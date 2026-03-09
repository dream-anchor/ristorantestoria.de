/**
 * Sync Speisekarte von Neon DB → Google Business Profile Food Menu API (v4)
 *
 * Usage:
 *   npx ts-node --esm scripts/sync-gbp-menu.ts             # Live-Sync
 *   npx ts-node --esm scripts/sync-gbp-menu.ts --dry-run    # Nur JSON-Datei schreiben
 *
 * Env-Vars:
 *   DATABASE_URL            — Neon Connection String
 *   GBP_TOKEN_ENCRYPTION_KEY — für OAuth-Token-Entschlüsselung
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "..", ".env") });

import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as crypto from "crypto";

// --- Config ---

const GBP_ACCOUNT_ID = "114367954632843728381";
const GBP_LOCATION_ID = "17586248070861131392";
const GBP_API_BASE = "https://mybusiness.googleapis.com/v4";
const SOURCE_URL = "https://ristorantestoria.de/speisekarte";
const CUISINES = ["ITALIAN", "PIZZA", "MEDITERRANEAN"];
const MENU_TYPES_TO_SYNC = ["food", "lunch"];

// --- Types ---

interface DbMenu {
  id: string;
  menu_type: string;
  title: string;
  title_it: string | null;
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
  return { currencyCode: "EUR", units: String(units), nanos };
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

const MAX_DISPLAY_NAME = 140;

function splitNameDescription(name: string, description: string | null): { displayName: string; description?: string } {
  if (name.length <= MAX_DISPLAY_NAME) {
    return { displayName: name, ...(description ? { description } : {}) };
  }
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
  const dietaryRestriction = buildDietaryRestrictions(item);
  const attributes: Record<string, unknown> = {};
  if (item.price != null) attributes.price = priceToMoney(item.price);
  if (dietaryRestriction.length > 0) attributes.dietaryRestriction = dietaryRestriction;
  return { labels, ...(Object.keys(attributes).length > 0 ? { attributes } : {}) };
}

function buildFoodMenuSection(category: DbCategory, items: DbItem[]) {
  const sortedItems = items.sort((a, b) => a.sort_order - b.sort_order);
  const de = splitNameDescription(category.name, category.description);
  const it = splitNameDescription(category.name_it || category.name, category.description_it || category.description);
  return {
    labels: [{ ...de, languageCode: "de" }, { ...it, languageCode: "it" }],
    items: sortedItems.map(buildFoodMenuItem),
  };
}

function buildFoodMenu(menu: DbMenu, categories: DbCategory[], itemsByCategory: Map<string, DbItem[]>) {
  const sections = categories
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => buildFoodMenuSection(cat, itemsByCategory.get(cat.id) || []))
    .filter((s) => s.items.length > 0);

  const labels: Array<{ displayName: string; languageCode: string }> = [
    { displayName: menu.title, languageCode: "de" },
  ];
  if (menu.title_it && menu.title_it !== menu.title) {
    labels.push({ displayName: menu.title_it, languageCode: "it" });
  }
  return { labels, sourceUrl: SOURCE_URL, cuisines: CUISINES, sections };
}

// --- Encryption ---

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) { console.error("❌ GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt."); process.exit(1); }
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

// --- OAuth Token Management (from DB) ---

async function getAccessToken(sql: postgres.Sql): Promise<string> {
  // Tokens aus DB laden
  const [tokensRow] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_oauth_tokens'`;
  if (!tokensRow) {
    // Fallback: lokale Datei
    const localPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".gbp-tokens.json");
    if (!fs.existsSync(localPath)) {
      console.error("❌ Keine OAuth-Tokens in DB oder lokal gefunden.");
      process.exit(1);
    }
    console.log("⚠ Tokens aus lokaler Datei geladen (DB leer)");
    const tokens = JSON.parse(decrypt(fs.readFileSync(localPath, "utf-8").trim()));
    return await maybeRefreshToken(sql, tokens);
  }

  const tokens = JSON.parse(decrypt(tokensRow.setting_value));
  return await maybeRefreshToken(sql, tokens);
}

async function maybeRefreshToken(sql: postgres.Sql, tokens: { access_token: string; refresh_token: string; expiry_date?: number }): Promise<string> {
  const isExpired = !tokens.expiry_date || Date.now() > tokens.expiry_date - 5 * 60 * 1000;
  if (!isExpired) {
    console.log("✅ Access Token noch gültig");
    return tokens.access_token;
  }

  console.log("🔄 Access Token abgelaufen, refreshe...");
  const creds = await loadCredentials(sql);
  const refreshed = await refreshTokenHttp(creds.client_id, creds.client_secret, tokens.refresh_token);
  const updated = {
    access_token: refreshed.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: Date.now() + refreshed.expires_in * 1000,
  };
  // Zurück in DB speichern
  const encrypted = encrypt(JSON.stringify(updated));
  await sql`UPDATE google_business_settings SET setting_value = ${encrypted}, updated_at = now() WHERE setting_key = 'gbp_oauth_tokens'`;
  console.log("✅ Access Token erneuert + in DB gespeichert");
  return refreshed.access_token;
}

async function loadCredentials(sql: postgres.Sql): Promise<{ client_id: string; client_secret: string }> {
  const [row] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_client_secret'`;
  if (!row) {
    // Fallback: lokale Datei
    const localPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "client_secret.json");
    if (!fs.existsSync(localPath)) {
      console.error("❌ Kein Client Secret in DB oder lokal gefunden.");
      process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(localPath, "utf-8"));
    const c = raw.installed || raw.web;
    return { client_id: c.client_id, client_secret: c.client_secret };
  }
  const raw = JSON.parse(decrypt(row.setting_value));
  const c = raw.installed || raw.web;
  return { client_id: c.client_id, client_secret: c.client_secret };
}

function refreshTokenHttp(clientId: string, clientSecret: string, refToken: string): Promise<{ access_token: string; expires_in: number }> {
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
        let p: unknown;
        try { p = JSON.parse(resBody); } catch { p = resBody; }
        resolve({ status: res.statusCode || 0, data: p });
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// --- Main ---

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error("❌ DATABASE_URL nicht gesetzt."); process.exit(1); }

  const sql = postgres(dbUrl, { ssl: "require" });

  console.log("📥 Lade Menüdaten aus Neon...");

  const menus = await sql<DbMenu[]>`
    SELECT id, menu_type, title, title_it
    FROM menus
    WHERE menu_type = ANY(${MENU_TYPES_TO_SYNC}) AND is_published = true
  `;
  if (menus.length === 0) { console.error("❌ Keine publizierten Menüs gefunden."); process.exit(1); }
  console.log(`  ${menus.length} Menü(s): ${menus.map(m => m.menu_type).join(", ")}`);

  const menuIds = menus.map(m => m.id);
  const categories = await sql<DbCategory[]>`
    SELECT id, menu_id, name, name_it, description, description_it, sort_order
    FROM menu_categories WHERE menu_id = ANY(${menuIds}) ORDER BY sort_order
  `;
  console.log(`  ${categories.length} Kategorie(n)`);

  const categoryIds = categories.map(c => c.id);
  const items = await sql<DbItem[]>`
    SELECT id, category_id, name, name_it, description, description_it, price, allergens, is_vegetarian, is_vegan, sort_order
    FROM menu_items WHERE category_id = ANY(${categoryIds}) ORDER BY sort_order
  `;
  console.log(`  ${items.length} Item(s)`);

  const itemsByCategory = new Map<string, DbItem[]>();
  for (const item of items) {
    const list = itemsByCategory.get(item.category_id) || [];
    list.push(item);
    itemsByCategory.set(item.category_id, list);
  }

  const categoriesByMenu = new Map<string, DbCategory[]>();
  for (const cat of categories) {
    const list = categoriesByMenu.get(cat.menu_id) || [];
    list.push(cat);
    categoriesByMenu.set(cat.menu_id, list);
  }

  const foodMenus = menus.map(menu =>
    buildFoodMenu(menu, categoriesByMenu.get(menu.id) || [], itemsByCategory)
  );
  const payload = { menus: foodMenus };

  const totalSections = foodMenus.reduce((s, m) => s + m.sections.length, 0);
  const totalItems = foodMenus.reduce((s, m) => s + m.sections.reduce((ss, sec) => ss + sec.items.length, 0), 0);
  console.log(`\n📊 Payload: ${foodMenus.length} Menü(s), ${totalSections} Kategorie(n), ${totalItems} Item(s)`);

  if (dryRun) {
    const outPath = path.resolve("gbp-menu-payload.json");
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`\n✅ Dry-Run: Payload geschrieben nach ${outPath}`);
    await sql.end();
    return;
  }

  console.log("\n🔑 Authentifiziere bei Google...");
  const accessToken = await getAccessToken(sql);

  const url = `${GBP_API_BASE}/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/foodMenus`;
  console.log(`📤 Sende PATCH an ${url}...`);

  const result = await httpsPatch(url, accessToken, payload);

  if (result.status >= 200 && result.status < 300) {
    console.log(`\n✅ Sync erfolgreich! Status: ${result.status}`);
  } else {
    console.error(`\n❌ Google API Fehler (${result.status}):`);
    console.error(JSON.stringify(result.data, null, 2));
    await sql.end();
    process.exit(1);
  }

  await sql.end();
}

main();
