/**
 * GBP OAuth Auth-Test — Desktop OAuth Flow + Food Menu GET
 *
 * Usage:
 *   npx ts-node scripts/gbp-auth-test.ts
 *
 * Beim ersten Mal: Öffnet Consent-Screen, speichert Tokens in .gbp-tokens.json
 * Danach: Nutzt gespeicherten Refresh Token automatisch
 */

import dotenv from "dotenv";
import { fileURLToPath as urlToPath } from "url";
import { dirname, resolve } from "path";
dotenv.config({ path: resolve(dirname(urlToPath(import.meta.url)), "..", ".env") });

// Kein google-auth-library — direkter OAuth via HTTP
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { fileURLToPath } from "url";

// --- Config ---

const __filename_esm = fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

const CREDENTIALS_PATH = path.join(__dirname_esm, "client_secret.json");
const TOKENS_PATH = path.join(__dirname_esm, ".gbp-tokens.json");
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/business.manage";

const GBP_ACCOUNT_ID = "114367954632843728381";
const GBP_LOCATION_ID = "17586248070861131392";
const FOOD_MENUS_URL = `https://mybusiness.googleapis.com/v4/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/foodMenus`;

// --- Encryption ---

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) {
    console.error("❌ GBP_TOKEN_ENCRYPTION_KEY ist nicht gesetzt.");
    console.error("   Generiere einen Key mit: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
    process.exit(1);
  }
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    console.error(`❌ GBP_TOKEN_ENCRYPTION_KEY muss 32 Bytes (64 Hex-Zeichen) lang sein, ist aber ${key.length} Bytes.`);
    process.exit(1);
  }
  return key;
}

function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: iv:authTag:ciphertext (alle base64)
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(":");
}

function decrypt(encoded: string): string {
  const key = getEncryptionKey();
  const [ivB64, tagB64, dataB64] = encoded.split(":");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Ungültiges verschlüsseltes Token-Format");
  }
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf-8");
}

// --- Helpers ---

function loadCredentials(): { client_id: string; client_secret: string } {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`❌ Client-Secret nicht gefunden: ${CREDENTIALS_PATH}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const creds = raw.installed || raw.web;
  if (!creds) {
    console.error("❌ Ungültiges Client-Secret Format (weder 'installed' noch 'web')");
    process.exit(1);
  }
  return { client_id: creds.client_id, client_secret: creds.client_secret };
}

interface StoredTokens {
  access_token: string;
  refresh_token: string;
  expiry_date?: number;
}

function loadTokens(): StoredTokens | null {
  if (!fs.existsSync(TOKENS_PATH)) return null;
  try {
    const raw = fs.readFileSync(TOKENS_PATH, "utf-8").trim();
    const decrypted = decrypt(raw);
    return JSON.parse(decrypted);
  } catch (err) {
    console.warn("⚠ Tokens konnten nicht entschlüsselt werden:", err instanceof Error ? err.message : err);
    return null;
  }
}

function saveTokens(tokens: Record<string, unknown>) {
  const plaintext = JSON.stringify(tokens);
  const encrypted = encrypt(plaintext);
  fs.writeFileSync(TOKENS_PATH, encrypted, "utf-8");
  console.log(`🔒 Tokens verschlüsselt gespeichert in ${TOKENS_PATH}`);
}

// --- Token Refresh via direct HTTP ---

function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }).toString();

    const req = https.request(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Token refresh failed (${res.statusCode}): ${body}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      }
    );
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// --- Direct HTTPS GET ---

function httpsGet(
  url: string,
  accessToken: string
): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let data: unknown;
          try {
            data = JSON.parse(body);
          } catch {
            data = body;
          }
          resolve({ status: res.statusCode || 0, data });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

// --- OAuth Code Exchange via direct HTTP ---

function exchangeCodeForTokens(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString();

    const req = https.request(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Token exchange failed (${res.statusCode}): ${body}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      }
    );
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// --- OAuth Flow ---

function getAuthCodeViaLocalServer(authUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url?.startsWith("/oauth2callback")) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const url = new URL(req.url, "http://localhost:3000");
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Fehler</h1><p>${error}</p>`);
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Kein Auth-Code erhalten</h1>");
        server.close();
        reject(new Error("Kein Auth-Code in Callback"));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<h1>✅ Autorisierung erfolgreich!</h1><p>Du kannst dieses Fenster schließen.</p>"
      );
      server.close();
      resolve(code);
    });

    server.listen(3000, () => {
      console.log("\n🌐 Lokaler Server läuft auf http://localhost:3000");
      console.log("\n📋 Öffne diese URL im Browser:\n");
      console.log(authUrl);
      console.log("\n⏳ Warte auf OAuth-Callback...\n");
    });

    server.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
        console.error("❌ Port 3000 ist bereits belegt. Bitte freigeben und erneut starten.");
      }
      reject(err);
    });
  });
}

