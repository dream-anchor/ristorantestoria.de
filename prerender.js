/**
 * Prerender Script (Optimized for SEO & Helmet)
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
// Falls slugs.json fehlt, fangen wir das ab, damit der Build nicht crasht
let slugMaps = { de: {}, parentSlugs: {} };
try {
  slugMaps = require("./src/config/slugs.json");
} catch (e) {
  console.warn("⚠️ slugs.json not found, using basic routes.");
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

    if (!response.ok) return [];
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
  
  if (localizedSlug === "") return lang === "de" ? "/" : `/${lang}`;
  return lang === "de" ? `/${localizedSlug}` : `/${lang}/${localizedSlug}`;
}

/**
 * Generate all routes to prerender
 */
async function generateRoutesToPrerender() {
  const routes = [];
  
  // 1. Static Routes from slugs.json
  if (slugMaps.de) {
    const staticBaseSlugs = Object.keys(slugMaps.de).filter(s => !s.startsWith("admin"));
    for (const baseSlug of staticBaseSlugs) {
      for (const lang of LANGUAGES) {
        const p = getLocalizedPath(baseSlug, lang);
        if (p) routes.push(p);
      }
    }
  } else {
    // Fallback falls slugs.json leer ist
    routes.push("/"); 
  }

  // 2. Dynamic Routes from Supabase
  const dynamicSlugs = await fetchDynamicSlugs();
  const parentSlugs = slugMaps.parentSlugs || {};

  for (const menuSlug of dynamicSlugs) {
    for (const lang of LANGUAGES) {
      const parentSlug = parentSlugs[lang] || 'menu';
      const routePath = lang === "de" 
        ? `/${parentSlug}/${menuSlug}`
        : `/${lang}/${parentSlug}/${menuSlug}`;
      routes.push(routePath);
    }
  }

  return routes; // Admin routes lassen wir weg, da diese oft client-only sind
}

// Main execution
(async () => {
  const template = fs.readFileSync(toAbsolute("dist/index.html"), "utf-8");
  const { render } = await import("./dist/server/entry-server.js");

  const routesToPrerender = await generateRoutesToPrerender();
  // Sicherstellen, dass Root dabei ist
  if (!routesToPrerender.includes('/')) routesToPrerender.push('/');

  console.log(`\n🚀 Prerendering ${routesToPrerender.length} routes...\n`);

  for (const url of routesToPrerender) {
    try {
      // HIER IST DIE ÄNDERUNG: Wir holen HTML + Helmet
      const { html, helmet } = render(url, {});
      
      // 1. App HTML einfügen (ersetzt <div id="root"> oder )
      let finalHtml = template.replace(
        /|<div id="root"><\/div>|<div id="root">\s*<\/div>/, 
        `<div id="root">${html}</div>`
      );

      // 2. SEO Meta Tags einfügen (Helmet)
      if (helmet) {
        const helmetHtml = `
          ${helmet.title ? helmet.title.toString() : ''}
          ${helmet.meta ? helmet.meta.toString() : ''}
          ${helmet.link ? helmet.link.toString() : ''}
          ${helmet.script ? helmet.script.toString() : ''}
        `;
        finalHtml = finalHtml.replace('</head>', `${helmetHtml}</head>`);
      }

      // Dateipfad bestimmen
      let filePath = `dist${url === '/' ? '/index.html' : `${url}.html`}`;
      
      // Ordner erstellen
      const dir = path.dirname(toAbsolute(filePath));
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(toAbsolute(filePath), finalHtml);
      console.log(`✓ Rendered: ${filePath}`);
      
    } catch (e) {
      console.error(`❌ Error rendering ${url}:`, e);
    }
  }

  // Cleanup Server Folder
  // fs.rmSync(toAbsolute('dist/server'), { recursive: true, force: true });
  console.log(`\n✅ Prerendering done.`);
})();
