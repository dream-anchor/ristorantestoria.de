import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const gscEmail = Deno.env.get("GSC_CLIENT_EMAIL") ?? "NOT SET";
  const gscKey = Deno.env.get("GSC_PRIVATE_KEY") ?? "NOT SET";
  const gscSite = Deno.env.get("GSC_SITE_URL") ?? "NOT SET";

  return new Response(JSON.stringify({
    GSC_CLIENT_EMAIL: gscEmail,
    GSC_PRIVATE_KEY_FIRST_40: gscKey.substring(0, 40),
    GSC_PRIVATE_KEY_LAST_20: gscKey.substring(gscKey.length - 20),
    GSC_PRIVATE_KEY_LENGTH: gscKey.length,
    GSC_SITE_URL: gscSite,
  }), {
    headers: { "Content-Type": "application/json" },
  });
});