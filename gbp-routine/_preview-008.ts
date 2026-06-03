import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { slackBlocks, slackText } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const changes = [
  { id: 3,  title: "Italienisches Frühstück",  pool: "A", slot: "lunch",     old_cta: "learn_more", new_cta: "reserve", reason: "lunch erlaubt nur call/reserve" },
  { id: 4,  title: "Wochenend-Reservierung",   pool: "A", slot: "lifestyle", old_cta: "call",       new_cta: "reserve", reason: "lifestyle erlaubt nur reserve/website" },
  { id: 8,  title: "(Pool B Event-Post)",       pool: "B", slot: "event",    old_cta: "learn_more", new_cta: "reserve", reason: "event erlaubt nur reserve/call" },
  { id: 12, title: "Geburtstag/Firmenfeier",   pool: "B", slot: "event",    old_cta: "learn_more", new_cta: "reserve", reason: "event erlaubt nur reserve/call" },
];

const lines = changes.map(c =>
  `• ID ${c.id} \`${c.title}\` [${c.pool}/${c.slot}]: \`${c.old_cta}\` → \`${c.new_cta}\` — ${c.reason}`
).join("\n");

await slackBlocks([
  {
    type: "header",
    text: { type: "plain_text", text: "🔧 Migration 008 — CTA-Fix Preview (warten auf GO 008)", emoji: true },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*4 Posts mit falschem CTA-Typ werden korrigiert:*\n\n${lines}\n\n*SLOT_CTA_MAP (neu):*\n\`lunch → call/reserve\` | \`brand → learn_more/website\` | \`lifestyle → reserve/website\` | \`event → reserve/call\``,
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Alle 4 CTAs werden auf `reserve` gesetzt (passt zu allen betroffenen Slots).\nRollback-Datei: `migrations/008_gbp_posts_cta_fix_rollback.sql`\n\n⏸ Warte auf Antoine: *GO 008*",
    },
  },
], true);

console.log("✅ Migration 008 Preview an Slack gesendet.");
