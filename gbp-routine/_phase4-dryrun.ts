/**
 * Phase 4: 10er Dry-Run gegen die finale Pipeline.
 * Mo/Mi/Fr × ~3 Wochen, Pool A/B/C gemischt, Frühlingssaison.
 * Jeder Post durchläuft Validation-Gate + Image-Tag-Check.
 * Kein DB-Write — Anti-Repetition wird in-memory getrackt.
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import postgres from "postgres";
import Anthropic from "@anthropic-ai/sdk";
import { validate } from "../validators/gbp-post-validator.js";
import { slackBlocks, slackText, slackPostPreview } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── 10-Slot-Simulation (Mo/Mi/Fr über ~3,5 Wochen) ───────────────────────────
const SLOTS: Array<{ weekday: "mon" | "wed" | "fri"; theme_slot: string; slot_time: string }> = [
  { weekday: "mon", theme_slot: "lunch",     slot_time: "09:00" },
  { weekday: "wed", theme_slot: "brand",     slot_time: "09:30" },
  { weekday: "fri", theme_slot: "lifestyle", slot_time: "15:00" },
  { weekday: "mon", theme_slot: "lunch",     slot_time: "09:00" },
  { weekday: "wed", theme_slot: "brand",     slot_time: "09:30" },
  { weekday: "fri", theme_slot: "lifestyle", slot_time: "15:00" },
  { weekday: "mon", theme_slot: "lunch",     slot_time: "09:00" },
  { weekday: "wed", theme_slot: "brand",     slot_time: "09:30" },
  { weekday: "fri", theme_slot: "lifestyle", slot_time: "15:00" },
  { weekday: "mon", theme_slot: "lunch",     slot_time: "09:00" },
];

const SEASON = "spring";

function selectPool(weekday: string): "A" | "B" | "C" {
  const rand = Math.random();
  if (weekday === "wed") return rand < 0.7 ? "C" : "B";
  return rand < 0.7 ? "A" : "B";
}

// ── DB-Queries (read-only, kein UPDATE) ──────────────────────────────────────

async function pickPostFromDB(
  pool: "A" | "B",
  season: string,
  themeSlot: string | null,
  usedIds: number[]
) {
  const slotFilter = themeSlot
    ? sql`AND theme_slot = ${themeSlot}`
    : sql``;
  const [row] = await sql`
    SELECT * FROM gbp_posts
    WHERE pool = ${pool}
      AND (season = 'allyear' OR season = ${season})
      ${slotFilter}
      AND id != ALL(${usedIds.length > 0 ? usedIds : [-1]})
    ORDER BY COALESCE(last_used, '2000-01-01') ASC, use_count ASC
    LIMIT 1
  `;
  if (row) return row;
  // Fallback: lockere Anti-Repetition
  const [fallback] = await sql`
    SELECT * FROM gbp_posts
    WHERE pool = ${pool}
      AND (season = 'allyear' OR season = ${season})
      ${slotFilter}
    ORDER BY COALESCE(last_used, '2000-01-01') ASC
    LIMIT 1
  `;
  return fallback || null;
}

async function pickImageDry(
  tags: string[],
  season: string,
  minRepDays: number,
  usedImageIds: number[]
): Promise<{ id: number; filename: string; storage_url: string; tags: string[] } | null> {
  const [row] = await sql`
    SELECT * FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND (season = 'allyear' OR season = ${season})
      AND is_active = TRUE
      AND (last_used IS NULL OR last_used < NOW() - ${minRepDays} * INTERVAL '1 day')
      AND id != ALL(${usedImageIds.length > 0 ? usedImageIds : [-1]})
    ORDER BY COALESCE(last_used, '2000-01-01') ASC
    LIMIT 1
  `;
  return row || null;
}

async function pickImageAnyMatch(tags: string[], season: string) {
  const [row] = await sql`
    SELECT id FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND (season = 'allyear' OR season = ${season})
      AND is_active = TRUE
    LIMIT 1
  `;
  return row || null;
}

async function generatePoolCPost(season: string, themeSlot: string, usedClusters: string[]) {
  const [cluster] = await sql`
    SELECT * FROM gbp_theme_clusters
    WHERE cluster_id != ALL(${usedClusters.length > 0 ? usedClusters : ["__none__"]})
    ORDER BY COALESCE(last_used, '2000-01-01') ASC
    LIMIT 1
  `;
  const fallbackCluster = cluster || (await sql`SELECT * FROM gbp_theme_clusters ORDER BY COALESCE(last_used, '2000-01-01') ASC LIMIT 1`)[0];

  const promptTemplate = readFileSync(resolve(__dirname, "prompts/generate-post.md"), "utf-8");
  const input = {
    pool: "C", weekday: "wed", theme_slot: themeSlot, season,
    last_4_weeks_topics: usedClusters,
    theme_cluster: {
      cluster_id: fallbackCluster.cluster_id,
      tone_hint: fallbackCluster.tone_hint,
      examples: fallbackCluster.examples,
    },
  };

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{
      role: "user",
      content: `${promptTemplate}\n\n## Eingabe\n\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\`\n\nGib nur das JSON zurück.`,
    }],
  });

  const text = (response.content[0] as { type: string; text: string }).text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Pool C: kein valides JSON: ${text.substring(0, 100)}`);
  return { generated: JSON.parse(jsonMatch[0]), cluster: fallbackCluster };
}

// ── Haupt-Simulation ──────────────────────────────────────────────────────────

interface RunResult {
  slot: number;
  weekday: string;
  theme_slot: string;
  slotTime: string;
  pool: string;
  body: string;
  clusterId: string | null;
  imageFilename: string | null;
  imageUrl: string | null;
  imageTagMatch: boolean;
  imageError: string | null;
  validPass: boolean;
  validReasons: string[];
  ctaType: string;
  ctaUrl: string;
}

async function main() {
  console.log(`\n🚀 Phase 4 — 10er Dry-Run (${SEASON})\n`);

  const usedPostIds: number[] = [];
  const usedImageIds: number[] = [];
  const usedClusters: string[] = [];
  const results: RunResult[] = [];

  for (let i = 0; i < SLOTS.length; i++) {
    const { weekday, theme_slot, slot_time } = SLOTS[i];
    const slotNum = i + 1;
    let pool = selectPool(weekday);

    console.log(`\n── Slot ${slotNum}: ${weekday} / ${theme_slot} / Pool ${pool}`);

    let body = "";
    let ctaType = "learn_more";
    let ctaUrl = "https://ristorantestoria.de";
    let imageTags: string[] = [];
    let imageSeason = SEASON;
    let clusterId: string | null = null;
    let minRepDays = 21;
    let mustUSP = true;
    let mustGeo = true;
    let skipReason: string | null = null;

    // Pool C direkt, oder A→Fallback C, oder B
    let usePoolC = pool === "C";

    if (!usePoolC) {
      const post = await pickPostFromDB(pool as "A" | "B", SEASON, theme_slot, usedPostIds);
      if (!post) {
        if (pool === "A") {
          console.log(`  ⚠️  Kein Pool-A-Post → Fallback Pool C`);
          usePoolC = true;
          pool = "C";
        } else {
          skipReason = `Kein Pool-B-Post verfügbar`;
        }
      } else {
        body = post.body;
        ctaType = post.cta_type;
        ctaUrl = post.cta_url;
        imageTags = post.image_tags || [];
        imageSeason = post.season || "allyear";
        usedPostIds.push(post.id);
        console.log(`  Post: "${(post.title || body.substring(0, 50))}..." (ID ${post.id})`);
      }
    }

    if (usePoolC) {
      pool = "C";
      try {
        const { generated, cluster } = await generatePoolCPost(SEASON, theme_slot, usedClusters);
        body = generated.body;
        ctaType = generated.cta_type || "learn_more";
        ctaUrl = generated.cta_url || "https://ristorantestoria.de";
        imageTags = (cluster.required_tags as string[])?.length
          ? (cluster.required_tags as string[])
          : (generated.image_tags || []);
        imageSeason = generated.image_season || SEASON;
        clusterId = cluster.cluster_id;
        minRepDays = (cluster.min_image_repetition_days as number) || 21;
        mustUSP = cluster.must_include_usp !== false;
        mustGeo = cluster.must_include_geo_anchor !== false;
        usedClusters.push(clusterId);
        console.log(`  Cluster: ${clusterId}`);
        console.log(`  Body: "${body.substring(0, 70)}..."`);
      } catch (err) {
        skipReason = `Pool C Fehler: ${String(err).substring(0, 80)}`;
      }
    }

    if (skipReason) {
      console.log(`  ❌ Skip: ${skipReason}`);
      results.push({
        slot: slotNum, weekday, theme_slot, slotTime: slot_time, pool, body: "",
        clusterId: null, imageFilename: null, imageUrl: null,
        imageTagMatch: false, imageError: skipReason,
        validPass: false, validReasons: ["SKIP"], ctaType, ctaUrl,
      });
      continue;
    }

    // Bild wählen (in-memory anti-repetition)
    let imageFilename: string | null = null;
    let imageUrl: string | null = null;
    let imageTagMatch = false;
    let imageError: string | null = null;

    const image = await pickImageDry(imageTags, imageSeason, minRepDays, usedImageIds);
    if (image) {
      imageFilename = image.filename;
      imageUrl = image.storage_url;
      usedImageIds.push(image.id);
      // Tag-Match-Check: image.tags ∩ imageTags ≠ ∅
      imageTagMatch = (image.tags as string[]).some(t => imageTags.includes(t));
      console.log(`  Bild: ${imageFilename} | Tags: [${(image.tags as string[]).join(",")}]`);
      if (!imageTagMatch) console.log(`  ⚠️  Bild-Tag-Mismatch! Post-Tags: [${imageTags.join(",")}]`);
    } else {
      // Prüfen ob überhaupt Tag-Match existiert
      const anyMatch = await pickImageAnyMatch(imageTags, imageSeason);
      if (!anyMatch) {
        imageError = `NoMatchingImage: tags=[${imageTags.join(",")}]`;
      } else {
        imageError = `ImageRepetitionBlock: alle Bilder tags=[${imageTags.join(",")}] in ${minRepDays}d verwendet`;
      }
      console.log(`  ❌ Bild-Fehler: ${imageError}`);
    }

    // Validation-Gate
    const validResult = validate({
      body,
      must_include_usp: mustUSP,
      must_include_geo: mustGeo,
      min_chars: 140,
      max_chars: 280,
      cta_type: ctaType,
      theme_slot,
    });

    if (validResult.pass) {
      console.log(`  ✅ Validation: PASS`);
    } else {
      console.log(`  ❌ Validation: FAIL — ${validResult.reasons.join(", ")}`);
    }

    results.push({
      slot: slotNum, weekday, theme_slot, slotTime: slot_time, pool, body,
      clusterId, imageFilename, imageUrl,
      imageTagMatch: imageError ? false : imageTagMatch,
      imageError,
      validPass: validResult.pass,
      validReasons: validResult.reasons,
      ctaType, ctaUrl,
    });
  }

  // ── Slack-Report ─────────────────────────────────────────────────────────────

  const passed = results.filter(r => r.validPass && !r.imageError);
  const failed = results.filter(r => !r.validPass || r.imageError);

  console.log(`\n📊 Ergebnis: ${passed.length}/10 voll OK | ${failed.length}/10 mit Issues\n`);

  // Header
  await slackBlocks([
    {
      type: "header",
      text: { type: "plain_text", text: `🔬 Phase 4 — 10er Dry-Run (${SEASON})`, emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Validation-Gate:* ${results.filter(r => r.validPass).length}/10 pass ✅\n*Image-OK:* ${results.filter(r => !r.imageError).length}/10 ohne Fehler\n*Voll OK (Gate + Bild):* ${passed.length}/10\n${passed.length >= 9 ? "✅ Ziel ≥9/10 erreicht." : "⚠️ Ziel ≥9/10 verfehlt."}`,
      },
    },
    { type: "divider" },
  ], true);

  // Post-Previews: alle Blöcke sammeln, dann in Batches senden (verhindert Slack invalid_blocks bei >7 Einzelnachrichten)
  const ctaLabel: Record<string, string> = { reserve: "Reservieren", call: "Anrufen", learn_more: "Mehr erfahren", website: "Website" };
  const weekdayLabel: Record<string, string> = { mon: "Montag", wed: "Mittwoch", fri: "Freitag" };
  const allSlotBlocks: unknown[] = [];

  for (const r of results) {
    const hasImage = !!(r.imageUrl && r.imageFilename);
    const emoji = (r.validPass && !r.imageError) ? "🔲" : "❌";
    const clusterInfo = r.clusterId ? ` · ${r.clusterId}` : "";
    const statusLines: string[] = [];
    if (!r.validPass) statusLines.push(`Gate: ${r.validReasons.join(", ")}`);
    if (r.imageError) statusLines.push(r.imageError);
    if (!r.imageTagMatch && !r.imageError) statusLines.push("Tag-Mismatch");

    if (hasImage) {
      const imageUrl = r.imageUrl!.replace("https://ristorantestoria.de/", "https://www.ristorantestoria.de/");
      allSlotBlocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${emoji} *Slot ${r.slot} — ${weekdayLabel[r.weekday] || r.weekday} ${r.slotTime} · Pool ${r.pool}${clusterInfo}*`,
        },
      });
      allSlotBlocks.push({ type: "image", image_url: imageUrl, alt_text: r.imageFilename! });
      allSlotBlocks.push({
        type: "section",
        text: { type: "mrkdwn", text: (r.body || "_(Skip)_").substring(0, 2900) },
      });
      allSlotBlocks.push({
        type: "context",
        elements: [
          { type: "mrkdwn", text: `CTA: ${ctaLabel[r.ctaType] || r.ctaType}` },
          ...(statusLines.length ? [{ type: "mrkdwn" as const, text: statusLines.join(" | ") }] : []),
        ],
      });
      allSlotBlocks.push({ type: "divider" });
    } else {
      const icon = (r.validPass && !r.imageError) ? "✅" : "❌";
      allSlotBlocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `${icon} *Slot ${r.slot} — ${weekdayLabel[r.weekday] || r.weekday} · Pool ${r.pool}${clusterInfo}*`,
            r.body ? `> ${r.body.substring(0, 120)}${r.body.length > 120 ? "…" : ""}` : "_(Skip)_",
            statusLines.length ? statusLines.join(" | ") : "✅ OK",
          ].join("\n"),
        },
      });
      allSlotBlocks.push({ type: "divider" });
    }
  }

  // Batches à 40 Blöcke senden
  const BATCH_SIZE = 40;
  for (let i = 0; i < allSlotBlocks.length; i += BATCH_SIZE) {
    const batch = allSlotBlocks.slice(i, i + BATCH_SIZE);
    console.log(`  → Slot-Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} Blocks`);
    await slackBlocks(batch, true);
  }

  // Summary
  const issues = failed.map(r => {
    const parts = [];
    if (!r.validPass) parts.push(`Gate: ${r.validReasons.join(", ")}`);
    if (r.imageError) parts.push(r.imageError);
    return `• Slot ${r.slot} (${r.weekday}/${r.pool}): ${parts.join(" | ")}`;
  });

  await slackBlocks([
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: failed.length > 0
          ? `*Issues (${failed.length}):*\n${issues.join("\n")}\n\nKeine Auto-Korrektur — Antoine entscheidet.`
          : `✅ Alle 10 Slots fehlerfrei. Pipeline bereit für Live-Schaltung.`,
      },
    },
  ], true);

  await sql.end();
  console.log("\nPhase 4 abgeschlossen.");
}

main().catch(async (err) => {
  console.error("Fatal:", err);
  await slackText(`❌ Phase 4 Crash: ${String(err)}`).catch(() => {});
  process.exit(1);
});
