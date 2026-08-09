import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/antoinemonot/Developer/Websites/ristorantestoria.de/.env', quiet: true });

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

const clusters = await sql`SELECT cluster_id, examples FROM gbp_theme_clusters WHERE EXISTS (SELECT 1 FROM unnest(examples) e WHERE e ILIKE '%Raucher%')`;
console.log(JSON.stringify(clusters, null, 2));

await sql.end();
