/**
 * Confirmation-Preview: 6 finale Posts (je 1 Bild, keine A/B-Auswahl mehr).
 * Wird gesendet BEVOR Migration 010+011 applied wird.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// Finale gewählte Posts (nach Antoine-Freigabe 2026-05-09)
const FINAL = [
  {
    label: "B/brand/1 [A] — Handwerk",
    migration: "010", pool: "B", theme_slot: "brand", season: "allyear",
    cta_type: "learn_more", image_tags: ["pasta", "handwerk"],
    body: "Handgemachte Pasta und Pizzen aus dem 400°C Steinofen — das STORIA in der Karlstraße steht für echtes Handwerk aus dem Cilento. Keine Convenience, keine Kompromisse. Maxvorstadt, seit 2015.",
  },
  {
    label: "B/brand/2 [B] — Familie & Cilento",
    migration: "010", pool: "B", theme_slot: "brand", season: "allyear",
    cta_type: "website", image_tags: ["team", "cilento"],
    body: "Von Rofrano nach München: Die Cucina del Cilento ist die Seele des STORIA Maxvorstadt. Domenico, Nicola und Familie Speranza stehen täglich in der Küche — Karlstraße 47a, seit 2015.",
  },
  {
    label: "B/lunch/1 [B] — Mittagsmenü",
    migration: "010", pool: "B", theme_slot: "lunch", season: "allyear",
    cta_type: "call", image_tags: ["pasta", "lunch"],
    body: "5 Minuten vom Königsplatz, 30 Minuten Pause: Im STORIA Maxvorstadt gibt es handgemachte Pasta und Tagesgerichte ab 14,90 €. Mo–Fr 11:30–14:30, Karlstraße 47a.",
  },
  {
    label: "A/lunch/spring [A] — Frühlingsküche",
    migration: "011", pool: "A", theme_slot: "lunch", season: "spring",
    cta_type: "call", image_tags: ["pasta", "lunch"],
    body: "Frühling in der Maxvorstadt: handgemachte Pasta mit frischen Zutaten — das Mittagsmenü im STORIA wechselt saisonal. 3 Gänge für 14,90 €, Mo–Fr 11:30–14:30. Karlstraße.",
  },
  {
    label: "A/lunch/allyear [B] — Schneller Mittag",
    migration: "011", pool: "A", theme_slot: "lunch", season: "allyear",
    cta_type: "reserve", image_tags: ["lunch", "innenraum"],
    body: "Schnelle Mittagspause am Königsplatz: Im STORIA Maxvorstadt wartet handgemachte Pasta, frische Antipasti, Dessert — alles in 45 Minuten. 14,90 €, Mo–Fr 11:30–14:30.",
  },
  {
    label: "A/lifestyle/summer [B] — Sommerterrasse",
    migration: "011", pool: "A", theme_slot: "lifestyle", season: "summer",
    cta_type: "reserve", image_tags: ["terrasse", "gaeste", "dinner"],
    body: "München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Raucher willkommen, Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.",
  },
];

// Bilder holen (1 pro Post, kein Duplikat-Tracking nötig — je unterschiedliche Tags)
async function pickImage(tags: string[], season: string): Promise<{ url: string; filename: string } | null> {
  const rows = await sql`
    SELECT id, filename, storage_url FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND (season = 'allyear' OR season = ${season})
      AND is_active = TRUE
    ORDER BY COALESCE(last_used, '2000-01-01') ASC, id ASC
    LIMIT 1
  `;
  if (!rows.length) return null;
  const url = (rows[0].storage_url as string).replace("https://ristorantestoria.de/", "https://www.ristorantestoria.de/");
  return { url, filename: rows[0].filename as string };
}

// Header
await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: "✅ Migration 010+011 — Finale Posts vor Apply", emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "6 Posts bereit für Insert. *Varianten-Wahl bestätigt.* Migration läuft jetzt.\n\n" +
        "📦 *M010:* Pool B — brand×2, lunch×1\n📦 *M011:* Pool A — lunch×2, lifestyle×1",
    },
  },
  { type: "divider" },
], true);

// 6 Posts mit je 1 Bild
const blocks: unknown[] = [];
const ctaLabel: Record<string, string> = { reserve: "Reservieren", call: "Anrufen", learn_more: "Mehr erfahren", website: "Website" };

for (const post of FINAL) {
  const img = await pickImage(post.image_tags, post.season);
  console.log(`  ${post.label}: ${img?.filename ?? "kein Bild"}`);

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${post.label}*\nPool ${post.pool} · ${post.theme_slot.toUpperCase()} · ${post.season} · ${ctaLabel[post.cta_type] || post.cta_type}`,
    },
  });
  if (img?.url) {
    blocks.push({ type: "image", image_url: img.url, alt_text: img.filename });
  }
  blocks.push({ type: "section", text: { type: "mrkdwn", text: post.body } });
  blocks.push({ type: "divider" });
}

await slackBlocks(blocks, true);

await slackBlocks([
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "▶️ *Migration läuft jetzt — dann Phase 4 Re-Run mit Bildern.*",
    },
  },
], true);

await sql.end();
console.log("✅ Confirmation gesendet.");
