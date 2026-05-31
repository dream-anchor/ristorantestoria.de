import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const EVENTS_PROJECT_URL =
  'https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/receive-event-inquiry';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await req.json();

    // Basic validation — name + email are the only hard requirements upstream.
    const contactName =
      typeof payload?.contactName === 'string' ? payload.contactName.trim() : '';
    const email = typeof payload?.email === 'string' ? payload.email.trim() : '';

    if (!contactName || !email) {
      return new Response(
        JSON.stringify({ error: 'Name und E-Mail sind erforderlich' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Server-to-server forward: no browser Origin header, so the upstream
    // CORS allowlist is irrelevant and the call always reaches the function.
    const upstream = await fetch(EVENTS_PROJECT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error forwarding event inquiry:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});