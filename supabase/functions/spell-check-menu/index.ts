import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpellingError {
  id: string;
  location: {
    type: 'title' | 'subtitle' | 'category' | 'item';
    categoryIndex?: number;
    itemIndex?: number;
    field: 'name' | 'description' | 'title' | 'subtitle';
    language: 'de' | 'en' | 'it' | 'fr';
  };
  originalText: string;
  suggestion: string;
  errorType: 'spelling' | 'grammar' | 'punctuation';
  context: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { menuData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting spell check for menu data...');

    // Build the text content to check
    const textsToCheck: { text: string; location: SpellingError['location']; context: string }[] = [];

    // Add title and subtitle
    if (menuData.title) {
      textsToCheck.push({ 
        text: menuData.title, 
        location: { type: 'title', field: 'title', language: 'de' },
        context: 'Menü-Titel (Deutsch)'
      });
    }
    if (menuData.title_en) {
      textsToCheck.push({ 
        text: menuData.title_en, 
        location: { type: 'title', field: 'title', language: 'en' },
        context: 'Menu Title (English)'
      });
    }
    if (menuData.title_it) {
      textsToCheck.push({ 
        text: menuData.title_it, 
        location: { type: 'title', field: 'title', language: 'it' },
        context: 'Titolo Menu (Italiano)'
      });
    }
    if (menuData.title_fr) {
      textsToCheck.push({ 
        text: menuData.title_fr, 
        location: { type: 'title', field: 'title', language: 'fr' },
        context: 'Titre Menu (Français)'
      });
    }

    if (menuData.subtitle) {
      textsToCheck.push({ 
        text: menuData.subtitle, 
        location: { type: 'subtitle', field: 'subtitle', language: 'de' },
        context: 'Menü-Untertitel (Deutsch)'
      });
    }
    if (menuData.subtitle_en) {
      textsToCheck.push({ 
        text: menuData.subtitle_en, 
        location: { type: 'subtitle', field: 'subtitle', language: 'en' },
        context: 'Menu Subtitle (English)'
      });
    }
    if (menuData.subtitle_it) {
      textsToCheck.push({ 
        text: menuData.subtitle_it, 
        location: { type: 'subtitle', field: 'subtitle', language: 'it' },
        context: 'Sottotitolo Menu (Italiano)'
      });
    }
    if (menuData.subtitle_fr) {
      textsToCheck.push({ 
        text: menuData.subtitle_fr, 
        location: { type: 'subtitle', field: 'subtitle', language: 'fr' },
        context: 'Sous-titre Menu (Français)'
      });
    }

    // Add categories and items
    menuData.categories?.forEach((category: any, catIndex: number) => {
      if (category.name) {
        textsToCheck.push({
          text: category.name,
          location: { type: 'category', categoryIndex: catIndex, field: 'name', language: 'de' },
          context: `Kategorie ${catIndex + 1} (Deutsch)`
        });
      }
      if (category.name_en) {
        textsToCheck.push({
          text: category.name_en,
          location: { type: 'category', categoryIndex: catIndex, field: 'name', language: 'en' },
          context: `Category ${catIndex + 1} (English)`
        });
      }
      if (category.name_it) {
        textsToCheck.push({
          text: category.name_it,
          location: { type: 'category', categoryIndex: catIndex, field: 'name', language: 'it' },
          context: `Categoria ${catIndex + 1} (Italiano)`
        });
      }
      if (category.name_fr) {
        textsToCheck.push({
          text: category.name_fr,
          location: { type: 'category', categoryIndex: catIndex, field: 'name', language: 'fr' },
          context: `Catégorie ${catIndex + 1} (Français)`
        });
      }

      category.items?.forEach((item: any, itemIndex: number) => {
        // Item names
        if (item.name) {
          textsToCheck.push({
            text: item.name,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'name', language: 'de' },
            context: `${category.name || 'Kategorie'} → Gericht ${itemIndex + 1} (Deutsch)`
          });
        }
        if (item.name_en) {
          textsToCheck.push({
            text: item.name_en,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'name', language: 'en' },
            context: `${category.name || 'Category'} → Item ${itemIndex + 1} (English)`
          });
        }
        if (item.name_it) {
          textsToCheck.push({
            text: item.name_it,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'name', language: 'it' },
            context: `${category.name || 'Categoria'} → Piatto ${itemIndex + 1} (Italiano)`
          });
        }
        if (item.name_fr) {
          textsToCheck.push({
            text: item.name_fr,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'name', language: 'fr' },
            context: `${category.name || 'Catégorie'} → Plat ${itemIndex + 1} (Français)`
          });
        }

        // Item descriptions
        if (item.description) {
          textsToCheck.push({
            text: item.description,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'description', language: 'de' },
            context: `${category.name || 'Kategorie'} → ${item.name || 'Gericht'} Beschreibung (Deutsch)`
          });
        }
        if (item.description_en) {
          textsToCheck.push({
            text: item.description_en,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'description', language: 'en' },
            context: `${category.name || 'Category'} → ${item.name || 'Item'} Description (English)`
          });
        }
        if (item.description_it) {
          textsToCheck.push({
            text: item.description_it,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'description', language: 'it' },
            context: `${category.name || 'Categoria'} → ${item.name || 'Piatto'} Descrizione (Italiano)`
          });
        }
        if (item.description_fr) {
          textsToCheck.push({
            text: item.description_fr,
            location: { type: 'item', categoryIndex: catIndex, itemIndex, field: 'description', language: 'fr' },
            context: `${category.name || 'Catégorie'} → ${item.name || 'Plat'} Description (Français)`
          });
        }
      });
    });

    // Filter out empty texts
    const nonEmptyTexts = textsToCheck.filter(t => t.text && t.text.trim().length > 0);

    // Filter out IT/FR texts that are just copies of German (fallback translations)
    const filterDuplicateFallbacks = (texts: typeof textsToCheck) => {
      return texts.filter(t => {
        // Always keep DE and EN entries
        if (t.location.language === 'de' || t.location.language === 'en') {
          return true;
        }
        // For IT/FR: check if text is identical to DE version (would indicate fallback copy)
        const deVersion = texts.find(d => 
          d.location.type === t.location.type &&
          d.location.categoryIndex === t.location.categoryIndex &&
          d.location.itemIndex === t.location.itemIndex &&
          d.location.field === t.location.field &&
          d.location.language === 'de'
        );
        // If IT/FR text is identical to DE, it's a fallback - skip spell checking it
        if (deVersion && deVersion.text.trim() === t.text.trim()) {
          console.log(`Skipping fallback text (${t.location.language}): "${t.text.substring(0, 50)}..."`);
          return false;
        }
        return true;
      });
    };

    const validTexts = filterDuplicateFallbacks(nonEmptyTexts);

    if (validTexts.length === 0) {
      return new Response(JSON.stringify({ errors: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Checking ${validTexts.length} text fields (filtered from ${nonEmptyTexts.length})...`);

    const prompt = `Du bist ein professioneller Lektor für Restaurant-Menüs. Prüfe die folgenden Texte auf Rechtschreib-, Grammatik- und Zeichensetzungsfehler.

WICHTIGE REGELN:
1. **STORIA ist der Restaurantname und darf NIEMALS als Fehler markiert oder übersetzt werden!**
   "STORIA" ist KEIN Rechtschreibfehler, es ist der Name des Restaurants. Niemals "Geschichte", "History", "Storia" oder andere Übersetzungen vorschlagen!
2. Italienische Fachbegriffe und Gerichtsnamen sind KORREKT und dürfen NICHT als Fehler markiert werden:
   - Antipasti, Bruschetta, Carpaccio, Tiramisu, Risotto, Gnocchi, Tagliatelle, Pappardelle, Penne, Rigatoni, Fusilli, Farfalle, Orecchiette
   - Bolognese, Carbonara, Arrabbiata, Puttanesca, Marinara, Primavera, Alfredo, Pesto, Ragù, Sugo
   - Prosciutto, Mozzarella, Burrata, Gorgonzola, Parmigiano, Pecorino, Mascarpone, Ricotta
   - Ossobuco, Saltimbocca, Scaloppine, Vitello, Manzo, Pollo, Agnello, Maiale
   - Gelato, Panna Cotta, Cannoli, Biscotti, Amaretti, Zabaione, Affogato
   - Espresso, Cappuccino, Latte, Macchiato, Americano, Ristretto
   - Prosecco, Chianti, Barolo, Amarone, Grappa, Limoncello, Sambuca
   - con, alla, al, del, della, e, di, ai, alle (italienische Präpositionen)
3. Prüfe jeden Text in seiner jeweiligen Sprache (de=Deutsch, en=Englisch, it=Italienisch, fr=Französisch)
4. Bei italienischen Texten: Nur echte Fehler markieren, italienische Wörter sind korrekt
5. Gib NUR echte Fehler zurück, keine stilistischen Vorschläge
6. Wenn ein Text korrekt ist, füge ihn NICHT zur Fehlerliste hinzu

Texte zum Prüfen (JSON-Format):
${JSON.stringify(validTexts.map((t, i) => ({ index: i, text: t.text, language: t.location.language, context: t.context })), null, 2)}

Antworte NUR mit einem JSON-Array von Fehlern. Wenn keine Fehler gefunden wurden, antworte mit einem leeren Array [].
Format für jeden Fehler:
{
  "index": <index des Textes>,
  "originalText": "<der fehlerhafte Text oder Textausschnitt>",
  "suggestion": "<korrigierter Text>",
  "errorType": "spelling" | "grammar" | "punctuation"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Du bist ein professioneller Lektor. Antworte ausschließlich mit validem JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '[]';
    
    console.log('AI Response:', content);

    // Parse the AI response
    let rawErrors: any[] = [];
    try {
      // Extract JSON from response (might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        rawErrors = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      rawErrors = [];
    }

    // Map raw errors to full error objects
    const errors: SpellingError[] = rawErrors
      .map((err: any, errIndex: number) => {
        const sourceText = validTexts[err.index];
        if (!sourceText) return null;
        
        return {
          id: `error-${errIndex}-${Date.now()}`,
          location: sourceText.location,
          originalText: err.originalText,
          suggestion: err.suggestion,
          errorType: err.errorType || 'spelling',
          context: sourceText.context,
        };
      })
      .filter((error): error is SpellingError => error !== null);

    console.log(`Found ${errors.length} spelling errors`);

    return new Response(JSON.stringify({ errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Spell check error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      errors: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
