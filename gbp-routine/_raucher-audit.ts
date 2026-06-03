import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const posts = await sql`SELECT id, pool, theme_slot, body FROM gbp_posts WHERE body ILIKE '%raucher%' ORDER BY id`;
const clusters = await sql`SELECT cluster_id, examples FROM gbp_theme_clusters WHERE EXISTS (SELECT 1 FROM unnest(examples) ex WHERE ex ILIKE '%raucher%')`;

console.log(`Posts mit "Raucher": ${posts.length}`);
posts.forEach(p => console.log(`  ID${p.id} [${p.pool}/${p.theme_slot}]: ${(p.body as string).substring(0, 80)}...`));
console.log(`Cluster-Examples mit "Raucher": ${clusters.length}`);
clusters.forEach(c => console.log(`  ${c.cluster_id}`));

const postLines = posts.length
  ? posts.map(p => `*ID${p.id} [${p.pool}/${p.theme_slot}]:*\n> ${p.body}`).join("\n\n")
  : "_(keine)_";
const clusterLines = clusters.length
  ? clusters.map(c => {
      const affected = (c.examples as string[]).filter(e => e.toLowerCase().includes("raucher"));
      return `*${c.cluster_id}:*\n${affected.map(e => `> ${e}`).join("\n")}`;
    }).join("\n\n")
  : "_(keine)_";

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "🚫 Raucher-Audit — Schritt 2", emoji: true } },
  { type: "section", text: { type: "mrkdwn", text: `*Posts (${posts.length}):*\n${postLines}` } },
  { type: "divider" },
  { type: "section", text: { type: "mrkdwn", text: `*Cluster-Examples (${clusters.length}):*\n${clusterLines}` } },
  { type: "divider" },
  { type: "section", text: { type: "mrkdwn", text: "Warte auf Antoine-Review → dann Rewrite + Migration 017." } },
], true);

await sql.end();
console.log("✅ Raucher-Audit gesendet.");
