import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANG_NAMES: Record<string, string> = {
  de: "Deutsch",
  en: "Englisch",
  it: "Italienisch",
  fr: "Französisch",
};

const TARGET_LANGS = ["en", "it", "fr"] as const;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { source_language = "de", fields } = await req.json();

    if (!fields || typeof fields !== "object") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'fields'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sourceLangName = LANG_NAMES[source_language] ?? source_language;

    const systemPrompt = `Du bist ein professioneller Übersetzer für ein italienisches Restaurant in München.
Übersetze die folgenden Felder aus dem ${sourceLangName} in Englisch (en), Italienisch (it) und Französisch (fr).
Regeln:
- Behalte italienische Begriffe (Bruschetta, Panna Cotta, Tiramisú, Scaloppine al Limone, Tagliatelle, Ossobuco, etc.) unverändert bei
- Behalte Formatierungen wie "½ l", "€", "p.P.", "ca.", Bindestriche in Zahlen ("45–60") unverändert bei
- Bei Arrays: übersetze jeden Eintrag einzeln, behalte die gleiche Anzahl an Einträgen
- Antworte NUR mit einem validen JSON-Objekt der Form: {"en": {...}, "it": {...}, "fr": {...}}
- Keine Erklärungen, keine Markdown-Formatierung, kein \`\`\`json`;

    const userPrompt = `Übersetze diese Felder aus dem ${sourceLangName} nach Englisch (en), Italienisch (it) und Französisch (fr):

${JSON.stringify(fields, null, 2)}

Antworte NUR mit JSON: {"en": {gleiche Felder übersetzt}, "it": {gleiche Felder übersetzt}, "fr": {gleiche Felder übersetzt}}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[translate-group-menu] Anthropic error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawText = (data.content?.[0]?.text ?? "").trim();

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[translate-group-menu] No JSON in response:", rawText.slice(0, 200));
      return new Response(
        JSON.stringify({ error: "Keine gültige JSON-Antwort von Claude" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("[translate-group-menu] JSON parse failed:", e);
      return new Response(
        JSON.stringify({ error: "JSON-Parsing fehlgeschlagen" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate that all target languages are present
    const translations: Record<string, unknown> = {};
    for (const lang of TARGET_LANGS) {
      if (!parsed[lang]) {
        console.warn(`[translate-group-menu] Missing language: ${lang}`);
      }
      translations[lang] = parsed[lang] ?? {};
    }

    return new Response(
      JSON.stringify({ translations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[translate-group-menu] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unbekannter Fehler" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
