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
 * Fetch complete menu data (menu + categories + items) for SSR
 */
async function fetchCompleteMenuData(menuType) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    // 1. Fetch menu by type
    const menuRes = await fetch(
      `${SUPABASE_URL}/rest/v1/menus?menu_type=eq.${menuType}&is_published=eq.true&select=*`,
      { headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" } }
    );
    const menus = await menuRes.json();
    const menu = menus[0];
    if (!menu) return null;

    // 2. Fetch categories
    const catRes = await fetch(
      `${SUPABASE_URL}/rest/v1/menu_categories?menu_id=eq.${menu.id}&order=sort_order&select=*`,
      { headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" } }
    );
    const categories = await catRes.json();
    if (!categories.length) return { ...menu, categories: [] };

    // 3. Fetch items for all categories
    const categoryIds = categories.map((c) => c.id).join(",");
    const itemsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/menu_items?category_id=in.(${categoryIds})&order=sort_order&select=*`,
      { headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" } }
    );
    const items = await itemsRes.json();

    // Return in useMenu-compatible format
    return {
      ...menu,
      categories: categories.map((cat) => ({
        ...cat,
        items: items.filter((item) => item.category_id === cat.id),
      })),
    };
  } catch (error) {
    console.error(`❌ Error fetching menu data for ${menuType}:`, error.message);
    return null;
  }
}

/**
 * Determine menu type from URL
 */
function getMenuTypeForRoute(url) {
  if (url.includes("speisekarte") || url.includes("food-menu") || url.includes("menu-cibo") || url.includes("/carte")) return "food";
  if (url.includes("mittags") || url.includes("lunch") || url.includes("pranzo") || url.includes("dejeuner")) return "lunch";
  if (url.includes("getraenke") || url.includes("drinks") || url.includes("bevande") || url.includes("boissons")) return "drinks";
  return null;
}

/**
 * Extract special menu slug from URL
 * Returns the slug if this is a special occasion page, null otherwise
 */
function getSpecialMenuSlugFromRoute(url) {
  const specialParentPatterns = [
    "/besondere-anlaesse/",
    "/special-occasions/",
    "/occasioni-speciali/",
    "/occasions-speciales/"
  ];

  for (const pattern of specialParentPatterns) {
    if (url.includes(pattern)) {
      const parts = url.split(pattern);
      if (parts[1]) {
        // Remove trailing slash and any further path segments
        return parts[1].split("/")[0].replace(/\/$/, "");
      }
    }
  }
  return null;
}

/**
 * Fetch special menu data by slug (with full content for SSR)
 * Searches across all slug columns (de, en, it, fr) to find the menu
 */
async function fetchSpecialMenuBySlug(slug) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !slug) return null;

  try {
    // 1. Fetch menu by any slug variant (supports all languages)
    // Uses OR filter to search: slug, slug_en, slug_it, slug_fr
    const menuRes = await fetch(
      `${SUPABASE_URL}/rest/v1/menus?is_published=eq.true&or=(slug.eq.${slug},slug_en.eq.${slug},slug_it.eq.${slug},slug_fr.eq.${slug})&select=*`,
      { headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" } }
    );
    const menus = await menuRes.json();
    const menu = menus[0];
    if (!menu) return null;

    // 2. Fetch categories
    const catRes = await fetch(
      `${SUPABASE_URL}/rest/v1/menu_categories?menu_id=eq.${menu.id}&order=sort_order&select=*`,
      { headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" } }
    );
    const categories = await catRes.json();

    // 3. Fetch items for all categories
    let items = [];
    if (categories.length > 0) {
      const categoryIds = categories.map((c) => c.id).join(",");
      const itemsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/menu_items?category_id=in.(${categoryIds})&order=sort_order&select=*`,
        { headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" } }
      );
      items = await itemsRes.json();
    }

    // Return both the basic menu data and the full menu with categories/items
    // Basic menu: for useSpecialMenuBySlug query
    const basicMenu = { ...menu };

    // Full menu: for useMenuById query (MenuDisplay component)
    const fullMenu = {
      id: menu.id,
      menu_type: menu.menu_type,
      title: menu.title,
      title_en: menu.title_en,
      title_it: menu.title_it,
      title_fr: menu.title_fr,
      subtitle: menu.subtitle,
      subtitle_en: menu.subtitle_en,
      subtitle_it: menu.subtitle_it,
      subtitle_fr: menu.subtitle_fr,
      is_published: menu.is_published,
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        name_en: cat.name_en,
        name_it: cat.name_it,
        name_fr: cat.name_fr,
        description: cat.description,
        description_en: cat.description_en,
        description_it: cat.description_it,
        description_fr: cat.description_fr,
        sort_order: cat.sort_order || 0,
        items: items
          .filter((item) => item.category_id === cat.id)
          .map((item) => ({
            id: item.id,
            name: item.name,
            name_en: item.name_en,
            name_it: item.name_it,
            name_fr: item.name_fr,
            description: item.description,
            description_en: item.description_en,
            description_it: item.description_it,
            description_fr: item.description_fr,
            price: item.price ? parseFloat(item.price.toString()) : null,
            price_display: item.price_display,
            price_display_en: item.price_display_en,
            price_display_it: item.price_display_it,
            price_display_fr: item.price_display_fr,
            sort_order: item.sort_order || 0,
          })),
      })),
    };

    return { basicMenu, fullMenu, slug };
  } catch (error) {
    console.error(`❌ Error fetching special menu for slug ${slug}:`, error.message);
    return null;
  }
}

