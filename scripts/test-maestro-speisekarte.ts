// Selbsttest P8: dynamische Kartenliste + Zusammenführung der Sprachantworten ins Menu-Format
// (Testdaten, keine echten Karten). Aufruf: node --experimental-strip-types scripts/test-maestro-speisekarte.ts
import assert from "node:assert/strict";
import { zusammenfuehren, ladeMaestroMenu, maestroSpeisekarteAktiv } from "../src/lib/maestroSpeisekarte.ts";

const antwort = (slug: string, name: string, lang: string, kat: string, pos: string, text: string | null) => ({
  data: {
    sprache: lang,
    stand: `st-${slug}`,
    html: `<div class="maestro-speisekarte" data-maestro-stand="st-${slug}">${slug}-${lang}</div>`,
    karten: [{ slug, name, kategorien: [
      { name: kat, positionen: [{ name: pos, beschreibung: `B-${lang}`, preis_cents: 1250, preis_text: text }] },
    ] }],
  },
});
const sprachen = (slug: string, name: string, kat: Record<string, string>) =>
  Object.fromEntries(["de", "en", "it", "fr"].map((l) => [l, antwort(slug, name, l, kat[l], `Pos-${l}`, l === "it" ? "a partire da" : null)]));

const sushi = sprachen("sushi", "Sushi", { de: "Maki", en: "Maki rolls", it: "Maki", fr: "Makis" });
const aperitivo = sprachen("aperitivo", "Aperitivo", { de: "Spritz", en: "Spritz", it: "Spritz", fr: "Spritz" });

const m = zusammenfuehren("food", [sushi, aperitivo] as any);
assert.equal(m.title, "Sushi · Aperitivo");
assert.equal(m.title_fr, "Sushi · Aperitivo");
assert.equal(m.categories.length, 2);
assert.equal(m.categories[0].name_en, "Maki rolls");
assert.equal(m.categories[1].id, "maestro-aperitivo-0");
assert.equal(m.categories[1].sort_order, 1);
const item = m.categories[0].items[0];
assert.equal(item.name_it, "Pos-it");
assert.equal(item.description_fr, "B-fr");
assert.equal(item.price, 12.5);
assert.equal(item.price_display_it, "a partire da");
assert.equal(item.price_display, null);
assert.deepEqual(m.maestro.karten.map((k) => k.slug), ["sushi", "aperitivo"]);
assert.equal(m.maestro.karten[1].name, "Aperitivo");
assert.match(m.maestro.karten[0].html.en, /st-sushi">sushi-en</);

const leer = { data: { sprache: "de", stand: "x", html: "", karten: [] } };
assert.throws(() => zusammenfuehren("food", [{ de: leer, en: leer, it: leer, fr: leer }] as any), /leer/);
assert.throws(() => zusammenfuehren("food", []), /keine veröffentlichte/);
assert.equal(maestroSpeisekarteAktiv(), false); // ohne Build-Variable bleibt der alte Weg

// Entdeckung über die Kartenliste: Slugs kommen aus /api/public/speisekarten, nicht aus dem Code.
const abrufe: string[] = [];
const antworten: Record<string, unknown> = {
  "/api/public/speisekarten": { data: { karten: [
    { slug: "sushi", name: "Sushi", kartenart: null },
    { slug: "aperitivo", name: "Aperitivo", kartenart: { id: "x", name: "Bar" } },
  ] } },
};
for (const [slug, k] of [["sushi", sushi], ["aperitivo", aperitivo]] as const)
  for (const l of ["de", "en", "it", "fr"]) antworten[`/api/public/speisekarte?karte=${slug}&lang=${l}`] = (k as any)[l];
globalThis.fetch = (async (url: string) => {
  const pfad = url.replace(/^https:\/\/[^/]+/, "");
  abrufe.push(pfad);
  const body = antworten[pfad];
  return { ok: !!body, status: body ? 200 : 404, json: async () => body } as Response;
}) as typeof fetch;

const geladen = await ladeMaestroMenu("drinks");
assert.deepEqual(geladen.maestro.karten.map((k) => k.name), ["Sushi", "Aperitivo"]);
assert.equal(geladen.menu_type, "drinks");
assert.equal(abrufe.length, 9); // 1 Liste + 2 Karten x 4 Sprachen
await ladeMaestroMenu("lunch");
assert.equal(abrufe.length, 9); // zweite Seite nutzt denselben Ladevorgang

// Leere Liste bzw. gestörte API -> laut scheitern (Prerender bricht ab). Neues Modul, frischer Zwischenspeicher.
antworten["/api/public/speisekarten"] = { data: { karten: [] } };
const frisch = await import("../src/lib/maestroSpeisekarte.ts?leer");
await assert.rejects(frisch.ladeMaestroMenu("food"), /keine veröffentlichte/);
delete antworten["/api/public/speisekarten"];
await assert.rejects(frisch.ladeMaestroMenu("food"), /HTTP 404/); // Fehler wird nicht festgehalten

console.log("OK maestroSpeisekarte: 23 Prüfungen grün");
