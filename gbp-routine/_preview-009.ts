/**
 * Migration 009 Preview — USP-Rewrites für 9 Posts ohne exakte USP-Phrase.
 * Je 2 Varianten pro Post: A (minimal) / B (richer).
 * Antoine wählt A / B / "neu schreiben mit Hint X".
 */
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks, slackText } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const PREVIEWS = [
  {
    id: 3, pool: "A", slot: "lunch",
    current: "Italienisches Frühstück in der Maxvorstadt: Cornetti, Caffè, frischer Saft ab 9 Uhr. ☕ STORIA in der Karlstraße — 5 Minuten vom Königsplatz, Mo–Fr.",
    usp_missing: "keine exakte USP-Phrase",
    A: "Italienisches Frühstück in der Maxvorstadt: Cornetti, Caffè, frischer Saft ab 9 Uhr — seit 2015. ☕ STORIA Karlstraße, 5 Minuten vom Königsplatz, Mo–Fr.",
    B: "Seit 2015 startet das STORIA den Tag mit italienischem Frühstück: Cornetti, Caffè, frischer Saft ab 9 Uhr. ☕ Karlstraße, Maxvorstadt — 5 Minuten vom Königsplatz, Mo–Fr.",
  },
  {
    id: 4, pool: "A", slot: "lifestyle",
    current: "Tisch sichern in der Maxvorstadt — STORIA Karlstraße für bis zu 180 Gäste. Überdachte Terrasse (wetterfest, Raucher ok), Innenraum, Events. Reservierung: +49 89 51519696.",
    usp_missing: '"bis zu 180 Gäste" ≠ "bis 180 Gäste" | "Raucher ok" ≠ "Raucher willkommen" | Tel im Body (verboten)',
    A: "Tisch sichern in der Maxvorstadt — STORIA Karlstraße, bis 180 Gäste. Überdachte Terrasse, wetterfest, Raucher willkommen. Innenraum, Events, Feiern.",
    B: "Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße bietet überdachte Terrasse, Raucher willkommen — für Dinner, Feiern und Events. Einfach reservieren.",
  },
  {
    id: 6, pool: "B", slot: "lifestyle",
    current: "Trüffel-Saison: Tagliolini mit schwarzem Trüffel — frisch gehobelt am Tisch. Im 4-Gänge-Menü Mare oder à la carte.",
    usp_missing: "keine USP-Phrase, kein Geo-Anker, nur 115 Zeichen (unter Min)",
    A: "Trüffel-Saison im STORIA Maxvorstadt: handgemachte Pasta mit schwarzem Trüffel — frisch gehobelt am Tisch. Im 4-Gänge-Menü Mare oder à la carte. Karlstraße, seit 2015.",
    B: "Handgemachte Pasta trifft Trüffel-Saison — im STORIA Maxvorstadt Tagliolini mit schwarzem Trüffel, frisch gehobelt am Tisch. Im 4-Gänge-Menü Mare oder à la carte. Karlstraße.",
  },
  {
    id: 7, pool: "B", slot: "lifestyle",
    current: "4-Gänge-Menü Mare: Hummersalat, Tagliolini mit Trüffel, Saltimbocca vom Seeteufel, Schokoladen-Soufflé. 78 € / 108 € mit Weinbegleitung.",
    usp_missing: "keine USP-Phrase, kein Geo-Anker, nur 137 Zeichen (unter Min)",
    A: "4-Gänge-Menü Mare im STORIA Maxvorstadt: handgemachte Pasta, Hummersalat, Saltimbocca vom Seeteufel, Schokoladen-Soufflé. 78 € / 108 € mit Weinbegleitung. Karlstraße.",
    B: "Handgemachte Pasta, Fisch, Soufflé — das 4-Gänge-Menü Mare im STORIA Karlstraße: Hummersalat, Tagliolini, Saltimbocca vom Seeteufel. 78 € / 108 € mit Weinbegleitung. Maxvorstadt.",
  },
  {
    id: 8, pool: "B", slot: "event",
    current: "Firmenfeier in München? Im STORIA passen 6 bis 300 Personen — von intimer Runde bis großem Event. Karlstraße, Maxvorstadt.",
    usp_missing: "keine USP-Phrase, Kapazität 300 widerspricht Fakten (max 180 Gäste)",
    A: "Firmenfeier in München? Im STORIA Karlstraße passen bis 180 Gäste — von intimer Runde bis großem Event. Überdachte Terrasse, wetterfest. Maxvorstadt.",
    B: "Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße eignet sich für Firmenfeiern, Geburtstage und Events. Überdachte Terrasse, Raucher willkommen.",
  },
  {
    id: 9, pool: "B", slot: "event",
    current: "Adventszeit im STORIA: Trüffel-Pasta, italienische Weine, ruhiger Innenhof — die Pause zwischen Christkindlmarkt und Büro.",
    usp_missing: "keine USP-Phrase, kein Geo-Anker, nur 123 Zeichen (unter Min)",
    A: "Adventszeit im STORIA Maxvorstadt: handgemachte Pasta, Trüffel, italische Weine — die Pause zwischen Christkindlmarkt und Büro. Karlstraße, seit 2015.",
    B: "Handgemachte Pasta und Trüffel in der Adventszeit — das STORIA Karlstraße ist die ruhige Pause zwischen Christkindlmarkt und Büro. Maxvorstadt, seit 2015. 🕯️",
  },
  {
    id: 10, pool: "B", slot: "lifestyle",
    current: "Pizza Napoletana: 48–72 Stunden geführter Teig, Steinofen bei 400°C. Wer Mimmos Pizza noch nicht probiert hat — Mittwochabend ist meist ruhiger.",
    usp_missing: '"48–72 Stunden" ≠ "48h Teigruhe" | "Steinofen bei 400°C" ≠ "400°C Steinofen" | kein Geo',
    A: "Pizza Napoletana im STORIA Maxvorstadt: 48h Teigruhe, 400°C Steinofen. Wer Mimmos Pizza noch nicht probiert hat — Mittwochabend ist meist ruhiger. Karlstraße.",
    B: "48h Teigruhe, 400°C Steinofen — Mimmos Pizza Napoletana im STORIA Maxvorstadt. Wer sie noch nicht probiert hat: Mittwochabend ist meist ruhiger. Karlstraße.",
  },
  {
    id: 11, pool: "B", slot: "lifestyle",
    current: "Überdachte Terrasse in der Maxvorstadt — 100 Plätze, wetterfest, auch für Raucher. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a.",
    usp_missing: '"100 Plätze" ≠ "100 überdachte Plätze" | "für Raucher" ≠ "Raucher willkommen"',
    A: "Überdachte Terrasse in der Maxvorstadt — 100 überdachte Plätze, wetterfest, Raucher willkommen. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a.",
    B: "100 überdachte Plätze im STORIA Maxvorstadt — wetterfest, Raucher willkommen. ☀️ Aperitivo, Steinofenpizza oder Wein auf der Karlstraße: egal ob Sonne oder Maigewitter.",
  },
  {
    id: 13, pool: "B", slot: "lifestyle",
    current: "Über 60 Weine auf der Karte — von Vermentino bis Amarone. Weinbar-Atmosphäre im STORIA Karlstraße, Maxvorstadt. 🥂 Nicola berät euch gern.",
    usp_missing: "keine USP-Phrase (Geo ok, Länge ok) — Hook ok",
    A: "Weinbar München Maxvorstadt: über 60 Weine im STORIA Karlstraße — Vermentino bis Amarone, seit 2015. 🥂 Nicola berät euch gern, auch zum Essen.",
    B: "Seit 2015 kuratiert Nicola die Weinkarte im STORIA Maxvorstadt — über 60 Positionen, von Vermentino bis Amarone. Weinbar-Atmosphäre, Karlstraße 47a. 🥂",
  },
];

// Header
await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: "🔧 Migration 009 — USP-Rewrite Preview (warten auf Varianten-Wahl)", emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*9 Posts ohne exakte USP-Phrase.* Je 2 Varianten: A (minimal) / B (richer).\nAntoine wählt pro Post: *A* | *B* | *"neu mit Hint X"*\n\nKeine Auto-Apply — Migration 009 läuft erst nach explizitem GO 009.`,
    },
  },
  { type: "divider" },
], true);

// Eine Block-Gruppe pro Post
for (const p of PREVIEWS) {
  await slackBlocks([
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          `*ID ${p.id} [${p.pool}/${p.slot}]* — Problem: \`${p.usp_missing}\``,
          `> _Aktuell:_ ${p.current}`,
          `\n*A (minimal):*\n> ${p.A}`,
          `\n*B (richer):*\n> ${p.B}`,
        ].join("\n"),
      },
    },
    { type: "divider" },
  ], true);
}

await slackText("⏸ 009-Preview fertig. Bitte pro ID A / B / Hint angeben → dann GO 009.");
console.log("✅ Migration 009 Preview gesendet (9 Posts × 2 Varianten).");
