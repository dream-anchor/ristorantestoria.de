#!/usr/bin/env node
/**
 * Fetches Google Reviews via GBP API v4 (mybusiness.googleapis.com).
 * Uses OAuth tokens from Neon DB (same pattern as sync-gbp-menu.ts).
 * Paginates through all reviews, filters 4-5 stars + >=50 chars, saves top 50.
 * Saves to src/data/google-reviews-{de,en,it,fr}.json.
 *
 * Required env vars:
 *   DATABASE_URL             — Neon Connection String
 *   GBP_TOKEN_ENCRYPTION_KEY — AES-256-GCM key (hex) for OAuth token decryption
 *
 * Usage:
 *   npm run fetch-reviews
 *   npm run fetch-reviews -- --force
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createDecipheriv, randomBytes, createCipheriv } from 'crypto';
import * as https from 'https';
import postgres from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../src/data');
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LANGUAGES = ['de', 'en', 'it', 'fr'];
const MAX_REVIEWS = 50;
const MIN_RATING = 4;
const MIN_TEXT_LENGTH = 50;
const MAX_FETCH = 200; // max reviews to collect before filtering

const GBP_ACCOUNT_ID = '114367954632843728381';
const GBP_LOCATION_ID = '17586248070861131392';
const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

const ALGORITHM = 'aes-256-gcm';
const STAR_MAP = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

// Ausf\u00fchrliche Zusammenfassungen basierend auf echten 4-5\u2605 Bewertungen
const SUMMARIES = {
  de: '\u00dcber 780 G\u00e4ste bewerten das STORIA mit durchschnittlich 4,5 Sternen. Besonders gelobt werden die neapolitanische Pizza aus dem Steinofen, die hausgemachte Pasta und die frischen Fischgerichte. Viele Stammg\u00e4ste heben das stilvolle Ambiente mit warmem Licht und italienischer Musik hervor. Der Service wird als herzlich, aufmerksam und professionell beschrieben \u2013 auch bei gr\u00f6\u00dferen Gruppen. Die zentrale Lage nahe K\u00f6nigsplatz und Theresienstra\u00dfe macht das Restaurant zum beliebten Treffpunkt in der M\u00fcnchner Maxvorstadt. Das Tiramis\u00f9 nach eigenem Hausrezept und die Weinauswahl werden in zahlreichen Bewertungen als Highlights genannt.',
  en: 'Over 780 guests rate STORIA an average of 4.5 stars. The Neapolitan stone-oven pizza, homemade pasta, and fresh seafood dishes receive particular praise. Many regulars highlight the stylish ambiance with warm lighting and Italian music. Service is consistently described as warm, attentive, and professional \u2013 even for larger groups. The central location near K\u00f6nigsplatz makes it a popular meeting point in Munich\u2019s Maxvorstadt district. The house-recipe tiramis\u00f9 and the wine selection are frequently mentioned as standout highlights.',
  it: 'Oltre 780 ospiti valutano il STORIA con una media di 4,5 stelle. La pizza napoletana dal forno a pietra, la pasta fatta in casa e i piatti di pesce fresco ricevono elogi particolari. Molti clienti abituali sottolineano l\u2019elegante atmosfera con luci calde e musica italiana. Il servizio viene descritto come cordiale, attento e professionale \u2013 anche per gruppi numerosi. La posizione centrale vicino a K\u00f6nigsplatz lo rende un punto d\u2019incontro amato nel quartiere Maxvorstadt di Monaco. Il tiramis\u00f9 con ricetta della casa e la selezione di vini vengono citati come punti di forza.',
  fr: 'Plus de 780 clients attribuent au STORIA une note moyenne de 4,5 \u00e9toiles. La pizza napolitaine au four \u00e0 pierre, les p\u00e2tes fra\u00eeches maison et les plats de poisson frais sont particuli\u00e8rement appr\u00e9ci\u00e9s. De nombreux habitu\u00e9s soulignent l\u2019ambiance \u00e9l\u00e9gante avec \u00e9clairage chaleureux et musique italienne. Le service est d\u00e9crit comme chaleureux, attentif et professionnel \u2013 m\u00eame pour les grands groupes. L\u2019emplacement central pr\u00e8s de K\u00f6nigsplatz en fait un lieu de rencontre pris\u00e9 dans le quartier Maxvorstadt de Munich. Le tiramis\u00f9 maison et la carte des vins sont r\u00e9guli\u00e8rement cit\u00e9s comme des atouts majeurs.',
};

const SUMMARY_LABELS = {
  de: 'Zusammenfassung aus \u00fcber 780 Bewertungen',
  en: 'Summary from over 780 reviews',
  it: 'Riepilogo di oltre 780 recensioni',
  fr: 'R\u00e9sum\u00e9 de plus de 780 avis',
};

// ── Load .env ──
function loadEnv() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const FORCE = process.argv.includes('--force');

// ── Cache check ──
const cacheFile = resolve(DATA_DIR, 'google-reviews-de.json');
if (!FORCE && existsSync(cacheFile)) {
  try {
    const cached = JSON.parse(readFileSync(cacheFile, 'utf-8'));
    if (cached.lastFetched) {
      const age = Date.now() - new Date(cached.lastFetched).getTime();
      if (age < CACHE_MAX_AGE_MS && cached.reviews?.length > 0) {
        console.log(`\u23ed\ufe0f  Cache is ${Math.round(age / 3600000)}h old (< 24h). Use --force to override.`);
        process.exit(0);
      }
    }
  } catch { /* proceed */ }
}

