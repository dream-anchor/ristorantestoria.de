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
import { fileURLToPath, fileURLToPath as urlToPath } from "url";
import { dirname, resolve } from "path";
dotenv.config({ path: resolve(dirname(urlToPath(import.meta.url)), "..", ".env") });

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as crypto from "crypto";

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
  is_published: boolean;
}

interface DbCategory {
  id: string;
  menu_id: string;
  name: string;
  name_it: string | null;
  description: string | null;
  description_it: string | null;
  sort_order: number;
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

const MAX_DISPLAY_NAME = 140;

function splitNameDescription(name: string, description: string | null): { displayName: string; description?: string } {
  if (name.length <= MAX_DISPLAY_NAME) {
    return { displayName: name, ...(description ? { description } : {}) };
  }
  // Name zu lang — kürze und verschiebe Rest in description
  const truncated = name.slice(0, MAX_DISPLAY_NAME).replace(/\s+\S*$/, "");
  const overflow = name.slice(truncated.length).trim();
  const fullDesc = [overflow, description].filter(Boolean).join(" ");
  return { displayName: truncated, ...(fullDesc ? { description: fullDesc } : {}) };
}

function buildFoodMenuItem(item: DbItem) {
  const de = splitNameDescription(item.name, item.description);
  const it = splitNameDescription(item.name_it || item.name, item.description_it || item.description);

  const labels = [
    { ...de, languageCode: "de" },
    { ...it, languageCode: "it" },
  ];

  // Google Food Menu API akzeptiert nur: HALAL, KOSHER, ORGANIC, VEGAN, VEGETARIAN, GLUTEN_FREE
  // Individuelle Allergene (DAIRY, EGG etc.) werden NICHT unterstützt
  const dietaryRestriction = buildDietaryRestrictions(item);

  const attributes: Record<string, unknown> = {};
  if (item.price != null) {
    attributes.price = priceToMoney(item.price);
  }
  if (dietaryRestriction.length > 0) {
    attributes.dietaryRestriction = dietaryRestriction;
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
  const sortedItems = items
    .sort((a, b) => a.sort_order - b.sort_order);

  const de = splitNameDescription(category.name, category.description);
  const it = splitNameDescription(category.name_it || category.name, category.description_it || category.description);
  const labels = [
    { ...de, languageCode: "de" },
    { ...it, languageCode: "it" },
  ];

  return {
    labels,
    items: sortedItems.map(buildFoodMenuItem),
  };
}

function buildFoodMenu(
  menu: DbMenu,
  categories: DbCategory[],
  itemsByCategory: Map<string, DbItem[]>
) {
  const sortedCategories = categories
    .sort((a, b) => a.sort_order - b.sort_order);

  const sections = sortedCategories
    .map((cat) => buildFoodMenuSection(cat, itemsByCategory.get(cat.id) || []))
    .filter((s) => s.items.length > 0);

  // Google verlangt unique displayNames pro Sprache — nur IT-Label wenn unterschiedlich
  const labels: Array<{ displayName: string; languageCode: string }> = [
    { displayName: menu.title, languageCode: "de" },
  ];
  if (menu.title_it && menu.title_it !== menu.title) {
    labels.push({ displayName: menu.title_it, languageCode: "it" });
  }

  return {
    labels,
    sourceUrl: SOURCE_URL,
    cuisines: CUISINES,
    sections,
  };
}

// --- Main ---

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  // Env-Vars prüfen (Fallback auf VITE_-Varianten)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_URL (oder VITE_SUPABASE_URL) und SUPABASE_SERVICE_ROLE_KEY (oder VITE_SUPABASE_PUBLISHABLE_KEY) müssen gesetzt sein.");
    process.exit(1);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && dryRun) {
    console.warn("⚠ Kein Service Role Key — verwende Anon Key (Dry-Run). RLS muss SELECT erlauben.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Menüs laden
  console.log("📥 Lade Menüdaten aus Supabase...");

  const { data: menus, error: menusErr } = await supabase
    .from("menus")
    .select("id, menu_type, title, title_it, is_published")
    .in("menu_type", [...MENU_TYPES_TO_SYNC])
    .eq("is_published", true);

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
    .select("id, menu_id, name, name_it, description, description_it, sort_order")
    .in("menu_id", menuIds)
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
      "id, category_id, name, name_it, description, description_it, price, allergens, is_vegetarian, is_vegan, sort_order"
    )
    .in("category_id", categoryIds)
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

  // Google Auth — Tokens aus Supabase DB laden
  console.log("\n🔑 Authentifiziere bei Google...");
  const accessToken = await getAccessToken(supabase);

  const url = `${GBP_API_BASE}/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/foodMenus`;
  console.log(`📤 Sende PATCH an ${url}...`);

  const result = await httpsPatch(url, accessToken, payload);

  if (result.status >= 200 && result.status < 300) {
    console.log(`\n✅ Sync erfolgreich! Status: ${result.status}`);
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.error(`\n❌ Google API Fehler (${result.status}):`);
    console.error(JSON.stringify(result.data, null, 2));
    process.exit(1);
  }
}

// --- OAuth Token Management (from Supabase DB) ---

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) {
    console.error("❌ GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt.");
    process.exit(1);
  }
  return Buffer.from(keyHex, "hex");
}

