/**
 * Menu Data Cleanup Edge Function
 *
 * Extracts prices, allergens from descriptions,
 * cleans up description text, and copies Italian names.
 *
 * POST /cleanup-menu-data
 * Body: { "dry_run": true/false, "menu_type": "food" (optional) }
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Italian terms that should be copied as-is to name_it
const ITALIAN_TERMS = [
  'antipasti', 'antipasto', 'bruschetta', 'carpaccio', 'caprese',
  'pasta', 'paste', 'spaghetti', 'penne', 'rigatoni', 'tagliatelle',
  'linguine', 'fusilli', 'farfalle', 'orecchiette', 'gnocchi',
  'ravioli', 'tortellini', 'lasagne', 'cannelloni', 'pappardelle',
  'pizza', 'calzone', 'focaccia', 'ciabatta', 'grissini',
  'risotto', 'polenta', 'minestrone', 'ribollita',
  'prosciutto', 'pancetta', 'bresaola', 'mortadella', 'salame',
  'mozzarella', 'burrata', 'ricotta', 'mascarpone', 'parmigiano',
  'gorgonzola', 'pecorino', 'provolone', 'scamorza',
  'tiramisu', 'tiramisù', 'panna cotta', 'pannacotta', 'zabaglione',
  'gelato', 'granita', 'semifreddo', 'cannoli', 'biscotti',
  'ossobuco', 'saltimbocca', 'vitello', 'tonnato', 'piccata',
  'scaloppine', 'involtini', 'cotoletta', 'bistecca', 'tagliata',
  'calamari', 'frutti di mare', 'vongole', 'cozze', 'gamberi',
  'insalata', 'contorni', 'verdure', 'melanzane', 'zucchine',
  'arancini', 'supplì', 'crostini', 'fritto misto',
  'espresso', 'cappuccino', 'macchiato', 'affogato', 'limoncello',
  'amaretto', 'grappa', 'prosecco', 'chianti', 'barolo',
  'secondi', 'primi', 'dolci', 'contorno', 'zuppa',
  'alla carbonara', 'all\'amatriciana', 'alla norma', 'aglio e olio',
  'al pesto', 'alla bolognese', 'alla puttanesca', 'cacio e pepe',
  'margherita', 'marinara', 'quattro formaggi', 'quattro stagioni',
  'diavola', 'napoletana', 'capricciosa', 'prosciutto e funghi',
];

// Regex: price at end of description like "8,8" or "15,50" or "8.80"
// Matches patterns like: "... 8,8" or "... 15,50" or standalone "12,90"
const PRICE_REGEX = /\b(\d{1,3}[,.]\d{1,2})\s*€?\s*$/;

// Allergen codes: single letters a-h or numbers, typically in parentheses or at end
// Matches: "(a, c, g)" or "a,c,g" or "(a,c,g,8)" at end of text
const ALLERGEN_REGEX = /\s*[\(\[]?\s*([a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*)\s*[\)\]]?\s*$/i;

// Combined pattern: allergens then price, or price then allergens, or just one
const DESC_CLEANUP_PATTERNS = [
  // Price at end, possibly preceded by allergens
  /\s*[\(\[]?\s*([a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*)\s*[\)\]]?\s+(\d{1,3}[,.]\d{1,2})\s*€?\s*$/i,
  // Price at end only
  /\s+(\d{1,3}[,.]\d{1,2})\s*€?\s*$/,
  // Allergens at end only (in parens)
  /\s*\(\s*([a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*)\s*\)\s*$/i,
  // Allergens at end only (without parens, after description)
  /\s+([a-h1-9](?:\s*,\s*[a-h1-9])+)\s*$/i,
];

interface CleanupResult {
  itemId: string;
  name: string;
  changes: string[];
  extractedPrice: number | null;
  extractedAllergens: string | null;
  cleanedDescription: string | null;
  copiedNameIt: boolean;
}

// deno-lint-ignore no-explicit-any
function extractPriceFromDescription(description: string): { price: number | null; remaining: string } {
  const match = description.match(PRICE_REGEX);
  if (match) {
    const priceStr = match[1].replace(',', '.');
    const price = parseFloat(priceStr);
    if (!isNaN(price) && price > 0 && price < 1000) {
      const remaining = description.slice(0, match.index).trim();
      return { price, remaining };
    }
  }
  return { price: null, remaining: description };
}

function extractAllergensFromDescription(description: string): { allergens: string | null; remaining: string } {
  const match = description.match(ALLERGEN_REGEX);
  if (match) {
    const raw = match[1];
    const codes = raw.split(/[,;/\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    // Validate: all codes must be single chars a-h or single digits 1-9
    const validCodes = codes.filter(c => /^[a-h]$/.test(c) || /^[1-9]$/.test(c));
    if (validCodes.length > 0 && validCodes.length === codes.length) {
      const remaining = description.slice(0, match.index).trim();
      return { allergens: validCodes.join(','), remaining };
    }
  }
  return { allergens: null, remaining: description };
}

function cleanDescription(description: string): { price: number | null; allergens: string | null; cleaned: string } {
  let text = description.trim();
  let price: number | null = null;
  let allergens: string | null = null;

  // Try combined pattern first: allergens + price at end
  const combinedMatch = text.match(DESC_CLEANUP_PATTERNS[0]);
  if (combinedMatch) {
    const allergenRaw = combinedMatch[1];
    const priceStr = combinedMatch[2].replace(',', '.');
    const parsedPrice = parseFloat(priceStr);

    if (!isNaN(parsedPrice) && parsedPrice > 0 && parsedPrice < 1000) {
      price = parsedPrice;
      const codes = allergenRaw.split(/[,;/\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
      const validCodes = codes.filter(c => /^[a-h]$/.test(c) || /^[1-9]$/.test(c));
      if (validCodes.length > 0) {
        allergens = validCodes.join(',');
      }
      text = text.slice(0, combinedMatch.index!).trim();
      return { price, allergens, cleaned: text };
    }
  }

  // Try price extraction first (price is usually at the very end)
  const priceResult = extractPriceFromDescription(text);
  if (priceResult.price !== null) {
    price = priceResult.price;
    text = priceResult.remaining;
  }

  // Then try allergen extraction
  const allergenResult = extractAllergensFromDescription(text);
  if (allergenResult.allergens !== null) {
    allergens = allergenResult.allergens;
    text = allergenResult.remaining;
  }

  return { price, allergens, cleaned: text };
}

function shouldCopyAsItalianName(name: string): boolean {
  const lower = name.toLowerCase().trim();
  return ITALIAN_TERMS.some(term => {
    // Exact match or starts with the term
    return lower === term || lower.startsWith(term + ' ') || lower.startsWith(term + ',');
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const dryRun = body.dry_run !== false; // Default: dry_run = true
    const menuTypeFilter = body.menu_type || null;

    console.log(`Menu cleanup: dry_run=${dryRun}, menu_type=${menuTypeFilter || 'all'}`);

    // 1. Load menu items with their categories and menus
    let query = supabase
      .from('menu_items')
      .select(`
        id, name, name_it, description, description_it, price, allergens,
        category_id,
        menu_categories!inner(menu_id, menus!inner(menu_type))
      `);

    // deno-lint-ignore no-explicit-any
    const { data: items, error: itemsErr } = await query as any;

    if (itemsErr) {
      throw new Error(`Failed to load items: ${itemsErr.message}`);
    }

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No items found', results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter by menu_type if specified
    // deno-lint-ignore no-explicit-any
    const filteredItems = menuTypeFilter
      // deno-lint-ignore no-explicit-any
      ? items.filter((item: any) => item.menu_categories?.menus?.menu_type === menuTypeFilter)
      : items;

    console.log(`Processing ${filteredItems.length} items (of ${items.length} total)`);

    const results: CleanupResult[] = [];
    // deno-lint-ignore no-explicit-any
    const updates: Array<{ id: string; updates: Record<string, any> }> = [];

    // deno-lint-ignore no-explicit-any
    for (const item of filteredItems as any[]) {
      const result: CleanupResult = {
        itemId: item.id,
        name: item.name,
        changes: [],
        extractedPrice: null,
        extractedAllergens: null,
        cleanedDescription: null,
        copiedNameIt: false,
      };

      // deno-lint-ignore no-explicit-any
      const itemUpdates: Record<string, any> = {};

      // --- Price & Allergen Extraction from description ---
      if (item.description) {
        const { price, allergens, cleaned } = cleanDescription(item.description);

        // Only extract price if the item doesn't already have one
        if (price !== null && (item.price === null || item.price === 0)) {
          result.extractedPrice = price;
          result.changes.push(`price: null → ${price}`);
          itemUpdates.price = price;
          // Also set price_display
          itemUpdates.price_display = price.toFixed(2).replace('.', ',') + ' €';
        }

        // Only extract allergens if the item doesn't already have them
        if (allergens !== null && (!item.allergens || item.allergens.trim() === '')) {
          result.extractedAllergens = allergens;
          result.changes.push(`allergens: null → "${allergens}"`);
          itemUpdates.allergens = allergens;
        }

        // Clean description if we extracted anything
        if ((price !== null || allergens !== null) && cleaned !== item.description) {
          result.cleanedDescription = cleaned;
          result.changes.push(`description cleaned`);
          itemUpdates.description = cleaned;
        }
      }

      // --- Italian name copy ---
      if (!item.name_it && item.name && shouldCopyAsItalianName(item.name)) {
        result.copiedNameIt = true;
        result.changes.push(`name_it: copied "${item.name}"`);
        itemUpdates.name_it = item.name;
      }

      // Only add if there are changes
      if (result.changes.length > 0) {
        results.push(result);
        updates.push({ id: item.id, updates: itemUpdates });
      }
    }

    console.log(`Found ${results.length} items with changes`);

    // Apply updates if not dry run
    let appliedCount = 0;
    if (!dryRun && updates.length > 0) {
      for (const { id, updates: upd } of updates) {
        const { error } = await supabase
          .from('menu_items')
          .update(upd)
          .eq('id', id);

        if (!error) {
          appliedCount++;
        } else {
          console.error(`Failed to update item ${id}:`, error.message);
        }
      }
      console.log(`Applied ${appliedCount} updates`);
    }

    return new Response(JSON.stringify({
      success: true,
      dry_run: dryRun,
      total_items: filteredItems.length,
      items_with_changes: results.length,
      applied: dryRun ? 0 : appliedCount,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
