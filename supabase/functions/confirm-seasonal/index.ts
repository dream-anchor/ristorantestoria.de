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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let token = "";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      token = String(body.token ?? "").trim();
    } else {
      token = new URL(req.url).searchParams.get("token")?.trim() ?? "";
    }

    if (!isUuid(token)) {
      return new Response(JSON.stringify({ status: "invalid" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: row } = await supabase
      .from("seasonal_signups")
      .select("id, status")
      .eq("confirm_token", token)
      .maybeSingle();

    if (!row) {
      return new Response(JSON.stringify({ status: "invalid" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (row.status === "confirmed") {
      return new Response(JSON.stringify({ status: "already_confirmed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updErr } = await supabase
      .from("seasonal_signups")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", row.id);
    if (updErr) throw new Error(updErr.message);

    return new Response(JSON.stringify({ status: "confirmed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[confirm-seasonal] error:", err);
    return new Response(JSON.stringify({ status: "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});