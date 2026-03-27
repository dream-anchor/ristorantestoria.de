#!/usr/bin/env node
/**
 * Google Indexing API — URL Submission Script
 *
 * Submits URLs to Google's Indexing API (indexing.googleapis.com/v3)
 * to request (re)crawling. Uses Service Account JWT authentication.
 *
 * NOTE: The Indexing API is officially for JobPosting/BroadcastEvent,
 * but Google processes notifications for all URL types. This is a
 * widely-used SEO technique to speed up crawling.
 *
 * Credentials (one of):
 *   a) GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY in .env
 *   b) GOOGLE_SERVICE_ACCOUNT_JSON in .env (path to .json key file)
 *   c) scripts/service-account.json (auto-detected)
 *
 * Usage:
 *   node scripts/request-indexing.mjs                          # All DE URLs from sitemap
 *   node scripts/request-indexing.mjs --all                    # All URLs from sitemap
 *   node scripts/request-indexing.mjs /pizza-muenchen/ /silvester-muenchen/  # Specific paths
 *   node scripts/request-indexing.mjs --dry-run                # Preview without submitting
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = "https://www.ristorantestoria.de";
const INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/indexing";
const RATE_LIMIT_MS = 300; // 300ms between requests (safe for 200/day quota)

// ── Load .env ──
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

// ── Service Account Credentials ──
function loadCredentials() {
  // Option a) Env vars (same as Supabase Edge Function gsc-sync)
  if (process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY) {
    return {
      client_email: process.env.GSC_CLIENT_EMAIL,
      private_key: process.env.GSC_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  // Option b) Path to JSON key file via env
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const keyFile = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_JSON, "utf-8"));
    return { client_email: keyFile.client_email, private_key: keyFile.private_key };
  }

  // Option c) Auto-detect in scripts/
  const autoPath = path.resolve(__dirname, "service-account.json");
  if (fs.existsSync(autoPath)) {
    const keyFile = JSON.parse(fs.readFileSync(autoPath, "utf-8"));
    return { client_email: keyFile.client_email, private_key: keyFile.private_key };
  }

  console.error("❌ Keine Service-Account-Credentials gefunden.");
  console.error("   Setze GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY in .env");
  console.error("   oder lege scripts/service-account.json ab.");
  process.exit(1);
}

// ── JWT + Access Token ──
function base64url(data) {
  return Buffer.from(data).toString("base64url");
}

async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));

  const signInput = `${header}.${payload}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signInput);
  const signature = sign.sign(credentials.private_key, "base64url");
  const jwt = `${signInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token-Request fehlgeschlagen (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.access_token;
}

// ── Sitemap Parser ──
function getUrlsFromSitemap(allLanguages = false) {
  const sitemapPath = path.resolve(__dirname, "../dist/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.error("❌ dist/sitemap.xml nicht gefunden. Zuerst `npm run build` ausführen.");
    process.exit(1);
  }

  const sitemap = fs.readFileSync(sitemapPath, "utf-8");
  const allUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  if (allLanguages) return allUrls;

  // Default: only DE URLs (no /en/, /it/, /fr/ prefix)
  return allUrls.filter(url => {
    const pathname = new URL(url).pathname;
    return !pathname.startsWith("/en/") && !pathname.startsWith("/it/") && !pathname.startsWith("/fr/");
  });
}

// ── Submit single URL ──
async function submitUrl(url, accessToken) {
  const res = await fetch(INDEXING_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      url,
      type: "URL_UPDATED",
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (res.ok) {
    return { url, status: "ok", notifyTime: body.urlNotificationMetadata?.latestUpdate?.notifyTime };
  } else {
    return { url, status: "error", code: res.status, message: body.error?.message || res.statusText };
  }
}

// ── Main ──
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const allLangs = args.includes("--all");
  const paths = args.filter(a => !a.startsWith("--"));

  let urls;

  if (paths.length > 0) {
    urls = paths.map(p => {
      if (p.startsWith("https://")) return p;
      const cleanPath = p.startsWith("/") ? p : `/${p}`;
      const withTrailing = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;
      return `${HOST}${withTrailing}`;
    });
    console.log("🎯 Modus: Spezifische URLs\n");
  } else {
    urls = getUrlsFromSitemap(allLangs);
    console.log(`🗺️  Modus: ${allLangs ? "Alle" : "DE"} URLs aus Sitemap\n`);
  }

  console.log(`📊 ${urls.length} URLs`);
  if (urls.length <= 20) {
    urls.forEach(u => console.log(`   ${u}`));
  } else {
    urls.slice(0, 10).forEach(u => console.log(`   ${u}`));
    console.log(`   ... und ${urls.length - 10} weitere`);
  }
  console.log();

  if (urls.length > 200) {
    console.warn(`⚠️  ${urls.length} URLs überschreiten das Tageslimit (200). Nur die ersten 200 werden gesendet.`);
    urls = urls.slice(0, 200);
  }

  if (dryRun) {
    console.log("🏁 Dry-Run — keine URLs gesendet.");
    return;
  }

  // Authenticate
  console.log("🔑 Authentifiziere Service Account...");
  const credentials = loadCredentials();
  console.log(`   Client: ${credentials.client_email}`);
  const accessToken = await getAccessToken(credentials);
  console.log("✅ Access Token erhalten\n");

  // Submit URLs
  console.log("📤 Sende URLs an Google Indexing API...\n");
  let okCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const result = await submitUrl(urls[i], accessToken);

    if (result.status === "ok") {
      okCount++;
      console.log(`   ✅ ${i + 1}/${urls.length} ${result.url}`);
    } else {
      errorCount++;
      console.log(`   ❌ ${i + 1}/${urls.length} ${result.url} — ${result.code}: ${result.message}`);
    }

    // Rate limiting
    if (i < urls.length - 1) {
      await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
    }
  }

  console.log(`\n🏁 Fertig: ${okCount} OK, ${errorCount} Fehler (von ${urls.length} URLs)`);
}

main().catch((error) => {
  console.error("❌ Fehler:", error.message);
  process.exit(1);
});
