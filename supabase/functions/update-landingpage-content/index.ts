import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Types for external Events project data
interface EventPackage {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  price: number | null;
  price_per_person: boolean;
  min_guests: number | null;
  max_guests: number | null;
  package_type: string;
  includes: unknown[] | null;
}

interface CateringMenuItem {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  price: number | null;
  price_display: string | null;
  category_name: string;
  category_name_en: string | null;
  menu_title: string;
  menu_slug: string;
}

interface PageConfig {
  page_slug: string;
  keywords_de: string[];
  keywords_en: string[];
  package_types?: string[];
  catering_slugs?: string[];
  description: string;
}

// Page configurations for Firmenfeier and Eventlocation
const PAGE_CONFIGS: PageConfig[] = [
  {
    page_slug: 'firmenfeier',
    keywords_de: ['firmenfeier', 'firmenevent', 'business', 'corporate', 'meeting', 'team', 'konferenz'],
    keywords_en: ['corporate', 'business', 'company', 'team', 'meeting', 'conference'],
    package_types: ['event'],
    catering_slugs: ['fingerfood', 'platten', 'buffet'],
    description: 'Firmenfeiern und Corporate Events'
  },
  {
    page_slug: 'eventlocation',
    keywords_de: ['event', 'location', 'veranstaltung', 'feier', 'party', 'hochzeit', 'jubiläum'],
    keywords_en: ['event', 'location', 'venue', 'celebration', 'party', 'wedding', 'anniversary'],
    package_types: ['event', 'general'],
    catering_slugs: ['fingerfood', 'platten', 'buffet', 'menu'],
    description: 'Eventlocation München für alle Anlässe'
  }
];

