/**
 * Frequency Re-Check (kurzer Output): Geo-Verteilung + Top-5-Trigrams.
 * Ziel: Pinakotheken ≥4, Königsplatz ≥4, "in der Maxvorstadt" ≤5.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GEO_ANCHORS } from "../gbp-routine/gbp-constants.js";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const EXAMPLES: string[] = [
  "Handgemachte Pasta im STORIA Maxvorstadt: Mamma Speranza kocht nach Rofrano-Rezept — Original aus dem Cilento, täglich frisch. Karlstraße 47a, München.",
  "Im STORIA Maxvorstadt: Mamma hat heute frische Burrata aus Apulien mitgebracht. Zum Mittagsmenü als Antipasto — handgemachte Pasta, 3 Gänge für 14,90 €, Mo–Fr 11:30.",
  "Mamma Speranza und ihre Familie kochen seit 2015 in der Karlstraße — Cucina del Cilento, Original-Rezepte aus Rofrano. Maxvorstadt, nahe den Pinakotheken.",
  "48h Teigruhe: Mimmo testet heute einen neuen Tagliolini-Teig im STORIA München. Mehl aus dem Cilento — wenn er passt, kommt er auf die Karte. Karlstraße, nahe Königsplatz.",
  "Steinofenpizza München: Mimmo heizt den 400°C Steinofen, 48h Teigruhe im Teig. Probier die aktuelle Cilento-Variante — STORIA Karlstraße, Maxvorstadt.",
  "Handgemachte Pasta täglich frisch — Mimmos Küche im STORIA Maxvorstadt arbeitet mit Lieferanten aus dem Cilento und dem regionalen Großmarkt. Karlstraße 47a, München.",
  "Cucina del Cilento in München: Das Strozzapreti-Rezept stammt aus Rofrano, 30 km südlich von Salerno. Familie Speranza bringt es seit 2015 in die Maxvorstadt.",
  "Karlstraße, Maxvorstadt: Im Cilento isst man Pasta dünner als in Neapel und schwört auf lokales Olivenöl. Was Mamma Speranza hier kocht, kommt aus dieser Tradition.",
  "Pinakotheken-Besucher: 5 Minuten bis zur Karlstraße — dann bist du im STORIA. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr 11:30–14:30 in der Maxvorstadt.",
  "TU oder LMU Mensa ausgebucht? Das STORIA Karlstraße ist 8 Minuten entfernt — 5 Gehminuten von den Pinakotheken. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr.",
  "STORIA Karlstraße: Nicola erklärt dir den Unterschied zwischen Gavi und Vermentino — zwei Weine, die anders schmecken, obwohl beide von der Küste kommen. Maxvorstadt.",
  "Seit 2015 läuft das STORIA durch Gutes wie durch ruhigere Phasen. Was sich nicht geändert hat: handgemachte Pasta und Familie Speranza am Herd — Cucina del Cilento in München.",
  "Hausgemachte Pasta München: jeder Streifen per Hand gerollt, kein Automat. Im STORIA Karlstraße seit 2015 — täglich frisch ab 11:30, 5 Gehminuten von den Pinakotheken.",
  "Pasta Maxvorstadt: Familie Speranza rollt Teig nach Cilento-Tradition — dünn, handgemacht, ohne Ei-Pulver. Karlstraße 47a, täglich frisch ab 11:30.",
  "Der Tagliolini-Teig für heute wurde gestern Abend angesetzt. Handgemachte Pasta München — 48h Teigruhe, dann frisch im STORIA, Karlstraße Maxvorstadt.",
  "Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.",
  "Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen. Nähe Königsplatz.",
  "Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Raucher willkommen, Weinbar München — STORIA in der Maxvorstadt.",
  '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
  "48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.",
  '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, Raucher willkommen, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.',
  "Steinofenpizza München: 400°C Steinofen, 48h Teigruhe, Cilento-Salami oder Burrata-Variante. Mimmo zieht jede Pizza selbst aus dem Ofen — STORIA Karlstraße, Maxvorstadt.",
  "Neapolitanische Pizza München: der Teig hat 48h Teigruhe, dann in den 400°C Steinofen. Im STORIA Karlstraße Maxvorstadt — täglich frisch gebacken.",
  "Was Steinofenpizza in München bedeutet: 48h Teigruhe im Teig, 400°C Steinofen, Mimmos Handwerk. STORIA Karlstraße — Mittwochabend meist ruhiger für spontane Tische.",
  "100 überdachte Plätze in der Maxvorstadt — wetterfest, Raucher willkommen, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.",
  "Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, Raucher willkommen, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.",
  "Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach, Raucher willkommen. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.",
  "Weinbar München Maxvorstadt: Über 60 Weine — Vermentino von der Küste, Amarone aus dem Valpolicella, Rosato aus dem Cilento. STORIA Karlstraße.",
  "Maxvorstadt Weinbar-Tipp: Nicola empfiehlt zum Tagliolini einen Fiano di Avellino — weniger bekannt als Pinot Grigio, passt aber besser. STORIA Karlstraße München.",
  "Wer in München eine Weinbar sucht, die auch ehrliches Essen hat: Karlstraße 47a. STORIA — 60+ Weine, handgemachte Pasta, überdachte Terrasse.",
  "Wild essen München: Mimmo verarbeitet Reh und Hirsch seit 2015 — kein Supermarkt-Wild, regionale Lieferanten, handgemachte Pasta dazu. STORIA Karlstraße, Maxvorstadt.",
  "Wild essen München — Herbst im STORIA: Wildschweinragù auf handgemachte Pasta, Rehkeule aus dem Ofen. Wenn die Saison stimmt, steht es auf der Karte. Karlstraße Maxvorstadt.",
  "Wer Wild in München sucht, übersieht oft kleine Restaurants. Im STORIA kommen Reh und Hirsch von heimischen Lieferanten — Cucina del Cilento trifft Münchner Herbst.",
  "Frühling in der Maxvorstadt: der erste Aperitivo auf der überdachten Terrasse. STORIA Karlstraße — 100 Plätze, wetterfest, Raucher willkommen. Seit 2015.",
];

const N = EXAMPLES.length;

// Geo
const geoFreq = GEO_ANCHORS.map((geo) => {
  const count = EXAMPLES.filter((e) => e.includes(geo)).length;
  return { term: geo, count, pct: Math.round((count / N) * 100) };
}).sort((a, b) => b.count - a.count);

// "in der Maxvorstadt" literal count
const inDerMax = EXAMPLES.filter((e) => e.includes("in der Maxvorstadt")).length;

// Trigrams (dedup per example)
function tokenize(t: string) {
  return t.replace(/[.,;:!?()«»„""\u2014\u2013'"]/g, " ").split(/\s+/).map(w => w.toLowerCase()).filter(w => w.length > 1);
}
const tMap = new Map<string, number>();
for (const ex of EXAMPLES) {
  const toks = tokenize(ex);
  const seen = new Set<string>();
  for (let i = 0; i < toks.length - 2; i++) {
    const t = `${toks[i]} ${toks[i+1]} ${toks[i+2]}`;
    if (!seen.has(t)) { seen.add(t); tMap.set(t, (tMap.get(t) ?? 0) + 1); }
  }
}
const top5 = [...tMap.entries()].filter(([,c]) => c >= 2).sort((a,b) => b[1]-a[1]).slice(0,5);

// Targets
const pinakotheken = geoFreq.find(g => g.term === "Pinakotheken")!;
const koenigsplatz = geoFreq.find(g => g.term === "Königsplatz")!;
const pinaOk = pinakotheken.count >= 4;
const koenigOk = koenigsplatz.count >= 4;
const maxOk = inDerMax <= 5;

// Console
console.log(`\n📊 Frequency Re-Check — ${N} Examples`);
console.log(`\nGeo-Anker:`);
geoFreq.forEach(g => console.log(`  ${g.term.padEnd(15)} ${g.count}/${N}  ${g.pct}%`));
console.log(`\n"in der Maxvorstadt": ${inDerMax}/${N} (Ziel: ≤5) ${maxOk ? "✅" : "❌"}`);
console.log(`Pinakotheken: ${pinakotheken.count}/${N} (Ziel: ≥4) ${pinaOk ? "✅" : "❌"}`);
console.log(`Königsplatz: ${koenigsplatz.count}/${N} (Ziel: ≥4) ${koenigOk ? "✅" : "❌"}`);
console.log(`\nTop-5 Trigrams:`);
top5.forEach(([p, c]) => console.log(`  ${c}/${N}  "${p}"`));

// Slack
const geoLines = geoFreq.map(g => `\`${g.term}\` — ${g.count}/${N} (${g.pct}%)`).join("\n");
const triLines = top5.map(([p, c]) => `\`${p}\` — ${c}/${N}`).join("\n");
const targetsLine = [
  `${pinaOk ? "✅" : "❌"} Pinakotheken: ${pinakotheken.count}/${N}`,
  `${koenigOk ? "✅" : "❌"} Königsplatz: ${koenigsplatz.count}/${N}`,
  `${maxOk ? "✅" : "❌"} "in der Maxvorstadt": ${inDerMax}/${N}`,
].join("  |  ");

await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: `📊 Frequency Re-Check — ${N} Examples`, emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Geo-Verteilung:*\n${geoLines}\n\n*Top-5 Drei-Wort-Phrasen:*\n${triLines}`,
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Ziel-Check:*\n${targetsLine}\n\n${pinaOk && koenigOk && maxOk ? "✅ Alle Frequency-Ziele erreicht. GO 007 kann Antoine jetzt freigeben." : "❌ Nicht alle Ziele erreicht."}`,
    },
  },
], true);
