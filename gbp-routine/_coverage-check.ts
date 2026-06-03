/**
 * Tag-Coverage-Analyse: Welche Cluster haben wieviele aktive Bilder?
 * Läuft nach jedem Bild-Audit um Repetition-Risiken sichtbar zu machen.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { slackBlocks } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const images = await sql`SELECT id, filename, tags, season, is_active FROM gbp_images`;
const clusters = await sql`SELECT cluster_id, required_tags, min_image_repetition_days FROM gbp_theme_clusters ORDER BY cluster_id`;

const activeImages = images.filter(i => i.is_active !== false);
const inactiveImages = images.filter(i => i.is_active === false);

console.log(`\nAktive Bilder: ${activeImages.length} / ${images.length} total`);
console.log(`Deaktiviert: ${inactiveImages.map(i => i.filename).join(", ")}\n`);

// Für jeden Cluster: wie viele aktive Bilder matchen?
type Coverage = { cluster: string; reqTags: string[]; minRepDays: number; allyear: number; seasonal: number; total: number; risk: string };
const coverageRows: Coverage[] = [];

for (const c of clusters) {
  const reqTags = c.required_tags as string[];
  const minRepDays = c.min_image_repetition_days as number ?? 21;

  const matching = activeImages.filter(img =>
    (img.tags as string[]).some(t => reqTags.includes(t))
  );
  const allyear = matching.filter(i => i.season === "allyear").length;
  const seasonal = matching.filter(i => i.season !== "allyear").length;
  const total = matching.length;

  // Faustregel: min. ceil(minRepDays / 14) Bilder für störungsfreien Betrieb
  const minNeeded = Math.ceil(minRepDays / 14);
  const risk = allyear === 0 ? "⛔ LEER (allyear)" : allyear < minNeeded ? `⚠️  knapp (${allyear}/${minNeeded} nötig)` : "✅";

  coverageRows.push({ cluster: c.cluster_id, reqTags, minRepDays, allyear, seasonal, total, risk });
  console.log(`${risk} ${c.cluster_id}: ${allyear} allyear + ${seasonal} saisonal (minRep=${minRepDays}d → min ${minNeeded} Bilder)`);
}

// Slack-Report
const tableLines = coverageRows.map(r =>
  `${r.risk.padEnd(22)} \`${r.cluster}\`\n   Tags: [${r.reqTags.join(",")}] | ${r.allyear} allyear + ${r.seasonal} saisonal | minRep: ${r.minRepDays}d`
).join("\n\n");

const leerCluster = coverageRows.filter(r => r.allyear === 0);
const knappCluster = coverageRows.filter(r => r.allyear > 0 && r.allyear < Math.ceil(r.minRepDays / 14));

const summaryText = [
  leerCluster.length > 0
    ? `⛔ *${leerCluster.length} Cluster ohne allyear-Bild:* ${leerCluster.map(r => `\`${r.cluster}\``).join(", ")}\n→ Cluster deaktivieren bis Ersatz-Bilder vorhanden`
    : "✅ Alle Cluster haben mind. 1 allyear-Bild.",
  knappCluster.length > 0
    ? `⚠️ *${knappCluster.length} Cluster knapp (Repetitions-Risiko):* ${knappCluster.map(r => `\`${r.cluster}\` (${r.allyear} Bild${r.allyear > 1 ? "er" : ""})`).join(", ")}`
    : "",
].filter(Boolean).join("\n\n");

await slackBlocks([
  { type: "header", text: { type: "plain_text", text: "📊 Tag-Coverage nach Bild-Audit (012+013)", emoji: true } },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${activeImages.length} aktive Bilder* (${inactiveImages.length} deaktiviert: ${inactiveImages.map(i => `\`${i.filename}\``).join(", ")})\n\n${summaryText}`,
    },
  },
  { type: "divider" },
  {
    type: "section",
    text: { type: "mrkdwn", text: `*Cluster-Übersicht (${clusters.length} Cluster):*\n\n${tableLines}` },
  },
  { type: "divider" },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: leerCluster.length === 0
        ? "✅ *Kein Cluster muss deaktiviert werden.* GO 010/011 freigegeben."
        : `⚠️ *${leerCluster.length} Cluster ohne Bilder → deaktivieren bevor GO 010/011.*`,
    },
  },
], true);

await sql.end();
console.log("\n✅ Coverage-Check abgeschlossen.");
