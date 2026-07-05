import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MenuItem {
  name: string;
  name_en: string;
  name_it: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_it: string;
  description_fr: string;
  price: number | null;
  price_display: string;
  allergens: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  sort_order: number;
}

interface MenuCategory {
  name: string;
  name_en: string;
  name_it: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_it: string;
  description_fr: string;
  sort_order: number;
  items: MenuItem[];
}

interface ParsedMenu {
  title: string;
  title_en: string;
  title_it: string;
  title_fr: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_it: string;
  subtitle_fr: string;
  categories: MenuCategory[];
}

// ---------------------------------------------------------------------------
// Validierung & Nachübersetzung
// Prüft nach der Extraktion für jede Zielsprache (EN/IT/FR), ob Übersetzungen
// fehlen oder nur deutsche Kopien sind, und übersetzt Verdachtsfälle in einem
// zweiten, sprachspezifischen KI-Call nach (max. 2 Runden). Was danach immer
// noch eine deutsche Kopie ist, wird geleert – der Fallback auf Deutsch
// passiert zur Render-Zeit im Frontend, nicht in den Daten.
// ---------------------------------------------------------------------------

type TargetLang = 'en' | 'it' | 'fr';

const TARGET_LANGS: TargetLang[] = ['en', 'it', 'fr'];

const LANG_NAMES: Record<TargetLang, string> = {
  en: 'Englische',
  it: 'Italienische',
  fr: 'Französische',
};

const MAX_TRANSLATION_ROUNDS = 2;

// Normalisierter Vergleich (Kleinschreibung, Whitespace zusammenfassen)
const normalizeText = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

// Heuristik: Sieht der deutsche Originaltext "deutsch" aus?
// Eigennamen wie "Pizza Margherita" oder "Tiramisu" sind in allen Sprachen
// legitim identisch und werden dadurch NICHT als Kopie gewertet.
const looksGerman = (text: string) =>
  /[äöüßÄÖÜ]|\b(und|mit|aus|für|der|die|das|vom|im|auf|dazu|hausgemacht\w*)\b/i.test(text);

// Verdächtig = Übersetzung fehlt ODER ist (normalisiert) identisch mit dem
// deutschen Original, obwohl dieses deutsch aussieht
const isSuspectTranslation = (de: string | undefined | null, translated: string | undefined | null): boolean => {
  const source = (de ?? '').trim();
  if (!source) return false; // kein Original → nichts zu übersetzen
  const target = (translated ?? '').trim();
  if (!target) return true; // fehlende Übersetzung
  return normalizeText(source) === normalizeText(target) && looksGerman(source);
};

interface SuspectField {
  id: number;
  text: string; // deutscher Originaltext
  apply: (translated: string) => void;
}

// Sammelt alle verdächtigen Felder einer Zielsprache (Titel, Untertitel,
// Kategorien- und Gericht-Namen/-Beschreibungen) samt Setter
const collectSuspects = (menu: ParsedMenu, lang: TargetLang): SuspectField[] => {
  const suspects: SuspectField[] = [];
  let nextId = 0;

  const check = (de: string | undefined | null, translated: string | undefined | null, apply: (t: string) => void) => {
    if (isSuspectTranslation(de, translated)) {
      suspects.push({ id: nextId++, text: (de ?? '').trim(), apply });
    }
  };

  const m = menu as unknown as Record<string, string>;
  check(menu.title, m[`title_${lang}`], (t) => { m[`title_${lang}`] = t; });
  check(menu.subtitle, m[`subtitle_${lang}`], (t) => { m[`subtitle_${lang}`] = t; });

  for (const cat of menu.categories) {
    const c = cat as unknown as Record<string, string>;
    check(cat.name, c[`name_${lang}`], (t) => { c[`name_${lang}`] = t; });
    check(cat.description, c[`description_${lang}`], (t) => { c[`description_${lang}`] = t; });
    for (const item of cat.items) {
      const i = item as unknown as Record<string, string>;
      check(item.name, i[`name_${lang}`], (t) => { i[`name_${lang}`] = t; });
      check(item.description, i[`description_${lang}`], (t) => { i[`description_${lang}`] = t; });
    }
  }

  return suspects;
};

