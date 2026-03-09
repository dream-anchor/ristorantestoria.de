import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Only allow GET
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "NOT SET";

  return new Response(JSON.stringify({ SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey }), {
    headers: { "Content-Type": "application/json" },
  });
});
