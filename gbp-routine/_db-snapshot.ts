import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const posts = await sql`SELECT id, pool, season, theme_slot, body, cta_type, image_tags FROM gbp_posts ORDER BY pool, theme_slot`;
const images = await sql`SELECT id, filename, tags, season, last_used FROM gbp_images ORDER BY id`;
const clusters = await sql`SELECT cluster_id, required_tags, min_image_repetition_days, must_include_usp, must_include_geo_anchor, examples FROM gbp_theme_clusters ORDER BY cluster_id`;

console.log("=== POSTS ===");
console.log(JSON.stringify(posts.map(p => ({ id: p.id, pool: p.pool, season: p.season, theme_slot: p.theme_slot, body_len: (p.body as string)?.length, cta: p.cta_type, img_tags: p.image_tags })), null, 2));
console.log("=== IMAGES ===");
console.log(JSON.stringify(images.map(i => ({ id: i.id, filename: i.filename, tags: i.tags, season: i.season, last_used: i.last_used })), null, 2));
console.log("=== CLUSTERS ===");
console.log(JSON.stringify(clusters.map(c => ({ cluster_id: c.cluster_id, req_tags: c.required_tags, min_rep_days: c.min_image_repetition_days, must_usp: c.must_include_usp, must_geo: c.must_include_geo_anchor, ex_count: (c.examples as string[])?.length })), null, 2));

await sql.end();
