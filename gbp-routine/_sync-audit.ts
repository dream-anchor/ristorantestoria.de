import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// Filesystem: alle .webp in public/gbp-images/
const fsFiles = new Set(
  readdirSync(resolve(__dirname, "..", "public", "gbp-images"))
    .filter(f => f.endsWith(".webp"))
);

// DB: alle Einträge (active + inactive)
const dbRows = await sql`SELECT filename, is_active FROM gbp_images ORDER BY filename`;
const dbAll = new Map(dbRows.map(r => [r.filename as string, r.is_active as boolean]));

// Neue 22 Bilder (Downloads-Batch)
const newFiles = Array.from(fsFiles)
  .filter(f => !dbAll.has(f))
  .sort();

// In DB aber NICHT im Filesystem
const dbOnlyFiles = Array.from(dbAll.keys())
  .filter(f => !fsFiles.has(f))
  .sort();

// In beiden (DB + FS)
const inBoth = Array.from(dbAll.keys())
  .filter(f => fsFiles.has(f))
  .sort();

const activeInBoth = inBoth.filter(f => dbAll.get(f) === true);
const inactiveInBoth = inBoth.filter(f => dbAll.get(f) === false);

console.log(`\nNeu (FS, nicht in DB): ${newFiles.length}`);
newFiles.forEach(f => console.log(`  + ${f}`));
console.log(`\nIn DB, nicht in FS: ${dbOnlyFiles.length}`);
dbOnlyFiles.forEach(f => console.log(`  - ${f} (active=${dbAll.get(f)})`));
console.log(`\nIn beiden — aktiv in DB: ${activeInBoth.length}, inaktiv: ${inactiveInBoth.length}`);

// Slack-Report
await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "🔍 DB-Sync-Audit — GO 016a?", emoji: true } },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: [
        `*A) Im Filesystem, NICHT in DB → INSERT nötig (${newFiles.length}):*`,
        newFiles.map(f => `• \`${f}\``).join("\n"),
      ].join("\n"),
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: dbOnlyFiles.length > 0
        ? `*B) In DB, NICHT im Filesystem (${dbOnlyFiles.length}):*\n${dbOnlyFiles.map(f => `• \`${f}\` (active=${dbAll.get(f)})`).join("\n")}`
        : "*B) In DB, NICHT im Filesystem:* keine — alle DB-Einträge haben physische Datei ✅",
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: [
        `*C) In beiden (DB + FS):* ${inBoth.length} Dateien`,
        `→ Davon aktiv in DB: ${activeInBoth.length} (werden per Migration 016 deaktiviert)`,
        `→ Davon bereits inaktiv: ${inactiveInBoth.length} (bleiben inaktiv)`,
      ].join("\n"),
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Migration 016 wird:*\n• Alle bisherigen DB-Einträge auf is_active=FALSE setzen\n• 22 neue Bilder mit Tags + Saison inserieren\n\n*GO 016a* → Migration-016-Preview senden",
    },
  },
], true);

await sql.end();
console.log("✅ Sync-Audit gesendet.");
