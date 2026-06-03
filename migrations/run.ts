/**
 * Migration Runner — führt SQL-Migrations in Reihenfolge aus
 * Usage: npx tsx migrations/run.ts [--rollback 003]
 * Env: DATABASE_URL
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, readdirSync } from "fs";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function runMigration(file: string) {
  const content = readFileSync(resolve(__dirname, file), "utf-8");
  // Kommentarzeilen entfernen, dann auf ; splitten
  const stripped = content
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n");
  const statements = stripped
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    await sql.unsafe(stmt + ";");
  }
}

async function main() {
  const rollbackArg = process.argv.indexOf("--rollback");
  const isRollback = rollbackArg !== -1;
  const rollbackId = isRollback ? process.argv[rollbackArg + 1] : null;

  if (isRollback && rollbackId) {
    // Einzelnes Rollback
    const file = `${rollbackId.padStart(3, "0")}_*.rollback.sql`;
    const files = readdirSync(__dirname).filter(
      (f) => f.startsWith(rollbackId.padStart(3, "0")) && f.endsWith(".rollback.sql")
    );
    if (files.length === 0) { console.error(`Rollback-File nicht gefunden: ${file}`); process.exit(1); }
    console.log(`⏪ Rollback: ${files[0]}`);
    await runMigration(files[0]);
    console.log("✅ Rollback abgeschlossen.");
  } else {
    // Alle Migrations in Reihenfolge ausführen
    const files = readdirSync(__dirname)
      .filter((f) => /^\d{3}_/.test(f) && f.endsWith(".sql") && !f.endsWith(".rollback.sql"))
      .sort();
    console.log(`🔧 ${files.length} Migrations gefunden:\n`);
    for (const file of files) {
      process.stdout.write(`  → ${file} ... `);
      await runMigration(file);
      console.log("✓");
    }
    console.log("\n✅ Alle Migrations abgeschlossen.");
  }

  await sql.end();
}

main().catch(async (e) => {
  console.error("❌ Migration fehlgeschlagen:", e.message);
  await sql.end();
  process.exit(1);
});
