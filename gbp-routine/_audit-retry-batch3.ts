import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const images = await sql`
  SELECT id, filename, storage_url, tags, season
  FROM gbp_images
  WHERE is_active = TRUE
  ORDER BY filename ASC
  OFFSET 20
`;
console.log(`Batch 3: ${images.length} Bilder (Offset 20)`);

// 8 Sekunden warten — Slack braucht Abstand nach 2 großen Image-Batches
console.log("Warte 8s...");
await new Promise(r => setTimeout(r, 8000));

// Blocks: 3 statt 4 pro Bild (section kombiniert Filename+Tags, dann Image, dann Divider)
const blocks: unknown[] = [];
for (const img of images) {
  const url = (img.storage_url as string).replace("https://ristorantestoria.de/", "https://www.ristorantestoria.de/");
  const tags = (img.tags as string[]).join(", ");
  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: `*\`${img.filename}\`*  ·  season: \`${img.season}\`\nTags: \`${tags}\`` },
  });
  blocks.push({ type: "image", image_url: url, alt_text: img.filename as string });
  blocks.push({ type: "divider" });
}

console.log(`Sending ${blocks.length} blocks...`);
await slackBlocks(blocks, true);

await slackBlocks([{
  type: "section",
  text: { type: "mrkdwn", text: "✅ Alle 28 Bilder gesendet. Bitte Tags prüfen — Pipeline pausiert (is_dry_run=TRUE)." },
}], true);

await sql.end();
console.log("✅ Batch 3 gesendet.");
