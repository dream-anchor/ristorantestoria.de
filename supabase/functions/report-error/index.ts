const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HUB_URL = "https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/report-system-error";
const SHARED_SECRET = Deno.env.get("SYSTEM_HEALTH_SHARED_SECRET");

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

    if (!SHARED_SECRET) {
      console.warn("[report-error] SYSTEM_HEALTH_SHARED_SECRET fehlt, Hub-Meldung uebersprungen:", source, message);
      return new Response(JSON.stringify({ ok: false, skipped: "hub_secret_missing" }), {
        status: 200,
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