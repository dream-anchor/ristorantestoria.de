/**
 * Prerender Script
 * * Generates static HTML for IONOS (Apache)
 * - Fetches routes from slugs.json & Supabase
 * - Injects SEO (React Helmet)
 * - Creates folder structures (e.g. /en/index.html) to prevent 403 errors
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toAbsolute = (p) => path.resolve(__dirname, p);

// Create require to load JSON files in ESM
const require = createRequire(import.meta.url);

// 1. Load Slugs (Fail gracefully if missing)
let slugMaps = { de: {}, parentSlugs: {} };
try {
  slugMaps = require("./src/config/slugs.json");
} catch (e) {
  console.warn("⚠️ slugs.json not found or invalid. Using basic routes.");
}

const LANGUAGES = ["de", "en", "it", "fr"];

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Fetch dynamic special menu slugs from Supabase
 */
async function fetchDynamicSlugs() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️ Supabase credentials not found. Skipping dynamic routes.");
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
      console.warn(`⚠️ Failed to fetch dynamic slugs: ${response.status}`);
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
  if (localizedSlug === undefined) return null;
  
  if (localizedSlug === "") {
    return lang === "de" ? "/" : `/${lang}`;
  }
  
  return lang === "de" ? `/${localizedSlug}` : `/${lang}/${localizedSlug}`;
}

/**
 * Generate all routes to prerender
 */
async function generateRoutesToPrerender() {
  const routes = [];

  // 1. Static Routes from slugs.json
  if (slugMaps.de) {
    const staticBaseSlugs = Object.keys(slugMaps.de).filter(
      (slug) => !slug.startsWith("admin")
    );

    for (const baseSlug of staticBaseSlugs) {
      for (const lang of LANGUAGES) {
        const localizedPath = getLocalizedPath(baseSlug, lang);
        if (localizedPath) routes.push(localizedPath);
      }
    }
  } else {
    // Fallback if slugs.json is missing
    routes.push("/");
  }

  // 2. Dynamic Routes from Supabase
  const dynamicSlugs = await fetchDynamicSlugs();
  const parentSlugs = slugMaps.parentSlugs || {};

  for (const menuSlug of dynamicSlugs) {
    for (const lang of LANGUAGES) {
      // Default fallback to 'menu' if parentSlugs is missing
      const parentSlug = parentSlugs[lang] || "menu"; 
      const routePath = lang === "de" 
        ? `/${parentSlug}/${menuSlug}`
        : `/${lang}/${parentSlug}/${menuSlug}`;
      routes.push(routePath);
    }
  }

  return routes;
}

// Main execution
(async () => {
  const template = fs.readFileSync(toAbsolute("dist/index.html"), "utf-8");
  const { render } = await import("./dist/server/entry-server.js");

  const routesToPrerender = await generateRoutesToPrerender();
  
  // Ensure root is always rendered
  if (!routesToPrerender.includes('/')) routesToPrerender.push('/');

  console.log(`\n🚀 Prerendering ${routesToPrerender.length} routes...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const url of routesToPrerender) {
    try {
      // 1. Render App & get Helmet data
      // Note: entry-server.tsx must return { html, helmet }
      const { html, helmet } = render(url, {});

      // 2. Inject HTML into Template
      // Replaces OR <div id="root"></div>
      let finalHtml = template.replace(
        /|<div id="root"><\/div>|<div id="root">\s*<\/div>/,
        `<div id="root">${html}</div>`
      );

      // 3. Inject SEO Tags (Helmet)
      if (helmet) {
        const helmetHtml = `
          ${helmet.title ? helmet.title.toString() : ""}
          ${helmet.meta ? helmet.meta.toString() : ""}
          ${helmet.link ? helmet.link.toString() : ""}
          ${helmet.script ? helmet.script.toString() : ""}
        `;
        finalHtml = finalHtml.replace("</head>", `${helmetHtml}</head>`);
      }

      // 4. Determine File Path (Fix for IONOS 403)
      // Instead of dist/en.html -> dist/en/index.html
      const cleanUrl = url === '/' ? '' : url.replace(/\/$/, '');
      const filePath = `dist${cleanUrl}/index.html`;

      // 5. Create Directory
      const dir = path.dirname(toAbsolute(filePath));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 6. Write File
      fs.writeFileSync(toAbsolute(filePath), finalHtml);
      console.log(`✓ Rendered: ${filePath}`);
      successCount++;
    } catch (e) {
      console.error(`❌ Error rendering ${url}:`, e.message);
      errorCount++;
    }
  }

  // Cleanup: Remove server build folder (not needed on hosting)
  try {
    fs.rmSync(toAbsolute('dist/server'), { recursive: true, force: true });
  } catch (e) { 
    // ignore cleanup errors 
  }

  console.log(`\n✅ Prerendering complete!`);
  console.log(`   - Success: ${successCount}`);
  console.log(`   - Errors: ${errorCount}`);
})();
