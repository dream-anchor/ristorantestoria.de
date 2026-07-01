/**
 * Generiert (a) eine Supabase-Seed-Migration und (b) den Fallback-JSON-Eintrag
 * für das editierbare "Oktoberfest"-Sondermenü — aus den bestehenden 4-sprachigen
 * Übersetzungen (src/translations/*). So kann der Betreiber Pakete, Preise, Menüs,
 * Speisen & Getränke im Admin ("Besondere Anlässe") komplett selbst editieren.
 *
 * Aufruf:  npx tsx scripts/gen-oktoberfest-menu.ts
 */
import { randomUUID } from "node:crypto";
import { writeFileSync, readFileSync } from "node:fs";
import { de } from "../src/translations/de";
import { en } from "../src/translations/en";
import { it } from "../src/translations/it";
import { fr } from "../src/translations/fr";

type Lang = "de" | "en" | "it" | "fr";
const T: Record<Lang, any> = { de, en, it, fr };
const o = (l: Lang) => T[l].seo.oktoberfest as Record<string, string>;

// Struktur: Kategorien (Sektionen) → Positionen (Speisen/Getränke/Pakete)
// nameKey → `${n}Name`, descKey → `${n}Desc`. Preis: literal (alle Sprachen gleich)
// oder priceKey (übersetzter Preis, z. B. Pakete "ab ca. € 29 p. P.").
type Item = { n: string; price?: string; priceKey?: string };
type Cat = { titleKey: string; descKey?: string; items: Item[] };

const CATS: Cat[] = [
  { titleKey: "categoryBeer", descKey: "beerSubtitle", items: [
    { n: "beerMass", price: "€ 12,90" }, { n: "beerRadler", price: "€ 12,90" },
    { n: "beerRuss", price: "€ 12,90" }, { n: "beerAlkoholfrei", price: "€ 6,90" } ] },
  { titleKey: "categoryAperitivo", items: [
    { n: "spritzBavarese", price: "€ 9,90" }, { n: "spritzAperol", price: "€ 9,90" }, { n: "spritzHugo", price: "€ 9,90" } ] },
  { titleKey: "brotzeitTitle", descKey: "brotzeitSubtitle", items: [
    { n: "brettBavarese", price: "ca. € 24,90" }, { n: "brettMuenchen", price: "ca. € 19,90" }, { n: "brettItalia", price: "ca. € 19,90" },
    { n: "brezn", price: "€ 4,50" }, { n: "obatzda", price: "€ 8,90" }, { n: "weisswurst", price: "€ 8,90" } ] },
  { titleKey: "pizzaTitle", descKey: "pizzaSubtitle", items: [
    { n: "pizzaBratwurst", price: "ca. € 15,90" }, { n: "pizzaSpanferkel", price: "ca. € 16,90" },
    { n: "pizzaSalami", price: "ca. € 14,90" }, { n: "pizzaObatzda", price: "ca. € 14,90" } ] },
  { titleKey: "bratenTitle", descKey: "bratenSubtitle", items: [
    { n: "schweinsbraten", price: "ca. € 19,90" }, { n: "rinderbraten", price: "ca. € 22,90" }, { n: "vegetarisch", price: "ca. € 16,90" } ] },
  { titleKey: "paketeTitle", descKey: "paketeSubtitle", items: [
    { n: "paketBrotzeit", priceKey: "paketBrotzeitPrice" }, { n: "paketBavarese", priceKey: "paketBavarasePrice" }, { n: "paketFirma", priceKey: "paketFirmaPrice" } ] },
];

const MENU_TITLE: Record<Lang, string> = {
  de: "Oktoberfest – Speisen & Getränke", en: "Oktoberfest – Food & Drinks",
  it: "Oktoberfest – Cibo & Bevande", fr: "Oktoberfest – Cuisine & Boissons",
};
const SLUGS: Record<Lang, string> = { de: "oktoberfest-menue", en: "oktoberfest-menu", it: "oktoberfest-menu-it", fr: "oktoberfest-menu-fr" };

