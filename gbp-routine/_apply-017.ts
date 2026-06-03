/**
 * Apply Migration 017: Raucher-Entfernung
 */
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/antoinemonot/Documents/Websites/VISUAL STUDIO CODE/ristorantestoria.de/.env', quiet: true });

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

// Run the 3 missing statements that were filtered by the comment-split bug
const missing = [
  {
    label: 'ID2 post body',
    stmt: `UPDATE gbp_posts SET body = 'Aperitivo & Dinner auf der überdachten Terrasse in München Maxvorstadt. 🍹 100 wetterfeste Plätze in der Karlstraße. Italienische Weine, Aperol-Klassiker, Antipasti. Ab 19:00 im STORIA.' WHERE id = 2`,
  },
  {
    label: 'terrasse_lifestyle cluster',
    stmt: `UPDATE gbp_theme_clusters SET examples = ARRAY['100 überdachte Plätze in der Maxvorstadt — wetterfest, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.','Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.','Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.'] WHERE cluster_id = 'terrasse_lifestyle'`,
  },
  {
    label: 'volle-stube season → winter',
    stmt: `UPDATE gbp_images SET season = 'winter' WHERE filename = 'business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp'`,
  },
];

for (const { label, stmt } of missing) {
  const result = await sql.unsafe(stmt);
  const count = (result as unknown as { count: number }).count ?? 0;
  console.log(`${count === 1 ? '✅' : '❌'} ${label}: ${count} row(s)`);
}

// Verify all 6 posts
console.log('\n--- Verification ---');
const posts = await sql`SELECT id, LEFT(body, 60) as preview, LENGTH(body) as len FROM gbp_posts WHERE id IN (2,4,5,8,11,19) ORDER BY id`;
for (const p of posts) {
  const hasRaucher = p.preview.toLowerCase().includes('raucher');
  console.log(`ID${p.id} (${p.len}ch) ${hasRaucher ? '❌ RAUCHER NOCH DA' : '✅'}: ${p.preview}`);
}

// Verify clusters
const clusters = await sql`SELECT cluster_id, array_length(examples, 1) as cnt FROM gbp_theme_clusters WHERE cluster_id IN ('terrasse_lifestyle','pinakothek_dinner','rezension_highlight') ORDER BY cluster_id`;
for (const c of clusters) {
  const row = await sql`SELECT examples FROM gbp_theme_clusters WHERE cluster_id = ${c.cluster_id}`;
  const hasRaucher = row[0].examples.some((e: string) => e.toLowerCase().includes('raucher'));
  console.log(`Cluster ${c.cluster_id}: ${hasRaucher ? '❌ RAUCHER NOCH DA' : '✅ clean'}`);
}

// Verify image seasons
const imgs = await sql`SELECT filename, season FROM gbp_images WHERE filename IN ('business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp','business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp')`;
for (const img of imgs) {
  const fn = img.filename.replace('business-lunch-', '').slice(0, 40);
  console.log(`${img.season === 'winter' ? '✅' : '❌'} ${fn}: season=${img.season}`);
}

await sql.end();
