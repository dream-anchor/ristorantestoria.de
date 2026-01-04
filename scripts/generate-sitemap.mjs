/**
 * Dynamic Sitemap Generator
 * 
 * Single Source of Truth: src/config/slugs.json + Supabase Database
 * 
 * This script automatically generates the sitemap by:
 * 1. Reading static routes from slugs.json
 * 2. Fetching dynamic special menu routes from Supabase
 * 
 * No manual route maintenance required!
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import slugs from Single Source of Truth
const require = createRequire(import.meta.url);
const slugMaps = require("../src/config/slugs.json");

// Configuration
const BASE_URL = "https://www.ristorantestoria.de";
const LANGUAGES = ["de", "en", "it", "fr"];
const TODAY = new Date().toISOString().split("T")[0];

// Supabase configuration from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Routes to exclude from sitemap (admin, internal)
const EXCLUDED_ROUTES = ["admin", "admin/login"];

// Priority configuration based on route type
const getPriority = (baseSlug) => {
  if (baseSlug === "home") return "1.0";
  if (["reservierung", "speisekarte", "menu", "mittags-menu", "getraenke"].includes(baseSlug)) return "0.9";
  if (["kontakt", "ueber-uns", "besondere-anlaesse", "catering"].includes(baseSlug)) return "0.8";
  if (baseSlug.includes("muenchen")) return "0.7"; // SEO landing pages
  if (["impressum", "datenschutz", "cookie-richtlinie", "agb-restaurant", "agb-gutscheine", 
       "widerrufsbelehrung", "zahlungsinformationen", "lebensmittelhinweise", "haftungsausschluss"].includes(baseSlug)) return "0.3";
  return "0.6";
};

// Change frequency based on route type
const getChangeFreq = (baseSlug) => {
  if (baseSlug === "home") return "daily";
  if (["mittags-menu", "speisekarte", "getraenke"].includes(baseSlug)) return "weekly";
  if (["reservierung", "kontakt"].includes(baseSlug)) return "monthly";
  return "monthly";
};

/**
 * Fetch dynamic special menu routes from Supabase
 */
async function fetchDynamicRoutes() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️  Supabase credentials not found. Skipping dynamic routes.");
    return [];
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/menus?menu_type=eq.special&is_published=eq.true&select=slug`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn(`⚠️  Failed to fetch dynamic routes: ${response.status}`);
      return [];
    }

    const menus = await response.json();
    const parentSlugs = slugMaps.parentSlugs;

    console.log(`📦 Found ${menus.length} published special menus in database`);

    return menus.map((menu) => ({
      baseSlug: `special-menu-${menu.slug}`, // Unique identifier
      slugs: {
        de: `${parentSlugs.de}/${menu.slug}`,
        en: `${parentSlugs.en}/${menu.slug}`,
        it: `${parentSlugs.it}/${menu.slug}`,
        fr: `${parentSlugs.fr}/${menu.slug}`,
      },
      priority: "0.7",
      changefreq: "weekly",
    }));
  } catch (error) {
    console.error("❌ Error fetching dynamic routes:", error.message);
    return [];
  }
}

/**
 * Build URL for a specific language
 */
function buildUrl(slug, lang) {
  if (!slug) {
    // Home page
    return lang === "de" ? BASE_URL : `${BASE_URL}/${lang}`;
  }
  return lang === "de" ? `${BASE_URL}/${slug}` : `${BASE_URL}/${lang}/${slug}`;
}

/**
 * Generate hreflang links for a route
 */
function generateHreflangLinks(slugs) {
  const links = LANGUAGES.map((lang) => {
    const url = buildUrl(slugs[lang], lang);
    return `      <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`;
  });

  // Add x-default (German)
  const xDefaultUrl = buildUrl(slugs.de, "de");
  links.push(`      <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`);

  return links.join("\n");
}

/**
 * Generate a single URL entry
 */
function generateUrlEntry(url, lastmod, changefreq, priority, hreflangLinks) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks}
  </url>`;
}

/**
 * Main sitemap generation
 */
async function generateSitemap() {
  console.log("🚀 Starting dynamic sitemap generation...\n");

  // Get static routes from slugs.json (excluding admin routes)
  const staticBaseSlugs = Object.keys(slugMaps.de).filter(
    (slug) => !EXCLUDED_ROUTES.includes(slug)
  );

  console.log(`📄 Found ${staticBaseSlugs.length} static routes in slugs.json`);

  // Fetch dynamic routes from database
  const dynamicRoutes = await fetchDynamicRoutes();

  // Collect all URL entries
  const urlEntries = [];

  // Process static routes
  for (const baseSlug of staticBaseSlugs) {
    const slugs = {
      de: slugMaps.de[baseSlug],
      en: slugMaps.en[baseSlug],
      it: slugMaps.it[baseSlug],
      fr: slugMaps.fr[baseSlug],
    };

    const priority = getPriority(baseSlug);
    const changefreq = getChangeFreq(baseSlug);
    const hreflangLinks = generateHreflangLinks(slugs);

    // Generate URL entry for each language
    for (const lang of LANGUAGES) {
      const url = buildUrl(slugs[lang], lang);
      urlEntries.push(generateUrlEntry(url, TODAY, changefreq, priority, hreflangLinks));
    }
  }

  // Process dynamic routes (special menus from database)
  for (const route of dynamicRoutes) {
    const hreflangLinks = generateHreflangLinks(route.slugs);

    for (const lang of LANGUAGES) {
      const url = buildUrl(route.slugs[lang], lang);
      urlEntries.push(generateUrlEntry(url, TODAY, route.changefreq, route.priority, hreflangLinks));
    }
  }

  // Build final XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>`;

  // Write to dist/sitemap.xml
  const distPath = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const outputPath = path.join(distPath, "sitemap.xml");
  fs.writeFileSync(outputPath, sitemap, "utf-8");

  // Statistics
  const totalUrls = urlEntries.length;
  const staticUrls = staticBaseSlugs.length * LANGUAGES.length;
  const dynamicUrls = dynamicRoutes.length * LANGUAGES.length;

  console.log("\n✅ Sitemap generated successfully!");
  console.log(`📍 Output: ${outputPath}`);
  console.log(`📊 Statistics:`);
  console.log(`   - Static URLs: ${staticUrls} (${staticBaseSlugs.length} routes × ${LANGUAGES.length} languages)`);
  console.log(`   - Dynamic URLs: ${dynamicUrls} (${dynamicRoutes.length} special menus × ${LANGUAGES.length} languages)`);
  console.log(`   - Total URLs: ${totalUrls}`);
  console.log(`   - File size: ${(Buffer.byteLength(sitemap, "utf-8") / 1024).toFixed(2)} KB`);
}

// Run
generateSitemap().catch((error) => {
  console.error("❌ Sitemap generation failed:", error);
  process.exit(1);
});
