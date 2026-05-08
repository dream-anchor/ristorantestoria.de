/**
 * GBP Routine — Bilder in gbp_images registrieren
 * Usage: npx tsx gbp-routine/seed-images.ts
 * Env: DATABASE_URL
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const BASE_URL = "https://ristorantestoria.de/gbp-images";

const IMAGES: { filename: string; tags: string[]; season: string }[] = [
  { filename: "aperitivo-muenchen-italienische-bar-storia.webp", tags: ["aperitivo", "bar", "abend"], season: "allyear" },
  { filename: "aussen.webp", tags: ["terrasse", "tageslicht", "keine-personen"], season: "allyear" },
  { filename: "business-lunch-atmosphere.webp", tags: ["innenraum", "mittag", "tageslicht"], season: "allyear" },
  { filename: "business-lunch-food.webp", tags: ["pasta", "mittag", "tageslicht"], season: "allyear" },
  { filename: "business-lunch-mittagessen-maxvorstadt-muenchen.webp", tags: ["pasta", "mittag", "innenraum"], season: "allyear" },
  { filename: "chefs.webp", tags: ["kueche", "keine-personen"], season: "allyear" },
  { filename: "cocktails.webp", tags: ["bar", "aperitivo", "abend"], season: "allyear" },
  { filename: "domenico-speranza.webp", tags: ["kueche"], season: "allyear" },
  { filename: "firmenfeier-event.webp", tags: ["innenraum", "abend"], season: "allyear" },
  { filename: "firmenfeier-eventlocation-storia-muenchen.webp", tags: ["innenraum", "abend"], season: "allyear" },
  { filename: "gaeste-terrasse-italiener-maxvorstadt-muenchen.webp", tags: ["terrasse", "sommer", "tageslicht"], season: "summer" },
  { filename: "geburtstagsfeier-event.webp", tags: ["innenraum", "abend"], season: "allyear" },
  { filename: "geburtstagsfeier-restaurant-storia-muenchen.webp", tags: ["innenraum", "abend"], season: "allyear" },
  { filename: "haus-aussen-2.webp", tags: ["terrasse", "tageslicht", "keine-personen"], season: "allyear" },
  { filename: "italiener-koenigsplatz-terrasse-storia-muenchen.webp", tags: ["terrasse", "tageslicht", "sommer"], season: "summer" },
  { filename: "meeresfruchte.webp", tags: ["fisch", "keine-personen"], season: "allyear" },
  { filename: "menschen-aussen.webp", tags: ["terrasse", "sommer", "tageslicht"], season: "summer" },
  { filename: "mittagsmenue-pasta-lunch-storia-muenchen.webp", tags: ["pasta", "mittag", "innenraum"], season: "allyear" },
  { filename: "neapolitan-pizza-hero.webp", tags: ["pizza", "keine-personen"], season: "allyear" },
  { filename: "nicola-speranza.webp", tags: ["innenraum", "abend"], season: "allyear" },
  { filename: "pasta.webp", tags: ["pasta", "keine-personen"], season: "allyear" },
  { filename: "ravioli-lunch.webp", tags: ["pasta", "mittag"], season: "allyear" },
  { filename: "ravioli.webp", tags: ["pasta", "keine-personen"], season: "allyear" },
  { filename: "romantisches-dinner-kerzenlicht-storia-muenchen.webp", tags: ["innenraum", "abend", "warm"], season: "allyear" },
  { filename: "silvester-dinner-gala-storia-muenchen.webp", tags: ["innenraum", "abend"], season: "winter" },
  { filename: "sommerfest-event.webp", tags: ["terrasse", "sommer"], season: "summer" },
  { filename: "tiramisu.webp", tags: ["dolci", "keine-personen"], season: "allyear" },
  { filename: "weihnachtsfeier-event.webp", tags: ["innenraum", "abend"], season: "winter" },
  { filename: "weihnachtsfeier-italiener-storia-muenchen.webp", tags: ["innenraum", "abend"], season: "winter" },
  { filename: "weinservice.webp", tags: ["bar", "abend"], season: "allyear" },
  { filename: "wild-venison-hero.webp", tags: ["fleisch", "keine-personen"], season: "autumn" },
];

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require", connect_timeout: 30 });

async function main() {
  console.log(`🖼️  Registriere ${IMAGES.length} Bilder in gbp_images...\n`);

  for (const img of IMAGES) {
    const url = `${BASE_URL}/${img.filename}`;
    await sql`
      INSERT INTO gbp_images (filename, storage_url, tags, season)
      VALUES (${img.filename}, ${url}, ${img.tags}, ${img.season})
      ON CONFLICT (filename) DO UPDATE
        SET storage_url = ${url}, tags = ${img.tags}, season = ${img.season}
    `;
    console.log(`✓ ${img.filename}`);
  }

  const count = await sql`SELECT COUNT(*) as n FROM gbp_images`;
  console.log(`\n✅ ${count[0].n} Bilder in DB.`);
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
