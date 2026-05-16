const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HUB_URL = "https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/report-system-error";
const SHARED_SECRET = "a7f3d8e2c9b14056ef8a3d7c2b9e1f4d8a6c3b9e7f2d5a8c1b4e9f3d6a8c2b7e5f1d9a4c";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { source, severity = "error", message, payload, url, user_agent } = body ?? {};

    if (!source || !message) {
      return new Response(JSON.stringify({ error: "missing_fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(HUB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: "ristorante_storia",
        source,
        severity,
        message,
        payload: payload ?? null,
        url: url ?? null,
        user_agent: user_agent ?? null,
        shared_secret: SHARED_SECRET,
      }),
    });

    const hubResponse = await res.json().catch(() => ({ error: "hub_parse_failed" }));

    return new Response(JSON.stringify({ ok: res.ok, hub_status: res.status, ...hubResponse }), {
      status: res.ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[report-error]", err);
    return new Response(JSON.stringify({ error: "internal", detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});