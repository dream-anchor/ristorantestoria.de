import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// 1. Pausieren
await sql`UPDATE gbp_schedule SET is_dry_run = TRUE WHERE is_active = TRUE`;
const check = await sql`SELECT id, weekday, theme_slot, is_dry_run FROM gbp_schedule ORDER BY id`;
console.log("Pause:", check.map(r => `${r.weekday}/${r.theme_slot}=${r.is_dry_run}`).join(", "));

// 2. Alle aktiven Bilder laden
const images = await sql`
  SELECT id, filename, storage_url, tags, season
  FROM gbp_images
  WHERE is_active = TRUE
  ORDER BY filename ASC
`;
console.log(`\n${images.length} aktive Bilder — sende Audit zu Slack...`);

// Header
await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "🖼️ Bild-Audit — 30 aktive GBP-Bilder", emoji: true } },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${images.length} aktive Bilder* — bitte Tags prüfen.\n\n*Antwort-Format:*\n\`\`\`\nFilename: tag-x entfernen\nFilename: tag-y hinzufügen\nFilename: ok\n\`\`\``,
    },
  },
  { type: "divider" },
], true);

// Bilder in Batches à 10 Bilder (je ~30 Blocks)
const IMGS_PER_BATCH = 10;
for (let i = 0; i < images.length; i += IMGS_PER_BATCH) {
  const batch = images.slice(i, i + IMGS_PER_BATCH);
  const blocks: unknown[] = [];

  for (const img of batch) {
    const url = (img.storage_url as string).replace("https://ristorantestoria.de/", "https://www.ristorantestoria.de/");
    const tags = (img.tags as string[]).join(", ");
    const season = img.season as string;

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*\`${img.filename}\`*  ·  season: \`${season}\``,
      },
    });
    blocks.push({ type: "image", image_url: url, alt_text: img.filename as string });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `Tags: \`${tags}\`` },
    });
    blocks.push({ type: "divider" });
  }

  const batchNum = Math.floor(i / IMGS_PER_BATCH) + 1;
  const total = Math.ceil(images.length / IMGS_PER_BATCH);
  console.log(`  Batch ${batchNum}/${total}: ${batch.length} Bilder`);
  await slackBlocks(blocks, true);
}

await slackBlocks([
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "✅ Alle Bilder gesendet. *Bitte Tags prüfen und korrigieren.*\nPipeline ist pausiert (is_dry_run=TRUE) bis GO 015.",
    },
  },
], true);

await sql.end();
console.log("✅ Audit gesendet.");
