/**
 * Einmal-Script: Lokale GBP-Tokens und Client-Credentials in die Supabase-DB migrieren.
 *
 * Usage:
 *   npx tsx scripts/migrate-tokens-to-db.ts
 *
 * Voraussetzungen:
 *   - scripts/.gbp-tokens.json (verschlüsselte Tokens, erstellt von gbp-auth-test.ts)
 *   - scripts/client_secret.json (Google OAuth Client-Credentials)
 *   - GBP_TOKEN_ENCRYPTION_KEY in .env oder Umgebungsvariable
 *   - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (oder VITE_-Varianten in .env)
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as fs from "fs";
import * as crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

// --- Config ---
const TOKENS_PATH = resolve(__dirname, ".gbp-tokens.json");
const CREDENTIALS_PATH = resolve(__dirname, "client_secret.json");
const ALGORITHM = "aes-256-gcm";

// --- Encryption helpers ---
function getEncryptionKey(): Buffer {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) {
    console.error("❌ GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt.");
    process.exit(1);
  }
  return Buffer.from(keyHex, "hex");
}

function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
  return [iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(":");
}

// --- Main ---
async function main() {
  // 1. Supabase-Client erstellen
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein.");
    console.error("   Tipp: SUPABASE_SERVICE_ROLE_KEY findest du über die temp-show-key Edge Function.");
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Tokens-Datei lesen
  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`❌ ${TOKENS_PATH} nicht gefunden.`);
    console.error("   Erst 'npx tsx scripts/gbp-auth-test.ts' ausführen, um Tokens zu erstellen.");
    process.exit(1);
  }
  const encryptedTokens = fs.readFileSync(TOKENS_PATH, "utf-8").trim();
  console.log(`✅ Verschlüsselte Tokens gelesen (${encryptedTokens.length} Zeichen)`);

  // 3. Client-Credentials lesen und verschlüsseln
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`❌ ${CREDENTIALS_PATH} nicht gefunden.`);
    process.exit(1);
  }
  const rawCreds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const creds = rawCreds.installed || rawCreds.web;
  const credsPayload = JSON.stringify({
    client_id: creds.client_id,
    client_secret: creds.client_secret,
  });
  const encryptedCreds = encrypt(credsPayload);
  console.log(`✅ Client-Credentials verschlüsselt (${encryptedCreds.length} Zeichen)`);

  // 4. In DB speichern (upsert)
  const now = new Date().toISOString();

  const { error: err1 } = await supabase
    .from("google_business_settings")
    .upsert(
      { setting_key: "gbp_tokens", setting_value: encryptedTokens, updated_at: now },
      { onConflict: "setting_key" }
    );
  if (err1) {
    console.error("❌ Fehler beim Speichern von gbp_tokens:", err1.message);
    process.exit(1);
  }
  console.log("✅ gbp_tokens in DB gespeichert");

  const { error: err2 } = await supabase
    .from("google_business_settings")
    .upsert(
      { setting_key: "gbp_client_credentials", setting_value: encryptedCreds, updated_at: now },
      { onConflict: "setting_key" }
    );
  if (err2) {
    console.error("❌ Fehler beim Speichern von gbp_client_credentials:", err2.message);
    process.exit(1);
  }
  console.log("✅ gbp_client_credentials in DB gespeichert");

  console.log("\n🎉 Migration abgeschlossen! Die GitHub Action kann jetzt Tokens aus der DB lesen.");
  console.log("   Du kannst die lokalen Dateien (.gbp-tokens.json, client_secret.json) jetzt sicher löschen.");
}

main();
