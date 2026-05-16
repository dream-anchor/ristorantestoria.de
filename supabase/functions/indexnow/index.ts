import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INDEXNOW_API = "https://api.indexnow.org/IndexNow";
const HOST = "www.ristorantestoria.de";


async function reportEdgeError(source: string, message: string, payload?: unknown) {
  try {
    await fetch("https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/report-system-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: "ristorante_storia",
        source,
        severity: "error",
        message,
        payload: payload ?? null,
        shared_secret: "a7f3d8e2c9b14056ef8a3d7c2b9e1f4d8a6c3b9e7f2d5a8c1b4e9f3d6a8c2b7e5f1d9a4c",
      }),
    });
  } catch (_) { /* silent */ }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const key = Deno.env.get("INDEXNOW_KEY");
    if (!key) {
      throw new Error("INDEXNOW_KEY nicht konfiguriert");
    }

    const { urlList } = await req.json() as { urlList: string[] };

    if (!urlList || !Array.isArray(urlList) || urlList.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "urlList ist leer oder fehlt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Max 10.000 URLs pro Request (IndexNow Limit)
    const urls = urlList.slice(0, 10000);

    const payload = {
      host: HOST,
      key,
      keyLocation: `https://${HOST}/${key}.txt`,
      urlList: urls,
    };

    console.log(`📤 IndexNow: Sende ${urls.length} URLs...`);

    const response = await fetch(INDEXNOW_API, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const status = response.status;
    const responseText = await response.text();

    // Response Codes loggen
    const statusMessages: Record<number, string> = {
      200: "OK – URLs erfolgreich übermittelt",
      202: "Accepted – URLs zur Verarbeitung angenommen",
      400: "Bad Request – Ungültiges Format",
      403: "Forbidden – Key ungültig oder nicht autorisiert",
      422: "Unprocessable Entity – URLs entsprechen nicht dem Host",
      429: "Too Many Requests – Rate Limit erreicht",
    };

    const statusMessage = statusMessages[status] || `Unbekannter Status: ${status}`;
    console.log(`📬 IndexNow Response: ${status} – ${statusMessage}`);

    if (responseText) {
      console.log(`📋 Response Body: ${responseText}`);
    }

    const success = status === 200 || status === 202;

    return new Response(
      JSON.stringify({
        success,
        status,
        message: statusMessage,
        urlCount: urls.length,
        ...(responseText && { response: responseText }),
      }),
      {
        status: success ? 200 : status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    await reportEdgeError("edge:indexnow", String(error));
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    console.error("❌ IndexNow Fehler:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
