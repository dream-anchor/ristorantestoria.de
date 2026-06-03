import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

await sql`UPDATE gbp_images SET is_active = FALSE WHERE is_active = TRUE`;

const IMAGES = [
  { f: "calamari-gegrillt-rucola-cherrytomaten-vorspeise-meeresfruechte-storia-muenchen.webp", t: ["antipasti","dinner"], s: "allyear" },
  { f: "pizza-margherita-mozzarella-basilikum-steinofen-pizzabaecker-storia-muenchen.webp",     t: ["pizza","handwerk","team"], s: "allyear" },
  { f: "ravioli-tomatensauce-pasta-fatta-in-casa-handarbeit-kueche-storia-muenchen.webp",       t: ["pasta","handwerk"], s: "allyear" },
  { f: "tiramisu-dessert-weisseschokolade-segel-kumquat-platting-storia-muenchen.webp",         t: ["dessert"], s: "allyear" },
  { f: "business-lunch-tisch-carbonara-ossobuco-gemeinsam-essen-storia-muenchen.webp",          t: ["lunch","pasta","innenraum"], s: "allyear" },
  { f: "wild-rehruecken-blaubeeren-rotweinsauce-gemuese-hauptgang-feinschmecker-storia-muenchen.webp", t: ["dinner","wein"], s: "autumn" },
  { f: "bar-aperitivo-aperolspritz-abendstimmung-marmorwand-storia-muenchen.webp",              t: ["bar","aperitivo","innenraum"], s: "allyear" },
  { f: "cocktails-mango-bellini-erdbeer-mojito-bar-storia-muenchen.webp",                       t: ["aperitivo","bar"], s: "allyear" },
  { f: "weinservice-sommelier-magnum-flasche-rotwein-tischservice-storia-muenchen.webp",        t: ["wein","dinner","innenraum"], s: "allyear" },
  { f: "storia-aussenansicht-worle-gebaeude-koenigsplatz-blauer-himmel-muenchen.webp",          t: ["fassade"], s: "allyear" },
  { f: "terrasse-gaeste-kellner-service-fruehlingstag-koenigsplatz-storia-muenchen.webp",       t: ["terrasse","gaeste","team"], s: "spring" },
  { f: "aussenterrasse-abendevent-heizpilze-luftballons-gaeste-storia-muenchen.webp",           t: ["terrasse","gaeste","event"], s: "summer" },
  { f: "business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp",         t: ["lunch","innenraum"], s: "allyear" },
  { f: "business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp",   t: ["lunch","innenraum"], s: "allyear" },
  { f: "firmenfeier-langtafel-weinregal-kerzenlicht-eventlocation-storia-muenchen.webp",        t: ["firmenfeier","event","dinner"], s: "allyear" },
  { f: "weihnachtsfeier-anstossen-tannengruen-geschenke-firmenevent-abendstimmung-storia-muenchen.webp", t: ["firmenfeier","event","wein"], s: "winter" },
  { f: "geburtstag-dinner-champagner-lammkarree-festtafel-luftballons-storia-muenchen.webp",    t: ["geburtstag","dinner","event"], s: "allyear" },
  { f: "sommerfest-aussen-aperitivo-empfang-blumendekor-servicekraft-storia-muenchen.webp",     t: ["event","terrasse","aperitivo"], s: "summer" },
  { f: "geburtstag-luftballons-partyhuete-tischdeko-tageslicht-storia-muenchen.webp",           t: ["geburtstag","event","innenraum"], s: "allyear" },
  { f: "romantisches-dinner-rotwein-rote-rosen-kerzenlicht-zweisamkeit-storia-muenchen.webp",   t: ["romantic","dinner","wein"], s: "allyear" },
  { f: "domenico-speranza-gastgeber-portrait-espressobar-segafredo-storia-muenchen.webp",       t: ["team","tradition"], s: "allyear" },
  { f: "nicola-speranza-kuechenchef-portrait-kochmuetze-schwarzweiss-storia-muenchen.webp",     t: ["team","handwerk"], s: "allyear" },
];

for (const img of IMAGES) {
  const url = `https://ristorantestoria.de/gbp-images/${img.f}`;
  await sql`INSERT INTO gbp_images (filename, storage_url, tags, season, is_active)
    VALUES (${img.f}, ${url}, ${img.t}, ${img.s}, TRUE)`;
}

const active = await sql`SELECT COUNT(*) as n FROM gbp_images WHERE is_active = TRUE`;
console.log(`Migration 016 applied — ${active[0].n} aktive Bilder`);

// Post-Tag-Mismatch-Audit
const posts = await sql`SELECT id, pool, theme_slot, image_tags FROM gbp_posts WHERE image_tags IS NOT NULL ORDER BY id`;
const images = await sql`SELECT tags FROM gbp_images WHERE is_active = TRUE`;
const allActiveTags = new Set(images.flatMap(i => i.tags as string[]));

console.log("\nPost-Tag-Mismatch-Audit:");
const mismatches: typeof posts = [];
for (const p of posts) {
  const tags = p.image_tags as string[];
  const hasMatch = tags.some(t => allActiveTags.has(t));
  if (!hasMatch) {
    mismatches.push(p);
    console.log(`  ❌ ID${p.id} [${p.pool}/${p.theme_slot}] tags:[${tags}] → KEIN Bild-Match`);
  } else {
    console.log(`  ✅ ID${p.id} [${p.pool}/${p.theme_slot}] tags:[${tags}]`);
  }
}
console.log(`\nMismatches: ${mismatches.length}`);

await sql.end();
