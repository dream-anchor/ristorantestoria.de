import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const FINAL = [
  { id: 3,  v: "A", body: "Italienisches Frühstück in der Maxvorstadt: Cornetti, Caffè, frischer Saft ab 9 Uhr — seit 2015. ☕ STORIA Karlstraße, 5 Minuten vom Königsplatz, Mo–Fr." },
  { id: 4,  v: "A✏️", body: "Tisch sichern in der Maxvorstadt — STORIA Karlstraße, bis 180 Gäste. Überdachte Terrasse, wetterfest, Raucher willkommen. Innenraum für Feiern und Events." },
  { id: 6,  v: "B", body: "Handgemachte Pasta trifft Trüffel-Saison — im STORIA Maxvorstadt Tagliolini mit schwarzem Trüffel, frisch gehobelt am Tisch. Im 4-Gänge-Menü Mare oder à la carte. Karlstraße." },
  { id: 7,  v: "A", body: "4-Gänge-Menü Mare im STORIA Maxvorstadt: handgemachte Pasta, Hummersalat, Saltimbocca vom Seeteufel, Schokoladen-Soufflé. 78 € / 108 € mit Weinbegleitung. Karlstraße." },
  { id: 8,  v: "B", body: "Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße eignet sich für Firmenfeiern, Geburtstage und Events. Überdachte Terrasse, Raucher willkommen." },
  { id: 9,  v: "B", body: "Handgemachte Pasta und Trüffel in der Adventszeit — das STORIA Karlstraße ist die ruhige Pause zwischen Christkindlmarkt und Büro. Maxvorstadt, seit 2015. 🕯️" },
  { id: 10, v: "B", body: "48h Teigruhe, 400°C Steinofen — Mimmos Pizza Napoletana im STORIA Maxvorstadt. Wer sie noch nicht probiert hat: Mittwochabend ist meist ruhiger. Karlstraße." },
  { id: 11, v: "A", body: "Überdachte Terrasse in der Maxvorstadt — 100 überdachte Plätze, wetterfest, Raucher willkommen. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a." },
  { id: 13, v: "B", body: "Seit 2015 kuratiert Nicola die Weinkarte im STORIA Maxvorstadt — über 60 Positionen, von Vermentino bis Amarone. Weinbar-Atmosphäre, Karlstraße 47a. 🥂" },
];

const lines = FINAL.map(f => `✅ ID ${f.id} [${f.v}]\n> ${f.body}`).join("\n\n");

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "✅ Migration 009 — Finale Texte (wird jetzt angewendet)", emoji: true } },
  { type: "section", text: { type: "mrkdwn", text: `*9 Posts werden aktualisiert. Originals in body_legacy gesichert.*\n\n${lines}` } },
], true);
console.log("✅ 009 Confirmation gesendet.");