// Übersetzt eine Liste deutscher Texte in EINEM sprachspezifischen KI-Call
const translateBatch = async (
  entries: SuspectField[],
  lang: TargetLang,
  apiKey: string,
): Promise<Map<number, string>> => {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `Du bist ein professioneller Gastronomie-Übersetzer für das italienische Restaurant "STORIA" in München. Übersetze deutsche Speisekarten-Texte ins ${LANG_NAMES[lang]}. REGELN: 1. Liefere ECHTE Übersetzungen, NIEMALS den deutschen Text kopieren. 2. Italienische Gerichtnamen (z.B. "Spaghetti alla Carbonara", "Tiramisu") bleiben unverändert. 3. Der Restaurantname "STORIA" wird niemals übersetzt. 4. Antworte NUR mit dem Tool-Call.`,
        },
        {
          role: 'user',
          content: JSON.stringify({ texts: entries.map((e) => ({ id: e.id, text: e.text })) }),
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'submit_translations',
            description: `Liefert die ${LANG_NAMES[lang]}n Übersetzungen der übergebenen deutschen Texte`,
            parameters: {
              type: 'object',
              properties: {
                translations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', description: 'ID des Originaltexts' },
                      translation: { type: 'string', description: 'Übersetzter Text' },
                    },
                    required: ['id', 'translation'],
                  },
                },
              },
              required: ['translations'],
            },
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'submit_translations' } },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI gateway error (retranslate ${lang}): ${response.status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.function.name !== 'submit_translations') {
    throw new Error(`Invalid AI response format (retranslate ${lang})`);
  }

  const parsed = JSON.parse(toolCall.function.arguments) as {
    translations?: Array<{ id: number; translation: string }>;
  };

  const result = new Map<number, string>();
  for (const entry of parsed.translations ?? []) {
    if (typeof entry.id === 'number' && typeof entry.translation === 'string') {
      result.set(entry.id, entry.translation.trim());
    }
  }
  return result;
};

// Validiert alle Zielsprachen und repariert Verdachtsfälle per Nachübersetzung
const validateAndRepairTranslations = async (menu: ParsedMenu, apiKey: string): Promise<void> => {
  for (const lang of TARGET_LANGS) {
    for (let round = 1; round <= MAX_TRANSLATION_ROUNDS; round++) {
      const suspects = collectSuspects(menu, lang);
      if (suspects.length === 0) break;

      console.log(`Nachübersetzung ${lang} (Runde ${round}/${MAX_TRANSLATION_ROUNDS}): ${suspects.length} verdächtige Felder`);
      try {
        const translations = await translateBatch(suspects, lang, apiKey);
        for (const suspect of suspects) {
          const translated = translations.get(suspect.id);
          if (translated) {
            suspect.apply(translated);
          }
        }
      } catch (err) {
        console.error(`Nachübersetzung ${lang} (Runde ${round}) fehlgeschlagen:`, err);
        break; // weitere Runden für diese Sprache abbrechen
      }
    }

    // Nach den Retry-Runden: verbliebene deutsche Kopien LEEREN statt
    // deutschen Text als vermeintliche Übersetzung zu speichern
    const remaining = collectSuspects(menu, lang);
    for (const suspect of remaining) {
      suspect.apply('');
    }
    if (remaining.length > 0) {
      console.warn(`⚠ ${lang}: ${remaining.length} Feld(er) nach ${MAX_TRANSLATION_ROUNDS} Runden weiterhin unübersetzt – Felder geleert (Frontend-Fallback auf Deutsch)`);
    } else {
      console.log(`✅ ${lang}: alle Übersetzungen valide`);
    }
  }
};


