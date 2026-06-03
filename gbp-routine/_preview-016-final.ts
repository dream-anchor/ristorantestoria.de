import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const s: Record<string,string> = { allyear:"🔵 allyear", spring:"🌸 spring", summer:"☀️ summer", autumn:"🍂 autumn", winter:"❄️ winter" };

const rows = [
  ["calamari-gegrillt-rucola…",                "antipasti, dinner",          "allyear",  "✏️"],
  ["pizza-margherita…pizzabaecker",             "pizza, handwerk, team",      "allyear",  ""],
  ["ravioli-tomatensauce…handarbeit",           "pasta, handwerk",            "allyear",  ""],
  ["tiramisu-dessert…platting",                 "dessert",                    "allyear",  ""],
  ["business-lunch-tisch-carbonara-ossobuco",   "lunch, pasta, innenraum",    "allyear",  ""],
  ["wild-rehruecken…feinschmecker",             "dinner, wein",               "autumn",   ""],
  ["bar-aperitivo-aperolspritz…marmorwand",     "bar, aperitivo, innenraum",  "allyear",  ""],
  ["cocktails-mango-bellini…",                  "aperitivo, bar",             "allyear",  ""],
  ["weinservice-sommelier-magnum…",             "wein, dinner, innenraum",    "allyear",  ""],
  ["storia-aussenansicht-worle-gebaeude",       "fassade",                    "allyear",  "✏️"],
  ["terrasse-gaeste-kellner…fruehlingstag",     "terrasse, gaeste, team",     "spring",   ""],
  ["aussenterrasse-abendevent-heizpilze",       "terrasse, gaeste, event",    "summer",   ""],
  ["business-lunch-volle-stube-weihnachtsdeko", "lunch, innenraum",           "allyear",  "✏️"],
  ["business-lunch-restaurantuebersicht-weihn", "lunch, innenraum",           "allyear",  "✏️"],
  ["firmenfeier-langtafel-weinregal",           "firmenfeier, event, dinner", "allyear",  "✏️"],
  ["weihnachtsfeier-anstossen-tannengruen",     "firmenfeier, event, wein",   "winter",   ""],
  ["geburtstag-dinner-champagner-lammkarree",   "geburtstag, dinner, event",  "allyear",  ""],
  ["sommerfest-aussen-aperitivo-empfang",       "event, terrasse, aperitivo", "summer",   ""],
  ["geburtstag-luftballons-partyhuete",         "geburtstag, event, innenraum","allyear", ""],
  ["romantisches-dinner-rotwein-rote-rosen",    "romantic, dinner, wein",     "allyear",  ""],
  ["domenico-speranza-gastgeber-portrait",      "team, tradition",            "allyear",  "✏️"],
  ["nicola-speranza-kuechenchef-portrait",      "team, handwerk",             "allyear",  ""],
];

const lines = rows.map(([f, t, season, mark]) =>
  `${mark ? mark+" " : "✅ "}\`${f}\`\n   tags: \`[${t}]\` · ${s[season as string]}`
).join("\n\n");

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "✅ Migration 016 — 22 Bilder final (6×✏️ korrigiert) — GO 016b?", emoji: true } },
  { type: "section", text: { type: "mrkdwn", text: `*✏️ = Korrektur eingearbeitet.*\n\n${lines}` } },
  { type: "divider" },
  { type: "section", text: { type: "mrkdwn", text: "Hinweis: Tags `cilento` + `mamma` haben 0 Bilder → Asset-Backlog.\n\n*GO 016b* → Migration anwenden + Phase 4 Re-Run + Live." } },
], true);

console.log("✅ M016-Preview gesendet.");
