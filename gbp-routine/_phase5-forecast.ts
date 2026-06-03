/**
 * Phase 5: 156-Post-Forecast (Mai 2026 – April 2027)
 * Trockenlauf — kein DB-Write, kein Claude-API-Call.
 * Pool C: Cluster-Rotation simuliert, Validation auf examples[0].
 * Anti-Repetition: in-memory (frischer Start, DB-last_used ignoriert).
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { validate } from "../validators/gbp-post-validator.js";
import { slackBlocks, slackText } from "./slack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// ── Typen ────────────────────────────────────────────────────────────────────

type Season = "spring" | "summer" | "autumn" | "winter";
type Weekday = "mon" | "wed" | "fri";
type ThemeSlot = "lunch" | "brand" | "lifestyle";
type Pool = "A" | "B" | "C";

interface Slot { date: Date; weekday: Weekday; theme_slot: ThemeSlot; season: Season; }
interface PostRow { id: number; pool: string; season: string; theme_slot: string; body: string; cta_type: string; image_tags: string[]; }
interface ImageRow { id: number; filename: string; tags: string[]; season: string; }
interface ClusterRow { cluster_id: string; required_tags: string[]; min_image_repetition_days: number; must_include_usp: boolean; must_include_geo_anchor: boolean; examples: string[]; }

interface SlotResult {
  slot: number; date: string; weekday: Weekday; theme_slot: ThemeSlot; season: Season;
  pool: Pool; outcome: "PASS" | "FAIL" | "SKIP";
  failReason?: string; imageError?: string; validReasons?: string[];
  postId?: number; clusterId?: string; bodyReuseCount: number;
}

// ── 156 Slots generieren (Mo/Mi/Fr, 11.05.2026 – ~April 2027) ──────────────

function getSeason(m: number): Season {
  if ([3, 4, 5].includes(m)) return "spring";
  if ([6, 7, 8].includes(m)) return "summer";
  if ([9, 10, 11].includes(m)) return "autumn";
  return "winter";
}

function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  const d = new Date("2026-05-11");
  while (slots.length < 156) {
    const dow = d.getDay();
    if (dow === 1 || dow === 3 || dow === 5) {
      const m = d.getMonth() + 1;
      slots.push({
        date: new Date(d),
        weekday: dow === 1 ? "mon" : dow === 3 ? "wed" : "fri",
        theme_slot: dow === 1 ? "lunch" : dow === 3 ? "brand" : "lifestyle",
        season: getSeason(m),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return slots;
}

// ── In-Memory-Helfer ──────────────────────────────────────────────────────────

function simDaysSince(lastUsed: Date | undefined, slotDate: Date): number {
  if (!lastUsed) return 9999;
  return Math.floor((slotDate.getTime() - lastUsed.getTime()) / 86_400_000);
}

function pickPost(
  allPosts: PostRow[], pool: "A" | "B", season: Season, themeSlot: ThemeSlot,
  simPostLastUsed: Map<number, Date>
): PostRow | null {
  const cands = allPosts.filter(p =>
    p.pool === pool &&
    (p.season === "allyear" || p.season === season) &&
    p.theme_slot === themeSlot
  );
  if (!cands.length) return null;
  return cands.sort((a, b) => {
    const aL = simPostLastUsed.get(a.id)?.getTime() ?? 0;
    const bL = simPostLastUsed.get(b.id)?.getTime() ?? 0;
    return aL - bL;
  })[0];
}

function pickImage(
  allImages: ImageRow[], tags: string[], season: Season,
  minRepDays: number, slotDate: Date, simImageLastUsed: Map<number, Date>
): { image: ImageRow | null; anyMatch: boolean } {
  const cutoff = new Date(slotDate.getTime() - minRepDays * 86_400_000);
  const eligible = allImages.filter(img =>
    img.tags.some(t => tags.includes(t)) &&
    (img.season === "allyear" || img.season === season) &&
    (!simImageLastUsed.has(img.id) || simImageLastUsed.get(img.id)! < cutoff)
  );
  const anyMatch = allImages.some(img =>
    img.tags.some(t => tags.includes(t)) &&
    (img.season === "allyear" || img.season === season)
  );
  if (!eligible.length) return { image: null, anyMatch };
  const best = eligible.sort((a, b) =>
    (simImageLastUsed.get(a.id)?.getTime() ?? 0) - (simImageLastUsed.get(b.id)?.getTime() ?? 0)
  )[0];
  return { image: best, anyMatch };
}

function pickCluster(
  allClusters: ClusterRow[], simClusterLastUsed: Map<string, Date>
): ClusterRow {
  return allClusters.sort((a, b) =>
    (simClusterLastUsed.get(a.cluster_id)?.getTime() ?? 0) -
    (simClusterLastUsed.get(b.cluster_id)?.getTime() ?? 0)
  )[0];
}

// ── Haupt-Simulation ──────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔭 Phase 5 — 156-Post-Forecast (Mai 2026 – April 2027)\n");

  const allPostsRaw = await sql<PostRow[]>`SELECT id, pool, season, theme_slot, body, cta_type, image_tags FROM gbp_posts`;
  const allImages = await sql<ImageRow[]>`SELECT id, filename, tags, season FROM gbp_images`;
  const allClusters = await sql<ClusterRow[]>`SELECT cluster_id, required_tags, min_image_repetition_days, must_include_usp, must_include_geo_anchor, examples FROM gbp_theme_clusters`;

  const allPosts = allPostsRaw.map(p => ({
    ...p,
    image_tags: Array.isArray(p.image_tags) ? p.image_tags : [],
  }));

  const slots = buildSlots();
  const simPostLastUsed = new Map<number, Date>();
  const simImageLastUsed = new Map<number, Date>();
  const simClusterLastUsed = new Map<string, Date>();
  const postUseCount = new Map<number, number>();
  const results: SlotResult[] = [];

  for (let i = 0; i < slots.length; i++) {
    const { date, weekday, theme_slot, season } = slots[i];
    const slotNum = i + 1;
    let pool: Pool = weekday === "wed"
      ? (Math.random() < 0.7 ? "C" : "B")
      : (Math.random() < 0.7 ? "A" : "B");

    let body = ""; let ctaType = "learn_more"; let imageTags: string[] = [];
    let minRepDays = 21; let mustUSP = true; let mustGeo = true;
    let postId: number | undefined; let clusterId: string | undefined;
    let skipReason: string | undefined; let usePoolC = pool === "C";

    if (!usePoolC) {
      const post = pickPost(allPosts, pool as "A" | "B", season, theme_slot, simPostLastUsed);
      if (!post) {
        if (pool === "A") { usePoolC = true; pool = "C"; }
        else { skipReason = `PoolB/${theme_slot}: 0 Posts`; }
      } else {
        body = post.body; ctaType = post.cta_type;
        imageTags = post.image_tags; postId = post.id;
        simPostLastUsed.set(post.id, date);
        postUseCount.set(post.id, (postUseCount.get(post.id) ?? 0) + 1);
      }
    }

    if (usePoolC) {
      pool = "C";
      const cluster = pickCluster(allClusters, simClusterLastUsed);
      clusterId = cluster.cluster_id;
      // Simulate: use first example as proxy body for validation
      body = cluster.examples[0] ?? "";
      ctaType = theme_slot === "brand" ? "learn_more" : "reserve";
      imageTags = cluster.required_tags;
      minRepDays = cluster.min_image_repetition_days ?? 21;
      mustUSP = cluster.must_include_usp !== false;
      mustGeo = cluster.must_include_geo_anchor !== false;
      simClusterLastUsed.set(cluster.cluster_id, date);
    }

    if (skipReason) {
      results.push({ slot: slotNum, date: date.toISOString().slice(0, 10), weekday, theme_slot, season, pool, outcome: "SKIP", failReason: skipReason, bodyReuseCount: 0 });
      continue;
    }

    // Bild wählen
    const { image, anyMatch } = pickImage(allImages, imageTags, season, minRepDays, date, simImageLastUsed);
    let imageError: string | undefined;
    if (image) {
      simImageLastUsed.set(image.id, date);
    } else {
      imageError = anyMatch
        ? `ImageRepetitionBlock [${imageTags.join(",")}] ${minRepDays}d`
        : `NoMatchingImage [${imageTags.join(",")}]`;
    }

    // Validation
    const vr = validate({ body, must_include_usp: mustUSP, must_include_geo: mustGeo, min_chars: 140, max_chars: 280, cta_type: ctaType, theme_slot });

    const outcome: "PASS" | "FAIL" = (vr.pass && !imageError) ? "PASS" : "FAIL";
    const bodyReuseCount = postId ? (postUseCount.get(postId) ?? 1) : 0;

    results.push({
      slot: slotNum, date: date.toISOString().slice(0, 10), weekday, theme_slot, season, pool,
      outcome, failReason: imageError || (vr.pass ? undefined : vr.reasons.join(", ")),
      imageError, validReasons: vr.reasons, postId, clusterId, bodyReuseCount,
    });
  }

  // ── Statistiken ─────────────────────────────────────────────────────────────

  const total = results.length;
  const passed = results.filter(r => r.outcome === "PASS").length;
  const failed = results.filter(r => r.outcome === "FAIL").length;
  const skipped = results.filter(r => r.outcome === "SKIP").length;

  // Per-Saison
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
  const seasonStats = seasons.map(s => {
    const sr = results.filter(r => r.season === s);
    const sp = sr.filter(r => r.outcome === "PASS").length;
    const ss = sr.filter(r => r.outcome === "SKIP").length;
    const sf = sr.filter(r => r.outcome === "FAIL").length;
    return { s, total: sr.length, pass: sp, skip: ss, fail: sf, pct: sr.length ? Math.round(sp / sr.length * 100) : 0 };
  });

  // Pool-Verteilung
  const poolDist: Record<Pool, number> = { A: 0, B: 0, C: 0 };
  for (const r of results) poolDist[r.pool]++;
  const poolExpected = { A: Math.round(total * 0.70 * 2/3), B: Math.round(total * 0.30), C: Math.round(total * 0.70 * 1/3) };

  // ImageRepetitionBlock pro Tag-Gruppe
  const repBlocks = new Map<string, number>();
  for (const r of results.filter(r => r.imageError?.startsWith("ImageRepetitionBlock"))) {
    const key = r.imageError!;
    repBlocks.set(key, (repBlocks.get(key) ?? 0) + 1);
  }

  // Slot-Pool-Kombis mit <3 Posts
  type SlotKey = `${"A"|"B"}/${ThemeSlot}/${Season|"allyear"}`;
  const slotCoverage: Record<string, number> = {};
  for (const pool of ["A", "B"] as const) {
    for (const ts of ["lunch", "brand", "lifestyle"] as ThemeSlot[]) {
      for (const s of [...seasons, "allyear"] as (Season | "allyear")[]) {
        const count = allPosts.filter(p =>
          p.pool === pool && p.theme_slot === ts &&
          (p.season === s || p.season === "allyear" || s === "allyear")
        ).length;
        const key = `${pool}/${ts}/${s}`;
        slotCoverage[key] = count;
      }
    }
  }
  const sparseSlots = Object.entries(slotCoverage)
    .filter(([, c]) => c < 3)
    .sort(([, a], [, b]) => a - b);

  // Post-Wiederholungs-Top5
  const topReused = [...postUseCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const p = allPosts.find(x => x.id === id)!;
      return { id, count, pool: p.pool, theme_slot: p.theme_slot, body: p.body.substring(0, 60) };
    });

  // NoMatchingImage
  const noMatch = results.filter(r => r.imageError?.startsWith("NoMatchingImage"));

  // ── Console Summary ──────────────────────────────────────────────────────────

  console.log(`\n📊 Gesamt: ${passed}/${total} PASS (${Math.round(passed/total*100)}%) | ${failed} FAIL | ${skipped} SKIP`);
  console.log(`\nPro Saison:`);
  for (const s of seasonStats) {
    console.log(`  ${s.s.padEnd(7)}: ${s.pass}/${s.total} (${s.pct}%) | skip=${s.skip} fail=${s.fail}`);
  }
  console.log(`\nPool-Verteilung: A=${poolDist.A} B=${poolDist.B} C=${poolDist.C}`);
  console.log(`Pool-Erwartet:   A≈${poolExpected.A} B≈${poolExpected.B} C≈${poolExpected.C}`);
  console.log(`\nSparse Slots (<3 Posts):`);
  for (const [key, count] of sparseSlots.slice(0, 10)) {
    console.log(`  ${count === 0 ? "⛔" : "⚠️ "} ${key}: ${count}`);
  }
  console.log(`\nTop wiederholte Posts:`);
  for (const r of topReused) {
    console.log(`  ID ${r.id} (Pool ${r.pool}/${r.theme_slot}): ${r.count}× — "${r.body}..."`);
  }

  // ── Slack-Report ─────────────────────────────────────────────────────────────

  const passRate = Math.round(passed / total * 100);
  const skipRate = Math.round(skipped / total * 100);
  const failRate = Math.round(failed / total * 100);

  // Block 1: Header + Overall
  await slackBlocks([
    { type: "header", text: { type: "plain_text", text: "🔭 Phase 5 — 156-Post-Forecast (Mai 2026 – April 2027)", emoji: true } },
    { type: "section", text: { type: "mrkdwn", text:
      `*Gesamt:* ${total} Slots | *PASS:* ${passed} (${passRate}%) | *FAIL:* ${failed} (${failRate}%) | *SKIP:* ${skipped} (${skipRate}%)\n` +
      `*Pool-Verteilung:* A=${poolDist.A} | B=${poolDist.B} | C=${poolDist.C}` +
      ` _(erwartet A≈${poolExpected.A} B≈${poolExpected.B} C≈${poolExpected.C})_`
    }},
    { type: "divider" },
  ], true);

  // Block 2: Per-Saison
  const seasonTable = seasonStats.map(s =>
    `${s.s.charAt(0).toUpperCase() + s.s.slice(1).padEnd(6)}: ${s.pass}/${s.total} (${s.pct}%) — skip=${s.skip} fail=${s.fail}`
  ).join("\n");
  await slackBlocks([
    { type: "section", text: { type: "mrkdwn", text: `*📅 Pass-Quote pro Saison:*\n\`\`\`\n${seasonTable}\n\`\`\`` }},
    { type: "divider" },
  ], true);

  // Block 3: ImageRepetitionBlock
  const repText = repBlocks.size === 0
    ? "✅ Keine ImageRepetitionBlocks erwartet."
    : [...repBlocks.entries()].map(([k, n]) => `• \`${k}\` — ${n}×`).join("\n");
  const noMatchText = noMatch.length === 0
    ? ""
    : `\n\n*NoMatchingImage (${noMatch.length}×):*\n` + [...new Set(noMatch.map(r => r.imageError))].map(e => `• \`${e}\``).join("\n");

  await slackBlocks([
    { type: "section", text: { type: "mrkdwn", text: `*🖼️ ImageRepetitionBlock-Analyse:*\n${repText}${noMatchText}` }},
    { type: "divider" },
  ], true);

  // Block 4: Slot-Coverage
  const zeroSlots = sparseSlots.filter(([, c]) => c === 0);
  const lowSlots = sparseSlots.filter(([, c]) => c > 0 && c < 3);
  const slotCovText = [
    zeroSlots.length > 0
      ? `*⛔ 0 Posts (immer Skip):*\n` + zeroSlots.map(([k]) => `• ${k}`).join("\n")
      : "✅ Keine komplett leeren Slots.",
    lowSlots.length > 0
      ? `\n\n*⚠️ 1–2 Posts (Repetitionsrisiko):*\n` + lowSlots.map(([k, c]) => `• ${k}: ${c} Post${c > 1 ? "s" : ""}`).join("\n")
      : "",
  ].join("");
  await slackBlocks([
    { type: "section", text: { type: "mrkdwn", text: `*📦 Slot-Abdeckung Pool A/B (<3 Posts):*\n${slotCovText}` }},
    { type: "divider" },
  ], true);

  // Block 5: Top Wiederholungen
  const reuseText = topReused.map(r =>
    `• ID ${r.id} (Pool ${r.pool}/${r.theme_slot}): *${r.count}×* pro Jahr — _"${r.body}…"_`
  ).join("\n");
  await slackBlocks([
    { type: "section", text: { type: "mrkdwn", text: `*🔁 Top-Wiederholungen (Post-Body):*\n${reuseText}` }},
    { type: "divider" },
  ], true);

  // Block 6: Top-3 Empfehlungen
  const recs: string[] = [];

  // Rec 1: Pool B Gaps
  const poolBGaps = zeroSlots.filter(([k]) => k.startsWith("B/")).map(([k]) => k.split("/")[1]).filter((v, i, a) => a.indexOf(v) === i);
  if (poolBGaps.length > 0) {
    recs.push(`*1. Pool-B-Lücken schließen (${skipped} Skips = ${skipRate}% aller Slots):*\n` +
      poolBGaps.map(ts => `   • ${ts}: mind. 2–3 neue Pool-B-Posts anlegen`).join("\n") + "\n" +
      `   → alternativ: Pool-B → Pool-C Fallback in gbp-poster.ts aktivieren`);
  }

  // Rec 2: Pool A Repetition
  const highRepPosts = topReused.filter(r => r.count >= 10 && r.pool === "A");
  if (highRepPosts.length > 0) {
    const slots_affected = [...new Set(highRepPosts.map(r => r.theme_slot))];
    recs.push(`*${recs.length + 1}. Pool-A-Repetition reduzieren (${highRepPosts[0].count}× gleicher Text/Jahr):*\n` +
      slots_affected.map(ts => {
        const cur = allPosts.filter(p => p.pool === "A" && p.theme_slot === ts).length;
        return `   • Pool A/${ts}: aktuell ${cur} Posts → mind. 5 für ≤7× Wiederholung/Jahr`;
      }).join("\n"));
  }

  // Rec 3: Image or NoMatch
  if (noMatch.length > 0) {
    const tags = [...new Set(noMatch.map(r => {
      const m = r.imageError?.match(/\[([^\]]+)\]/);
      return m ? m[1] : "?";
    }))];
    recs.push(`*${recs.length + 1}. Fehlende Bilder hinzufügen:*\n` +
      tags.map(t => `   • Tag-Gruppe [${t}]: 0 passende Bilder → mind. 2 Bilder uploaden`).join("\n"));
  } else if (repBlocks.size > 0) {
    const topBlock = [...repBlocks.entries()].sort((a, b) => b[1] - a[1])[0];
    recs.push(`*${recs.length + 1}. Bild-Pool für häufige Cluster erweitern:*\n` +
      `   • \`${topBlock[0]}\` verursacht ${topBlock[1]} Blocks — 2–3 weitere Bilder mit diesen Tags anlegen`);
  } else {
    recs.push(`*${recs.length + 1}. Bild-Pool:* ✅ Keine Repetition-Blocks erwartet. Kein Handlungsbedarf.`);
  }

  if (recs.length < 3) {
    recs.push(`*${recs.length + 1}. Pool C Cluster:* ${allClusters.length} Cluster für 36 Wed/brand-Slots (3× je Cluster/Jahr). ` +
      `Qualität abhängig von Claude — HARDRULE-Prompt aus Phase 4.5 aktiv.`);
  }

  await slackBlocks([
    { type: "section", text: { type: "mrkdwn", text:
      `*🎯 Top-${recs.length} Empfehlungen vor Live-Schaltung:*\n\n` + recs.join("\n\n")
    }},
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text:
      passRate >= 85
        ? `✅ *Forecast-Fazit:* ${passRate}% Pass-Rate. Pipeline ist live-bereit — Content-Nachzug empfohlen aber nicht blocking.`
        : `⚠️ *Forecast-Fazit:* Nur ${passRate}% Pass-Rate. Content-Nachzug vor Live-Schaltung *dringend empfohlen*.`
    }},
  ], true);

  await sql.end();
  console.log("\n✅ Phase 5 Forecast abgeschlossen.");
}

main().catch(async (err) => {
  console.error("Fatal:", err);
  await slackText(`❌ Phase 5 Crash: ${String(err)}`).catch(() => {});
  process.exit(1);
});
