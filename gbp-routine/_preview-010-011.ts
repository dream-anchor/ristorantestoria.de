/**
 * Phase 6 — Preview: 6 neue Posts, je 2 Varianten.
 * Alle 12 Texte laufen durch Validation-Gate bevor Slack-Preview.
 * Migration 010: Pool B (brand×2, lunch×1)
 * Migration 011: Pool A (lunch×2, lifestyle×1)
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { validate } from "../validators/gbp-post-validator.js";
import { slackBlocks, slackPostPreview } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// In-Memory-Tracking: welche Bild-IDs wurden im Preview bereits verwendet?
const previewUsedImageIds = new Set<number>();

/** Aktives Bild das zu den Tags passt — rotiert über Posts (in-memory anti-repetition) */
async function pickPreviewImage(tags: string[], season: string): Promise<{ url: string; filename: string } | null> {
  // Bevorzuge noch nicht verwendetes Bild
  const rows = await sql`
    SELECT id, filename, storage_url FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND (season = 'allyear' OR season = ${season})
      AND is_active = TRUE
    ORDER BY COALESCE(last_used, '2000-01-01') ASC, id ASC
  `;
  if (!rows.length) return null;

  // Nimm das erste Bild das noch nicht in dieser Preview-Session verwendet wurde
  const fresh = rows.find(r => !previewUsedImageIds.has(r.id as number));
  const row = fresh ?? rows[0]; // Fallback: erstes wenn alle verwendet

  previewUsedImageIds.add(row.id as number);
  const url = (row.storage_url as string).replace("https://ristorantestoria.de/", "https://www.ristorantestoria.de/");
  return { url, filename: row.filename as string };
}

const WEEKDAY: Record<string, "mon" | "wed" | "fri"> = {
  lunch: "mon", brand: "wed", lifestyle: "fri",
};
const SLOT_TIME: Record<string, string> = {
  lunch: "09:00", brand: "09:30", lifestyle: "15:00",
};
const CTA_URL = "https://ristorantestoria.de";

// ── Neue Posts: 2 Varianten je ───────────────────────────────────────────────

interface NewPost {
  label:      string;   // z.B. "B/brand/1"
  pool:       string;
  theme_slot: string;
  season:     string;
  cta_type:   string;
  image_tags: string[];
  variants: { v: "A" | "B"; body: string }[];
}

const NEW_POSTS: NewPost[] = [

  // ── Migration 010: Pool B ───────────────────────────────────────────────────

  {
    label: "B/brand/1 — Handwerk",
    pool: "B", theme_slot: "brand", season: "allyear", cta_type: "learn_more",
    image_tags: ["pasta", "handwerk"],
    variants: [
      {
        v: "A",
        body: "Handgemachte Pasta und Pizzen aus dem 400°C Steinofen — das STORIA in der Karlstraße steht für echtes Handwerk aus dem Cilento. Keine Convenience, keine Kompromisse. Maxvorstadt, seit 2015.",
      },
      {
        v: "B",
        body: "48h Teigruhe, 400°C Steinofen, handgemachte Pasta: In der Karlstraße 47a steckt die Cucina del Cilento in jedem Detail. Seit 2015 in der Maxvorstadt — Familie Speranza kocht täglich frisch.",
      },
    ],
  },

  {
    label: "B/brand/2 — Familie & Cilento",
    pool: "B", theme_slot: "brand", season: "allyear", cta_type: "website",
    image_tags: ["team", "cilento"],
    variants: [
      {
        v: "A",
        body: "Familie Speranza kocht seit 2015 im STORIA Maxvorstadt — die Original-Rezepte aus Rofrano, die Cucina del Cilento, authentisch in München. Jeden Abend frisch. Karlstraße 47a.",
      },
      {
        v: "B",
        body: "Von Rofrano nach München: Die Cucina del Cilento ist die Seele des STORIA Maxvorstadt. Domenico, Nicola und Familie Speranza stehen täglich in der Küche — Karlstraße 47a, seit 2015.",
      },
    ],
  },

  {
    label: "B/lunch/1 — Mittagsmenü",
    pool: "B", theme_slot: "lunch", season: "allyear", cta_type: "call",
    image_tags: ["pasta", "lunch"],
    variants: [
      {
        v: "A",
        body: "Mittagspause in der Maxvorstadt: handgemachte Pasta, Tagessuppe und Dessert für 14,90 €. Mo–Fr 11:30–14:30, Cucina del Cilento aus Rofrano — STORIA Karlstraße.",
      },
      {
        v: "B",
        body: "5 Minuten vom Königsplatz, 30 Minuten Pause: Im STORIA Maxvorstadt gibt es handgemachte Pasta und Tagesgerichte ab 14,90 €. Mo–Fr 11:30–14:30, Karlstraße 47a.",
      },
    ],
  },

  // ── Migration 011: Pool A ───────────────────────────────────────────────────

  {
    label: "A/lunch/spring — Frühlingsküche",
    pool: "A", theme_slot: "lunch", season: "spring", cta_type: "call",
    image_tags: ["pasta", "lunch"],
    variants: [
      {
        v: "A",
        body: "Frühling in der Maxvorstadt: handgemachte Pasta mit frischen Zutaten — das Mittagsmenü im STORIA wechselt saisonal. 3 Gänge für 14,90 €, Mo–Fr 11:30–14:30. Karlstraße.",
      },
      {
        v: "B",
        body: "Wenn München aufblüht, kommt die Frühlingsküche: handgemachte Pasta mit Saison-Antipasti im STORIA Maxvorstadt. Mittagsmenü 14,90 €, Karlstraße 47a, Mo–Fr.",
      },
    ],
  },

  {
    label: "A/lunch/allyear — Schneller Mittag",
    pool: "A", theme_slot: "lunch", season: "allyear", cta_type: "reserve",
    image_tags: ["lunch", "innenraum"],
    variants: [
      {
        v: "A",
        body: "Mittagstisch in der Karlstraße: handgemachte Pasta, Antipasti und Dessert — echte Cucina del Cilento ohne langen Umweg. Seit 2015 in der Maxvorstadt. 11:30–14:30, Mo–Fr.",
      },
      {
        v: "B",
        body: "Schnelle Mittagspause am Königsplatz: Im STORIA Maxvorstadt wartet handgemachte Pasta, frische Antipasti, Dessert — alles in 45 Minuten. 14,90 €, Mo–Fr 11:30–14:30.",
      },
    ],
  },

  {
    label: "A/lifestyle/summer — Sommerterrasse",
    pool: "A", theme_slot: "lifestyle", season: "summer", cta_type: "reserve",
    image_tags: ["terrasse", "gaeste", "dinner"],
    variants: [
      {
        v: "A",
        body: "Sommerabend in der Maxvorstadt: 100 überdachte Plätze auf unserer Terrasse am Königsplatz — Raucher willkommen. Aperitivo, Dinner, Wein unter freiem Himmel. STORIA Karlstraße.",
      },
      {
        v: "B",
        body: "München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Raucher willkommen, Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.",
      },
    ],
  },
];

