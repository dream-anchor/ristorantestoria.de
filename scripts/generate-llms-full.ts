/**
 * Generiert public/llms-full.txt
 * Flat-Markdown aller Seiteninhalte für AI-Retrieval (llms.txt-Standard).
 *
 * Ausführen: npx tsx scripts/generate-llms-full.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Basis-llms.txt einlesen
const base = readFileSync(join(ROOT, "public/llms.txt"), "utf-8");

// Translations dynamisch importieren
const { de } = await import("../src/translations/de.js").catch(async () => {
  // Fallback: TypeScript via tsx
  return import("../src/translations/de.ts");
});

const t = de as any;

// FAQ-Kategorien zu Markdown
function faqToMarkdown(): string {
  const cats = t.faqPage?.categories ?? [];
  if (!cats.length) return "";

  let md = "\n## FAQ – Häufige Fragen\n\n";

  for (const cat of cats) {
    md += `### ${cat.title}\n\n`;
    for (const item of cat.items) {
      md += `**F: ${item.question}**\n`;
      md += `A: ${item.answer}\n\n`;
    }
  }
  return md;
}

// Landing Pages (bekannte Inhalte)
const landingPages = `
## Landing Pages

### Neapolitanische Pizza München
URL: https://www.ristorantestoria.de/neapolitanische-pizza-muenchen/
Das STORIA backt echte neapolitanische Pizza nach UNESCO-anerkannter Tradition: 48-Stunden-Teigführung bei kontrollierter Temperatur, San Marzano DOP-Tomaten, Büffelmozzarella aus Kampanien, Steinofen bei über 400 °C. Die Pizza gart in 60–90 Sekunden – erkennbar an luftigem Cornicione und charakteristischen Leoparden-Brandflecken.

### Business Lunch München Maxvorstadt
URL: https://www.ristorantestoria.de/lunch-muenchen-maxvorstadt/
Wechselndes Mittagsmenü Mo–Fr ab 11:30 Uhr. Vorspeise, Hauptgang, Getränk. Ideal für Geschäftsessen in der Maxvorstadt – zwischen TU München, Pinakotheken und Hauptbahnhof.

### Aperitivo München
URL: https://www.ristorantestoria.de/aperitivo-muenchen/
Aperol Spritz, Negroni, Bellini, Hugo, Campari Soda – täglich ab Öffnung auf der überdachten Terrasse oder an der Bar.

### Romantisches Dinner München
URL: https://www.ristorantestoria.de/romantisches-dinner-muenchen/
Warmes Licht, süditalienische Musik, Familienbetrieb-Charme. Reservierung empfohlen, besonders Fr/Sa.

### Terrasse München
URL: https://www.ristorantestoria.de/terrasse-muenchen/
100 Sitzplätze, überdacht und beheizt – ganzjährig nutzbar. Mitten in Münchens Maxvorstadt.

### Firmenfeier München
URL: https://www.ristorantestoria.de/firmenfeier-muenchen/
Bis zu 180 Personen (stehend) oder 200 Sitzplätze (innen + Terrasse). Individuelle Menüpakete, flexibel gestaltbar.

### Geburtstagsfeier München
URL: https://www.ristorantestoria.de/geburtstagsfeier-muenchen/
Private Events ab 6 bis 300 Personen. Individuelle Menüs auf Anfrage.

### Wild essen München
URL: https://www.ristorantestoria.de/wild-essen-muenchen/
Saisonale Wildspezialitäten September–Februar: Cinghiale (Wildschwein), Capriolo (Reh), Lepre (Hase). Wild aus nachhaltiger bayerischer Jagd.

### Reisegruppen München
URL: https://www.ristorantestoria.de/reisegruppen-muenchen/
Gruppenmenüs und Sonderkonditionen für Reiseveranstalter. Kapazität bis 300 Personen.

### Eventlocation München Maxvorstadt
URL: https://www.ristorantestoria.de/eventlocation-muenchen-maxvorstadt/
Das STORIA als Eventlocation: Firmenfeiern, Kongress-Dinner, Produktpräsentationen, Jubiläen.

## Qualitätsstandards & Zertifizierungen

- **Neapolitanische Pizzakultur**: UNESCO-Immaterielles Kulturerbe (2017) – https://ich.unesco.org/en/RL/art-of-neapolitan-pizzaiuolo-01207
- **San Marzano DOP**: Geschützte Ursprungsbezeichnung (g.U.) der EU – https://www.consorziosanmarzano.it/
- **Büffelmozzarella**: Mozzarella di Bufala Campana DOP aus Kampanien

## Externe Profile & Bewertungsplattformen

- Google Maps: https://maps.google.com/?cid=3761590175870856939
- Instagram: https://www.instagram.com/ristorante_storia/
- Facebook: https://www.facebook.com/ristorantestoria/
- OpenTable DE: https://www.opentable.de/r/storia-ristorante-pizzeria-bar-munchen
- Quandoo: https://www.quandoo.de/place/storia-10239
- Domenico Speranza LinkedIn: https://www.linkedin.com/in/domenico-speranza-650b122a5/
`;

const output = [
  base.trimEnd(),
  "\n\n---\n",
  `> Generiert: ${new Date().toISOString().slice(0, 10)}`,
  faqToMarkdown(),
  landingPages,
].join("\n");

const outPath = join(ROOT, "public/llms-full.txt");
writeFileSync(outPath, output, "utf-8");

const lineCount = output.split("\n").length;
console.log(`✅ llms-full.txt generiert (${lineCount} Zeilen) → ${outPath}`);
