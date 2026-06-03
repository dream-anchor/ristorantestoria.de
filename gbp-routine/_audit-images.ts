/**
 * Bild-Audit: Alle gbp_images in Slack als prüfbare Tabelle.
 * Antoine klassifiziert: ECHT / KI-VERDACHT / UNKLAR.
 * KI-VERDACHT/UNKLAR → is_active=FALSE per Follow-up-Migration.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const images = await sql`
  SELECT id, filename, tags, season, is_active
  FROM gbp_images
  ORDER BY is_active DESC, id ASC
`;

console.log(`\n📸 Bild-Audit — ${images.length} Bilder\n`);

// Header
await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: "📸 Bild-Audit — Klassifikation ECHT / KI-VERDACHT / UNKLAR", emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${images.length} Bilder im Pool.* chefs.webp bereits deaktiviert (KI bestätigt).\n\n` +
        "Bitte jedes Bild aufrufen und klassifizieren:\n" +
        "• ✅ *ECHT* — authentisches Foto, kann im GBP erscheinen\n" +
        "• ⚠️ *KI-VERDACHT* — sieht generiert aus, sofort deaktivieren\n" +
        "• ❓ *UNKLAR* — Herkunft unbekannt, erstmal deaktivieren\n\n" +
        "Antwort-Format (alle 31 Bilder in einer Nachricht):\n```\n1: ECHT\n2: ECHT\n6: KI-VERDACHT\n...\n```",
    },
  },
  { type: "divider" },
], true);

// Bilder in Gruppen à 5 schicken (Slack-Rate-Limit)
const BASE_URL = "https://www.ristorantestoria.de/gbp-images/";
const BATCH = 5;

for (let i = 0; i < images.length; i += BATCH) {
  const batch = images.slice(i, i + BATCH);
  const blocks: unknown[] = [];

  for (const img of batch) {
    const isActive = img.is_active !== false;
    const statusBadge = isActive ? "" : " 🚫 *DEAKTIVIERT*";
    const url = `${BASE_URL}${img.filename}`;
    const tagsStr = (img.tags as string[]).join(", ");

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          `*ID ${img.id}: ${img.filename}*${statusBadge}`,
          `Tags: \`[${tagsStr}]\` | Saison: \`${img.season}\``,
          `<${url}|🔗 Bild öffnen>`,
        ].join("\n"),
      },
    });
    blocks.push({ type: "divider" });
  }

  await slackBlocks(blocks, true);
}

// Abschluss
await slackBlocks([
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Nach deiner Klassifikation:*\n" +
        "• KI-VERDACHT → Migration 013: UPDATE gbp_images SET is_active=FALSE WHERE id IN (…)\n" +
        "• Dann: Tag-Coverage-Analyse welche Cluster Bilder verlieren\n" +
        "• Betroffene Cluster → is_active=FALSE in gbp_theme_clusters\n" +
        "• Phase 5 Re-Run mit reduziertem Pool\n\n" +
        "_Neue echte Fotos: ASSETS-BACKLOG.md lesen → Domenico fragen_",
    },
  },
], true);

await sql.end();
console.log("✅ Audit-Tabelle in Slack gesendet.");
