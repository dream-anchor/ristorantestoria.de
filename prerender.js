/**
 * Prerender Script
 * * Generates static HTML for IONOS (Apache)
 * - Fetches routes from slugs.json & Supabase
 * - Injects SEO (React Helmet)
 * - Creates folder structures (e.g. /en/index.html) to prevent 403 errors
 * - Includes manual fix for specific menu pages
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
 * Fetch dynamic slugs from Supabase
 * UPDATE: Fetches ALL published menus to ensure special events like Valentine's are found
 */
async function fetchDynamicSlugs() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️ Supabase credentials not found. Skipping dynamic routes.");
    return [];
  }

  try {
    // UPDATE: Removed "menu_type=eq.special" filter. We fetch all published menus.
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/menus?is_published=eq.true&select=slug,menu_type`,
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
    console.log(`📦 Found ${menus.length} published menus from DB`);
    // Return objects with slug AND type
    return menus.map((m) => ({ slug: m.slug, type: m.menu_type }));
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

  // 1. ADDED: Manual Static Routes (Fix for missing pages)
  // These are hardcoded to ensure they always exist
  const manualRoutes = [
    "/mittags-menu",
    "/speisekarte",
    "/getraenke"
    // Add translations if needed, e.g. "/en/lunch-menu"
  ];
  routes.push(...manualRoutes);

  // 2. Static Routes from slugs.json
  if (slugMaps.de) {
    const staticBaseSlugs = Object.keys(slugMaps.de).filter(
      (slug) => !slug.startsWith("admin")
    );

    for (const baseSlug of staticBaseSlugs) {
      for (const lang of LANGUAGES) {
        const localizedPath = getLocalizedPath(baseSlug, lang);
        // Avoid duplicates if manual route already added it
        if (localizedPath && !routes.includes(localizedPath)) {
          routes.push(localizedPath);
        }
      }
    }
  } else {
    // Fallback if slugs.json is missing
    if (!routes.includes('/')) routes.push("/");
  }

  // 3. Dynamic Routes from Supabase
  const dynamicMenus = await fetchDynamicSlugs();
  const parentSlugs = slugMaps.parentSlugs || {};

  for (const menu of dynamicMenus) {
    for (const lang of LANGUAGES) {
      // Determine parent folder based on menu type
      // Standard fallback is 'menu'
      let parentSlug = parentSlugs[lang] || 'menu';
      
      // If it's a special event (like Valentine's), try to use special-events folder
      if (menu.type === 'special') {
         parentSlug = slugMaps[lang]?.['special-events'] || parentSlug; 
      }

      const routePath = lang === "de" 
        ? `/${parentSlug}/${menu.slug}`
        : `/${lang}/${parentSlug}/${menu.slug}`;
      
      if (!routes.includes(routePath)) {
        routes.push(routePath);
      }
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
      const { html, helmet } = render(url, {});

      // 2. Inject HTML into Template
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

  // Cleanup: Remove server build folder
  try {
    fs.rmSync(toAbsolute('dist/server'), { recursive: true, force: true });
  } catch (e) { 
    // ignore cleanup errors 
  }

  console.log(`\n✅ Prerendering complete!`);
  console.log(`   - Success: ${successCount}`);
  console.log(`   - Errors: ${errorCount}`);
})();
