import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
async function main() {
  const posts = await sql`SELECT pool, title, LEFT(body,70) as body_preview, cta_type, season, image_tags FROM gbp_posts ORDER BY pool, id`;
  const clusters = await sql`SELECT cluster_id, tone_hint, array_length(examples, 1) as n, char_length(examples[1]) as len1 FROM gbp_theme_clusters ORDER BY cluster_id`;
  const images = await sql`SELECT filename, tags, season FROM gbp_images ORDER BY filename`;
  const schedule = await sql`SELECT weekday, slot_time, pool_priority, is_active, is_dry_run FROM gbp_schedule ORDER BY id`;
  const log = await sql`SELECT pool, status, COUNT(*) as n FROM gbp_post_log GROUP BY pool, status`;

  console.log("=== POSTS (" + posts.length + ") ===");
  for (const p of posts) console.log(JSON.stringify(p));
  console.log("\n=== CLUSTERS (" + clusters.length + ") ===");
  for (const c of clusters) console.log(JSON.stringify(c));
  const allTags = new Set<string>();
  for (const i of images) (i.tags || []).forEach((t: string) => allTags.add(t));
  console.log("\n=== IMAGES (" + images.length + ") tag vocab: " + [...allTags].sort().join(", "));
  console.log("\n=== SCHEDULE ===");
  for (const s of schedule) console.log(JSON.stringify(s));
  console.log("\n=== POST_LOG ===");
  for (const l of log) console.log(JSON.stringify(l));
  await sql.end();
}
main().catch(e => { console.error(e); process.exit(1); });