function decrypt(encoded: string): string {
  const key = getEncryptionKey();
  const [ivB64, tagB64, dataB64] = encoded.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf-8");
}

function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
  return [iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(":");
}

async function loadSettingFromDB(supabase: ReturnType<typeof createClient>, key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("google_business_settings")
    .select("setting_value")
    .eq("setting_key", key)
    .maybeSingle();
  if (error) {
    console.error(`❌ Fehler beim Laden von '${key}':`, error.message);
    return null;
  }
  return data?.setting_value ?? null;
}

async function saveSettingToDB(supabase: ReturnType<typeof createClient>, key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from("google_business_settings")
    .upsert({ setting_key: key, setting_value: value, updated_at: new Date().toISOString() }, { onConflict: "setting_key" });
  if (error) {
    console.error(`❌ Fehler beim Speichern von '${key}':`, error.message);
  }
}

async function getAccessToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  const encryptedTokens = await loadSettingFromDB(supabase, "gbp_tokens");
  if (!encryptedTokens) {
    console.error("❌ Keine GBP-Tokens in der Datenbank. Bitte zuerst lokal mit 'npx tsx scripts/gbp-auth-test.ts' authentifizieren und Tokens in die DB übertragen.");
    process.exit(1);
  }

  const tokens = JSON.parse(decrypt(encryptedTokens));
  const isExpired = !tokens.expiry_date || Date.now() > tokens.expiry_date - 5 * 60 * 1000;

  if (!isExpired) {
    console.log("✅ Gespeicherter Access Token noch gültig");
    return tokens.access_token;
  }

  console.log("🔄 Access Token abgelaufen, refreshe...");

  const encryptedCreds = await loadSettingFromDB(supabase, "gbp_client_credentials");
  if (!encryptedCreds) {
    console.error("❌ Keine Client-Credentials in der Datenbank. Bitte 'gbp_client_credentials' in google_business_settings speichern.");
    process.exit(1);
  }
  const creds = JSON.parse(decrypt(encryptedCreds));

  const refreshed = await refreshToken(creds.client_id, creds.client_secret, tokens.refresh_token);
  const updated = {
    access_token: refreshed.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: Date.now() + refreshed.expires_in * 1000,
  };

  await saveSettingToDB(supabase, "gbp_tokens", encrypt(JSON.stringify(updated)));
  console.log("✅ Access Token erneuert und in DB gespeichert");
  return refreshed.access_token;
}

function refreshToken(clientId: string, clientSecret: string, refToken: string): Promise<{ access_token: string; expires_in: number }> {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: clientId, client_secret: clientSecret,
      refresh_token: refToken, grant_type: "refresh_token",
    }).toString();
    const req = https.request("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": String(Buffer.byteLength(postData)) },
    }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => res.statusCode === 200 ? resolve(JSON.parse(body)) : reject(new Error(`Refresh failed (${res.statusCode}): ${body}`)));
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function httpsPatch(url: string, accessToken: string, data: unknown): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname, path: parsed.pathname + parsed.search,
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "Content-Length": String(Buffer.byteLength(body)) },
    }, (res) => {
      let resBody = "";
      res.on("data", (c) => (resBody += c));
      res.on("end", () => {
        let parsed: unknown;
        try { parsed = JSON.parse(resBody); } catch { parsed = resBody; }
        resolve({ status: res.statusCode || 0, data: parsed });
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

main();
