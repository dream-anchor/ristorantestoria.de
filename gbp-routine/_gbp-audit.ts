import postgres from "postgres";
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve("/Users/antoinemonot/Developer/Websites/ristorantestoria.de", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function main() {
  const posts = await sql`SELECT id, title, pool, theme_slot, cta_type, body FROM gbp_posts ORDER BY id`;

  const SLOT_CTA_MAP: Record<string, string[]> = {
    lunch:     ["call", "reserve"],
    brand:     ["learn_more", "website"],
    lifestyle: ["reserve", "website"],
    event:     ["reserve", "call"],
  };

  const USPS = ["48h Teigruhe","100 überdachte Plätze","wetterfeste Terrasse","Raucher willkommen","seit 2015","Cucina del Cilento","400°C Steinofen","handgemachte Pasta","bis 180 Gäste","Familie Speranza","Original-Rezepte aus Rofrano"];

  console.log("=== CTA AUDIT ===");
  for (const r of posts) {
    const allowed = SLOT_CTA_MAP[r.theme_slot] || [];
    const ok = allowed.length === 0 || allowed.includes(r.cta_type);
    console.log(JSON.stringify({ id: r.id, title: r.title, pool: r.pool, slot: r.theme_slot, cta: r.cta_type, status: ok ? "OK" : "MISMATCH", allowed }));
  }

  console.log("\n=== USP AUDIT ===");
  for (const r of posts) {
    const bodyLow = r.body.toLowerCase();
    const found = USPS.filter(u => bodyLow.includes(u.toLowerCase()));
    console.log(JSON.stringify({ id: r.id, title: r.title, pool: r.pool, slot: r.theme_slot, usps: found.length > 0 ? found : ["NONE"] }));
  }

  await sql.end();
}
main();