// Create hash from data to detect changes
function createDataHash(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// Fetch packages from external Events project
// deno-lint-ignore no-explicit-any
async function fetchEventPackages(eventsClient: SupabaseClient<any>, packageTypes: string[]): Promise<EventPackage[]> {
  console.log('Fetching packages from Events project...');
  
  const { data, error } = await eventsClient
    .from('packages')
    .select('id, name, name_en, description, description_en, price, price_per_person, min_guests, max_guests, package_type, includes')
    .in('package_type', packageTypes);
  
  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
  
  console.log(`Found ${data?.length || 0} packages`);
  return (data || []) as EventPackage[];
}

// Fetch catering items from external Events project
// deno-lint-ignore no-explicit-any
async function fetchCateringItems(eventsClient: SupabaseClient<any>, menuSlugs: string[]): Promise<CateringMenuItem[]> {
  console.log('Fetching catering items from Events project...');
  
  // First get menus
  const { data: menus, error: menusError } = await eventsClient
    .from('menus')
    .select('id, title, title_en, slug')
    .eq('menu_type', 'catering')
    .eq('is_published', true)
    .in('slug', menuSlugs);
  
  if (menusError || !menus?.length) {
    console.error('Error fetching menus:', menusError);
    return [];
  }
  
  const menuIds = menus.map((m: { id: string }) => m.id);
  
  // Get categories for these menus
  const { data: categories, error: catError } = await eventsClient
    .from('menu_categories')
    .select('id, menu_id, name, name_en')
    .in('menu_id', menuIds);
  
  if (catError || !categories?.length) {
    console.error('Error fetching categories:', catError);
    return [];
  }
  
  const categoryIds = categories.map((c: { id: string }) => c.id);
  
  // Get items
  const { data: items, error: itemsError } = await eventsClient
    .from('menu_items')
    .select('id, category_id, name, name_en, description, description_en, price, price_display')
    .in('category_id', categoryIds);
  
  if (itemsError) {
    console.error('Error fetching items:', itemsError);
    return [];
  }
  
  // Build lookup maps
  const categoryMap = new Map(categories.map((c: { id: string; menu_id: string; name: string; name_en: string | null }) => [c.id, c]));
  const menuMap = new Map(menus.map((m: { id: string; title: string; slug: string }) => [m.id, m]));
  
  // Combine data
  // deno-lint-ignore no-explicit-any
  const result: CateringMenuItem[] = (items || []).map((item: any) => {
    const category = categoryMap.get(item.category_id);
    const menu = category ? menuMap.get(category.menu_id) : null;
    return {
      id: item.id,
      name: item.name,
      name_en: item.name_en,
      description: item.description,
      description_en: item.description_en,
      price: item.price,
      price_display: item.price_display,
      category_name: category?.name || '',
      category_name_en: category?.name_en || null,
      menu_title: menu?.title || '',
      menu_slug: menu?.slug || ''
    };
  });
  
  console.log(`Found ${result.length} catering items`);
  return result;
}

// Generate AI content using Lovable AI Gateway
async function generateAIContent(
  packages: EventPackage[],
  cateringItems: CateringMenuItem[],
  pageConfig: PageConfig
): Promise<{
  intro_de: string;
  intro_en: string;
  intro_it: string;
  intro_fr: string;
  highlights_text_de: string;
  highlights_text_en: string;
  highlights_text_it: string;
  highlights_text_fr: string;
}> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not configured');
  }

  // Build context from data
  const packageSummary = packages.map(p => {
    const priceInfo = p.price_per_person 
      ? `ab ${p.price}€ pro Person` 
      : `${p.price}€ pauschal`;
    const guestInfo = p.min_guests && p.max_guests 
      ? `(${p.min_guests}-${p.max_guests} Gäste)` 
      : '';
    return `- ${p.name}: ${p.description || ''} ${priceInfo} ${guestInfo}`;
  }).join('\n');

  const cateringSummary = cateringItems.slice(0, 15).map(item => {
    const priceInfo = item.price_display || (item.price ? `${item.price}€` : '');
    return `- ${item.name} (${item.category_name}): ${item.description || ''} ${priceInfo}`;
  }).join('\n');

  const systemPrompt = `Du bist ein SEO-Texter für das italienische Restaurant "STORIA" in München-Maxvorstadt. 
Schreibe überzeugende, authentische Texte für Landingpages. Der Ton ist elegant, warm und einladend.

WICHTIG:
- Verwende die ECHTEN Pakete und Preise aus den Daten
- Nenne konkrete Beispiele aus dem Catering-Angebot
- Halte dich kurz (max 2-3 Sätze pro Abschnitt)
- Keine erfundenen Informationen`;

  const userPrompt = `Erstelle SEO-optimierte Texte für die Landingpage "${pageConfig.page_slug}" (${pageConfig.description}).

VERFÜGBARE PAKETE:
${packageSummary || 'Keine Pakete verfügbar'}

CATERING-ANGEBOT:
${cateringSummary || 'Keine Catering-Optionen verfügbar'}

Generiere folgende Texte als JSON:
{
  "intro_de": "Kurzer Einleitungstext (2 Sätze) auf Deutsch",
  "intro_en": "Same intro in English",
  "intro_it": "Stessa introduzione in italiano",
  "intro_fr": "Même introduction en français",
  "highlights_text_de": "Highlights/Features (2-3 Sätze) mit konkreten Angeboten auf Deutsch",
  "highlights_text_en": "Same highlights in English",
  "highlights_text_it": "Stessi highlights in italiano",
  "highlights_text_fr": "Mêmes highlights en français"
}

Antworte NUR mit dem JSON-Objekt, keine Erklärungen.`;

  console.log(`Generating AI content for ${pageConfig.page_slug}...`);

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
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI Gateway error:', response.status, errorText);
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content || '';
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse AI response as JSON');
  }
  
  return JSON.parse(jsonMatch[0]);
}

