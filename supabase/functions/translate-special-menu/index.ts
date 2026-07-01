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

const ALL_LANGS = ["de", "en", "it", "fr"] as const;

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
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { source_language = "de", menu } = await req.json();

    if (!menu || typeof menu !== "object") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'menu'" }),
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

    const targetLangs = ALL_LANGS.filter((l) => l !== source_language);
    const sourceLangName = LANG_NAMES[source_language] ?? source_language;
    const targetLangNames = targetLangs.map((l) => `${LANG_NAMES[l]} (${l})`).join(", ");

    const systemPrompt = `Du bist ein professioneller Übersetzer für ein italienisches Restaurant in München.
Übersetze den Menü-Inhalt aus dem ${sourceLangName} in folgende Zielsprachen: ${targetLangNames}.
Regeln:
- Behalte italienische Begriffe (Bruschetta, Panna Cotta, Tiramisú, Scaloppine al Limone, Tagliatelle, Ossobuco, Aperol Spritz, etc.) unverändert bei.
- Der Markenname "STORIA" bleibt immer unverändert.
- price_display NICHT übersetzen: Zahlen, Währungssymbole (€), "½ l", Bindestriche in Preisen ("45–60") bleiben exakt gleich. Übersetze NUR reine Zusatzwörter darin sinngemäß: "ca." → "approx."/"circa"/"env.", "p. P."/"p.P." (pro Person) → "p.p."/"a persona"/"p. pers.".
- Behalte die Struktur exakt bei: gleiche Anzahl an Kategorien und Items, gleiche Reihenfolge.
- Leere Felder ("") bleiben leer.
- Antworte NUR mit einem validen JSON-Objekt, ohne Erklärungen, ohne Markdown, ohne \`\`\`.`;

    const shape = `{
  "title": "...",
  "subtitle": "...",
  "categories": [
    { "name": "...", "description": "...", "items": [ { "name": "...", "description": "...", "price_display": "..." } ] }
  ]
}`;

    const userPrompt = `Quellinhalt (${sourceLangName}):
${JSON.stringify(menu, null, 2)}

Übersetze diesen Inhalt in ${targetLangNames}.
Antworte NUR mit JSON in dieser Form, wobei jeder Zielsprach-Schlüssel den gesamten übersetzten Inhalt enthält:
{ ${targetLangs.map((l) => `"${l}": ${shape}`).join(", ")} }`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[translate-special-menu] Anthropic error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${response.status}`, detail: errText }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawText = (data.content?.[0]?.text ?? "").trim();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[translate-special-menu] No JSON in response:", rawText.slice(0, 200));
      return new Response(
        JSON.stringify({ error: "Keine gültige JSON-Antwort von Claude" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("[translate-special-menu] JSON parse failed:", e);
      return new Response(
        JSON.stringify({ error: "JSON-Parsing fehlgeschlagen" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const translations: Record<string, unknown> = {};
    for (const lang of targetLangs) {
      if (!parsed[lang]) {
        console.warn(`[translate-special-menu] Missing language: ${lang}`);
      }
      translations[lang] = parsed[lang] ?? {};
    }

    return new Response(
      JSON.stringify({ translations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    await reportEdgeError("edge:translate-special-menu", String(err));
    console.error("[translate-special-menu] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unbekannter Fehler" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});