// ── Validation-Gate über alle 12 Varianten ────────────────────────────────────

console.log("\n🔬 Validation-Gate — 12 Varianten\n");

let allPass = true;
const validatedPosts: Array<{ post: NewPost; results: Array<{ v: "A"|"B"; body: string; pass: boolean; reasons: string[] }> }> = [];

for (const post of NEW_POSTS) {
  const varResults: Array<{ v: "A"|"B"; body: string; pass: boolean; reasons: string[] }> = [];

  for (const variant of post.variants) {
    const vr = validate({
      body: variant.body,
      min_chars: 140,
      max_chars: 280,
      must_include_usp: true,
      must_include_geo: true,
      cta_type: post.cta_type,
      theme_slot: post.theme_slot,
    });

    const icon = vr.pass ? "✅" : "❌";
    const len = variant.body.length;
    console.log(`${icon} ${post.label} / Var ${variant.v} (${len}Z): ${vr.pass ? "PASS" : vr.reasons.join(", ")}`);

    if (!vr.pass) allPass = false;
    varResults.push({ v: variant.v, body: variant.body, pass: vr.pass, reasons: vr.reasons });
  }

  validatedPosts.push({ post, results: varResults });
}

if (!allPass) {
  console.error("\n❌ Mindestens 1 Variante schlägt fehl — kein Slack-Preview. Fix nötig.");
  process.exit(1);
}

console.log("\n✅ Alle 12 Varianten valide — sende Slack-Preview mit Bildern...\n");

// ── Slack-Preview ─────────────────────────────────────────────────────────────

await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: "✍️ Phase 6 — Content-Nachzug: 6 neue Posts (je 2 Varianten)", emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Alle 12 Varianten ✅ Validation-Gate bestanden. Jede Variante zeigt ein repräsentatives Bild aus dem aktiven Pool.\n" +
        "*Bitte je Post eine Variante wählen (A oder B) — dann GO 010/011.*\n\n" +
        "📦 *Migration 010:* Pool B — brand×2, lunch×1\n📦 *Migration 011:* Pool A — lunch×2, lifestyle×1",
    },
  },
  { type: "divider" },
], true);

// Alle Variant-Blocks sammeln, dann in 2 Batches à 6 Varianten senden
const allVariantBlocks: unknown[] = [];
const ctaLabel: Record<string, string> = { reserve: "Reservieren", call: "Anrufen", learn_more: "Mehr erfahren", website: "Website" };

for (const { post, results } of validatedPosts) {
  const migration = post.pool === "B" ? "010" : "011";
  const weekday = WEEKDAY[post.theme_slot] ?? "mon";
  const slotTime = SLOT_TIME[post.theme_slot] ?? "09:00";
  const previewImage = await pickPreviewImage(post.image_tags, post.season);

  for (const r of results) {
    const imageFilename = previewImage?.filename ?? "";
    const imageUrl = previewImage?.url ?? "";

    console.log(`  Variante ${r.v} ${post.label}: Bild = ${imageFilename || "fehlt"}`);

    allVariantBlocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Var ${r.v} — M${migration} — ${post.label}*\nPool ${post.pool} · ${weekday.toUpperCase()} ${slotTime} · ${ctaLabel[post.cta_type] || post.cta_type}`,
      },
    });
    if (imageUrl) {
      allVariantBlocks.push({ type: "image", image_url: imageUrl, alt_text: imageFilename });
    }
    allVariantBlocks.push({ type: "section", text: { type: "mrkdwn", text: r.body } });
    allVariantBlocks.push({ type: "divider" });
  }
}

// Batches à max 45 Blocks senden (Slack-Limit 50, mit Puffer)
const BATCH_SIZE = 40;
for (let i = 0; i < allVariantBlocks.length; i += BATCH_SIZE) {
  const batch = allVariantBlocks.slice(i, i + BATCH_SIZE);
  console.log(`\n  → Batch ${Math.floor(i/BATCH_SIZE)+1}: ${batch.length} Blocks`);
  await slackBlocks(batch, true);
}

await slackBlocks([
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Antwort-Format:*\n```\nB/brand/1: A\nB/brand/2: B\nB/lunch/1: A\nA/lunch/spring: B\nA/lunch/allyear: A\nA/lifestyle/summer: A\n```",
    },
  },
], true);

await sql.end();
console.log("✅ Slack-Preview mit Bildern gesendet. Warte auf Varianten-Wahl.");
