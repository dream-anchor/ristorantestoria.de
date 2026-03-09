/**
 * Sync Speisekarte von Supabase → Google Business Profile Food Menu API (v4)
 *
 * Usage:
 *   npx ts-node scripts/sync-gbp-menu.ts             # Live-Sync
 *   npx ts-node scripts/sync-gbp-menu.ts --dry-run    # Nur JSON-Datei schreiben
 *
 * Env-Vars:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_APPLICATION_CREDENTIALS (Pfad zu service_account_key.json)
 */

import dotenv from "dotenv";
import { fileURLToPath as urlToPath } from "url";
import { dirname, resolve } from "path";
dotenv.config({ path: resolve(dirname(urlToPath(import.meta.url)), "..", ".env") });

import { createClient } from "@supabase/supabase-js";
import { GoogleAuth } from "google-auth-library";
import * as fs from "fs";
import * as path from "path";

// --- Config ---

const GBP_ACCOUNT_ID = "114367954632843728381";
const GBP_LOCATION_ID = "17586248070861131392";
const GBP_API_BASE = "https://mybusiness.googleapis.com/v4";
const GBP_SCOPE = "https://www.googleapis.com/auth/business.manage";
const SOURCE_URL = "https://ristorantestoria.de/speisekarte";
const CUISINES = ["ITALIAN", "PIZZA", "MEDITERRANEAN"];
const MENU_TYPES_TO_SYNC = ["food", "lunch"] as const;

// --- Allergen-Mapping ---

const ALLERGEN_MAP: Record<string, string> = {
  // Deutsche Bezeichnungen
  milch: "DAIRY",
  laktose: "DAIRY",
  milchprodukte: "DAIRY",
  ei: "EGG",
  eier: "EGG",
  fisch: "FISH",
  erdnuss: "PEANUT",
  erdnüsse: "PEANUT",
  schalentiere: "SHELLFISH",
  krebstiere: "SHELLFISH",
  soja: "SOY",
  schalenfrüchte: "TREE_NUT",
  nüsse: "TREE_NUT",
  baumnüsse: "TREE_NUT",
  weizen: "WHEAT",
  gluten: "WHEAT",
  // Englische Bezeichnungen
  dairy: "DAIRY",
  egg: "EGG",
  eggs: "EGG",
  fish: "FISH",
  peanut: "PEANUT",
  peanuts: "PEANUT",
  shellfish: "SHELLFISH",
  soy: "SOY",
  tree_nut: "TREE_NUT",
  treenut: "TREE_NUT",
  wheat: "WHEAT",
  // Codes (Buchstaben-Kennzeichnung)
  a: "WHEAT",   // Gluten
  b: "SHELLFISH",
  c: "EGG",
  d: "FISH",
  e: "PEANUT",
  f: "SOY",
  g: "DAIRY",
  h: "TREE_NUT",
};

// --- Types ---

interface DbMenu {
  id: string;
  menu_type: string;
  title: string;
  title_it: string | null;
  published: boolean;
}

interface DbCategory {
  id: string;
  menu_id: string;
  name: string;
  name_it: string | null;
  description: string | null;
  description_it: string | null;
  sort_order: number;
  published: boolean;
}

interface DbItem {
  id: string;
  category_id: string;
  name: string;
  name_it: string | null;
  description: string | null;
  description_it: string | null;
  price: number | null;
  allergens: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  sort_order: number;
  published: boolean;
}

interface MoneyProto {
  currencyCode: string;
  units: string;
  nanos: number;
}

// --- Hilfsfunktionen ---

function priceToMoney(price: number): MoneyProto {
  const units = Math.floor(price);
  const nanos = Math.round((price - units) * 1_000_000_000);
  return {
    currencyCode: "EUR",
    units: String(units),
    nanos,
  };
}

