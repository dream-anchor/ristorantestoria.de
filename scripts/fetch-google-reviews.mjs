#!/usr/bin/env node
/**
 * Fetches Google Reviews via Places API and saves to src/data/google-reviews.json.
 *
 * Required env vars:
 *   GOOGLE_PLACES_API_KEY — Google Cloud API key with Places API enabled
 *   GOOGLE_PLACE_ID      — Place ID (format: ChIJ...)
 *
 * Usage:
 *   npm run fetch-reviews
 *   GOOGLE_PLACES_API_KEY=xxx GOOGLE_PLACE_ID=yyy node scripts/fetch-google-reviews.mjs
 *
 * The script skips fetching if the cached file is less than 24h old (use --force to override).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/google-reviews.json');
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Load .env manually (no dependency needed)
function loadEnv() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const FORCE = process.argv.includes('--force');

if (!API_KEY || !PLACE_ID) {
  console.error('❌ Missing env vars. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env');
  console.error('   GOOGLE_PLACES_API_KEY:', API_KEY ? '✓ set' : '✗ missing');
  console.error('   GOOGLE_PLACE_ID:', PLACE_ID ? '✓ set' : '✗ missing');
  process.exit(1);
}

// Check cache age
if (!FORCE && existsSync(OUTPUT_PATH)) {
  try {
    const cached = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
    if (cached.lastFetched) {
      const age = Date.now() - new Date(cached.lastFetched).getTime();
      if (age < CACHE_MAX_AGE_MS && cached.reviews?.length > 0) {
        const hoursAgo = Math.round(age / (60 * 60 * 1000));
        console.log(`⏭️  Cache is ${hoursAgo}h old (< 24h). Skipping. Use --force to override.`);
        process.exit(0);
      }
    }
  } catch {
    // Cache corrupt, proceed with fetch
  }
}

console.log('🔄 Fetching Google Reviews...');
console.log(`   Place ID: ${PLACE_ID}`);

// Google Places API (legacy) — reviews field
const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
url.searchParams.set('place_id', PLACE_ID);
url.searchParams.set('fields', 'rating,user_ratings_total,reviews');
url.searchParams.set('key', API_KEY);
url.searchParams.set('language', 'de'); // German reviews preferred
url.searchParams.set('reviews_sort', 'newest');

try {
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error(`Places API error: ${data.status} — ${data.error_message || 'Unknown error'}`);
  }

  const result = data.result;

  const output = {
    placeId: PLACE_ID,
    rating: result.rating || 0,
    totalReviews: result.user_ratings_total || 0,
    lastFetched: new Date().toISOString(),
    reviews: (result.reviews || []).map(r => ({
      authorName: r.author_name || 'Anonym',
      rating: r.rating,
      text: r.text || '',
      relativeTimeDescription: r.relative_time_description || '',
      time: r.time,
      profilePhotoUrl: r.profile_photo_url || '',
      language: r.language || 'de',
    })),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');

  console.log(`✅ Saved ${output.reviews.length} reviews to src/data/google-reviews.json`);
  console.log(`   Rating: ${output.rating} / 5 (${output.totalReviews} total)`);
  console.log(`   Fetched: ${output.lastFetched}`);

} catch (err) {
  console.error('❌ Fetch failed:', err.message);

  // Fallback: keep existing cache if available
  if (existsSync(OUTPUT_PATH)) {
    try {
      const cached = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
      if (cached.reviews?.length > 0) {
        console.log('📦 Keeping existing cached reviews as fallback.');
        process.exit(0);
      }
    } catch {
      // ignore
    }
  }

  process.exit(1);
}
