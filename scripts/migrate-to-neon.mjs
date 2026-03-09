#!/usr/bin/env node
/**
 * Migriert Schema + Daten von Supabase nach Neon.
 * 1. Erstellt Schema (neon-init.sql)
 * 2. Exportiert Daten aus Supabase
 * 3. Importiert Daten in Neon
 * 4. Migriert verschlüsselte GBP-Tokens
 *
 * Usage: node scripts/migrate-to-neon.mjs
 *
 * Env:
 *   DATABASE_URL — Neon Connection String
 *   VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY — Supabase (Quelle)
 *   GBP_TOKEN_ENCRYPTION_KEY — für Token-Migration
 */

import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Load .env ---
function loadEnv() {
  const envPath = resolve(__dirname, '..', '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

// --- Config ---
const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!DATABASE_URL) { console.error('❌ DATABASE_URL nicht gesetzt'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌ VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY nicht gesetzt'); process.exit(1); }

// --- Encryption helpers (for GBP tokens) ---
const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey() {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) return null;
  return Buffer.from(keyHex, 'hex');
}

function decrypt(encoded) {
  const key = getEncryptionKey();
  if (!key) throw new Error('GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt');
  const [ivB64, tagB64, dataB64] = encoded.split(':');
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf-8');
}

function encrypt(plaintext) {
  const key = getEncryptionKey();
  if (!key) throw new Error('GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt');
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join(':');
}

// --- Main ---
async function main() {
  console.log('🔄 Migration Supabase → Neon\n');

  // 1. Neon: Schema erstellen
  console.log('1️⃣  Schema in Neon erstellen...');
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  const schemaSql = readFileSync(resolve(__dirname, 'neon-init.sql'), 'utf-8');
  // Split by semicolons but keep $function$ blocks intact
  await sql.unsafe(schemaSql);
  console.log('   ✅ Schema erstellt (6 Tabellen + Trigger)\n');

  // 2. Supabase: Daten exportieren
  console.log('2️⃣  Daten aus Supabase exportieren...');
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: menus } = await sb.from('menus').select('*');
  const { data: categories } = await sb.from('menu_categories').select('*');
  const { data: items } = await sb.from('menu_items').select('*');
  const { data: landingpages } = await sb.from('landingpage_content').select('*');
  const { data: signups } = await sb.from('seasonal_signups').select('*');

  console.log(`   menus: ${(menus||[]).length}`);
  console.log(`   menu_categories: ${(categories||[]).length}`);
  console.log(`   menu_items: ${(items||[]).length}`);
  console.log(`   landingpage_content: ${(landingpages||[]).length}`);
  console.log(`   seasonal_signups: ${(signups||[]).length}\n`);

  // 3. Neon: Daten importieren (Reihenfolge wegen FK: menus → categories → items)
  console.log('3️⃣  Daten in Neon importieren...');

  if (menus && menus.length > 0) {
    for (const m of menus) {
      await sql`INSERT INTO menus ${sql(m, ...Object.keys(m))} ON CONFLICT (id) DO NOTHING`;
    }
    console.log(`   ✅ menus: ${menus.length} rows`);
  }

  if (categories && categories.length > 0) {
    for (const c of categories) {
      await sql`INSERT INTO menu_categories ${sql(c, ...Object.keys(c))} ON CONFLICT (id) DO NOTHING`;
    }
    console.log(`   ✅ menu_categories: ${categories.length} rows`);
  }

  if (items && items.length > 0) {
    // Trigger deaktivieren für Import (Daten sind schon bereinigt)
    await sql`ALTER TABLE menu_items DISABLE TRIGGER trg_cleanup_menu_item`;
    for (const item of items) {
      await sql`INSERT INTO menu_items ${sql(item, ...Object.keys(item))} ON CONFLICT (id) DO NOTHING`;
    }
    await sql`ALTER TABLE menu_items ENABLE TRIGGER trg_cleanup_menu_item`;
    console.log(`   ✅ menu_items: ${items.length} rows`);
  }

  if (landingpages && landingpages.length > 0) {
    for (const lp of landingpages) {
      await sql`INSERT INTO landingpage_content ${sql(lp, ...Object.keys(lp))} ON CONFLICT (id) DO NOTHING`;
    }
    console.log(`   ✅ landingpage_content: ${landingpages.length} rows`);
  }

  if (signups && signups.length > 0) {
    for (const s of signups) {
      await sql`INSERT INTO seasonal_signups ${sql(s, ...Object.keys(s))} ON CONFLICT (id) DO NOTHING`;
    }
    console.log(`   ✅ seasonal_signups: ${signups.length} rows`);
  }

  // 4. GBP Tokens migrieren
  console.log('\n4️⃣  GBP-Tokens migrieren...');
  const tokensPath = resolve(__dirname, '.gbp-tokens.json');
  const clientSecretPath = resolve(__dirname, 'client_secret.json');

  if (existsSync(tokensPath) && getEncryptionKey()) {
    const tokensRaw = readFileSync(tokensPath, 'utf-8').trim();
    try {
      const tokensPlain = decrypt(tokensRaw);
      JSON.parse(tokensPlain); // Validieren
      const encrypted = encrypt(tokensPlain);
      await sql`
        INSERT INTO google_business_settings (setting_key, setting_value)
        VALUES ('gbp_oauth_tokens', ${encrypted})
        ON CONFLICT (setting_key) DO UPDATE SET setting_value = ${encrypted}, updated_at = now()
      `;
      console.log('   ✅ gbp_oauth_tokens hochgeladen');
    } catch (err) {
      console.error('   ❌ Token-Entschlüsselung fehlgeschlagen:', err.message);
    }
  } else {
    console.log('   ⚠ Keine .gbp-tokens.json oder kein Encryption Key — übersprungen');
  }

  if (existsSync(clientSecretPath) && getEncryptionKey()) {
    const secretRaw = readFileSync(clientSecretPath, 'utf-8').trim();
    try {
      JSON.parse(secretRaw); // Validieren
      const encrypted = encrypt(secretRaw);
      await sql`
        INSERT INTO google_business_settings (setting_key, setting_value)
        VALUES ('gbp_client_secret', ${encrypted})
        ON CONFLICT (setting_key) DO UPDATE SET setting_value = ${encrypted}, updated_at = now()
      `;
      console.log('   ✅ gbp_client_secret hochgeladen');
    } catch (err) {
      console.error('   ❌ Client Secret ungültig:', err.message);
    }
  } else {
    console.log('   ⚠ Keine client_secret.json — übersprungen');
  }

  // 5. Verifizierung
  console.log('\n5️⃣  Verifizierung...');
  const [menuCount] = await sql`SELECT count(*) as c FROM menus`;
  const [catCount] = await sql`SELECT count(*) as c FROM menu_categories`;
  const [itemCount] = await sql`SELECT count(*) as c FROM menu_items`;
  const [lpCount] = await sql`SELECT count(*) as c FROM landingpage_content`;
  const [gbpCount] = await sql`SELECT count(*) as c FROM google_business_settings`;

  console.log(`   menus: ${menuCount.c}`);
  console.log(`   menu_categories: ${catCount.c}`);
  console.log(`   menu_items: ${itemCount.c}`);
  console.log(`   landingpage_content: ${lpCount.c}`);
  console.log(`   google_business_settings: ${gbpCount.c}`);

  await sql.end();
  console.log('\n✅ Migration abgeschlossen!');
}

main().catch((err) => {
  console.error('❌ Migration fehlgeschlagen:', err);
  process.exit(1);
});
