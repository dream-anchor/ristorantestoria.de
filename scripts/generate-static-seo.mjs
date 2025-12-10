// scripts/generate-static-seo.mjs
// Läuft im GitHub-Workflow VOR `npm run build`.
// Liest Menüdaten aus Supabase und erzeugt einen
// statischen, SEO-/KI-freundlichen Textblock im <noscript>-Bereich
// der index.html. Bei Fehlern wird ein statischer Fallback genutzt.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const START_MARKER = "<!-- NOSCRIPT_CONTENT_START -->";
const END_MARKER = "<!-- NOSCRIPT_CONTENT_END -->";

/**
 * Fallback-HTML, falls Supabase nicht erreichbar ist.
 */
const STATIC_FALLBACK_HTML = `
<article itemscope itemtype="https://schema.org/Restaurant">
  <h1 itemprop="name">STORIA – Ristorante • Pizzeria • Bar in München Maxvorstadt</h1>
  <p itemprop="description">
    Authentisches italienisches Restaurant in der Karlstraße 47a in München Maxvorstadt – nahe Königsplatz,
    Technischer Universität München, den Pinakotheken und dem Hauptbahnhof. Wir servieren Frühstück,
    Business Lunch, hausgemachte Pasta, neapolitanische Pizza und Aperitivo bis spät in die Nacht.
  </p>

  <section aria-label="Adresse und Kontakt">
    <h2>Adresse &amp; Kontakt</h2>
    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
      <p>
        <span itemprop="streetAddress">Karlstraße 47a</span>,
        <span itemprop="postalCode">80333</span>
        <span itemprop="addressLocality">München</span>,
        <span itemprop="addressCountry">Deutschland</span>
      </p>
    </div>
    <p>
      Telefon:
      <a href="tel:+4989515196" itemprop="telephone">+49 89 515196</a><br />
      E-Mail:
      <a href="mailto:info@ristorantestoria.de" itemprop="email">info@ristorantestoria.de</a>
    </p>
    <p itemprop="openingHours">
      Öffnungszeiten: Montag bis Freitag 09:00–01:00 Uhr, Samstag und Sonntag 12:00–01:00 Uhr.
    </p>
  </section>

  <section aria-label="Business Lunch und Mittagsmenü">
    <h2>Business Lunch &amp; Mittagsmenü in München</h2>
    <p>
      Unter der Woche bieten wir ein wechselndes Mittagsmenü für Business-Gäste, Agenturen und Studierende in der
      Maxvorstadt – ideal für die Mittagspause rund um Königsplatz, TU München und die Pinakotheken.
    </p>
    <p>
      Mehr zum aktuellen Mittagsmenü finden Sie auf unserer Seite
      <a href="/mittagsmenu">Mittagsmenü</a>.
    </p>
  </section>

  <section aria-label="Aperitivo und Bar">
    <h2>Aperitivo, Cocktails &amp; Bar</h2>
    <p>
      Am Abend wird das STORIA zur italienischen Bar mit Aperitivo, Cocktails, Wein und kleinen Gerichten –
      perfekt für After-Work-Drinks, Dates und Treffen mit Freunden in der Münchner Innenstadt.
    </p>
  </section>

  <section aria-label="Besondere Anlässe und Events">
    <h2>Firmenfeiern &amp; besondere Anlässe</h2>
    <p>
      Das STORIA kann für Firmenfeiern, Geburtstage und private Events reserviert werden. Wir erstellen individuelle
      Menüs, Fingerfood-Varianten oder Aperitivo-Arrangements – auf Wunsch auch mit exklusiver Nutzung ausgewählter
      Bereiche des Restaurants.
    </p>
    <p>
      Informationen zu besonderen Anlässen finden Sie unter
      <a href="/besondere-anlaesse">Besondere Anlässe</a>
      oder direkt über unsere
      <a href="/kontakt">Kontaktseite</a>.
    </p>
  </section>

  <section aria-label="Reservierung">
    <h2>Tisch reservieren</h2>
    <p>
      Reservierungen für Frühstück, Lunch, Aperitivo und Dinner können Sie bequem online über unsere Seite
      <a href="/reservierung">Reservierung</a> oder telefonisch unter
      <a href="tel:+4989515196">+49 89 515196</a> vornehmen.
    </p>
  </section>

  <section aria-label="Navigation">
    <h2>Übersicht der wichtigsten Seiten</h2>
    <nav>
      <ul>
        <li><a href="/speisekarte">Speisekarte</a></li>
        <li><a href="/mittagsmenu">Mittagsmenü</a></li>
        <li><a href="/getraenke">Getränkekarte</a></li>
        <li><a href="/reservierung">Tisch reservieren</a></li>
        <li><a href="/besondere-anlaesse">Besondere Anlässe &amp; Events</a></li>
        <li><a href="/kontakt">Kontakt &amp; Anfahrt</a></li>
        <li><a href="/ueber-uns">Über uns</a></li>
      </ul>
    </nav>
  </section>

  <p itemprop="servesCuisine">Italienische Küche, Pizza, Pasta &amp; Aperitivo.</p>
  <p itemprop="priceRange">Preisniveau: €€</p>
</article>
`.trim();

/**
 * Hauptablauf: index.html laden, NOSCRIPT-Bereich ersetzen, wieder speichern.
 */
