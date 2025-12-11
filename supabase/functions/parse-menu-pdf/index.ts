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

    const systemPrompt = `Du bist ein präziser Menü-Parser für ein italienisches Restaurant. Deine Aufgabe ist es, den Inhalt eines Menü-PDFs EXAKT zu extrahieren UND automatisch in Englisch, Italienisch und Französisch zu übersetzen.

WICHTIGE REGELN FÜR EXTRAKTION:
1. Übernimm ALLE deutschen Texte WÖRTLICH - keine Umformulierungen oder Korrekturen
2. Preise müssen EXAKT übernommen werden (z.B. "12,50" oder "€12,50")
3. Behalte die Kategorien-Struktur bei (z.B. "Vorspeisen", "Pasta", "Pizza", etc.)
4. Bei Unklarheiten: lieber original übernehmen als interpretieren
5. Erkenne Preise auch wenn sie in verschiedenen Formaten angegeben sind (€, EUR, ohne Währung)

AUTOMATISCHE ÜBERSETZUNG IN 3 SPRACHEN (PFLICHT):
6. Übersetze ALLE deutschen Texte automatisch für die _en, _it und _fr Felder:
   - name → name_en (Englisch), name_it (Italienisch), name_fr (Französisch)
   - description → description_en, description_it, description_fr
7. Bei italienischen Kategorie-Namen wie "Antipasti", "Primi Piatti", "Dolci":
   - Behalte sie im deutschen name Feld
   - Für name_en: füge englische Übersetzung hinzu (z.B. "Antipasti - Starters")
   - Für name_it: behalte den italienischen Namen
   - Für name_fr: füge französische Übersetzung hinzu (z.B. "Antipasti - Entrées")
8. Bei Gerichten mit italienischen Namen (z.B. "Spaghetti Carbonara"):
   - name: Original beibehalten
   - name_en, name_it, name_fr: Original beibehalten (italienische Gerichtnamen sind international)
   - description_en, description_it, description_fr: Deutsche Beschreibung übersetzen

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
                text: 'Extrahiere den kompletten Menü-Inhalt aus diesem PDF. Übernimm alle Gerichte, Beschreibungen und Preise EXAKT wie im Dokument. Übersetze automatisch in EN, IT und FR.'
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_menu',
              description: 'Extrahiert strukturierte Menü-Daten aus dem PDF-Inhalt mit Übersetzungen',
              parameters: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Titel des Menüs auf Deutsch' },
                  title_en: { type: 'string', description: 'Titel auf Englisch' },
                  title_it: { type: 'string', description: 'Titel auf Italienisch' },
                  title_fr: { type: 'string', description: 'Titel auf Französisch' },
                  subtitle: { type: 'string', description: 'Untertitel auf Deutsch' },
                  subtitle_en: { type: 'string', description: 'Untertitel auf Englisch' },
                  subtitle_it: { type: 'string', description: 'Untertitel auf Italienisch' },
                  subtitle_fr: { type: 'string', description: 'Untertitel auf Französisch' },
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        name_en: { type: 'string' },
                        name_it: { type: 'string' },
                        name_fr: { type: 'string' },
                        description: { type: 'string' },
                        description_en: { type: 'string' },
                        description_it: { type: 'string' },
                        description_fr: { type: 'string' },
                        sort_order: { type: 'number' },
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              name_en: { type: 'string' },
                              name_it: { type: 'string' },
                              name_fr: { type: 'string' },
                              description: { type: 'string' },
                              description_en: { type: 'string' },
                              description_it: { type: 'string' },
                              description_fr: { type: 'string' },
                              price: { type: 'number' },
                              price_display: { type: 'string' },
                              sort_order: { type: 'number' }
                            },
                            required: ['name', 'price_display', 'sort_order']
                          }
                        }
                      },
                      required: ['name', 'sort_order', 'items']
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
    
    // Ensure all IT/FR fields have fallback values (use DE if missing)
    const ensureTranslations = (menu: ParsedMenu): ParsedMenu => {
      return {
        ...menu,
        title_it: menu.title_it || menu.title || '',
        title_fr: menu.title_fr || menu.title || '',
        subtitle_it: menu.subtitle_it || menu.subtitle || '',
        subtitle_fr: menu.subtitle_fr || menu.subtitle || '',
        categories: menu.categories.map(cat => ({
          ...cat,
          name_it: cat.name_it || cat.name || '',
          name_fr: cat.name_fr || cat.name || '',
          description_it: cat.description_it || cat.description || '',
          description_fr: cat.description_fr || cat.description || '',
          items: cat.items.map(item => ({
            ...item,
            name_it: item.name_it || item.name || '',
            name_fr: item.name_fr || item.name || '',
            description_it: item.description_it || item.description || '',
            description_fr: item.description_fr || item.description || '',
          }))
        }))
      };
    };

    const parsedMenu = ensureTranslations(rawMenu);
    console.log(`Parsed ${parsedMenu.categories.length} categories with IT/FR translations (fallback applied)`);

    return new Response(JSON.stringify({ 
      success: true, 
      data: parsedMenu 
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
