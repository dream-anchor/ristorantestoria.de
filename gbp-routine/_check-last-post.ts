import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/antoinemonot/Documents/Websites/VISUAL STUDIO CODE/ristorantestoria.de/.env', quiet: true });
(async () => {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
  const rows = await sql`SELECT id, body, last_used, LEFT(body,60) as preview FROM gbp_posts ORDER BY last_used DESC NULLS LAST LIMIT 5`;
  for (const r of rows) console.log(`ID${r.id} | last_used: ${r.last_used} | ${r.preview}`);
  await sql.end();
})();