// Update landingpage_content table
// deno-lint-ignore no-explicit-any
async function updateLandingpageContent(
  supabase: SupabaseClient<any>,
  pageSlug: string,
  packages: EventPackage[],
  cateringItems: CateringMenuItem[],
  aiContent: {
    intro_de: string;
    intro_en: string;
    intro_it: string;
    intro_fr: string;
    highlights_text_de: string;
    highlights_text_en: string;
    highlights_text_it: string;
    highlights_text_fr: string;
  },
  dataHash: string
): Promise<void> {
  // Prepare featured items from packages
  const featuredItems = packages.slice(0, 5).map(p => ({
    id: p.id,
    name: p.name,
    name_en: p.name_en,
    price: p.price,
    price_per_person: p.price_per_person,
    min_guests: p.min_guests,
    max_guests: p.max_guests,
    includes: p.includes
  }));

  // Prepare menu highlights from catering items
  const menuHighlights = cateringItems.slice(0, 10).map(item => ({
    name: item.name,
    name_en: item.name_en,
    description: item.description,
    description_en: item.description_en,
    price_display: item.price_display,
    category: item.category_name
  }));

  // Prepare prices summary
  const packagePrices = packages.filter(p => p.price !== null).map(p => p.price!);
  const pricesSummary = {
    min_package_price: packagePrices.length > 0 ? Math.min(...packagePrices) : null,
    max_package_price: packagePrices.length > 0 ? Math.max(...packagePrices) : null,
    packages_count: packages.length,
    catering_items_count: cateringItems.length
  };

  const updateData = {
    page_slug: pageSlug,
    ...aiContent,
    featured_items: featuredItems,
    menu_highlights: menuHighlights,
    prices_summary: pricesSummary,
    items_found_count: packages.length + cateringItems.length,
    last_menu_hash: dataHash,
    last_successful_update: new Date().toISOString(),
    last_check: new Date().toISOString(),
    update_status: 'success',
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('landingpage_content')
    .upsert(updateData, { onConflict: 'page_slug' });

  if (error) {
    console.error(`Error updating ${pageSlug}:`, error);
    throw error;
  }

  console.log(`Successfully updated landingpage_content for ${pageSlug}`);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const EVENTS_SUPABASE_URL = Deno.env.get('EVENTS_SUPABASE_URL');
    const EVENTS_SUPABASE_ANON_KEY = Deno.env.get('EVENTS_SUPABASE_ANON_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials');
    }
    if (!EVENTS_SUPABASE_URL || !EVENTS_SUPABASE_ANON_KEY) {
      throw new Error('Missing Events project credentials');
    }

    // Create Supabase clients
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const eventsClient = createClient(EVENTS_SUPABASE_URL, EVENTS_SUPABASE_ANON_KEY);

    console.log('Starting landingpage content update from Events project...');

    // Parse request body for optional page filter
    let targetPages: string[] | null = null;
    try {
      const body = await req.json();
      if (body.pages && Array.isArray(body.pages)) {
        targetPages = body.pages;
      }
    } catch {
      // No body or invalid JSON, process all pages
    }

    const results: Record<string, string> = {};

    for (const pageConfig of PAGE_CONFIGS) {
      // Skip if not in target pages (when specified)
      if (targetPages && !targetPages.includes(pageConfig.page_slug)) {
        continue;
      }

      try {
        console.log(`\n=== Processing ${pageConfig.page_slug} ===`);

        // Fetch data from Events project
        const packages = await fetchEventPackages(eventsClient, pageConfig.package_types || []);
        const cateringItems = await fetchCateringItems(eventsClient, pageConfig.catering_slugs || []);

        // Check if we have any data
        if (packages.length === 0 && cateringItems.length === 0) {
          console.log(`No data found for ${pageConfig.page_slug}, preserving existing content`);
          
          // Update last_check only
          await supabase
            .from('landingpage_content')
            .upsert({
              page_slug: pageConfig.page_slug,
              last_check: new Date().toISOString(),
              update_status: 'no_data',
              items_found_count: 0
            }, { onConflict: 'page_slug' });
          
          results[pageConfig.page_slug] = 'no_data';
          continue;
        }

        // Create hash to detect changes
        const dataHash = createDataHash({ packages, cateringItems });

        // Check if data has changed
        const { data: existing } = await supabase
          .from('landingpage_content')
          .select('last_menu_hash')
          .eq('page_slug', pageConfig.page_slug)
          .maybeSingle();

        if (existing?.last_menu_hash === dataHash) {
          console.log(`No changes detected for ${pageConfig.page_slug}, skipping AI generation`);
          
          // Update last_check only
          await supabase
            .from('landingpage_content')
            .update({
              last_check: new Date().toISOString(),
              update_status: 'unchanged'
            })
            .eq('page_slug', pageConfig.page_slug);
          
          results[pageConfig.page_slug] = 'unchanged';
          continue;
        }

        // Generate AI content
        const aiContent = await generateAIContent(packages, cateringItems, pageConfig);

        // Update database
        await updateLandingpageContent(
          supabase,
          pageConfig.page_slug,
          packages,
          cateringItems,
          aiContent,
          dataHash
        );

        results[pageConfig.page_slug] = 'updated';

      } catch (pageError) {
        console.error(`Error processing ${pageConfig.page_slug}:`, pageError);
        results[pageConfig.page_slug] = `error: ${pageError instanceof Error ? pageError.message : 'Unknown error'}`;
        
        // Mark as error but don't delete existing content
        await supabase
          .from('landingpage_content')
          .upsert({
            page_slug: pageConfig.page_slug,
            last_check: new Date().toISOString(),
            update_status: 'error'
          }, { onConflict: 'page_slug' });
      }
    }

    console.log('\n=== Update complete ===');
    console.log('Results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Landingpage content update completed',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Fatal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
