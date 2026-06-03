import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// Volle Post-Texte
const posts = await sql`SELECT id, pool, theme_slot, body, image_tags FROM gbp_posts WHERE body ILIKE '%raucher%' ORDER BY id`;

// ID2 image_tags check
const id2 = await sql`SELECT id, image_tags FROM gbp_posts WHERE id = 2`;
console.log("ID2 image_tags:", id2[0].image_tags);

// Terrasse-Tag matchability
const activeWithTerrasse = await sql`SELECT COUNT(*) as n FROM gbp_images WHERE is_active = TRUE AND 'terrasse' = ANY(tags)`;
console.log("Aktive Bilder mit terrasse-Tag:", activeWithTerrasse[0].n);

// Cluster-Examples mit Raucher (für Reference)
const clusters = await sql`SELECT cluster_id, examples FROM gbp_theme_clusters WHERE EXISTS (SELECT 1 FROM unnest(examples) ex WHERE ex ILIKE '%raucher%')`;

await sql.end();

// Volle Texte ausgeben
for (const p of posts) console.log(`\nID${p.id}: ${p.body}`);