// --- Main ---

async function main() {
  const creds = loadCredentials();
  let accessToken: string;

  // Prüfe ob Tokens existieren
  const existingTokens = loadTokens();

  if (existingTokens?.refresh_token) {
    // Prüfe ob Access Token noch gültig (5 Min Puffer)
    const isExpired =
      !existingTokens.expiry_date ||
      Date.now() > existingTokens.expiry_date - 5 * 60 * 1000;

    if (isExpired) {
      console.log("🔄 Access Token abgelaufen, refreshe...");
      try {
        const refreshed = await refreshAccessToken(
          creds.client_id,
          creds.client_secret,
          existingTokens.refresh_token
        );
        accessToken = refreshed.access_token;
        saveTokens({
          access_token: refreshed.access_token,
          refresh_token: existingTokens.refresh_token,
          expiry_date: Date.now() + refreshed.expires_in * 1000,
        });
        console.log("✅ Access Token erneuert");
      } catch (err) {
        console.error("⚠ Refresh fehlgeschlagen:", err instanceof Error ? err.message : err);
        console.log("Starte neuen OAuth-Flow...");
        accessToken = await doFullAuthFlow(creds);
      }
    } else {
      console.log("✅ Gespeicherter Access Token noch gültig");
      accessToken = existingTokens.access_token;
    }
  } else {
    accessToken = await doFullAuthFlow(creds);
  }

  // API-Test: Food Menus abrufen
  console.log(`\n📡 GET ${FOOD_MENUS_URL}`);
  console.log(`   Authorization: Bearer ${accessToken.substring(0, 20)}...`);

  const res = await httpsGet(FOOD_MENUS_URL, accessToken);

  if (res.status >= 200 && res.status < 300) {
    console.log(`\n✅ Status: ${res.status}`);
    console.log("\n--- Response ---\n");
    console.log(JSON.stringify(res.data, null, 2));
  } else {
    console.error(`\n❌ API-Fehler (${res.status}):`);
    console.error(JSON.stringify(res.data, null, 2));
    process.exit(1);
  }
}

async function doFullAuthFlow(
  creds: { client_id: string; client_secret: string }
): Promise<string> {
  const authParams = new URLSearchParams({
    access_type: "offline",
    scope: SCOPE,
    prompt: "consent",
    response_type: "code",
    client_id: creds.client_id,
    redirect_uri: REDIRECT_URI,
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`;

  const code = await getAuthCodeViaLocalServer(authUrl);
  console.log("🔑 Auth-Code erhalten, tausche gegen Tokens...");

  const tokens = await exchangeCodeForTokens(
    creds.client_id,
    creds.client_secret,
    code,
    REDIRECT_URI
  );

  const accessToken = tokens.access_token as string;
  saveTokens(tokens);

  if (!tokens.refresh_token) {
    console.warn("⚠ Kein Refresh Token erhalten. Beim nächsten Mal muss erneut autorisiert werden.");
  }

  console.log("✅ Authentifizierung erfolgreich!");
  return accessToken;
}

main();