async function main() {
  const indexPath = path.join(__dirname, "..", "index.html");
  let html = fs.readFileSync(indexPath, "utf-8");

  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error("NOSCRIPT-Marker in index.html nicht gefunden.");
    process.exit(1);
  }

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after = html.slice(endIdx);

  const noscriptContent = await buildNoscriptHtmlFromSupabase().catch((err) => {
    console.error("Fehler beim Generieren des dynamischen NOSCRIPT-HTML:", err);
    console.error("Verwende statischen Fallback-Content.");
    return STATIC_FALLBACK_HTML;
  });

  const newHtml = `${before}\n${noscriptContent}\n${after}`;
  fs.writeFileSync(indexPath, newHtml, "utf-8");

  console.log("Static SEO noscript content injected into index.html");
}

/**
 * Holt Menüs + Kategorien + Items aus Supabase
 * und baut ein gut lesbares HTML für <noscript>.
 */
async function buildNoscriptHtmlFromSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt – Fallback wird genutzt.");
    return STATIC_FALLBACK_HTML;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // MENUS: title bleibt, description => subtitle
  const { data: menus, error: menusError } = await supabase
    .from("menus")
    .select("id, slug, title, subtitle, menu_type")
    .order("menu_type", { ascending: true })
    .order("title", { ascending: true });

  if (menusError) {
    console.error("Fehler beim Laden der Menüs:", menusError);
    return STATIC_FALLBACK_HTML;
  }

  // KATEGORIEN: name, description, sort_order
  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select("id, menu_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (catError) {
    console.error("Fehler beim Laden der Kategorien:", catError);
    return STATIC_FALLBACK_HTML;
  }

  // ITEMS: name, description, price, price_display, sort_order
  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price, price_display, sort_order")
    .order("sort_order", { ascending: true });

  if (itemsError) {
    console.error("Fehler beim Laden der Gerichte:", itemsError);
    return STATIC_FALLBACK_HTML;
  }

  // Daten in Maps aufbereiten
  const categoriesByMenuId = new Map();
  for (const cat of categories || []) {
    if (!categoriesByMenuId.has(cat.menu_id)) {
      categoriesByMenuId.set(cat.menu_id, []);
    }
    categoriesByMenuId.get(cat.menu_id).push(cat);
  }

  const itemsByCategoryId = new Map();
  for (const item of items || []) {
    if (!itemsByCategoryId.has(item.category_id)) {
      itemsByCategoryId.set(item.category_id, []);
    }
    itemsByCategoryId.get(item.category_id).push(item);
  }

  // HTML aufbauen
  let html = `<article itemscope itemtype="https://schema.org/Restaurant">
  <h1 itemprop="name">STORIA – Ristorante • Pizzeria • Bar in München Maxvorstadt</h1>
  <p>
    Diese HTML-Version der Speisekarten wird automatisch aus der Datenbank generiert,
    damit Suchmaschinen und KI-Sucher (z.&nbsp;B. ChatGPT, Perplexity, Bing Copilot)
    alle aktuellen Menüs textbasiert lesen können.
  </p>`;

  // Menüs sinnvoll sortieren
  const orderedMenus = [...(menus || [])].sort((a, b) => {
    const order = { food: 1, lunch: 2, drinks: 3, special: 4 };
    const oa = order[a.menu_type] ?? 99;
    const ob = order[b.menu_type] ?? 99;
    if (oa !== ob) return oa - ob;
    return (a.title || "").localeCompare(b.title || "", "de");
  });

  for (const menu of orderedMenus) {
    const menuCats = categoriesByMenuId.get(menu.id) || [];

    html += `
  <section aria-label="Speisekarte – ${escapeHtml(menu.title || "")}">
    <h2>${escapeHtml(menu.title || "")}</h2>`;

    const menuDesc = menu.subtitle || "";
    if (menuDesc) {
      html += `
    <p>${escapeHtml(menuDesc)}</p>`;
    }

    for (const cat of menuCats) {
      const catItems = itemsByCategoryId.get(cat.id) || [];
      if (!catItems.length) continue;

      const catTitle = cat.name || "";
      const catDesc = cat.description || "";

      html += `
    <section aria-label="${escapeHtml(catTitle)}">
      <h3>${escapeHtml(catTitle)}</h3>`;

      if (catDesc) {
        html += `
      <p>${escapeHtml(catDesc)}</p>`;
      }

      html += `
      <ul>`;

      for (const item of catItems) {
        const title = escapeHtml(item.name || "");
        const desc = item.description ? ` – ${escapeHtml(item.description)}` : "";
        const priceStr = item.price_display || item.price || "";
        const price = priceStr ? ` (${escapeHtml(priceStr)})` : "";

        html += `
        <li><strong>${title}</strong>${desc}${price}</li>`;
      }

      html += `
      </ul>
    </section>`;
    }

    html += `
  </section>`;
  }

  html += `
  <p itemprop="servesCuisine">Italienische Küche, neapolitanische Pizza, Pasta, Fisch &amp; Aperitivo.</p>
  <p itemprop="priceRange">Preisniveau: €€</p>
</article>`;

  return html.trim();
}

/**
 * Einfaches HTML-Escaping.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

main().catch((err) => {
  console.error("Unerwarteter Fehler in generate-static-seo.mjs:", err);
  process.exit(1);
});