// ── Encryption (AES-256-GCM) ──
function getEncryptionKey() {
  const keyHex = process.env.GBP_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) { console.error('\u274c GBP_TOKEN_ENCRYPTION_KEY nicht gesetzt.'); process.exit(1); }
  return Buffer.from(keyHex, 'hex');
}

function decrypt(encoded) {
  const key = getEncryptionKey();
  const [ivB64, tagB64, dataB64] = encoded.split(':');
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf-8');
}

function encrypt(plaintext) {
  const key = getEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join(':');
}

// ── OAuth Token Management ──
function refreshTokenHttp(clientId, clientSecret, refToken) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: clientId, client_secret: clientSecret,
      refresh_token: refToken, grant_type: 'refresh_token',
    }).toString();
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': String(Buffer.byteLength(postData)) },
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(body)) : reject(new Error(`Refresh failed (${res.statusCode}): ${body}`)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function loadCredentials(sql) {
  const [row] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_client_secret'`;
  if (!row) { console.error('\u274c Kein Client Secret in DB gefunden.'); process.exit(1); }
  const raw = JSON.parse(decrypt(row.setting_value));
  const c = raw.installed || raw.web;
  return { client_id: c.client_id, client_secret: c.client_secret };
}

async function maybeRefreshToken(sql, tokens) {
  const isExpired = !tokens.expiry_date || Date.now() > tokens.expiry_date - 5 * 60 * 1000;
  if (!isExpired) {
    console.log('\u2705 Access Token noch g\u00fcltig');
    return tokens.access_token;
  }
  console.log('\ud83d\udd04 Access Token abgelaufen, refreshe...');
  const creds = await loadCredentials(sql);
  const refreshed = await refreshTokenHttp(creds.client_id, creds.client_secret, tokens.refresh_token);
  const updated = {
    access_token: refreshed.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: Date.now() + refreshed.expires_in * 1000,
  };
  const encrypted = encrypt(JSON.stringify(updated));
  await sql`UPDATE google_business_settings SET setting_value = ${encrypted}, updated_at = now() WHERE setting_key = 'gbp_oauth_tokens'`;
  console.log('\u2705 Access Token erneuert + in DB gespeichert');
  return refreshed.access_token;
}

async function getAccessToken(sql) {
  const [tokensRow] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_oauth_tokens'`;
  if (!tokensRow) { console.error('\u274c Keine OAuth-Tokens in DB gefunden.'); process.exit(1); }
  const tokens = JSON.parse(decrypt(tokensRow.setting_value));
  return await maybeRefreshToken(sql, tokens);
}

// ── GBP Reviews API ──
async function fetchReviewsPage(accessToken, pageToken) {
  const params = new URLSearchParams({ pageSize: '50' });
  if (pageToken) params.set('pageToken', pageToken);
  const url = `${GBP_API_BASE}/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/reviews?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`GBP API HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAllReviews(accessToken) {
  const allReviews = [];
  let pageToken = null;
  let averageRating = 0;
  let totalReviewCount = 0;

  do {
    const data = await fetchReviewsPage(accessToken, pageToken);
    if (!averageRating) averageRating = data.averageRating || 0;
    if (!totalReviewCount) totalReviewCount = data.totalReviewCount || 0;
    const reviews = data.reviews || [];
    allReviews.push(...reviews);
    pageToken = data.nextPageToken || null;
    console.log(`   Fetched page: ${reviews.length} reviews (total so far: ${allReviews.length})`);
  } while (pageToken && allReviews.length < MAX_FETCH);

  return { allReviews, averageRating, totalReviewCount };
}

// ── Language Detection ──
const germanWords = ['und', 'der', 'die', 'das', 'ein', 'eine', 'ist', 'war', 'sehr', 'wir', 'ich', 'mit', 'auch', 'aber', 'hier', 'f\u00fcr', 'bei', 'zum', 'haben', 'nicht', 'kann', 'nur', 'alle'];
const englishWords = ['the', 'and', 'was', 'were', 'have', 'had', 'with', 'for', 'this', 'that', 'very', 'great', 'amazing', 'beautiful', 'excellent', 'perfect', 'recommend', 'would', 'really'];
const italianWords = ['che', 'del', 'una', 'sono', 'molto', 'anche', 'questo', 'questa', 'stato', 'ottimo', 'buono', 'bello', 'posto', 'cibo', 'servizio', 'consiglio', 'davvero', 'sempre', 'tutto', 'nella'];
const frenchWords = ['les', 'des', 'une', 'est', 'nous', 'avec', 'pour', 'dans', 'tr\u00e8s', 'bien', 'bon', 'bonne', 'cette', 'sont', 'mais', 'aussi', 'tout', 'fait', 'comme', 'chez'];

function detectLanguage(text) {
  if (!text) return 'other';
  const words = text.toLowerCase().split(/\s+/);
  const deScore = words.filter(w => germanWords.includes(w)).length;
  const enScore = words.filter(w => englishWords.includes(w)).length;
  const itScore = words.filter(w => italianWords.includes(w)).length;
  const frScore = words.filter(w => frenchWords.includes(w)).length;
  const maxScore = Math.max(deScore, enScore, itScore, frScore);
  if (maxScore === 0) return 'other';
  if (deScore === maxScore) return 'de';
  if (enScore === maxScore) return 'en';
  if (itScore === maxScore) return 'it';
  if (frScore === maxScore) return 'fr';
  return 'other';
}

// ── Relative Time Formatting ──
function formatRelativeTime(isoDate, lang) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 7) {
    if (diffDays <= 1) return { de: 'vor 1 Tag', en: '1 day ago', it: '1 giorno fa', fr: 'il y a 1 jour' }[lang] || '1 day ago';
    return { de: `vor ${diffDays} Tagen`, en: `${diffDays} days ago`, it: `${diffDays} giorni fa`, fr: `il y a ${diffDays} jours` }[lang] || `${diffDays} days ago`;
  }
  if (diffDays < 30) {
    const n = Math.floor(diffDays / 7);
    if (n === 1) return { de: 'vor 1 Woche', en: '1 week ago', it: '1 settimana fa', fr: 'il y a 1 semaine' }[lang] || '1 week ago';
    return { de: `vor ${n} Wochen`, en: `${n} weeks ago`, it: `${n} settimane fa`, fr: `il y a ${n} semaines` }[lang] || `${n} weeks ago`;
  }
  if (diffDays < 365) {
    const n = Math.floor(diffDays / 30);
    if (n === 1) return { de: 'vor 1 Monat', en: '1 month ago', it: '1 mese fa', fr: 'il y a 1 mois' }[lang] || '1 month ago';
    return { de: `vor ${n} Monaten`, en: `${n} months ago`, it: `${n} mesi fa`, fr: `il y a ${n} mois` }[lang] || `${n} months ago`;
  }
  const n = Math.floor(diffDays / 365);
  if (n === 1) return { de: 'vor 1 Jahr', en: '1 year ago', it: '1 anno fa', fr: 'il y a 1 an' }[lang] || '1 year ago';
  return { de: `vor ${n} Jahren`, en: `${n} years ago`, it: `${n} anni fa`, fr: `il y a ${n} anni` }[lang] || `${n} years ago`;
}

