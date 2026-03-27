#!/usr/bin/env node
/**
 * Google Indexing API — Bulk URL Submission
 *
 * Reicht URLs bei Google zur Indexierung ein (200/Tag kostenlos).
 * Nutzt Service Account JWT Auth (scripts/service-account.json).
 * Keine externen Dependencies — nur Node.js built-ins.
 *
 * NOTE: Die Indexing API ist offiziell für JobPosting/BroadcastEvent,
 * aber Google verarbeitet Notifications für alle URL-Typen.
 *
 * Usage:
 *   node scripts/request-indexing.mjs                                        # Alle DE-Sitemap-URLs
 *   node scripts/request-indexing.mjs --all                                  # Alle Sitemap-URLs
 *   node scripts/request-indexing.mjs --priority                             # Nur nicht-indexierte DE-URLs
 *   node scripts/request-indexing.mjs /pizza-muenchen/ /silvester-muenchen/  # Pfade
 *   node scripts/request-indexing.mjs --dry-run                              # Preview ohne Submit
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://www.ristorantestoria.de";
const INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/indexing";
const RATE_LIMIT_MS = 500;

// Service Account Key: scripts/service-account.json or env override
const SERVICE_ACCOUNT_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.resolve(__dirname, "service-account.json");

// Priority URLs: Nicht-indexierte DE-Seiten (aus GSC Coverage Report)
const PRIORITY_URLS = [
  "/pizza-muenchen/",
  "/italienisches-restaurant-muenchen/",
  "/italiener-hauptbahnhof-muenchen/",
  "/eventlocation-muenchen-maxvorstadt/",
  "/valentinstag-muenchen/",
  "/silvester-muenchen/",
  "/weihnachten-muenchen/",
  "/weihnachtsfeier-muenchen/",
  "/romantisches-dinner-muenchen/",
  "/wild-essen-muenchen/",
  "/terrasse-muenchen/",
  "/barrierefreiheit/",
  "/besondere-anlaesse/",
  "/besondere-anlaesse/valentinstag-menue/",
  "/lebensmittelhinweise/",
  "/widerrufsbelehrung/",
].map(p => SITE_URL + p);

// ── Service Account Credentials ──
function loadCredentials() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`Service Account JSON nicht gefunden: ${SERVICE_ACCOUNT_PATH}`);
    console.error("Lege scripts/service-account.json ab oder setze GOOGLE_APPLICATION_CREDENTIALS.");
    process.exit(1);
  }
  const keyFile = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));
  if (keyFile.type !== "service_account") {
    console.error("JSON ist kein Service Account (type muss 'service_account' sein).");
    process.exit(1);
  }
  return { client_email: keyFile.client_email, private_key: keyFile.private_key };
}

// ── JWT → Access Token (zero dependencies) ──
async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })).toString("base64url");

  const signInput = `${header}.${payload}`;
  const signature = crypto.createSign("RSA-SHA256").update(signInput).sign(credentials.private_key, "base64url");
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
  return (await res.json()).access_token;
}

// ── Sitemap Parser ──
function getUrlsFromSitemap(allLanguages = false) {
  const sitemapPath = path.resolve(__dirname, "../dist/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.error("dist/sitemap.xml nicht gefunden. Zuerst `npm run build` ausführen.");
    process.exit(1);
  }

  const sitemap = fs.readFileSync(sitemapPath, "utf-8");
  const allUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  if (allLanguages) return allUrls;

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
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });

  const body = await res.json().catch(() => ({}));
  if (res.ok) {
    return { ok: true };
  }
  return { ok: false, code: res.status, message: body.error?.message || res.statusText };
}

// ── Main ──
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const allLangs = args.includes("--all");
  const isPriority = args.includes("--priority");
  const paths = args.filter(a => !a.startsWith("--"));

  let urls;

  if (isPriority) {
    urls = PRIORITY_URLS;
    console.log("Modus: Priority URLs (nicht-indexierte DE-Seiten)\n");
  } else if (paths.length > 0) {
    urls = paths.map(p => {
      if (p.startsWith("https://")) return p;
      const cleanPath = p.startsWith("/") ? p : `/${p}`;
      const withTrailing = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;
      return `${SITE_URL}${withTrailing}`;
    });
    console.log("Modus: Spezifische Pfade\n");
  } else {
    urls = getUrlsFromSitemap(allLangs);
    console.log(`Modus: ${allLangs ? "Alle" : "DE"} URLs aus Sitemap\n`);
  }

  console.log(`${urls.length} URLs:`);
  if (urls.length <= 20) {
    urls.forEach(u => console.log(`   ${u}`));
  } else {
    urls.slice(0, 10).forEach(u => console.log(`   ${u}`));
    console.log(`   ... und ${urls.length - 10} weitere`);
  }
  console.log();

  if (urls.length > 200) {
    console.warn(`${urls.length} URLs > Tageslimit (200). Nur die ersten 200.`);
    urls = urls.slice(0, 200);
  }

  if (dryRun) {
    console.log("Dry-Run — keine URLs gesendet.");
    return;
  }

  // Auth
  console.log("Authentifiziere Service Account...");
  const credentials = loadCredentials();
  console.log(`   ${credentials.client_email}`);
  const accessToken = await getAccessToken(credentials);
  console.log("Access Token erhalten\n");

  // Submit
  let success = 0, failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await submitUrl(url, accessToken);

    if (result.ok) {
      success++;
      console.log(`   [${i + 1}/${urls.length}] ${url}`);
    } else {
      failed++;
      console.error(`   [${i + 1}/${urls.length}] FEHLER ${url} — ${result.code}: ${result.message}`);

      if (result.code === 429) {
        console.log("\n   Rate limit erreicht. Morgen weitermachen.");
        break;
      }
    }

    if (i < urls.length - 1) {
      await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
    }
  }

  console.log(`\nErgebnis: ${success} eingereicht, ${failed} fehlgeschlagen (von ${urls.length} URLs)`);
}

main().catch((error) => {
  console.error("Fehler:", error.message);
  process.exit(1);
});
