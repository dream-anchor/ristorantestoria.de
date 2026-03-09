#!/usr/bin/env node
/**
 * Fetches Google Reviews via Places API (New) in 4 languages.
 * Saves to src/data/google-reviews-{de,en,it,fr}.json.
 *
 * Required env vars:
 *   GOOGLE_PLACES_API_KEY — Google Cloud API key with Places API enabled
 *   GOOGLE_PLACE_ID      — Place ID (format: ChIJ...)
 *
 * Usage:
 *   npm run fetch-reviews
 *   npm run fetch-reviews -- --force
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../src/data');
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LANGUAGES = ['de', 'en', 'it', 'fr'];
const MAX_REVIEWS = 10;
const MIN_RATING = 4;

// AI-generated summaries (update manually when review themes change)
const SUMMARIES = {
  de: 'Unsere G\u00e4ste sch\u00e4tzen besonders die authentische italienische K\u00fcche mit neapolitanischer Pizza aus dem Steinofen, den aufmerksamen und herzlichen Service sowie die stilvolle Atmosph\u00e4re. Die zentrale Lage nahe dem K\u00f6nigsplatz wird regelm\u00e4\u00dfig als Pluspunkt hervorgehoben.',
  en: 'Our guests particularly appreciate the authentic Italian cuisine with Neapolitan stone-oven pizza, the attentive and warm service, and the stylish atmosphere. The central location near K\u00f6nigsplatz is regularly highlighted as a plus.',
  it: 'I nostri ospiti apprezzano particolarmente la cucina italiana autentica con pizza napoletana dal forno a pietra, il servizio attento e cordiale e l\u2019atmosfera elegante. La posizione centrale vicino a K\u00f6nigsplatz viene regolarmente evidenziata come punto di forza.',
  fr: 'Nos clients appr\u00e9cient particuli\u00e8rement la cuisine italienne authentique avec pizza napolitaine au four \u00e0 pierre, le service attentionn\u00e9 et chaleureux ainsi que l\u2019atmosph\u00e8re \u00e9l\u00e9gante. L\u2019emplacement central pr\u00e8s de K\u00f6nigsplatz est r\u00e9guli\u00e8rement soulign\u00e9 comme un atout.',
};

const SUMMARY_LABELS = {
  de: 'KI-generierte Zusammenfassung',
  en: 'AI-generated summary',
  it: "Riepilogo generato dall'IA",
  fr: 'R\u00e9sum\u00e9 g\u00e9n\u00e9r\u00e9 par IA',
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

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const FORCE = process.argv.includes('--force');

if (!API_KEY || !PLACE_ID) {
  console.error('❌ Missing env vars. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env');
  process.exit(1);
}

// ── Cache check ──
const cacheFile = resolve(DATA_DIR, 'google-reviews-de.json');
if (!FORCE && existsSync(cacheFile)) {
  try {
    const cached = JSON.parse(readFileSync(cacheFile, 'utf-8'));
    if (cached.lastFetched) {
      const age = Date.now() - new Date(cached.lastFetched).getTime();
      if (age < CACHE_MAX_AGE_MS && cached.reviews?.length > 0) {
        console.log(`⏭️  Cache is ${Math.round(age / 3600000)}h old (< 24h). Use --force to override.`);
        process.exit(0);
      }
    }
  } catch { /* proceed */ }
}

// ── Fetch from Google Places API (New) ──
async function fetchReviews(lang) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      'X-Goog-Api-Language-Code': lang,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

function mapReview(r) {
  return {
    authorName: r.authorAttribution?.displayName || 'Anonym',
    rating: r.rating,
    text: r.text?.text || r.originalText?.text || '',
    relativeTimeDescription: r.relativePublishTimeDescription || '',
    time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : 0,
    language: r.originalText?.languageCode || r.text?.languageCode || 'de',
  };
}

console.log('🔄 Fetching Google Reviews in 4 languages...');
console.log(`   Place ID: ${PLACE_ID}`);

try {
  // Fetch all 4 languages (localized relativeTimeDescription)
  const allByLang = {};
  let globalRating = 0;
  let globalTotal = 0;

  for (const lang of LANGUAGES) {
    const data = await fetchReviews(lang);
    globalRating = data.rating || globalRating;
    globalTotal = data.userRatingCount || globalTotal;

    allByLang[lang] = (data.reviews || [])
      .map(mapReview)
      .filter(r => r.rating >= MIN_RATING);

    console.log(`   ${lang.toUpperCase()}: ${allByLang[lang].length} reviews (${MIN_RATING}+ stars)`);
  }

  // Apply fallback: fill each language to MAX_REVIEWS from DE, then EN
  const now = new Date().toISOString();

  for (const lang of LANGUAGES) {
    let reviews = [...allByLang[lang]];

    // Fill from DE
    if (reviews.length < MAX_REVIEWS && lang !== 'de') {
      for (const r of (allByLang['de'] || [])) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(existing => existing.authorName === r.authorName)) {
          reviews.push(r);
        }
      }
    }

    // Fill from EN
    if (reviews.length < MAX_REVIEWS && lang !== 'en') {
      for (const r of (allByLang['en'] || [])) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(existing => existing.authorName === r.authorName)) {
          reviews.push(r);
        }
      }
    }

    const output = {
      placeId: PLACE_ID,
      rating: globalRating,
      totalReviews: globalTotal,
      lastFetched: now,
      summary: SUMMARIES[lang],
      summaryLabel: SUMMARY_LABELS[lang],
      reviews: reviews.slice(0, MAX_REVIEWS),
    };

    const outPath = resolve(DATA_DIR, `google-reviews-${lang}.json`);
    writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  }

  // Remove old single-file format if present
  const oldFile = resolve(DATA_DIR, 'google-reviews.json');
  if (existsSync(oldFile)) unlinkSync(oldFile);

  console.log(`\n✅ Saved reviews for ${LANGUAGES.length} languages`);
  console.log(`   Rating: ${globalRating} / 5 (${globalTotal} total)`);
  console.log(`   Fetched: ${now}`);

} catch (err) {
  console.error('❌ Fetch failed:', err.message);

  // Keep existing caches as fallback
  const hasCache = LANGUAGES.some(l =>
    existsSync(resolve(DATA_DIR, `google-reviews-${l}.json`))
  );
  if (hasCache) {
    console.log('📦 Keeping existing cached reviews as fallback.');
    process.exit(0);
  }
  process.exit(1);
}
