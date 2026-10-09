// Selbsttest P8: Zusammenführung der vier Sprachantworten ins Menu-Format (Testdaten, keine echten Karten).
// Aufruf: node --experimental-strip-types scripts/test-maestro-speisekarte.ts
import assert from "node:assert/strict";
import { zusammenfuehren, maestroSpeisekarteAktiv } from "../src/lib/maestroSpeisekarte.ts";

const antwort = (lang: string, kat: string, pos: string, text: string | null) => ({
  data: {
    sprache: lang,
    stand: "abc",
    html: `<div class="maestro-speisekarte" data-maestro-stand="abc">${lang}</div>`,
    karten: [{ slug: "testkarte", name: "Testkarte", kategorien: [
      { name: kat, positionen: [{ name: pos, beschreibung: `B-${lang}`, preis_cents: 1250, preis_text: text }] },
    ] }],
  },
});

const m = zusammenfuehren("food", {
  de: antwort("de", "Vorspeisen", "Suppe", null),
  en: antwort("en", "Starters", "Soup", null),
  it: antwort("it", "Antipasti", "Zuppa", "a partire da"),
  fr: antwort("fr", "Entrées", "Soupe", null),
} as any);

assert.equal(m.title, "Testkarte");
assert.equal(m.title_fr, "Testkarte");
assert.equal(m.categories[0].name_en, "Starters");
const item = m.categories[0].items[0];
assert.equal(item.name_it, "Zuppa");
assert.equal(item.description_fr, "B-fr");
assert.equal(item.price, 12.5);
assert.equal(item.price_display_it, "a partire da");
assert.equal(item.price_display, null);
assert.equal(m.maestro.slug, "testkarte");
assert.match(m.maestro.html.en, /data-maestro-stand="abc">en</);

const leer = { data: { sprache: "de", stand: "x", html: "", karten: [] } };
assert.throws(() => zusammenfuehren("food", { de: leer, en: leer, it: leer, fr: leer } as any), /leer/);
assert.equal(maestroSpeisekarteAktiv(), false); // ohne Build-Variable bleibt der alte Weg

console.log("OK maestroSpeisekarte: 12 Prüfungen grün");
