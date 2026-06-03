import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

await sql`UPDATE gbp_images SET is_active = FALSE WHERE filename = 'firmenfeier-eventlocation-storia-muenchen.webp'`;
await sql`UPDATE gbp_images SET is_active = FALSE WHERE filename = 'weihnachtsfeier-italiener-storia-muenchen.webp'`;
await sql`UPDATE gbp_images SET season = 'allyear', tags = ARRAY['innenraum','geburtstag','event'] WHERE filename = 'silvester-dinner-gala-storia-muenchen.webp'`;
await sql`UPDATE gbp_posts SET image_tags = ARRAY['pasta','pizza'] WHERE id = 14`;

const active = await sql`SELECT COUNT(*) as n FROM gbp_images WHERE is_active = TRUE`;
const post14 = await sql`SELECT id, image_tags FROM gbp_posts WHERE id = 14`;
const silv = await sql`SELECT filename, season, tags FROM gbp_images WHERE filename = 'silvester-dinner-gala-storia-muenchen.webp'`;

console.log("Aktive Bilder:", active[0].n);
console.log("Post 14 image_tags:", post14[0].image_tags);
console.log("silvester season:", silv[0].season, "tags:", silv[0].tags);
await sql.end();