const sq = (v: string | null) => (v == null ? "NULL" : "'" + v.replace(/'/g, "''") + "'");
const price = (i: Item, l: Lang) => (i.priceKey ? o(l)[i.priceKey] : i.price!) ?? "";

// ---------- SQL-Migration ----------
let sql = `-- Seed: editierbares Oktoberfest-Sondermenü ("Besondere Anlässe")
-- Generiert von scripts/gen-oktoberfest-menu.ts aus src/translations/*
-- Idempotent: legt das Menü nur an, wenn Slug 'oktoberfest-menue' noch nicht existiert.
DO $$
DECLARE m_id uuid; c_id uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM public.menus WHERE slug = 'oktoberfest-menue') THEN
    RAISE NOTICE 'Oktoberfest-Menü existiert bereits – übersprungen.';
    RETURN;
  END IF;

  INSERT INTO public.menus (menu_type, title, title_en, title_it, title_fr, subtitle, subtitle_en, subtitle_it, subtitle_fr, slug, slug_en, slug_it, slug_fr, is_published, published_at, sort_order)
  VALUES ('special', ${sq(MENU_TITLE.de)}, ${sq(MENU_TITLE.en)}, ${sq(MENU_TITLE.it)}, ${sq(MENU_TITLE.fr)}, ${sq(o("de").heroSubtitle)}, ${sq(o("en").heroSubtitle)}, ${sq(o("it").heroSubtitle)}, ${sq(o("fr").heroSubtitle)}, ${sq(SLUGS.de)}, ${sq(SLUGS.en)}, ${sq(SLUGS.it)}, ${sq(SLUGS.fr)}, true, now(), 150)
  RETURNING id INTO m_id;
`;
CATS.forEach((cat, ci) => {
  sql += `
  INSERT INTO public.menu_categories (menu_id, name, name_en, name_it, name_fr, description, description_en, description_it, description_fr, sort_order)
  VALUES (m_id, ${sq(o("de")[cat.titleKey])}, ${sq(o("en")[cat.titleKey])}, ${sq(o("it")[cat.titleKey])}, ${sq(o("fr")[cat.titleKey])}, ${sq(cat.descKey ? o("de")[cat.descKey] : null)}, ${sq(cat.descKey ? o("en")[cat.descKey] : null)}, ${sq(cat.descKey ? o("it")[cat.descKey] : null)}, ${sq(cat.descKey ? o("fr")[cat.descKey] : null)}, ${ci + 1})
  RETURNING id INTO c_id;
`;
  cat.items.forEach((item, ii) => {
    const nm = (l: Lang) => o(l)[`${item.n}Name`];
    const ds = (l: Lang) => o(l)[`${item.n}Desc`];
    sql += `  INSERT INTO public.menu_items (category_id, name, name_en, name_it, name_fr, description, description_en, description_it, description_fr, price_display, price_display_en, price_display_it, price_display_fr, sort_order)
  VALUES (c_id, ${sq(nm("de"))}, ${sq(nm("en"))}, ${sq(nm("it"))}, ${sq(nm("fr"))}, ${sq(ds("de"))}, ${sq(ds("en"))}, ${sq(ds("it"))}, ${sq(ds("fr"))}, ${sq(price(item, "de"))}, ${sq(price(item, "en"))}, ${sq(price(item, "it"))}, ${sq(price(item, "fr"))}, ${ii + 1});
`;
  });
});
sql += `END $$;\n`;

const stamp = "20260701120000";
const sqlPath = `supabase/migrations/${stamp}_seed_oktoberfest_menu.sql`;
writeFileSync(sqlPath, sql);
console.log("SQL geschrieben:", sqlPath, `(${sql.length} bytes)`);

// ---------- Fallback-JSON (für Prerender/Offline) ----------
const menuId = randomUUID();
const fallbackMenu: any = {
  id: menuId, menu_type: "special",
  title: MENU_TITLE.de, subtitle: o("de").heroSubtitle, pdf_url: null,
  is_published: true, published_at: new Date(0).toISOString(),
  created_at: new Date(0).toISOString(), updated_at: new Date(0).toISOString(),
  title_en: MENU_TITLE.en, subtitle_en: o("en").heroSubtitle, sort_order: 150,
  slug: SLUGS.de, title_it: MENU_TITLE.it, subtitle_it: o("it").heroSubtitle,
  title_fr: MENU_TITLE.fr, subtitle_fr: o("fr").heroSubtitle,
  slug_en: SLUGS.en, slug_it: SLUGS.it, slug_fr: SLUGS.fr, archive_year: null,
  categories: CATS.map((cat, ci) => ({
    id: randomUUID(), menu_id: menuId,
    name: o("de")[cat.titleKey], name_en: o("en")[cat.titleKey],
    description: cat.descKey ? o("de")[cat.descKey] : null, description_en: cat.descKey ? o("en")[cat.descKey] : null,
    sort_order: ci + 1, created_at: new Date(0).toISOString(),
    name_it: o("it")[cat.titleKey], description_it: cat.descKey ? o("it")[cat.descKey] : null,
    name_fr: o("fr")[cat.titleKey], description_fr: cat.descKey ? o("fr")[cat.descKey] : null,
    items: cat.items.map((item, ii) => ({
      id: randomUUID(), category_id: null,
      name: o("de")[`${item.n}Name`], name_en: o("en")[`${item.n}Name`],
      description: o("de")[`${item.n}Desc`], description_en: o("en")[`${item.n}Desc`],
      price: null, price_display: price(item, "de"), price_display_en: price(item, "en"),
      allergens: null, is_vegetarian: null, is_vegan: null, sort_order: ii + 1,
      created_at: new Date(0).toISOString(),
      name_it: o("it")[`${item.n}Name`], description_it: o("it")[`${item.n}Desc`], price_display_it: price(item, "it"),
      name_fr: o("fr")[`${item.n}Name`], description_fr: o("fr")[`${item.n}Desc`], price_display_fr: price(item, "fr"),
    })),
  })),
};

const fbPath = "src/data/special-menus-fallback.json";
const arr = JSON.parse(readFileSync(fbPath, "utf8"));
const idx = arr.findIndex((m: any) => m.slug === SLUGS.de);
if (idx >= 0) arr[idx] = fallbackMenu; else arr.push(fallbackMenu);
writeFileSync(fbPath, JSON.stringify(arr, null, 2) + "\n");
console.log("Fallback-JSON aktualisiert:", fbPath, `(menu id ${menuId})`);