/**
 * Fetch dynamic slugs from Supabase
 * UPDATE: Fetches ALL published menus with localized slugs for all languages
 */
async function fetchDynamicSlugs() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️ Supabase credentials not found. Skipping dynamic routes.");
    return [];
  }

  try {
    // Fetch all slug variants for proper i18n routing
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/menus?is_published=eq.true&select=slug,slug_en,slug_it,slug_fr,menu_type`,
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
    // Return objects with all slug variants and type
    return menus.map((m) => ({
      slug: m.slug,
      slug_en: m.slug_en || m.slug,
      slug_it: m.slug_it || m.slug,
      slug_fr: m.slug_fr || m.slug,
      type: m.menu_type,
    }));
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

  // 3. Seasonal Routes (permanent URLs — always prerendered, even when inactive)
  const SPECIAL_PARENT_SLUGS = {
    de: 'besondere-anlaesse',
    en: 'special-occasions',
    it: 'occasioni-speciali',
    fr: 'occasions-speciales',
  };

  const SEASONAL_MENUS = [
    { de: 'valentinstag-menue', en: 'valentines-menu', it: 'san-valentino-menu', fr: 'saint-valentin-menu' },
    { de: 'weihnachtsmenue', en: 'christmas-menu', it: 'natale-menu', fr: 'noel-menu' },
    { de: 'silvester', en: 'new-years-eve', it: 'capodanno', fr: 'nouvel-an' },
  ];

  for (const seasonal of SEASONAL_MENUS) {
    for (const lang of LANGUAGES) {
      const parentSlug = SPECIAL_PARENT_SLUGS[lang];
      const menuSlug = seasonal[lang];
      const routePath = lang === "de"
        ? `/${parentSlug}/${menuSlug}`
        : `/${lang}/${parentSlug}/${menuSlug}`;
      if (!routes.includes(routePath)) {
        routes.push(routePath);
      }
    }
  }

  // 4. Dynamic Routes from Supabase (non-seasonal special menus)
  const dynamicMenus = await fetchDynamicSlugs();

  for (const menu of dynamicMenus) {
    // Only generate routes for special menus (food, drinks, lunch are static)
    if (menu.type !== 'special') continue;

    for (const lang of LANGUAGES) {
      // Get the localized menu slug for this language
      const menuSlug = lang === 'de' ? menu.slug
        : lang === 'en' ? menu.slug_en
        : lang === 'it' ? menu.slug_it
        : menu.slug_fr;

      const parentSlug = SPECIAL_PARENT_SLUGS[lang];

      const routePath = lang === "de"
        ? `/${parentSlug}/${menuSlug}`
        : `/${lang}/${parentSlug}/${menuSlug}`;

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

  // Cache for menu data to avoid re-fetching
  const menuDataCache = {};
  const specialMenuCache = {};

  for (const url of routesToPrerender) {
    try {
      // 1. Fetch menu data if this is a menu page
      const menuType = getMenuTypeForRoute(url);
      let menuData = null;
      if (menuType) {
        if (!menuDataCache[menuType]) {
          console.log(`📥 Fetching ${menuType} menu data for SSR...`);
          menuDataCache[menuType] = await fetchCompleteMenuData(menuType);
        }
        menuData = menuDataCache[menuType];
      }

      // 2. Fetch special menu data if this is a special occasion page
      const specialMenuSlug = getSpecialMenuSlugFromRoute(url);
      let specialMenuData = null;
      if (specialMenuSlug) {
        if (!specialMenuCache[specialMenuSlug]) {
          console.log(`📥 Fetching special menu "${specialMenuSlug}" for SSR...`);
          specialMenuCache[specialMenuSlug] = await fetchSpecialMenuBySlug(specialMenuSlug);
        }
        specialMenuData = specialMenuCache[specialMenuSlug];
      }

      // 3. Render App & get Helmet data (with menu data context)
      const { html, helmet, dehydratedState } = render(url, { menuData, menuType, specialMenuData });

      // 3. Inject HTML into Template
      // Match <div id="root"> with optional <!--app-html--> marker or whitespace, then closing </div>
      let finalHtml = template.replace(
        /<div id="root">(?:<!--app-html-->|\s)*<\/div>/,
        `<div id="root">${html}</div>`
      );

      // 4. Inject dehydrated React Query state for hydration
      if (dehydratedState && dehydratedState.queries?.length > 0) {
        const stateScript = `<script>window.__REACT_QUERY_STATE__=${JSON.stringify(dehydratedState)}</script>`;
        finalHtml = finalHtml.replace("</head>", `${stateScript}</head>`);
      }

      // 5. Inject SEO Tags (Helmet)
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

  // Force exit to prevent hanging on open handles (fetch connections)
  process.exit(errorCount > 0 ? 1 : 0);
})();
