/**
 * IndexNow URL Submission Script
 *
 * Sends changed URLs to IndexNow API after deploy.
 * Can submit specific URLs or all URLs from sitemap.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs                    # All sitemap URLs
 *   node scripts/submit-indexnow.mjs /speisekarte/ /mittags-menu/  # Specific paths
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = "www.ristorantestoria.de";
const KEY = process.env.INDEXNOW_KEY || "6ac62121835b4540bb81eb3ff2d17ac7";
const INDEXNOW_API = "https://api.indexnow.org/IndexNow";

const STATUS_MESSAGES = {
  200: "OK – URLs erfolgreich übermittelt",
  202: "Accepted – URLs zur Verarbeitung angenommen",
  400: "Bad Request – Ungültiges Format",
  403: "Forbidden – Key ungültig",
  422: "Unprocessable Entity – URLs passen nicht zum Host",
  429: "Too Many Requests – Rate Limit erreicht",
};

/**
 * Extract URLs from sitemap.xml
 */
function getUrlsFromSitemap() {
  const sitemapPath = path.resolve(__dirname, "../dist/sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    console.error("❌ dist/sitemap.xml nicht gefunden. Zuerst `npm run build` ausführen.");
    process.exit(1);
  }

  const sitemap = fs.readFileSync(sitemapPath, "utf-8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  return urls;
}

/**
 * Submit URLs to IndexNow API
 */
async function submitToIndexNow(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };

  console.log(`📤 Sende ${urls.length} URLs an IndexNow...\n`);

  const response = await fetch(INDEXNOW_API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const status = response.status;
  const body = await response.text();
  const message = STATUS_MESSAGES[status] || `Unbekannter Status: ${status}`;

  if (status === 200 || status === 202) {
    console.log(`✅ ${status} – ${message}`);
  } else {
    console.error(`❌ ${status} – ${message}`);
    if (body) console.error(`   Response: ${body}`);
  }

  return status;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  let urls;

  if (args.length > 0) {
    // Specific paths provided as arguments
    urls = args.map(p => {
      if (p.startsWith("https://")) return p;
      const cleanPath = p.startsWith("/") ? p : `/${p}`;
      return `https://${HOST}${cleanPath}`;
    });
    console.log("🎯 Modus: Spezifische URLs\n");
  } else {
    // All URLs from sitemap
    urls = getUrlsFromSitemap();
    console.log("🗺️  Modus: Alle URLs aus Sitemap\n");
  }

  console.log(`📊 ${urls.length} URLs gefunden`);
  if (urls.length <= 10) {
    urls.forEach(u => console.log(`   ${u}`));
  } else {
    urls.slice(0, 5).forEach(u => console.log(`   ${u}`));
    console.log(`   ... und ${urls.length - 5} weitere`);
  }
  console.log();

  await submitToIndexNow(urls);
}

main().catch((error) => {
  console.error("❌ IndexNow Fehler:", error.message);
  process.exit(1);
});