async function reportEdgeError(source: string, message: string, payload?: unknown) {
  try {
    await fetch("https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/report-system-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: "ristorante_storia",
        source,
        severity: "critical",
        message,
        payload: payload ?? null,
        shared_secret: "a7f3d8e2c9b14056ef8a3d7c2b9e1f4d8a6c3b9e7f2d5a8c1b4e9f3d6a8c2b7e5f1d9a4c",
      }),
    });
  } catch (_) { /* silent */ }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, menuType } = await req.json();
    
    if (!pdfBase64) {
      throw new Error('PDF Base64 content is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Parsing menu PDF for type: ${menuType}, base64 length: ${pdfBase64.length}`);

    const systemPrompt = `Du bist ein präziser Menü-Parser für das italienische Restaurant "STORIA" in München. Deine Aufgabe ist es, den Inhalt eines Menü-PDFs EXAKT zu extrahieren UND automatisch in Englisch, Italienisch und Französisch zu übersetzen.

WICHTIGE REGELN FÜR EXTRAKTION:
1. Übernimm ALLE deutschen Texte WÖRTLICH - keine Umformulierungen oder Korrekturen
2. Preise müssen EXAKT übernommen werden (z.B. "12,50" oder "€12,50")
3. Behalte die Kategorien-Struktur bei (z.B. "Vorspeisen", "Pasta", "Pizza", etc.)
4. Bei Unklarheiten: lieber original übernehmen als interpretieren
5. Erkenne Preise auch wenn sie in verschiedenen Formaten angegeben sind (€, EUR, ohne Währung)

PREIS-EXTRAKTION (PFLICHT für Google Business Profile Sync):
6. Jedes Gericht MUSS zwei Preis-Felder haben:
   - price: Numerischer Wert als Zahl (z.B. 15.90, 8.80, 22.50) - NIEMALS null lassen wenn ein Preis im PDF steht!
   - price_display: Formatierter Preis für die Anzeige (z.B. "15,90 €")
   Beispiel: PDF zeigt "15,90" → price: 15.90, price_display: "15,90 €"
   Beispiel: PDF zeigt "8,8" → price: 8.80, price_display: "8,80 €"

ALLERGEN-EXTRAKTION (PFLICHT):
7. Identifiziere Allergen-Kürzel im PDF (oft am Ende der Beschreibung oder in Klammern).
   Gängige Kürzel: a (Gluten), b (Krebstiere), c (Eier), d (Fisch), e (Erdnüsse), f (Soja), g (Milch), h (Schalenfrüchte), 1-14 (Zusatzstoffe).
   - Speichere sie kommagetrennt in allergens (z.B. "a,c,g")
   - Entferne die Allergen-Kürzel aus der description, damit diese sauber bleibt
   - Wenn keine Allergene erkennbar: leeren String "" zurückgeben

VEGETARISCH/VEGAN-ERKENNUNG:
8. Erkenne vegetarische (is_vegetarian) und vegane (is_vegan) Gerichte anhand von Symbolen oder Beschreibungen im PDF.

PFLICHT: ÜBERSETZUNG IN ALLE 4 SPRACHEN (DE, EN, IT, FR):
9. Du MUSST alle Felder in ALLEN 4 SPRACHEN ausfüllen - KEINE leeren Felder erlaubt!
   - Deutsche Felder (name, description, title, subtitle) - Original aus PDF
   - Englische Felder (_en) - Übersetzung ins Englische
   - Italienische Felder (_it) - ECHTE Übersetzung ins Italienische (NIEMALS deutsche Texte kopieren!)
   - Französische Felder (_fr) - ECHTE Übersetzung ins Französische (NIEMALS deutsche Texte kopieren!)
10. WICHTIG: Lasse KEINE Übersetzungsfelder leer! Alle _en, _it, _fr Felder MÜSSEN ausgefüllt sein!
11. Der Restaurantname "STORIA" darf NIEMALS übersetzt werden - er bleibt immer "STORIA"!

REGELN FÜR ITALIENISCHE ÜBERSETZUNGEN (KRITISCH):
12. ALLE deutschen Texte MÜSSEN korrekt ins Italienische übersetzt werden:
    - "Vorspeisen" → "Antipasti" (NICHT "Vorspeisen" kopieren!)
    - "Kürbiscremesuppe" → "Crema di zucca" (NICHT den deutschen Namen kopieren!)
    - "Hausgemachte Pasta" → "Pasta fatta in casa"
    - "Gegrilltes Gemüse" → "Verdure grigliate"
    - "mit Trüffel und Parmesan" → "con tartufo e parmigiano"
13. name_it MUSS IMMER eine ECHTE italienische Übersetzung sein:
    - Bei bereits italienischen Gerichtnamen: Original beibehalten (z.B. "Spaghetti alla Carbonara" bleibt gleich)
    - Bei deutschen Namen: INS ITALIENISCHE ÜBERSETZEN (z.B. "Rinderfilet" → "Filetto di manzo")
    - NIEMALS den deutschen Text einfach nach name_it kopieren!
14. description_it MUSS eine ECHTE italienische Übersetzung der deutschen Beschreibung sein:
    - "mit hausgemachter Tomatensauce" → "con salsa di pomodoro fatta in casa"
    - NIEMALS die deutsche Beschreibung nach description_it kopieren!
15. Bei Gerichten mit italienischen Namen (z.B. "Spaghetti Carbonara"):
    - name, name_en, name_it, name_fr: Original beibehalten (italienische Gerichtnamen sind international)
    - description: Deutsche Beschreibung übernehmen (OHNE Allergene und Preis)
    - description_en: Ins Englische übersetzen
    - description_it: Ins Italienische übersetzen (ECHTE Übersetzung, nicht kopieren!)
    - description_fr: Ins Französische übersetzen
16. Bei deutschen Gerichten: Alle Namensfelder korrekt übersetzen.

Antworte NUR mit dem strukturierten Tool-Call, keine zusätzlichen Erklärungen.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${pdfBase64}`
                }
              },
              {
                type: 'text',
                text: 'Extrahiere den kompletten Menü-Inhalt aus diesem PDF. Übernimm alle Gerichte, Beschreibungen und Preise EXAKT wie im Dokument. WICHTIG: Fülle ALLE Übersetzungsfelder (_en, _it, _fr) aus - keine leeren Felder! Der Restaurantname "STORIA" darf nicht übersetzt werden!'
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_menu',
              description: 'Extrahiert strukturierte Menü-Daten aus dem PDF-Inhalt mit vollständigen Übersetzungen in DE, EN, IT, FR',
              parameters: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Titel des Menüs auf Deutsch' },
                  title_en: { type: 'string', description: 'Titel auf Englisch (PFLICHT)' },
                  title_it: { type: 'string', description: 'Titel auf Italienisch (PFLICHT)' },
                  title_fr: { type: 'string', description: 'Titel auf Französisch (PFLICHT)' },
                  subtitle: { type: 'string', description: 'Untertitel auf Deutsch' },
                  subtitle_en: { type: 'string', description: 'Untertitel auf Englisch (PFLICHT)' },
                  subtitle_it: { type: 'string', description: 'Untertitel auf Italienisch (PFLICHT)' },
                  subtitle_fr: { type: 'string', description: 'Untertitel auf Französisch (PFLICHT)' },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        name_en: { type: 'string', description: 'PFLICHT - Englische Übersetzung' },
                        name_it: { type: 'string', description: 'PFLICHT - Italienische Übersetzung' },
                        name_fr: { type: 'string', description: 'PFLICHT - Französische Übersetzung' },
                        description: { type: 'string' },
                        description_en: { type: 'string', description: 'PFLICHT - Englische Übersetzung' },
                        description_it: { type: 'string', description: 'PFLICHT - Italienische Übersetzung' },
                        description_fr: { type: 'string', description: 'PFLICHT - Französische Übersetzung' },
                        sort_order: { type: 'number' },
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              name_en: { type: 'string', description: 'PFLICHT - Englische Übersetzung' },
                              name_it: { type: 'string', description: 'PFLICHT - Muss IMMER befüllt sein, auch wenn identisch zum Deutschen! Google braucht dies für die IT-Karte.' },
                              name_fr: { type: 'string', description: 'PFLICHT - Französische Übersetzung' },
                              description: { type: 'string', description: 'Beschreibung OHNE Allergene und Preis' },
                              description_en: { type: 'string', description: 'PFLICHT - Englische Übersetzung' },
                              description_it: { type: 'string', description: 'PFLICHT - Italienische Übersetzung' },
                              description_fr: { type: 'string', description: 'PFLICHT - Französische Übersetzung' },
                              price: { type: 'number', description: 'PFLICHT - Numerischer Preis (z.B. 15.90). NIEMALS null wenn Preis im PDF steht!' },
                              price_display: { type: 'string', description: 'Formatierter Preis (z.B. "15,90 €")' },
                              allergens: { type: 'string', description: 'Kommagetrennte Allergen-Kürzel (z.B. "a,c,g"). Leerer String wenn keine.' },
                              is_vegetarian: { type: 'boolean', description: 'Ob das Gericht vegetarisch ist' },
                              is_vegan: { type: 'boolean', description: 'Ob das Gericht vegan ist' },
                              sort_order: { type: 'number' }
                            },
                            required: ['name', 'name_en', 'name_it', 'name_fr', 'price', 'price_display', 'allergens', 'sort_order']
                          }
                        }
                      },
                      required: ['name', 'name_en', 'name_it', 'name_fr', 'sort_order', 'items']
                    }
                  }
                },
                required: ['title', 'title_en', 'title_it', 'title_fr', 'categories']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_menu' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'extract_menu') {
      throw new Error('Invalid AI response format');
    }

    const rawMenu: ParsedMenu = JSON.parse(toolCall.function.arguments);

    // Validierungs- und Nachübersetzungs-Runde: fehlende Übersetzungen und
    // deutsche Kopien in EN/IT/FR werden repariert statt nur geloggt
    await validateAndRepairTranslations(rawMenu, LOVABLE_API_KEY);

    console.log(`Parsed ${rawMenu.categories.length} categories`);

    return new Response(JSON.stringify({ 
      success: true, 
      data: rawMenu 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    await reportEdgeError("edge:parse-menu-pdf", String(error));
    console.error('Error parsing menu PDF:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
