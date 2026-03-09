/**
 * Migriert .gbp-tokens.json und client_secret.json in die Neon-Tabelle
 * google_business_settings (verschlüsselt mit GBP_TOKEN_ENCRYPTION_KEY).
 *
 * Usage:
 *   npx ts-node --esm scripts/migrate-tokens-to-db.ts
 *
 * Env-Vars:
 *   DATABASE_URL              — Neon Connection String
 *   GBP_TOKEN_ENCRYPTION_KEY  — 32-Byte Hex-Key für AES-256-GCM
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "..", ".env") });

import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const __dirname_esm = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = path.resolve(__dirname_esm, ".gbp-tokens.json");
const CLIENT_SECRET_PATH = path.resolve(__dirname_esm, "client_secret.json");
const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) { console.error("❌ GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt."); process.exit(1); }
  return Buffer.from(keyHex, "hex");
}

function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
  return [iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(":");
}

function decrypt(encoded: string): string {
  const key = getEncryptionKey();
  const [ivB64, tagB64, dataB64] = encoded.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf-8");
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error("❌ DATABASE_URL nicht gesetzt."); process.exit(1); }
  const sql = postgres(dbUrl, { ssl: "require" });

  console.log("🔄 Migriere GBP-Tokens und Client-Secret nach Neon...\n");

  // 1. Tokens
  if (!fs.existsSync(TOKENS_PATH)) { console.error(`❌ ${TOKENS_PATH} nicht gefunden.`); process.exit(1); }
  const tokensRaw = fs.readFileSync(TOKENS_PATH, "utf-8").trim();
  let tokensPlain: string;
  try {
    tokensPlain = decrypt(tokensRaw);
    const parsed = JSON.parse(tokensPlain);
    console.log(`✅ Tokens entschlüsselt (access_token: ${(parsed.access_token as string).substring(0, 20)}...)`);
  } catch (err) { console.error("❌ Entschlüsselung fehlgeschlagen:", err); process.exit(1); }

  const encTokens = encrypt(tokensPlain);
  await sql`
    INSERT INTO google_business_settings (setting_key, setting_value)
    VALUES ('gbp_oauth_tokens', ${encTokens})
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = ${encTokens}, updated_at = now()
  `;
  console.log("   ✅ gbp_oauth_tokens hochgeladen\n");

  // 2. Client Secret
  if (!fs.existsSync(CLIENT_SECRET_PATH)) { console.error(`❌ ${CLIENT_SECRET_PATH} nicht gefunden.`); process.exit(1); }
  const secretRaw = fs.readFileSync(CLIENT_SECRET_PATH, "utf-8").trim();
  JSON.parse(secretRaw); // Validieren
  const encSecret = encrypt(secretRaw);
  await sql`
    INSERT INTO google_business_settings (setting_key, setting_value)
    VALUES ('gbp_client_secret', ${encSecret})
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = ${encSecret}, updated_at = now()
  `;
  console.log("   ✅ gbp_client_secret hochgeladen\n");

  // Verify
  const rows = await sql`SELECT setting_key, updated_at FROM google_business_settings`;
  for (const r of rows) console.log(`   ✅ ${r.setting_key} — ${r.updated_at}`);

  await sql.end();
  console.log("\n✅ Migration abgeschlossen!");
}

main();
