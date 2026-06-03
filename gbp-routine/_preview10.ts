/**
 * Sendet 10 Post-Previews an Slack (optimierte Texte, aktueller DB-Stand)
 * Usage: npx tsx gbp-routine/_preview10.ts
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// Feste 10-Post-Sequenz: Mo/Mi/Fr × 3,5 Wochen
// Mo → Pool A (70%) | Mi → Pool C (generiert, hier: alle Cluster) | Fr → Pool A/B
const PREVIEW_SCHEDULE: Array<{ weekday: string; label: string; pool: "A" | "B" | "C"; slot: string }> = [
  { weekday: "mon", label: "KW20 Montag",     pool: "A", slot: "09:00" },
  { weekday: "wed", label: "KW20 Mittwoch",   pool: "C", slot: "09:30" },
  { weekday: "fri", label: "KW20 Freitag",    pool: "B", slot: "15:00" },
  { weekday: "mon", label: "KW21 Montag",     pool: "A", slot: "09:00" },
  { weekday: "wed", label: "KW21 Mittwoch",   pool: "C", slot: "09:30" },
  { weekday: "fri", label: "KW21 Freitag",    pool: "A", slot: "15:00" },
  { weekday: "mon", label: "KW22 Montag",     pool: "A", slot: "09:00" },
  { weekday: "wed", label: "KW22 Mittwoch",   pool: "C", slot: "09:30" },
  { weekday: "fri", label: "KW22 Freitag",    pool: "B", slot: "15:00" },
  { weekday: "mon", label: "KW23 Montag",     pool: "A", slot: "09:00" },
];

// Rate-limitiertes Senden via slack.ts (rateDelay=true = 1200ms Pause nach jeder Nachricht)
async function sendSlackBlock(blocks: unknown[]) {
  await slackBlocks(blocks, true);
}

async function pickImage(tags: string[], usedIds: number[]) {
  const rows = await sql`
    SELECT * FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND id != ALL(${usedIds.length > 0 ? usedIds : [-1]})
    ORDER BY use_count ASC, COALESCE(last_used, '2000-01-01') ASC
    LIMIT 1
  `;
  if (rows.length > 0) return rows[0];
  const [any] = await sql`SELECT * FROM gbp_images ORDER BY use_count ASC LIMIT 1`;
  return any;
}

async function main() {
  console.log("📤 Sende 10 Post-Previews an Slack…\n");

  // Alle Posts laden
  const allPosts = await sql`SELECT * FROM gbp_posts ORDER BY pool, id`;
  const allClusters = await sql`SELECT * FROM gbp_theme_clusters ORDER BY cluster_id`;

  const poolAPosts = allPosts.filter((p) => p.pool === "A");
  const poolBPosts = allPosts.filter((p) => p.pool === "B");

  let poolAIndex = 0;
  let poolBIndex = 0;
  let clusterIndex = 0;
  const usedImageIds: number[] = [];

  // Header-Nachricht
  await sendSlackBlock([
    {
      type: "header",
      text: { type: "plain_text", text: "📋 STORIA GBP — Preview: nächste 10 Posts (optimiert)", emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Pool A & B: Texte aus DB (SEO-optimiert). Pool C: Beispiel-Cluster-Texte.\n*Freigabe? → Dann: `UPDATE gbp_schedule SET is_dry_run = FALSE`*",
      },
    },
    { type: "divider" },
  ]);

  for (let i = 0; i < PREVIEW_SCHEDULE.length; i++) {
    const slot = PREVIEW_SCHEDULE[i];
    let postBody = "";
    let ctaType = "reserve";
    let ctaUrl = "https://ristorantestoria.de/reservierung";
    let imageTags: string[] = ["innenraum"];
    let clusterLabel = "";

    if (slot.pool === "A") {
      const post = poolAPosts[poolAIndex % poolAPosts.length];
      poolAIndex++;
      postBody = post.body;
      ctaType = post.cta_type;
      ctaUrl = post.cta_url;
      imageTags = post.image_tags || ["innenraum"];
    } else if (slot.pool === "B") {
      const post = poolBPosts[poolBIndex % poolBPosts.length];
      poolBIndex++;
      postBody = post.body;
      ctaType = post.cta_type;
      ctaUrl = post.cta_url;
      imageTags = post.image_tags || ["innenraum"];
    } else {
      // Pool C: Cluster-Beispiel nehmen
      const cluster = allClusters[clusterIndex % allClusters.length];
      clusterIndex++;
      clusterLabel = ` · Cluster: \`${cluster.cluster_id}\``;
      const examples: string[] = cluster.examples || [];
      postBody = examples[0] || `[Claude generiert aus Cluster "${cluster.cluster_id}" — ${cluster.tone_hint}]`;
      imageTags = ["innenraum", "team"];
      ctaType = "reserve";
      ctaUrl = "https://ristorantestoria.de/reservierung";
    }

    const image = await pickImage(imageTags, usedImageIds);
    if (image) usedImageIds.push(image.id);

    const ctaLabel: Record<string, string> = {
      reserve: "Reservieren",
      call: "Anrufen",
      learn_more: "Mehr erfahren",
      website: "Website",
    };

    const poolEmoji = slot.pool === "A" ? "🔵" : slot.pool === "B" ? "🟡" : "🟢";

    const blocks: unknown[] = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${i + 1}/10 · ${slot.label} ${slot.slot}* · ${poolEmoji} Pool ${slot.pool}${clusterLabel}`,
        },
      },
      ...(image
        ? [
            {
              type: "image",
              image_url: image.storage_url,
              alt_text: image.filename,
              title: { type: "plain_text", text: image.filename },
            },
          ]
        : []),
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Post-Text:*\n${postBody}` },
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `*CTA:* ${ctaLabel[ctaType] || ctaType}` },
          { type: "mrkdwn", text: `*Zeichen:* ${postBody.length}` },
        ],
      },
      { type: "divider" },
    ];

    await sendSlackBlock(blocks);
    console.log(`✓ ${i + 1}/10 — ${slot.label} (Pool ${slot.pool}) — "${postBody.substring(0, 60)}…"`);
  }

  // Abschluss
  await sendSlackBlock([
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "✅ *Alle 10 Posts gezeigt.*\n\nFreigabe → Live schalten:\n```UPDATE gbp_schedule SET is_dry_run = FALSE WHERE is_active = TRUE;```\n\nNoch Änderungen? Einfach antworten.",
      },
    },
  ]);

  console.log("\n✅ Fertig. Alle 10 Posts in Slack.");
  await sql.end();
}

main().catch(async (e) => {
  console.error(e);
  await sql.end();
  process.exit(1);
});
