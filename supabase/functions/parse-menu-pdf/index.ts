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
   - Italienische Felder (_it) - Übersetzung ins Italienische  
   - Französische Felder (_fr) - Übersetzung ins Französische
10. WICHTIG: Lasse KEINE Übersetzungsfelder leer! Alle _en, _it, _fr Felder MÜSSEN ausgefüllt sein!
11. Der Restaurantname "STORIA" darf NIEMALS übersetzt werden - er bleibt immer "STORIA"!

REGELN FÜR ITALIENISCHE NAMEN (KRITISCH für Google Business Profile):
12. name_it MUSS IMMER befüllt werden - auch wenn der Name identisch zum Deutschen ist!
    Google verwendet name_it für die italienische Speisekarte. Ein leeres name_it bedeutet fehlendes Gericht.
    Beispiel: "Spaghetti alla Carbonara" → name_it: "Spaghetti alla Carbonara" (identisch, aber MUSS gesetzt sein)
    Beispiel: "Kürbiscremesuppe" → name_it: "Crema di zucca" (Übersetzung)
13. Bei Gerichten mit italienischen Namen (z.B. "Spaghetti Carbonara"):
    - name, name_en, name_it, name_fr: Original beibehalten (italienische Gerichtnamen sind international)
    - description: Deutsche Beschreibung übernehmen (OHNE Allergene und Preis)
    - description_en: Ins Englische übersetzen
    - description_it: Ins Italienische übersetzen
    - description_fr: Ins Französische übersetzen
14. Bei deutschen Gerichten: Alle Namensfelder korrekt übersetzen.

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
    
    // Log missing translations for debugging
    const checkMissingTranslations = (menu: ParsedMenu) => {
      let missingCount = 0;
      if (!menu.title_it || menu.title_it === menu.title) missingCount++;
      if (!menu.title_fr || menu.title_fr === menu.title) missingCount++;
      menu.categories.forEach(cat => {
        if (!cat.name_it || cat.name_it === cat.name) missingCount++;
        if (!cat.name_fr || cat.name_fr === cat.name) missingCount++;
        cat.items.forEach(item => {
          if (!item.name_it || item.name_it === item.name) missingCount++;
          if (!item.name_fr || item.name_fr === item.name) missingCount++;
        });
      });
      if (missingCount > 0) {
        console.log(`Warning: ${missingCount} IT/FR translations may be missing or identical to DE`);
      }
    };
    
    checkMissingTranslations(rawMenu);
    
    // Do NOT apply fallback - let the spell checker detect missing translations
    // This way the admin sees which translations are actually missing
    console.log(`Parsed ${rawMenu.categories.length} categories`);

    return new Response(JSON.stringify({ 
      success: true, 
      data: rawMenu 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error parsing menu PDF:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
