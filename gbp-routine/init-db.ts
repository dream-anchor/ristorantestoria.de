/**
 * GBP Routine — DB-Schema anlegen und Grunddaten einfügen
 * Usage: npx tsx gbp-routine/init-db.ts
 * Env: DATABASE_URL
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function main() {
  console.log("🔧 GBP-Routine DB-Init...\n");

  // Schema
  await sql`
    CREATE TABLE IF NOT EXISTS gbp_posts (
      id SERIAL PRIMARY KEY,
      pool TEXT NOT NULL CHECK (pool IN ('A', 'B', 'C')),
      title TEXT,
      body TEXT NOT NULL,
      cta_type TEXT CHECK (cta_type IN ('reserve', 'call', 'learn_more', 'website')),
      cta_url TEXT,
      image_tags TEXT[],
      season TEXT DEFAULT 'allyear',
      last_used TIMESTAMPTZ,
      use_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ gbp_posts");

  await sql`
    CREATE TABLE IF NOT EXISTS gbp_images (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      storage_url TEXT NOT NULL,
      tags TEXT[],
      season TEXT DEFAULT 'allyear',
      last_used TIMESTAMPTZ,
      use_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ gbp_images");

  await sql`
    CREATE TABLE IF NOT EXISTS gbp_theme_clusters (
      id SERIAL PRIMARY KEY,
      cluster_id TEXT UNIQUE NOT NULL,
      tone_hint TEXT,
      examples TEXT[],
      last_used TIMESTAMPTZ
    )
  `;
  console.log("✓ gbp_theme_clusters");

  await sql`
    CREATE TABLE IF NOT EXISTS gbp_post_log (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      pool TEXT,
      post_id INTEGER,
      image_id INTEGER,
      theme_cluster_id TEXT,
      generated_body TEXT,
      gbp_post_id TEXT,
      status TEXT CHECK (status IN ('gepostet', 'failed', 'dry_run')),
      error_log TEXT
    )
  `;
  console.log("✓ gbp_post_log");

  await sql`
    CREATE TABLE IF NOT EXISTS gbp_schedule (
      id SERIAL PRIMARY KEY,
      weekday TEXT CHECK (weekday IN ('mon', 'wed', 'fri')),
      slot_time TEXT,
      pool_priority TEXT[],
      is_active BOOLEAN DEFAULT TRUE,
      is_dry_run BOOLEAN DEFAULT TRUE
    )
  `;
  console.log("✓ gbp_schedule");

  // Schedule-Einträge (nur wenn leer)
  const existing = await sql`SELECT COUNT(*) as n FROM gbp_schedule`;
  if (Number(existing[0].n) === 0) {
    await sql`
      INSERT INTO gbp_schedule (weekday, slot_time, pool_priority) VALUES
      ('mon', '09:00', ARRAY['A', 'B']),
      ('wed', '09:30', ARRAY['C', 'B']),
      ('fri', '15:00', ARRAY['A', 'B'])
    `;
    console.log("✓ gbp_schedule — 3 Einträge");
  } else {
    console.log("  gbp_schedule bereits befüllt, übersprungen");
  }

  // Pool A — Recurring Posts
  const postsExisting = await sql`SELECT COUNT(*) as n FROM gbp_posts WHERE pool = 'A'`;
  if (Number(postsExisting[0].n) === 0) {
    await sql`
      INSERT INTO gbp_posts (pool, title, body, cta_type, cta_url, image_tags, season) VALUES
      ('A', 'Mittagsmenü Wochenstart',
       'Diese Woche im Mittagsmenü: wechselnde Pasta, Antipasti und ein Hauptgang aus dem Cilento. 14,90 €, Mo–Fr 11:30–14:30 in der Karlstraße. Tisch reservieren unter +49 89 51519696.',
       'call', 'tel:+498951519696', ARRAY['pasta','mittag','innenraum'], 'allyear'),
      ('A', 'Late Night Aperitivo',
       'Aperitivo ab 19:00 — italienische Weine, Aperol-Klassiker, Antipasti. STORIA in der Karlstraße, Tram direkt vor der Tür.',
       'reserve', 'https://ristorantestoria.de/reservierung', ARRAY['bar','aperitivo','abend'], 'allyear'),
      ('A', 'Italienisches Frühstück',
       'Cornetti, Caffè, frischer Saft — Mo–Fr ab 9 Uhr. STORIA in der Maxvorstadt, fünf Minuten vom Königsplatz.',
       'learn_more', 'https://ristorantestoria.de/speisekarte', ARRAY['innenraum','morgens','tageslicht'], 'allyear'),
      ('A', 'Wochenend-Reservierung',
       'Tisch fürs Wochenende sichern: +49 89 51519696. Auch unsere überdachte Terrasse ist reservierbar.',
       'call', 'tel:+498951519696', ARRAY['terrasse','innenraum','abend'], 'allyear')
    `;
    console.log("✓ gbp_posts Pool A — 4 Einträge");
  }

  // Pool B — Saisonal
  const poolBExisting = await sql`SELECT COUNT(*) as n FROM gbp_posts WHERE pool = 'B'`;
  if (Number(poolBExisting[0].n) === 0) {
    await sql`
      INSERT INTO gbp_posts (pool, body, cta_type, cta_url, image_tags, season) VALUES
      ('B', 'Unsere überdachte Terrasse im Innenhof ist offen — die ruhigsten Plätze für ein langes Abendessen in der Maxvorstadt.',
       'reserve', 'https://ristorantestoria.de/reservierung', ARRAY['terrasse','sommer','abend'], 'summer'),
      ('B', 'Trüffel-Saison: Tagliolini mit schwarzem Trüffel — frisch gehobelt am Tisch. Im 4-Gänge-Menü Mare oder à la carte.',
       'reserve', 'https://ristorantestoria.de/reservierung', ARRAY['pasta','abend','innenraum'], 'autumn'),
      ('B', '4-Gänge-Menü Mare: Hummersalat, Tagliolini mit Trüffel, Saltimbocca vom Seeteufel, Schokoladen-Soufflé. 78 € / 108 € mit Weinbegleitung.',
       'reserve', 'https://ristorantestoria.de/reservierung', ARRAY['fisch','abend','innenraum'], 'allyear'),
      ('B', 'Firmenfeier in München? Im STORIA passen 6 bis 300 Personen — von intimer Runde bis großem Event. Karlstraße, Maxvorstadt.',
       'learn_more', 'https://ristorantestoria.de/firmenfeier-muenchen', ARRAY['innenraum','abend'], 'allyear'),
      ('B', 'Adventszeit im STORIA: Trüffel-Pasta, italienische Weine, ruhiger Innenhof — die Pause zwischen Christkindlmarkt und Büro.',
       'reserve', 'https://ristorantestoria.de/reservierung', ARRAY['pasta','abend','innenraum'], 'winter'),
      ('B', 'Pizza Napoletana: 48–72 Stunden geführter Teig, Steinofen bei 400°C. Wer Mimmos Pizza noch nicht probiert hat — Mittwochabend ist meist ruhiger.',
       'reserve', 'https://ristorantestoria.de/reservierung', ARRAY['pizza','abend','innenraum'], 'allyear')
    `;
    console.log("✓ gbp_posts Pool B — 6 Einträge");
  }

  // Theme Clusters für Pool C
  const clustersExisting = await sql`SELECT COUNT(*) as n FROM gbp_theme_clusters`;
  if (Number(clustersExisting[0].n) === 0) {
    await sql`
      INSERT INTO gbp_theme_clusters (cluster_id, tone_hint, examples) VALUES
      ('mamma_anekdoten', 'warm, familiär, beiläufig',
       ARRAY['Mamma hat heute frische Burrata aus Apulien bekommen',
             'Mamma kocht heute ihre Pasta nach einem Rezept aus Rofrano',
             'Heute zeigt Mamma den Lehrlingen, wie man Strozzapreti formt']),
      ('mimmo_kueche', 'fachlich, konkret, leicht stolz',
       ARRAY['Heute Tagliolini-Test mit neuem Trüffel-Lieferanten',
             'Mimmo hat eine neue Pizza-Variante in der Probe — Cilento-Salami und Burrata']),
      ('cilento_hintergrund', 'informativ, kulturell, ohne Dozent-Ton',
       ARRAY['Das Pasta-Rezept von heute kommt aus Rofrano, einem Dorf 30 km südlich von Salerno',
             'Im Cilento isst man die Pasta dünner ausgerollt als in Neapel']),
      ('karlstrasse_anker', 'lokal, hilfsbereit, kein Anbiedern',
       ARRAY['Pinakotheken-Besucher: nach 5 Min Fußweg sind Sie bei uns',
             'TU-Mensa zu voll? STORIA ist 8 Min entfernt']),
      ('personal_story', 'persönlich, anekdotisch',
       ARRAY['Nicola erklärt heute den Unterschied zwischen Gavi und Vermentino',
             'Mamma Speranza hat heute eine Sondervorstellung: Cilento-Brotsalat'])
    `;
    console.log("✓ gbp_theme_clusters — 5 Cluster");
  }

  await sql.end();
  console.log("\n✅ DB-Init abgeschlossen.");
}

main().catch((e) => { console.error(e); process.exit(1); });