function parseAllergens(raw: string | null): string[] {
  if (!raw) return [];

  const parts = raw
    .split(/[,;|\/\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const mapped = new Set<string>();
  for (const part of parts) {
    const googleEnum = ALLERGEN_MAP[part];
    if (googleEnum) {
      mapped.add(googleEnum);
    } else {
      console.warn(`  ⚠ Unbekannter Allergen-Wert: "${part}" — übersprungen`);
    }
  }
  return [...mapped];
}

function buildDietaryRestrictions(item: DbItem): string[] {
  const restrictions: string[] = [];
  if (item.is_vegan) {
    restrictions.push("VEGAN", "VEGETARIAN");
  } else if (item.is_vegetarian) {
    restrictions.push("VEGETARIAN");
  }
  return restrictions;
}

// --- Google Food Menu Builder ---

function buildFoodMenuItem(item: DbItem) {
  const labels = [
    {
      displayName: item.name,
      ...(item.description ? { description: item.description } : {}),
      languageCode: "de",
    },
    {
      displayName: item.name_it || item.name,
      ...(item.description_it || item.description
        ? { description: item.description_it || item.description }
        : {}),
      languageCode: "it",
    },
  ];

  const dietaryRestriction = buildDietaryRestrictions(item);
  const allergens = parseAllergens(item.allergens);
  const allRestrictions = [...new Set([...dietaryRestriction, ...allergens])];

  const attributes: Record<string, unknown> = {};
  if (item.price != null) {
    attributes.price = priceToMoney(item.price);
  }
  if (allRestrictions.length > 0) {
    attributes.dietaryRestriction = allRestrictions;
  }

  return {
    labels,
    ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
  };
}

function buildFoodMenuSection(
  category: DbCategory,
  items: DbItem[]
) {
  const publishedItems = items
    .filter((i) => i.published)
    .sort((a, b) => a.sort_order - b.sort_order);

  const labels = [
    {
      displayName: category.name,
      ...(category.description ? { description: category.description } : {}),
      languageCode: "de",
    },
    {
      displayName: category.name_it || category.name,
      ...(category.description_it || category.description
        ? { description: category.description_it || category.description }
        : {}),
      languageCode: "it",
    },
  ];

  return {
    labels,
    items: publishedItems.map(buildFoodMenuItem),
  };
}

function buildFoodMenu(
  menu: DbMenu,
  categories: DbCategory[],
  itemsByCategory: Map<string, DbItem[]>
) {
  const publishedCategories = categories
    .filter((c) => c.published)
    .sort((a, b) => a.sort_order - b.sort_order);

  const sections = publishedCategories
    .map((cat) => buildFoodMenuSection(cat, itemsByCategory.get(cat.id) || []))
    .filter((s) => s.items.length > 0);

  return {
    labels: [
      { displayName: menu.title, languageCode: "de" },
      { displayName: menu.title_it || menu.title, languageCode: "it" },
    ],
    sourceUrl: SOURCE_URL,
    cuisines: CUISINES,
    sections,
  };
}

// --- Main ---

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  // Env-Vars prüfen
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Menüs laden
  console.log("📥 Lade Menüdaten aus Supabase...");

  const { data: menus, error: menusErr } = await supabase
    .from("menus")
    .select("id, menu_type, title, title_it, published")
    .in("menu_type", [...MENU_TYPES_TO_SYNC])
    .eq("published", true);

  if (menusErr) {
    console.error("❌ Fehler beim Laden der Menüs:", menusErr.message);
    process.exit(1);
  }
  if (!menus || menus.length === 0) {
    console.error("❌ Keine publizierten Menüs (food/lunch) gefunden.");
    process.exit(1);
  }

  console.log(`  ${menus.length} Menü(s) gefunden: ${menus.map((m) => m.menu_type).join(", ")}`);

  // 2. Kategorien laden
  const menuIds = menus.map((m) => m.id);
  const { data: categories, error: catErr } = await supabase
    .from("menu_categories")
    .select("id, menu_id, name, name_it, description, description_it, sort_order, published")
    .in("menu_id", menuIds)
    .eq("published", true)
    .order("sort_order");

  if (catErr) {
    console.error("❌ Fehler beim Laden der Kategorien:", catErr.message);
    process.exit(1);
  }

  console.log(`  ${(categories || []).length} Kategorie(n) geladen`);

  // 3. Items laden
  const categoryIds = (categories || []).map((c) => c.id);
  const { data: items, error: itemsErr } = await supabase
    .from("menu_items")
    .select(
      "id, category_id, name, name_it, description, description_it, price, allergens, is_vegetarian, is_vegan, sort_order, published"
    )
    .in("category_id", categoryIds)
    .eq("published", true)
    .order("sort_order");

  if (itemsErr) {
    console.error("❌ Fehler beim Laden der Items:", itemsErr.message);
    process.exit(1);
  }

  console.log(`  ${(items || []).length} Item(s) geladen`);

  // Items nach Kategorie gruppieren
  const itemsByCategory = new Map<string, DbItem[]>();
  for (const item of items || []) {
    const list = itemsByCategory.get(item.category_id) || [];
    list.push(item as DbItem);
    itemsByCategory.set(item.category_id, list);
  }

  // Kategorien nach Menü gruppieren
  const categoriesByMenu = new Map<string, DbCategory[]>();
  for (const cat of categories || []) {
    const list = categoriesByMenu.get(cat.menu_id) || [];
    list.push(cat as DbCategory);
    categoriesByMenu.set(cat.menu_id, list);
  }

  // 4. Google Food Menu Payload bauen
  const foodMenus = menus.map((menu) =>
    buildFoodMenu(
      menu as DbMenu,
      categoriesByMenu.get(menu.id) || [],
      itemsByCategory
    )
  );

  const payload = { menus: foodMenus };

  // Stats
  const totalSections = foodMenus.reduce((sum, m) => sum + m.sections.length, 0);
  const totalItems = foodMenus.reduce(
    (sum, m) => sum + m.sections.reduce((s, sec) => s + sec.items.length, 0),
    0
  );
  console.log(`\n📊 Payload: ${foodMenus.length} Menü(s), ${totalSections} Kategorie(n), ${totalItems} Item(s)`);

  // 5. Dry-Run oder Live-Sync
  if (dryRun) {
    const outPath = path.resolve("gbp-menu-payload.json");
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`\n✅ Dry-Run: Payload geschrieben nach ${outPath}`);
    return;
  }

  // Google Auth
  console.log("\n🔑 Authentifiziere bei Google...");
  const auth = new GoogleAuth({
    scopes: [GBP_SCOPE],
  });
  const client = await auth.getClient();

  const url = `${GBP_API_BASE}/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/foodMenus`;

  console.log(`📤 Sende PATCH an ${url}...`);

  try {
    const response = await client.request({
      url,
      method: "PATCH",
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    console.log(`✅ Sync erfolgreich! Status: ${response.status}`);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiErr = err as { response: { status: number; data: unknown } };
      console.error(`❌ Google API Fehler (${apiErr.response.status}):`);
      console.error(JSON.stringify(apiErr.response.data, null, 2));
    } else if (err instanceof Error) {
      console.error("❌ Fehler:", err.message);
    } else {
      console.error("❌ Unbekannter Fehler:", err);
    }
    process.exit(1);
  }
}

main();
