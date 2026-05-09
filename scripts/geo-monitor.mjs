/**
 * GEO-Monitor – Misst AI-Sichtbarkeit von Ristorante STORIA
 *
 * Testet 20 Restaurant-Suchanfragen gegen Claude Haiku.
 * Prüft ob STORIA / Familie Speranza erwähnt wird.
 *
 * Ausführen: node scripts/geo-monitor.mjs
 * Mit Report: node scripts/geo-monitor.mjs --report
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

config({ path: join(ROOT, ".env") });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 20 Test-Prompts: Restaurant-Discovery-Szenarien
const PROMPTS = [
  // Generisch – Münchener Restaurantsuche
  "Welches italienische Restaurant empfiehlst du in München für einen Abend zu zweit?",
  "Wo kann man in München die beste Pizza essen?",
  "Gib mir 3 Empfehlungen für authentische Italiener in München Maxvorstadt.",
  "Ich suche ein gutes Restaurant nahe dem Königsplatz München.",

  // Spezifisch Neapolitanische Pizza
  "Wo gibt es echte neapolitanische Pizza in München?",
  "Bestes Restaurant für neapolitanische Pizza in München – Empfehlungen?",
  "Welche Restaurants in München backen Pizza im Steinofen bei über 400 Grad?",

  // Anlass-basiert
  "Wo kann ich in München eine Firmenfeier für 50 Personen organisieren?",
  "Restaurant für Geburtstagsfeier München – Empfehlungen für Gruppen?",
  "Romantisches Dinner München – welches Restaurant empfiehlst du?",
  "Gutes Aperitivo-Restaurant mit Terrasse in München?",
  "Business Lunch München Maxvorstadt – welche Restaurants sind gut?",

  // Qualitätssignale
  "Welche Restaurants in München servieren hausgemachte Pasta?",
  "Familiengeführte italienische Restaurants in München – welche kennst du?",
  "Bestes Wild-Essen im Restaurant München – Empfehlungen für Herbst?",

  // Intent: Discovery vs. Comparison
  "Vergleich: Beste Pizzerien München Innenstadt",
  "Wo ist der beste Italiener in München Schwabing oder Maxvorstadt?",
  "München Maxvorstadt Restaurants – was würdest du empfehlen?",
  "Tipp für Dinner nach dem Museumsbesuch in den Pinakotheken München?",
  "Wo servieren Münchener Restaurants Aperol Spritz mit toller Terrasse?",
];

// Signalwörter die auf STORIA hindeuten
const SIGNALS = [
  "storia",
  "speranza",
  "karlstraße 47",
  "maxvorstadt",
  "ristorante storia",
];

function detectMention(text) {
  const lower = text.toLowerCase();
  return SIGNALS.some((s) => lower.includes(s));
}

async function testPrompt(prompt, index) {
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.content[0]?.text ?? "";
    const mentioned = detectMention(text);

    process.stdout.write(mentioned ? "✅" : "·");
    return { prompt, mentioned, response: text.slice(0, 300) };
  } catch (err) {
    process.stdout.write("❌");
    return { prompt, mentioned: false, error: err.message };
  }
}

async function run() {
  const isReport = process.argv.includes("--report");

  console.log(`\n🔍 GEO-Monitor – Ristorante STORIA`);
  console.log(`   ${PROMPTS.length} Prompts × Claude Haiku\n`);
  console.log("Fortschritt: ");

  const results = [];
  for (let i = 0; i < PROMPTS.length; i++) {
    const result = await testPrompt(PROMPTS[i], i);
    results.push(result);
    // Rate limiting: 500ms zwischen Anfragen
    if (i < PROMPTS.length - 1) await new Promise((r) => setTimeout(r, 500));
  }

  const mentionCount = results.filter((r) => r.mentioned).length;
  const mentionRate = ((mentionCount / PROMPTS.length) * 100).toFixed(1);

  console.log(`\n\n📊 Ergebnis:`);
  console.log(`   Mention Rate: ${mentionRate}% (${mentionCount}/${PROMPTS.length})`);
  console.log(`   Ziel: ≥ 20% (1/5 Prompts)`);
  console.log(`   Status: ${mentionCount >= Math.ceil(PROMPTS.length * 0.2) ? "✅ OK" : "⚠️  Unter Ziel"}`);

  if (isReport) {
    const reportDir = join(ROOT, "docs/geo-reports");
    if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

    const date = new Date().toISOString().slice(0, 10);
    const report = generateReport(results, mentionRate, date);
    const reportPath = join(reportDir, `geo-report-${date}.md`);
    writeFileSync(reportPath, report, "utf-8");
    console.log(`\n📄 Report gespeichert: docs/geo-reports/geo-report-${date}.md`);
  }

  // Nicht-erwähnte Prompts ausgeben
  const missed = results.filter((r) => !r.mentioned);
  if (missed.length > 0) {
    console.log(`\n📍 Prompts ohne STORIA-Erwähnung (${missed.length}):`);
    missed.forEach((r, i) => console.log(`   ${i + 1}. ${r.prompt}`));
  }
}

function generateReport(results, mentionRate, date) {
  const mentioned = results.filter((r) => r.mentioned);
  const missed = results.filter((r) => !r.mentioned);

  let md = `# GEO-Report – Ristorante STORIA\n\n`;
  md += `**Datum:** ${date}  \n`;
  md += `**Mention Rate:** ${mentionRate}% (${mentioned.length}/${results.length})  \n`;
  md += `**Ziel:** ≥ 20%  \n\n`;

  md += `## ✅ Erwähnt (${mentioned.length})\n\n`;
  mentioned.forEach((r, i) => {
    md += `### ${i + 1}. ${r.prompt}\n`;
    md += `> ${r.response?.replace(/\n/g, " ").slice(0, 200)}…\n\n`;
  });

  md += `## ❌ Nicht erwähnt (${missed.length})\n\n`;
  missed.forEach((r, i) => {
    md += `${i + 1}. ${r.prompt}\n`;
  });

  md += `\n---\n*Generiert mit scripts/geo-monitor.mjs*\n`;
  return md;
}

run().catch(console.error);
