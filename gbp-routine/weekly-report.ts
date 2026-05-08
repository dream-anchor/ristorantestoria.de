/**
 * GBP Routine — Wöchentlicher Slack-Report (Sonntag 18:00)
 * Usage: npx tsx gbp-routine/weekly-report.ts
 * Env: DATABASE_URL, SLACK_WEBHOOK_URL
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

function getKW(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

async function slackReport(message: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) { console.log("[Slack]", message); return; }
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });
}

async function main() {
  const kw = getKW();

  const logs = await sql`
    SELECT * FROM gbp_post_log
    WHERE timestamp > NOW() - INTERVAL '7 days'
    ORDER BY timestamp ASC
  `;

  const gepostet = logs.filter((l) => l.status === "gepostet" || l.status === "dry_run");
  const failed = logs.filter((l) => l.status === "failed");

  const poolCounts: Record<string, number> = {};
  for (const l of gepostet) {
    poolCounts[l.pool] = (poolCounts[l.pool] || 0) + 1;
  }

  // Top-Bild
  const topImageRows = await sql`
    SELECT gi.filename, COUNT(*) as cnt
    FROM gbp_post_log pl
    JOIN gbp_images gi ON gi.id = pl.image_id
    WHERE pl.timestamp > NOW() - INTERVAL '7 days'
    GROUP BY gi.filename
    ORDER BY cnt DESC
    LIMIT 1
  `;
  const topImage = topImageRows[0]?.filename || "—";

  const poolSummary = Object.entries(poolCounts)
    .map(([p, n]) => `Pool ${p}: ${n}×`)
    .join(", ") || "keine";

  const isDryRun = gepostet.some((l) => l.status === "dry_run");
  const dryRunHint = isDryRun ? " _(Dry-Run-Modus)_" : "";

  const lines = [
    `📊 STORIA GBP Woche KW ${kw}${dryRunHint}`,
    "",
    `Geplant: 3 Posts (Mo/Mi/Fr)`,
    `Gepostet: ${gepostet.length}/3 ${gepostet.length === 3 ? "✓" : "⚠️"}`,
    failed.length > 0 ? `Fehler: ${failed.length}× ❌` : "",
    "",
    poolSummary,
    "",
    `Top-Bild: ${topImage}`,
  ].filter((l) => l !== "").join("\n");

  console.log(lines);
  await slackReport(lines);
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
