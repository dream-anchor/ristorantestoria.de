import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const posts = await sql`SELECT id, pool, theme_slot, body FROM gbp_posts WHERE pool IN ('A','B') ORDER BY pool, theme_slot, id`;
const slots = ["lunch", "brand", "lifestyle", "event"];
const pools = ["A", "B"];

const lines: string[] = [];
for (const pool of pools) {
  for (const slot of slots) {
    const found = posts.filter(p => p.pool === pool && p.theme_slot === slot);
    const risk = found.length === 0 ? "⛔ LEER" : found.length < 2 ? "⚠️ knapp" : "✅";
    lines.push(`${risk} Pool ${pool} / ${slot}: ${found.length} Post(s)${found.length > 0 ? " — IDs: " + found.map(p => p.id).join(",") : ""}`);
  }
}

const brandB = posts.filter(p => p.pool === "B" && p.theme_slot === "brand").length;
const note = brandB === 0
  ? "⛔ *Kritisch:* Pool B hat 0 Posts für `brand`-Slot (Mittwoch). Mit neuem Slot-Filter: Pool B auf Wed immer leer → Skip. Optionen: neue Pool-B-brand-Posts anlegen ODER Pool-B→Pool-C Fallback in gbp-poster.ts."
  : "✅ Alle Slots versorgt.";

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "📊 Pool A/B Slot-Audit — nach theme_slot-Filter-Fix", emoji: true } },
  { type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
  { type: "divider" },
  { type: "section", text: { type: "mrkdwn", text: note } },
], true);

console.log(lines.join("\n"));
console.log("\n" + note);
await sql.end();
