/**
 * Frequency analysis over all 34 cluster examples (Migration 007 + Spring Post).
 * Counts USP/Geo occurrences and top 3-word phrases.
 * Sends Markdown table to Slack. Writes Repetition-Risk to EXAMPLES-FIXES.md.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";
import { USPS, GEO_ANCHORS } from "../gbp-routine/gbp-constants.js";
import { slackBlocks, slackText } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const EXAMPLES: string[] = [
  // mamma_anekdoten
  "Handgemachte Pasta im STORIA Maxvorstadt: Mamma Speranza kocht nach Rofrano-Rezept — Original aus dem Cilento, täglich frisch. Karlstraße 47a, München.",
  "Im STORIA Maxvorstadt: Mamma hat heute frische Burrata aus Apulien mitgebracht. Zum Mittagsmenü als Antipasto — handgemachte Pasta, 3 Gänge für 14,90 €, Mo–Fr 11:30.",
  "Mamma Speranza und ihre Familie kochen seit 2015 in der Karlstraße — Cucina del Cilento, Original-Rezepte aus Rofrano, täglich in der Maxvorstadt.",
  // mimmo_kueche
  "48h Teigruhe: Mimmo testet heute einen neuen Tagliolini-Teig im STORIA München. Mehl aus dem Cilento — wenn er passt, kommt er auf die Karte in der Maxvorstadt.",
  "Steinofenpizza München: Mimmo heizt den 400°C Steinofen, 48h Teigruhe im Teig. Probier die aktuelle Cilento-Variante — STORIA Karlstraße, Maxvorstadt.",
  "Handgemachte Pasta täglich frisch — Mimmos Küche im STORIA Maxvorstadt arbeitet mit Lieferanten aus dem Cilento und dem regionalen Großmarkt. Karlstraße 47a, München.",
  // cilento_hintergrund
  "Cucina del Cilento in München: Das Strozzapreti-Rezept stammt aus Rofrano, 30 km südlich von Salerno. Familie Speranza bringt es seit 2015 in die Maxvorstadt.",
  "Karlstraße, Maxvorstadt: Im Cilento isst man Pasta dünner als in Neapel und schwört auf lokales Olivenöl. Was Mamma Speranza hier kocht, kommt aus dieser Tradition.",
  // karlstrasse_anker
  "Pinakotheken-Besucher: 5 Minuten bis zur Karlstraße — dann bist du im STORIA. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr 11:30–14:30 in der Maxvorstadt.",
  "TU oder LMU Mensa ausgebucht? Das STORIA Karlstraße ist 8 Minuten entfernt. Mittagsmenü 14,90 € — handgemachte Pasta, täglich wechselnd, Mo–Fr in der Maxvorstadt.",
  // personal_story
  "STORIA Karlstraße: Nicola erklärt dir den Unterschied zwischen Gavi und Vermentino — zwei Weine, die anders schmecken, obwohl beide von der Küste kommen. Maxvorstadt.",
  "Seit 2015 läuft das STORIA durch Gutes wie durch ruhigere Phasen. Was sich nicht geändert hat: handgemachte Pasta und Familie Speranza am Herd — Cucina del Cilento in München.",
  // pasta_handarbeit
  "Hausgemachte Pasta München: jeder Streifen per Hand gerollt, kein Automat. Im STORIA Karlstraße seit 2015 — täglich frisch, serviert ab 11:30 in der Maxvorstadt.",
  "Pasta Maxvorstadt: Familie Speranza rollt Teig nach Cilento-Tradition — dünn, handgemacht, ohne Ei-Pulver. Karlstraße 47a, täglich frisch ab 11:30.",
  "Der Tagliolini-Teig für heute wurde gestern Abend angesetzt. Handgemachte Pasta München — 48h Teigruhe, dann frisch im STORIA, Karlstraße Maxvorstadt.",
  // pinakothek_dinner
  "Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.",
  "Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen in der Maxvorstadt.",
  "Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Raucher willkommen, Weinbar München — STORIA in der Maxvorstadt.",
  // rezension_highlight
  '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
  "48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.",
  '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, Raucher willkommen, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.',
  // steinofenpizza_muenchen
  "Steinofenpizza München: 400°C Steinofen, 48h Teigruhe, Cilento-Salami oder Burrata-Variante. Mimmo zieht jede Pizza selbst aus dem Ofen — STORIA Karlstraße, Maxvorstadt.",
  "Neapolitanische Pizza München: der Teig hat 48h Teigruhe, dann in den 400°C Steinofen. Im STORIA Karlstraße Maxvorstadt — täglich frisch gebacken.",
  "Was Steinofenpizza in München bedeutet: 48h Teigruhe im Teig, 400°C Steinofen, Mimmos Handwerk. STORIA Karlstraße — Mittwochabend meist ruhiger für spontane Tische.",
  // terrasse_lifestyle
  "100 überdachte Plätze in der Maxvorstadt — wetterfest, Raucher willkommen, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.",
  "Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, Raucher willkommen, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.",
  "Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach, Raucher willkommen. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.",
  // weinbar_maxvorstadt
  "Weinbar München Maxvorstadt: Über 60 Weine — Vermentino von der Küste, Amarone aus dem Valpolicella, Rosato aus dem Cilento. STORIA Karlstraße.",
  "Maxvorstadt Weinbar-Tipp: Nicola empfiehlt zum Tagliolini einen Fiano di Avellino — weniger bekannt als Pinot Grigio, passt aber besser. STORIA Karlstraße München.",
  "Wer in München eine Weinbar sucht, die auch ehrliches Essen hat: Karlstraße 47a. STORIA — 60+ Weine, handgemachte Pasta, überdachte Terrasse.",
  // wild_kueche
  "Wild essen München: Mimmo verarbeitet Reh und Hirsch seit 2015 — kein Supermarkt-Wild, regionale Lieferanten, handgemachte Pasta dazu. STORIA Karlstraße, Maxvorstadt.",
  "Wild essen München — Herbst im STORIA: Wildschweinragù auf handgemachte Pasta, Rehkeule aus dem Ofen. Wenn die Saison stimmt, steht es auf der Karte. Karlstraße Maxvorstadt.",
  "Wer Wild in München sucht, übersieht oft kleine Restaurants. Im STORIA kommen Reh und Hirsch von heimischen Lieferanten — Cucina del Cilento trifft Münchner Herbst.",
  // spring_post
  "Frühling in der Maxvorstadt: der erste Aperitivo auf der überdachten Terrasse. STORIA Karlstraße — 100 Plätze, wetterfest, Raucher willkommen. Seit 2015.",
];

const N = EXAMPLES.length;

// ── USP frequency ─────────────────────────────────────────────────────────────
const uspFreq: { term: string; count: number; pct: number; risk: boolean }[] = USPS.map((usp) => {
  const count = EXAMPLES.filter((e) => e.toLowerCase().includes(usp.toLowerCase())).length;
  const pct = Math.round((count / N) * 100);
  return { term: usp, count, pct, risk: pct > 40 };
});

// ── Geo frequency ─────────────────────────────────────────────────────────────
const geoFreq: { term: string; count: number; pct: number; risk: boolean }[] = GEO_ANCHORS.map((geo) => {
  const count = EXAMPLES.filter((e) => e.includes(geo)).length;
  const pct = Math.round((count / N) * 100);
  return { term: geo, count, pct, risk: pct > 40 };
});

// ── 3-gram frequency ──────────────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .replace(/[«»„""\u2014\u2013.,;:!?\(\)\[\]{}«»'"""]/g, " ")
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 1);
}

const trigramMap = new Map<string, number>();
for (const example of EXAMPLES) {
  const tokens = tokenize(example);
  const seen = new Set<string>(); // count once per example (not per occurrence)
  for (let i = 0; i < tokens.length - 2; i++) {
    const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
    if (!seen.has(trigram)) {
      seen.add(trigram);
      trigramMap.set(trigram, (trigramMap.get(trigram) ?? 0) + 1);
    }
  }
}

const top10Trigrams = [...trigramMap.entries()]
  .filter(([, c]) => c >= 2)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([phrase, count]) => ({ phrase, count, pct: Math.round((count / N) * 100) }));

// ── Console output ─────────────────────────────────────────────────────────────
console.log(`\n📊 Frequency Analysis — ${N} Examples\n`);
console.log("USPs:");
uspFreq.sort((a, b) => b.count - a.count).forEach((u) =>
  console.log(`  ${u.risk ? "⚠️ " : "   "}${u.term.padEnd(28)} ${u.count}/${N}  ${u.pct}%`)
);
console.log("\nGeo-Anker:");
geoFreq.sort((a, b) => b.count - a.count).forEach((g) =>
  console.log(`  ${g.risk ? "⚠️ " : "   "}${g.term.padEnd(28)} ${g.count}/${N}  ${g.pct}%`)
);
console.log("\nTop Trigrams:");
top10Trigrams.forEach((t) => console.log(`  ${t.count}/${N}  ${t.pct}%  "${t.phrase}"`));

// ── Slack ─────────────────────────────────────────────────────────────────────
const risks = [...uspFreq, ...geoFreq].filter((x) => x.risk);

const fmtTable = (rows: { term: string; count: number; pct: number; risk: boolean }[]) =>
  rows.map((r) => `${r.risk ? "⚠️" : "  "} \`${r.term}\` — ${r.count}/${N} (${r.pct}%)`).join("\n");

const trigramLines = top10Trigrams
  .map((t) => `\`${t.phrase}\` — ${t.count}/${N} (${t.pct}%)`)
  .join("\n");

await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: `📊 Frequency-Check — ${N} Examples (Migration 007)`, emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*USP-Häufigkeit* (⚠️ = Repetition-Risk >40%)\n\n${fmtTable(uspFreq.sort((a, b) => b.count - a.count))}`,
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Geo-Anker-Häufigkeit* (⚠️ = Repetition-Risk >40%)\n\n${fmtTable(geoFreq.sort((a, b) => b.count - a.count))}`,
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Top 10 Drei-Wort-Phrasen*\n\n${trigramLines}`,
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        risks.length > 0
          ? `⚠️ *${risks.length} Repetition-Risk${risks.length > 1 ? "s" : ""}:* ${risks.map((r) => `\`${r.term}\` (${r.pct}%)`).join(", ")}\nKein Auto-Reject — Antoine entscheidet.`
          : "✅ Kein Repetition-Risk über 40% — alle USPs/Geos gut verteilt.",
    },
  },
], true);

// ── EXAMPLES-FIXES.md: Repetition-Risk section ────────────────────────────────
const fixesPath = resolve(__dirname, "EXAMPLES-FIXES.md");
const existing = readFileSync(fixesPath, "utf-8");

const riskSection =
  risks.length > 0
    ? [
        "",
        "## Repetition-Risk (>40% der Examples)",
        "",
        "| USP / Geo | Vorkommen | % |",
        "|---|---|---|",
        ...risks.map((r) => `| \`${r.term}\` | ${r.count}/${N} | ${r.pct}% |`),
        "",
        "> Pre-Check, kein Auto-Reject. Antoine entscheidet ob Texte diversifiziert werden.",
      ].join("\n")
    : "\n## Repetition-Risk\n\n✅ Kein Anker über 40% — keine Maßnahmen nötig.";

const updated = existing.trimEnd() + "\n" + riskSection + "\n";
writeFileSync(fixesPath, updated, "utf-8");
console.log(`\n📋 EXAMPLES-FIXES.md aktualisiert (Repetition-Risk).`);