// ── Map GBP review to internal format ──
const negativePatterns = /anwalt|peinlich|entt\u00e4uschung|entt\u00e4uscht|f\u00e4lschen|aufpolieren|leider nicht|nie wieder|schlecht|katastroph/i;

function mapGbpReview(r) {
  const text = r.comment || '';
  const rating = STAR_MAP[r.starRating] || 0;
  const lang = detectLanguage(text);
  const isNegative = negativePatterns.test(text);
  return {
    authorName: r.reviewer?.displayName || 'Anonym',
    rating,
    text,
    updateTime: r.updateTime || r.createTime || '',
    language: lang,
    isNegative,
    valid: rating >= MIN_RATING && text.length >= MIN_TEXT_LENGTH && lang !== 'other' && !isNegative,
  };
}

// ── Main ──
console.log('\ud83d\udd04 Fetching Google Reviews via GBP API...');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('\u274c DATABASE_URL nicht gesetzt.');
  process.exit(1);
}

let sql;
try {
  sql = postgres(dbUrl, { ssl: 'require' });

  console.log('\ud83d\udd11 Authentifiziere bei Google...');
  const accessToken = await getAccessToken(sql);

  console.log('\ud83d\udce5 Lade Reviews von GBP API...');
  const { allReviews, averageRating, totalReviewCount } = await fetchAllReviews(accessToken);

  console.log(`\n\ud83c\udf10 GBP: ${averageRating}/5, ${totalReviewCount} total, ${allReviews.length} fetched`);

  // Map + filter
  const mapped = allReviews
    .map(mapGbpReview)
    .filter(r => r.valid);

  const byLang = { de: [], en: [], it: [], fr: [] };
  for (const r of mapped) {
    if (byLang[r.language]) byLang[r.language].push(r);
  }

  console.log(`\ud83d\udcca Valid: ${mapped.length} total — DE: ${byLang.de.length}, EN: ${byLang.en.length}, IT: ${byLang.it.length}, FR: ${byLang.fr.length}`);

  const now = new Date().toISOString();

  for (const lang of LANGUAGES) {
    // Primary: reviews in target language (sorted newest first)
    let reviews = [...byLang[lang]].sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));

    // Fill with DE if needed
    if (lang !== 'de') {
      for (const r of byLang.de.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(m => m.authorName === r.authorName)) reviews.push(r);
      }
    }

    // Fill with EN if still needed (for IT/FR)
    if (lang === 'it' || lang === 'fr') {
      for (const r of byLang.en.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(m => m.authorName === r.authorName)) reviews.push(r);
      }
    }

    reviews = reviews.slice(0, MAX_REVIEWS);

    // Map to output format with localized relativeTimeDescription
    const outputReviews = reviews.map(r => ({
      authorName: r.authorName,
      rating: r.rating,
      text: r.text,
      relativeTimeDescription: formatRelativeTime(r.updateTime, lang),
      time: Math.floor(new Date(r.updateTime).getTime() / 1000),
      language: r.language,
    }));

    const output = {
      placeId: `accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}`,
      rating: averageRating,
      totalReviews: totalReviewCount,
      lastFetched: now,
      summary: SUMMARIES[lang],
      summaryLabel: SUMMARY_LABELS[lang],
      reviews: outputReviews,
    };

    const outPath = resolve(DATA_DIR, `google-reviews-${lang}.json`);
    writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
    console.log(`   \u2705 ${lang.toUpperCase()}: ${outputReviews.length} reviews saved`);
  }

  console.log(`\n\u2705 Done! Rating: ${averageRating}/5 (${totalReviewCount} total)`);

} catch (err) {
  console.error('\u274c Fetch failed:', err.message);

  const hasCache = LANGUAGES.some(l =>
    existsSync(resolve(DATA_DIR, `google-reviews-${l}.json`))
  );
  if (hasCache) {
    console.log('\ud83d\udce6 Keeping existing cached reviews as fallback.');
    process.exit(0);
  }
  process.exit(1);
} finally {
  if (sql) await sql.end();
}
