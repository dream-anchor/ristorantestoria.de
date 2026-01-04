/**
 * Prerender Script
 * 
 * Single Source of Truth: src/config/slugs.json + Supabase Database
 * 
 * This script generates static HTML files for all routes by:
 * 1. Reading static routes from slugs.json
 * 2. Fetching dynamic special menu routes from Supabase
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toAbsolute = (p) => path.resolve(__dirname, p);

// Import slugs from Single Source of Truth
const require = createRequire(import.meta.url);
const slugMaps = require("./src/config/slugs.json");

const LANGUAGES = ["de", "en", "it", "fr"];

// Supabase configuration from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Fetch dynamic special menu slugs from Supabase
 */
async function fetchDynamicSlugs() {
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
      console.warn(`⚠️  Failed to fetch dynamic slugs: ${response.status}`);
      return [];
    }

    const menus = await response.json();
    console.log(`📦 Found ${menus.length} published special menus`);
    return menus.map((m) => m.slug);
  } catch (error) {
    console.error("❌ Error fetching dynamic slugs:", error.message);
    return [];
  }
}

/**
 * Get localized path for a base slug
 */
function getLocalizedPath(baseSlug, lang) {
  const localizedSlug = slugMaps[lang]?.[baseSlug];
  if (localizedSlug === undefined) {
    console.warn(`⚠️  No localized slug found for "${baseSlug}" in "${lang}"`);
    return null;
  }
  
  if (localizedSlug === "") {
    // Home page
    return lang === "de" ? "/" : `/${lang}`;
  }
  
  return lang === "de" ? `/${localizedSlug}` : `/${lang}/${localizedSlug}`;
}

/**
 * Generate all routes to prerender
 */
async function generateRoutesToPrerender() {
  const routes = [];

  // Get static base slugs (excluding admin routes for now, we'll add them separately)
  const staticBaseSlugs = Object.keys(slugMaps.de).filter(
    (slug) => !slug.startsWith("admin")
  );

  // Generate static routes for all languages
  for (const baseSlug of staticBaseSlugs) {
    for (const lang of LANGUAGES) {
      const localizedPath = getLocalizedPath(baseSlug, lang);
      if (localizedPath) {
        routes.push(localizedPath);
      }
    }
  }

  // Fetch dynamic routes from database
  const dynamicSlugs = await fetchDynamicSlugs();
  const parentSlugs = slugMaps.parentSlugs;

  for (const menuSlug of dynamicSlugs) {
    for (const lang of LANGUAGES) {
      const parentSlug = parentSlugs[lang];
      const routePath = lang === "de" 
        ? `/${parentSlug}/${menuSlug}`
        : `/${lang}/${parentSlug}/${menuSlug}`;
      routes.push(routePath);
    }
  }

  // Add admin routes (only German)
  routes.push("/admin");
  routes.push("/admin/login");

  return routes;
}

// Main execution
(async () => {
  const template = fs.readFileSync(toAbsolute("dist/index.html"), "utf-8");
  const { render } = await import("./dist/server/entry-server.js");

  const routesToPrerender = await generateRoutesToPrerender();

  console.log(`\n🚀 Prerendering ${routesToPrerender.length} routes...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const url of routesToPrerender) {
    try {
      const appHtml = render(url);
      const html = template.replace(`<!--app-html-->`, appHtml);

      // Determine file path
      let filePath;
      if (url === "/") {
        filePath = "dist/index.html";
      } else {
        const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;
        filePath = `dist${cleanUrl}.html`;
      }

      // Create directory if needed
      const dir = path.dirname(toAbsolute(filePath));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(toAbsolute(filePath), html);
      console.log("pre-rendered:", filePath);
      successCount++;
    } catch (e) {
      console.error(`❌ Error prerendering ${url}:`, e.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Prerendering complete!`);
  console.log(`   - Success: ${successCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Total routes: ${routesToPrerender.length}`);
})();
