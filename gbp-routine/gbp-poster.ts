/**
 * GBP Routine — Hauptskript für automatisches GBP-Posting
 * Usage: npx tsx gbp-routine/gbp-poster.ts [--dry-run]
 * Env: DATABASE_URL, GBP_TOKEN_ENCRYPTION_KEY, SLACK_WEBHOOK_URL, ANTHROPIC_API_KEY
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createDecipheriv, createCipheriv, randomBytes } from "crypto";
import postgres from "postgres";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { slackText, slackPostPreview } from "./slack";
import { GEO_ANCHORS, USPS } from "./gbp-constants";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const ACCOUNT_ID = "114367954632843728381";
const LOCATION_ID = "17586248070861131392";
const BASE_URL = "https://ristorantestoria.de";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Crypto (identisch zu gbp-post-reply.mjs) ──────────────────────────────────

function decrypt(encoded: string): string {
  const key = Buffer.from(process.env.GBP_TOKEN_ENCRYPTION_KEY!, "hex");
  const [ivB64, tagB64, dataB64] = encoded.split(":");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf-8");
}

function encrypt(plaintext: string): string {
  const key = Buffer.from(process.env.GBP_TOKEN_ENCRYPTION_KEY!, "hex");
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf-8"), cipher.final()]);
  return [iv.toString("base64"), cipher.getAuthTag().toString("base64"), encrypted.toString("base64")].join(":");
}

// ── GBP OAuth Token ────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const [tokRow] = await sql`
    SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_oauth_tokens'
  `;
  const tokens = JSON.parse(decrypt(tokRow.setting_value));
  let accessToken: string = tokens.access_token;

  if (!tokens.expiry_date || Date.now() > tokens.expiry_date - 60000) {
    const [credRow] = await sql`
      SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_client_secret'
    `;
    const creds = JSON.parse(decrypt(credRow.setting_value));
    const c = creds.installed || creds.web;
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: c.client_id,
        client_secret: c.client_secret,
        refresh_token: tokens.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const refreshed = await res.json() as { access_token: string; expires_in: number };
    accessToken = refreshed.access_token;
    tokens.access_token = accessToken;
    tokens.expiry_date = Date.now() + refreshed.expires_in * 1000;
    const encTokens = encrypt(JSON.stringify(tokens));
    await sql`
      UPDATE google_business_settings SET setting_value = ${encTokens}, updated_at = now()
      WHERE setting_key = 'gbp_oauth_tokens'
    `;
  }

  return accessToken;
}

// ── Wochentag ermitteln ────────────────────────────────────────────────────────

function getWeekday(): "mon" | "wed" | "fri" {
  const day = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: "Europe/Berlin" }).toLowerCase();
  if (day === "mon") return "mon";
  if (day === "wed") return "wed";
  if (day === "fri") return "fri";
  // Fallback für manuellen Aufruf
  console.warn(`⚠️  Kein regulärer GBP-Tag (${day}), verwende 'mon' als Fallback`);
  return "mon";
}

function getSeason(): "spring" | "summer" | "autumn" | "winter" {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// ── Pool-Auswahl (Wochentag-basiert) ──────────────────────────────────────────

function selectPool(weekday: string): "A" | "B" | "C" {
  const rand = Math.random();
  if (weekday === "wed") return rand < 0.7 ? "C" : "B";
  return rand < 0.7 ? "A" : "B";
}

// ── Anti-Wiederholung: letzte 4 Wochen ────────────────────────────────────────

async function getRecentPostIds(pool: string): Promise<number[]> {
  const rows = await sql`
    SELECT post_id FROM gbp_post_log
    WHERE pool = ${pool}
      AND timestamp > NOW() - INTERVAL '28 days'
      AND status IN ('gepostet', 'dry_run')
      AND post_id IS NOT NULL
    ORDER BY timestamp DESC
  `;
  return rows.map((r) => r.post_id as number);
}

async function getRecentImageIds(): Promise<number[]> {
  const rows = await sql`
    SELECT image_id FROM gbp_post_log
    WHERE timestamp > NOW() - INTERVAL '28 days'
      AND status IN ('gepostet', 'dry_run')
      AND image_id IS NOT NULL
    ORDER BY timestamp DESC
  `;
  return rows.map((r) => r.image_id as number);
}

async function getRecentClusters(): Promise<string[]> {
  const rows = await sql`
    SELECT theme_cluster_id FROM gbp_post_log
    WHERE timestamp > NOW() - INTERVAL '28 days'
      AND status IN ('gepostet', 'dry_run')
      AND theme_cluster_id IS NOT NULL
    ORDER BY timestamp DESC
  `;
  return rows.map((r) => r.theme_cluster_id as string);
}

// ── Pool A / B: Post aus DB wählen ────────────────────────────────────────────

async function pickPostFromDB(pool: "A" | "B", season: string, themeSlot: string | null, recentIds: number[]) {
  // Pool A: theme_slot muss passen. Pool B: kein theme_slot-Filter.
  const slotFilter = themeSlot
    ? sql`AND theme_slot = ${themeSlot}`
    : sql``;

  const rows = await sql`
    SELECT * FROM gbp_posts
    WHERE pool = ${pool}
      AND (season = 'allyear' OR season = ${season})
      ${slotFilter}
      AND id != ALL(${recentIds.length > 0 ? recentIds : [-1]})
    ORDER BY COALESCE(last_used, '2000-01-01') ASC, use_count ASC
    LIMIT 1
  `;
  if (rows.length > 0) return rows[0];

  // Fallback: Anti-Repetition lockern (alle Posts dieses Slots kürzlich verwendet)
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

// ── Echte Mittagsgerichte aus DB ──────────────────────────────────────────────

async function getLunchMenuItems(): Promise<string> {
  const lunchMenu = await sql`
    SELECT m.id FROM menus m WHERE m.menu_type = 'lunch' AND m.is_published = TRUE LIMIT 1
  `;
  if (!lunchMenu.length) return "";

  const menuId = lunchMenu[0].id;
  const items = await sql`
    SELECT mi.name, mi.description, mi.price_display
    FROM menu_items mi
    JOIN menu_categories mc ON mc.id = mi.category_id
    WHERE mc.menu_id = ${menuId}
    ORDER BY mc.sort_order, mi.sort_order
    LIMIT 8
  `;
  if (!items.length) return "";
  return items.map((i: any) => `${i.name}${i.description ? ` (${i.description})` : ""}${i.price_display ? ` – ${i.price_display}` : ""}`).join(", ");
}

// ── Neue Menükarte → Extra-Post ────────────────────────────────────────────────

async function checkNewMenuAndPost(dryRun: boolean): Promise<boolean> {
  // Menüs die in den letzten 24h veröffentlicht wurden
  const newMenus = await sql`
    SELECT m.*,
      (SELECT COUNT(*) FROM gbp_post_log pl WHERE pl.theme_cluster_id = 'new_menu_' || m.id::text) as already_posted
    FROM menus m
    WHERE m.is_published = TRUE
      AND m.published_at > NOW() - INTERVAL '24 hours'
    LIMIT 1
  `;

  if (!newMenus.length || Number(newMenus[0].already_posted) > 0) return false;

  const menu = newMenus[0];
  console.log(`\n🆕 Neue Karte entdeckt: "${menu.title}" (${menu.menu_type})`);

  // Gerichte der neuen Karte laden
  const items = await sql`
    SELECT mi.name, mi.price_display
    FROM menu_items mi
    JOIN menu_categories mc ON mc.id = mi.category_id
    WHERE mc.menu_id = ${menu.id}
    ORDER BY mc.sort_order, mi.sort_order
    LIMIT 5
  `;

  const itemList = items.map((i: any) => `${i.name}${i.price_display ? ` (${i.price_display})` : ""}`).join(", ");

  const menuTypeLabels: Record<string, string> = {
    lunch: "Mittagsmenü",
    food: "Speisekarte",
    drinks: "Getränkekarte",
    special: "Sondermenü",
  };
  const typeLabel = menuTypeLabels[menu.menu_type] || "neue Karte";

  let postBody: string;
  if (items.length > 0) {
    postBody = `Neue ${typeLabel} im STORIA: ${itemList}. Karlstraße 47a, München — Tisch reservieren unter +49 89 51519696.`;
  } else {
    postBody = `${menu.title} ist jetzt im STORIA. Reservierung: +49 89 51519696. STORIA, Karlstraße 47a, Maxvorstadt.`;
  }
  // Kürzen auf max 300 Zeichen
  if (postBody.length > 300) postBody = postBody.substring(0, 297) + "...";

  const image = await pickImage(["innenraum", "abend"], "allyear", []);
  if (!image) return false;

  let gbpPostId: string | null = null;
  let status: "gepostet" | "failed" | "dry_run" = "dry_run";
  let errorLog: string | null = null;

  if (!dryRun) {
    try {
      const accessToken = await getAccessToken();
      gbpPostId = await postToGBP(postBody, "reserve", "https://ristorantestoria.de/reservierung", image.storage_url, accessToken);
      status = "gepostet";
      console.log(`✅ Neue-Karte-Post: ${gbpPostId}`);
    } catch (err) {
      status = "failed";
      errorLog = String(err);
      console.error(`❌ Neue-Karte-Post fehlgeschlagen: ${errorLog}`);
    }
  }

  await sql`
    INSERT INTO gbp_post_log (pool, theme_cluster_id, generated_body, gbp_post_id, status, error_log)
    VALUES ('B', ${"new_menu_" + menu.id}, ${postBody}, ${gbpPostId}, ${status}, ${errorLog})
  `;

  const emoji = status === "gepostet" ? "✅" : status === "dry_run" ? "🔲" : "❌";
  await slackReport(`${emoji} STORIA GBP${dryRun ? " [DRY RUN]" : ""}: Neue Karte → "${menu.title}"\n${postBody.substring(0, 80)}…`);

  return true;
}

// ── Pool C: Claude generiert ───────────────────────────────────────────────────

async function generatePoolCPost(weekday: string, season: string, themeSlot: string, recentClusters: string[]) {
  // Cluster wählen (zuletzt genutzten vermeiden)
  const [cluster] = await sql`
    SELECT * FROM gbp_theme_clusters
    WHERE cluster_id != ALL(${recentClusters.length > 0 ? recentClusters : ["__none__"]})
    ORDER BY COALESCE(last_used, '2000-01-01') ASC
    LIMIT 1
  `;
  const fallbackCluster = cluster || (await sql`SELECT * FROM gbp_theme_clusters ORDER BY COALESCE(last_used, '2000-01-01') ASC LIMIT 1`)[0];
  if (!fallbackCluster) throw new Error("Keine Theme-Cluster in DB");

  const promptTemplate = readFileSync(resolve(__dirname, "prompts/generate-post.md"), "utf-8");

  const input = {
    pool: "C",
    weekday,
    theme_slot: themeSlot,
    season,
    last_4_weeks_topics: recentClusters,
    theme_cluster: {
      cluster_id: fallbackCluster.cluster_id,
      tone_hint: fallbackCluster.tone_hint,
      examples: fallbackCluster.examples,
    },
  };

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `${promptTemplate}\n\n## Eingabe\n\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\`\n\nGib nur das JSON zurück, keinen anderen Text.`,
      },
    ],
  });

  const text = (response.content[0] as { type: string; text: string }).text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Claude lieferte kein valides JSON: ${text}`);
  const generated = JSON.parse(jsonMatch[0]);

  return { generated, cluster: fallbackCluster };
}

// ── Bild auswählen (kein Random-Fallback) ─────────────────────────────────────
// Wirft Fehler wenn kein passendes Bild gefunden oder alle zu kürzlich verwendet.
// Kein Fallback auf "irgendein Bild" — Post wird dann übersprungen + Slack-Alert.

async function pickImage(tags: string[], season: string, minRepetitionDays = 21) {
  // Primär: Tag + Season + Repetition-Check
  const [match] = await sql`
    SELECT * FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND (season = 'allyear' OR season = ${season})
      AND is_active = TRUE
      AND (last_used IS NULL OR last_used < NOW() - ${minRepetitionDays} * INTERVAL '1 day')
    ORDER BY COALESCE(last_used, '2000-01-01') ASC
    LIMIT 1
  `;
  if (match) return match;

  // Prüfen: Gibt es überhaupt ein Tag-Match? (Repetition-Block vs. komplett fehlende Tags)
  const [anyTagMatch] = await sql`
    SELECT id FROM gbp_images
    WHERE tags && ${tags}::text[]
      AND (season = 'allyear' OR season = ${season})
      AND is_active = TRUE
    LIMIT 1
  `;

  if (!anyTagMatch) {
    throw new Error(`NoMatchingImage: Kein Bild mit tags=[${tags.join(",")}] season=${season}`);
  }
  throw new Error(`ImageRepetitionBlock: Alle Bilder für tags=[${tags.join(",")}] innerhalb ${minRepetitionDays}d verwendet`);
}

// ── GBP API: Post erstellen ────────────────────────────────────────────────────

async function postToGBP(body: string, ctaType: string, ctaUrl: string, imageUrl: string, accessToken: string): Promise<string> {
  const ctaActionMap: Record<string, string> = {
    reserve: "BOOK",
    call: "CALL",
    learn_more: "LEARN_MORE",
    website: "ORDER",
  };

  const now = new Date();
  const yearWeek = `${now.getFullYear()}-W${String(Math.ceil((now.getDate() + 6) / 7)).padStart(2, "0")}`;
  const pool = "auto"; // wird im Aufruf gesetzt
  const utmUrl = ctaUrl.startsWith("tel:")
    ? ctaUrl
    : `${ctaUrl}${ctaUrl.includes("?") ? "&" : "?"}utm_source=gbp&utm_medium=post&utm_campaign=${pool}_${yearWeek}`;

  const payload: Record<string, unknown> = {
    languageCode: "de",
    summary: body,
    callToAction: {
      actionType: ctaActionMap[ctaType] || "LEARN_MORE",
      url: utmUrl.startsWith("tel:") ? undefined : utmUrl,
    },
    media: [
      {
        mediaFormat: "PHOTO",
        sourceUrl: imageUrl,
      },
    ],
  };

  // Telefon-CTA hat keine URL
  if (ctaType === "call") {
    payload.callToAction = { actionType: "CALL" };
  }

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/localPosts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GBP API Fehler ${res.status}: ${err}`);
  }

  const result = await res.json() as { name: string };
  return result.name;
}

// Slack-Funktionen: slackText + slackPostPreview aus ./slack.ts importiert
const slackReport = slackText;

// ── Haupt-Workflow ─────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const weekdayArg = process.argv.find(a => a.startsWith("--weekday="))?.split("=")[1] as "mon" | "wed" | "fri" | undefined;
  const weekday = weekdayArg ?? getWeekday();
  const season = getSeason();

  // Schedule prüfen
  const [schedule] = await sql`
    SELECT * FROM gbp_schedule WHERE weekday = ${weekday} AND is_active = TRUE LIMIT 1
  `;
  if (!schedule) {
    console.log(`Kein aktiver Schedule für ${weekday}, abgebrochen.`);
    await sql.end();
    return;
  }

  const dryRun = isDryRun || schedule.is_dry_run;
  const themeSlot = (schedule.theme_slot || "lifestyle") as string;

  console.log(`\n🚀 GBP-Poster — ${weekday} ${schedule.slot_time}, Season: ${season}, Slot: ${themeSlot}${dryRun ? " [DRY RUN]" : ""}\n`);

  // Pool wählen
  let pool = selectPool(weekday);
  console.log(`Pool: ${pool}`);

  // Anti-Wiederholung
  const recentPostIds = await getRecentPostIds(pool);
  const recentClusters = await getRecentClusters();

  let postBody: string;
  let ctaType: string;
  let ctaUrl: string;
  let imageTags: string[];
  let imageSeason: string;
  let postId: number | null = null;
  let clusterId: string | null = null;
  let minRepDays = 21;

  // Neue Karte prüfen (läuft immer, unabhängig vom regulären Pool)
  await checkNewMenuAndPost(dryRun);

  // Post-Inhalt bestimmen
  // Pool A/B: aus DB. Pool A ohne passenden theme_slot-Post → Fallback auf Pool C.
  let usePoolC = pool === "C";

  if (!usePoolC) {
    const post = await pickPostFromDB(pool, season, themeSlot, recentPostIds);
    if (!post) {
      if (pool === "A") {
        console.log(`⚠️  Kein Pool-A-Post für theme_slot=${themeSlot} — Fallback auf Pool C`);
        usePoolC = true;
      } else {
        throw new Error(`Kein Post in Pool ${pool} verfügbar`);
      }
    } else {
      // Pool A Mittagsmenü-Post: echte Gerichte aus DB einsetzen
      if (pool === "A" && post.title === "Mittagsmenü Wochenstart") {
        const lunchItems = await getLunchMenuItems();
        if (lunchItems) {
          postBody = `Im Mittagsmenü: ${lunchItems}. Mo–Fr 11:30–14:30 in der Karlstraße. Tisch: +49 89 51519696.`;
          if (postBody.length > 300) postBody = postBody.substring(0, 297) + "...";
        } else {
          postBody = post.body;
        }
      } else {
        postBody = post.body;
      }
      ctaType = post.cta_type;
      ctaUrl = post.cta_url;
      imageTags = post.image_tags || [];
      imageSeason = post.season || "allyear";
      postId = post.id;

      await sql`UPDATE gbp_posts SET last_used = NOW(), use_count = use_count + 1 WHERE id = ${postId}`;
      console.log(`Post-ID: ${postId} — "${post.title || postBody!.substring(0, 50)}..."`);
    }
  }

  if (usePoolC) {
    pool = "C";
    const { generated, cluster } = await generatePoolCPost(weekday, season, themeSlot, recentClusters);
    postBody = generated.body;
    ctaType = generated.cta_type;
    ctaUrl = generated.cta_url;
    // required_tags des Clusters für Image-Matching verwenden (robuster als Claude-generierte Tags)
    imageTags = (cluster.required_tags as string[])?.length
      ? (cluster.required_tags as string[])
      : (generated.image_tags || []);
    imageSeason = generated.image_season || season;
    clusterId = cluster.cluster_id;
    minRepDays = (cluster.min_image_repetition_days as number) || 21;

    await sql`UPDATE gbp_theme_clusters SET last_used = NOW() WHERE cluster_id = ${clusterId}`;
    console.log(`Theme-Cluster: ${clusterId}`);
  }

  // Bild wählen — kein Random-Fallback. Fehler → Skip + Slack-Alert.
  let image: Awaited<ReturnType<typeof pickImage>>;
  try {
    image = await pickImage(imageTags!, imageSeason!, minRepDays);
  } catch (err) {
    const msg = String(err);
    console.error(`❌ Bild-Fehler: ${msg}`);
    await slackReport(`⚠️ STORIA GBP Skip (${weekday} ${schedule.slot_time}): ${msg}`);
    await sql.end();
    return;
  }
  console.log(`Bild: ${image.filename}`);

  // Image last_used aktualisieren
  await sql`UPDATE gbp_images SET last_used = NOW(), use_count = use_count + 1 WHERE id = ${image.id}`;

  console.log(`\nPost-Text:\n${postBody}\n`);
  console.log(`CTA: ${ctaType} → ${ctaUrl}`);
  console.log(`Bild-URL: ${image.storage_url}`);

  let gbpPostId: string | null = null;
  let status: "gepostet" | "failed" | "dry_run" = "dry_run";
  let errorLog: string | null = null;

  if (!dryRun) {
    try {
      const accessToken = await getAccessToken();
      gbpPostId = await postToGBP(postBody, ctaType, ctaUrl, image.storage_url, accessToken);
      status = "gepostet";
      console.log(`\n✅ GBP-Post erstellt: ${gbpPostId}`);
    } catch (err) {
      status = "failed";
      errorLog = String(err);
      console.error(`\n❌ GBP-Post fehlgeschlagen: ${errorLog}`);
    }
  } else {
    console.log("\n[DRY RUN] — kein GBP-API-Call");
  }

  // Log eintragen
  await sql`
    INSERT INTO gbp_post_log
      (pool, post_id, image_id, theme_cluster_id, generated_body, gbp_post_id, status, error_log)
    VALUES
      (${pool}, ${postId}, ${image.id}, ${clusterId}, ${postBody}, ${gbpPostId}, ${status}, ${errorLog})
  `;

  // Slack-Report mit vollem Post-Preview
  await slackPostPreview({
    dryRun,
    status,
    weekday,
    slotTime: schedule.slot_time,
    pool,
    body: postBody,
    ctaType,
    ctaUrl,
    imageUrl: image.storage_url,
    imageFilename: image.filename,
    gbpPostId,
    errorLog,
  });

  await sql.end();
  console.log("\nDone.");
}

main().catch(async (err) => {
  console.error("Fatal:", err);
  await slackReport(`❌ STORIA GBP CRASH: ${String(err)}`).catch(() => {});
  process.exit(1);
});
