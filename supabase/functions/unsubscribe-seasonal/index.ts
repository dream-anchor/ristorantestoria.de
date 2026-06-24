import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

function htmlPage(ok: boolean): string {
  const title = ok ? "Abgemeldet / Unsubscribed" : "Link ungültig / Invalid link";
  const msgDe = ok
    ? "Sie wurden erfolgreich von unseren Benachrichtigungen abgemeldet."
    : "Dieser Abmeldelink ist ungültig oder abgelaufen.";
  const msgEn = ok
    ? "You have been successfully unsubscribed from our notifications."
    : "This unsubscribe link is invalid or has expired.";
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background-color:#f5f0eb;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:60px auto;background:#FDF5E6;border-radius:12px;padding:40px;text-align:center;">
    <p style="color:#8B4513;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 24px;">Ristorante STORIA &middot; M&uuml;nchen</p>
    <p style="color:#4a3020;font-size:17px;line-height:1.6;margin:0 0 12px;">${msgDe}</p>
    <p style="color:#8a6a4a;font-size:15px;line-height:1.6;margin:0;">${msgEn}</p>
    <p style="margin:28px 0 0;"><a href="https://www.ristorantestoria.de/" style="color:#8B4513;font-size:14px;">www.ristorantestoria.de</a></p>
  </div>
</body></html>`;
}

async function unsubscribe(token: string): Promise<boolean> {
  if (!isUuid(token)) return false;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data: row } = await supabase
    .from("seasonal_signups")
    .select("id")
    .eq("confirm_token", token)
    .maybeSingle();
  if (!row) return false;
  const { error } = await supabase
    .from("seasonal_signups")
    .update({ status: "unsubscribed" })
    .eq("id", row.id);
  return !error;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = new URL(req.url).searchParams.get("token")?.trim() ?? "";

    // RFC 8058 one-click unsubscribe (POST) — email clients
    if (req.method === "POST") {
      await unsubscribe(token);
      return new Response("ok", { status: 200, headers: corsHeaders });
    }

    // Browser click (GET) — return a branded confirmation page
    const ok = await unsubscribe(token);
    return new Response(htmlPage(ok), {
      status: ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("[unsubscribe-seasonal] error:", err);
    return new Response(htmlPage(false), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }
});