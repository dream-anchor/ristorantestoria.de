import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const MAPPING = [
  // FOOD
  { f: "calamari-gegrillt-rucola-cherrytomaten-vorspeise-meeresfruechte-storia-muenchen.webp",  s: "allyear", t: ["antipasti"] },
  { f: "pizza-margherita-mozzarella-basilikum-steinofen-pizzabaecker-storia-muenchen.webp",      s: "allyear", t: ["pizza", "handwerk", "team"] },
  { f: "ravioli-tomatensauce-pasta-fatta-in-casa-handarbeit-kueche-storia-muenchen.webp",        s: "allyear", t: ["pasta", "handwerk"] },
  { f: "tiramisu-dessert-weisseschokolade-segel-kumquat-platting-storia-muenchen.webp",          s: "allyear", t: ["dessert"] },
  { f: "business-lunch-tisch-carbonara-ossobuco-gemeinsam-essen-storia-muenchen.webp",           s: "allyear", t: ["lunch", "pasta", "innenraum"] },
  { f: "wild-rehruecken-blaubeeren-rotweinsauce-gemuese-hauptgang-feinschmecker-storia-muenchen.webp", s: "autumn", t: ["dinner", "wein"] },
  // GETRÄNKE / BAR
  { f: "bar-aperitivo-aperolspritz-abendstimmung-marmorwand-storia-muenchen.webp",               s: "allyear", t: ["bar", "aperitivo", "innenraum"] },
  { f: "cocktails-mango-bellini-erdbeer-mojito-bar-storia-muenchen.webp",                        s: "allyear", t: ["aperitivo", "bar"] },
  { f: "weinservice-sommelier-magnum-flasche-rotwein-tischservice-storia-muenchen.webp",          s: "allyear", t: ["wein", "dinner", "innenraum"] },
  // LOCATION
  { f: "storia-aussenansicht-worle-gebaeude-koenigsplatz-blauer-himmel-muenchen.webp",           s: "allyear", t: ["fassade", "terrasse"] },
  { f: "terrasse-gaeste-kellner-service-fruehlingstag-koenigsplatz-storia-muenchen.webp",        s: "spring",  t: ["terrasse", "gaeste", "team"] },
  { f: "aussenterrasse-abendevent-heizpilze-luftballons-gaeste-storia-muenchen.webp",            s: "summer",  t: ["terrasse", "gaeste", "event"] },
  { f: "business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp",          s: "winter",  t: ["lunch", "innenraum"] },
  { f: "business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp",    s: "winter",  t: ["lunch", "innenraum"] },
  // EVENTS
  { f: "firmenfeier-langtafel-weinregal-kerzenlicht-eventlocation-storia-muenchen.webp",         s: "allyear", t: ["firmenfeier", "event", "wein"] },
  { f: "weihnachtsfeier-anstossen-tannengruen-geschenke-firmenevent-abendstimmung-storia-muenchen.webp", s: "winter", t: ["firmenfeier", "event", "wein"] },
  { f: "geburtstag-dinner-champagner-lammkarree-festtafel-luftballons-storia-muenchen.webp",     s: "allyear", t: ["geburtstag", "dinner", "event"] },
  { f: "sommerfest-aussen-aperitivo-empfang-blumendekor-servicekraft-storia-muenchen.webp",      s: "summer",  t: ["event", "terrasse", "aperitivo"] },
  { f: "geburtstag-luftballons-partyhuete-tischdeko-tageslicht-storia-muenchen.webp",            s: "allyear", t: ["geburtstag", "event", "innenraum"] },
  { f: "romantisches-dinner-rotwein-rote-rosen-kerzenlicht-zweisamkeit-storia-muenchen.webp",    s: "allyear", t: ["romantic", "dinner", "wein"] },
  // TEAM
  { f: "domenico-speranza-gastgeber-portrait-espressobar-segafredo-storia-muenchen.webp",        s: "allyear", t: ["team", "cilento", "tradition"] },
  { f: "nicola-speranza-kuechenchef-portrait-kochmuetze-schwarzweiss-storia-muenchen.webp",      s: "allyear", t: ["team", "handwerk"] },
];

const seasonEmoji: Record<string,string> = { allyear:"🔵", spring:"🌸", summer:"☀️", autumn:"🍂", winter:"❄️" };

const lines = MAPPING.map((m, i) =>
  `${i+1}. \`${m.f.replace("-storia-muenchen.webp","")}\`\n   → season: ${seasonEmoji[m.s]} \`${m.s}\` | tags: \`[${m.t.join(", ")}]\``
).join("\n\n");

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "🏷️ Tag-Mapping Migration 016 — Review vor GO", emoji: true } },
  { type: "section", text: { type: "mrkdwn", text: `*22 Bilder — vorgeschlagene Tags + Saison.*\nBitte prüfen — dann GO 016b.\n\n${lines}` } },
], true);

console.log("✅ Tag-Mapping gesendet.");
