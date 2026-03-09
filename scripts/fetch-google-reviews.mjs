#!/usr/bin/env node
/**
 * Fetches Google Reviews via Places API (New) + parses local reviews.txt export.
 * Saves to src/data/google-reviews-{de,en,it,fr}.json.
 *
 * The API only returns 5 reviews per request. To supplement, place a
 * reviews.txt export (from Google Maps) in the project root or ~/Downloads.
 * The script parses it and extracts 4-5 star reviews with text > 50 chars.
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
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../src/data');
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LANGUAGES = ['de', 'en', 'it', 'fr'];
const MAX_REVIEWS = 10;
const MIN_RATING = 4;
const MIN_TEXT_LENGTH = 50;

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
  console.error('\u274c Missing env vars. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env');
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
        console.log(`\u23ed\ufe0f  Cache is ${Math.round(age / 3600000)}h old (< 24h). Use --force to override.`);
        process.exit(0);
      }
    }
  } catch { /* proceed */ }
}

// ── Fetch from Google Places API (New) ──
async function fetchPlaceData(lang) {
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=${lang}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

function mapApiReview(r) {
  return {
    authorName: r.authorAttribution?.displayName || 'Anonym',
    rating: r.rating,
    text: r.text?.text || r.originalText?.text || '',
    relativeTimeDescription: r.relativePublishTimeDescription || '',
    time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : 0,
    language: r.originalText?.languageCode || r.text?.languageCode || 'de',
  };
}

// ── Parse reviews.txt export ──
function parseReviewsTxt() {
  const searchPaths = [
    resolve(__dirname, '../reviews.txt'),
    resolve(homedir(), 'Downloads/reviews.txt'),
  ];

  const filePath = searchPaths.find(p => existsSync(p));
  if (!filePath) return [];

  console.log(`\ud83d\udcc4 Parsing reviews.txt: ${filePath}`);
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const reviews = [];
  let i = 0;

  while (i < lines.length) {
    // Suche Rating-Zeile (eine Zahl 1-5 allein auf einer Zeile)
    const ratingMatch = lines[i]?.trim().match(/^([1-5])$/);
    if (!ratingMatch) { i++; continue; }

    const rating = parseInt(ratingMatch[1]);
    i++; // skip ⭐ line
    if (lines[i]?.trim() === '\u2b50') i++;

    // Author name
    const authorName = lines[i]?.trim() || '';
    i++;

    // Skip "(Local Guide)" line if present
    if (lines[i]?.trim().startsWith('(Local Guide)') || lines[i]?.trim().startsWith('(')) i++;

    // Skip "X reviews • Y photos" line
    if (lines[i]?.trim().match(/\d+ reviews?/)) i++;

    // Review text: alles bis "No photos" / "📸" / "Show business response" / "View on Google"
    let text = '';
    while (i < lines.length) {
      const line = lines[i]?.trim() || '';
      if (
        line === 'No photos' ||
        line.startsWith('\ud83d\udcf8') ||
        line === 'Show business response' ||
        line === 'View on Google'
      ) break;
      if (text) text += ' ';
      text += line;
      i++;
    }

    // Bereinigung: Entferne "Food : X/5 | Service : X/5 ..." Suffix und strukturierte Metadaten
    text = text
      .replace(/\s*(Food|Service|Atmosphere|Reservation|Noise level|Group size|Wait time|Seating type|Recommendation|Vegetarian|Parking|Kid-friendliness|Wheelchair)\s*[:].*/s, '')
      .trim();

    // relativeTimeDescription finden (z.B. "a month ago", "3 months ago")
    let relativeTime = '';
    while (i < lines.length) {
      const line = lines[i]?.trim() || '';
      if (line.match(/\d+ months? ago|a month ago|a week ago|\d+ weeks? ago|a year ago|\d+ years? ago|Edited/)) {
        relativeTime = line.replace('Edited ', '');
        i++;
        break;
      }
      i++;
      // Sicherheitsabbruch: nächstes Rating gefunden
      if (line.match(/^[1-5]$/) && lines[i + 1]?.trim() === '\u2b50') break;
    }

    // Sprache erkennen (einfache Heuristik)
    const germanWords = ['und', 'der', 'die', 'das', 'ein', 'eine', 'ist', 'war', 'sehr', 'wir', 'ich', 'mit', 'auch', 'aber', 'hier', 'für', 'bei', 'zum', 'haben', 'nicht', 'kann', 'nur', 'alle'];
    const englishWords = ['the', 'and', 'was', 'were', 'have', 'had', 'with', 'for', 'this', 'that', 'very', 'great', 'amazing', 'beautiful', 'excellent', 'perfect', 'recommend', 'would', 'really'];
    const italianWords = ['che', 'del', 'una', 'sono', 'molto', 'anche', 'questo', 'questa', 'stato', 'ottimo', 'buono', 'bello', 'posto', 'cibo', 'servizio', 'consiglio', 'davvero', 'sempre', 'tutto', 'nella'];
    const frenchWords = ['les', 'des', 'une', 'est', 'nous', 'avec', 'pour', 'dans', 'très', 'bien', 'bon', 'bonne', 'cette', 'sont', 'mais', 'aussi', 'tout', 'fait', 'comme', 'chez'];

    const words = text.toLowerCase().split(/\s+/);
    const deScore = words.filter(w => germanWords.some(gw => w === gw)).length;
    const enScore = words.filter(w => englishWords.some(ew => w === ew)).length;
    const itScore = words.filter(w => italianWords.some(iw => w === iw)).length;
    const frScore = words.filter(w => frenchWords.some(fw => w === fw)).length;

    const maxScore = Math.max(deScore, enScore, itScore, frScore);
    let language = 'other';
    if (maxScore === 0 && text.length > 20) language = 'other';
    else if (deScore === maxScore) language = 'de';
    else if (enScore === maxScore) language = 'en';
    else if (itScore === maxScore) language = 'it';
    else if (frScore === maxScore) language = 'fr';

    // Negative/sarkastische Reviews trotz hoher Sterne filtern
    const negativePatterns = /anwalt|peinlich|enttäuschung|enttäuscht|fälschen|aufpolieren|leider nicht|nie wieder|schlecht|katastroph/i;
    const isNegative = negativePatterns.test(text);

    if (rating >= MIN_RATING && text.length >= MIN_TEXT_LENGTH && authorName && language !== 'other' && !isNegative) {
      // Timestamp schätzen aus relativeTimeDescription
      const time = estimateTimestamp(relativeTime);

      reviews.push({
        authorName,
        rating,
        text,
        relativeTimeDescription: relativeTime,
        time,
        language,
      });
    }
  }

  console.log(`   Parsed: ${reviews.length} reviews (${MIN_RATING}+ stars, ${MIN_TEXT_LENGTH}+ chars)`);
  const deCnt = reviews.filter(r => r.language === 'de').length;
  const enCnt = reviews.filter(r => r.language === 'en').length;
  const itCnt = reviews.filter(r => r.language === 'it').length;
  const frCnt = reviews.filter(r => r.language === 'fr').length;
  const otherCnt = reviews.filter(r => r.language === 'other').length;
  console.log(`   DE: ${deCnt}, EN: ${enCnt}, IT: ${itCnt}, FR: ${frCnt}, other: ${otherCnt}`);

  return reviews;
}

function estimateTimestamp(relativeTime) {
  const now = Date.now();
  if (!relativeTime) return Math.floor(now / 1000);

  const match = relativeTime.match(/(\d+)\s*(week|month|year)s?\s*ago/);
  if (match) {
    const n = parseInt(match[1]);
    const unit = match[2];
    const ms = unit === 'week' ? n * 7 * 86400000
      : unit === 'month' ? n * 30 * 86400000
      : n * 365 * 86400000;
    return Math.floor((now - ms) / 1000);
  }

  if (relativeTime.includes('a week ago')) return Math.floor((now - 7 * 86400000) / 1000);
  if (relativeTime.includes('a month ago')) return Math.floor((now - 30 * 86400000) / 1000);
  if (relativeTime.includes('a year ago')) return Math.floor((now - 365 * 86400000) / 1000);

  return Math.floor(now / 1000);
}

// ── Main ──
console.log('\ud83d\udd04 Fetching Google Reviews...');
console.log(`   Place ID: ${PLACE_ID}`);

try {
  // 1. API: Rating + Gesamtzahl holen (DE reicht)
  const apiData = await fetchPlaceData('de');
  const globalRating = apiData.rating || 0;
  const globalTotal = apiData.userRatingCount || 0;

  const apiReviews = (apiData.reviews || [])
    .map(mapApiReview)
    .filter(r => r.rating >= MIN_RATING);

  console.log(`\n\ud83c\udf10 API: ${globalRating}/5, ${globalTotal} total, ${apiReviews.length} reviews (${MIN_RATING}+ stars)`);

  // 2. reviews.txt parsen (falls vorhanden)
  const txtReviews = parseReviewsTxt();

  // 3. Merge: reviews.txt hat Priorität (mehr Auswahl), API ergänzt
  function mergeReviews(primary, secondary) {
    const merged = [...primary];
    for (const r of secondary) {
      if (!merged.some(m => m.authorName === r.authorName)) {
        merged.push(r);
      }
    }
    return merged;
  }

  // Reviews nach Sprache gruppieren
  const allDe = mergeReviews(
    txtReviews.filter(r => r.language === 'de'),
    apiReviews.filter(r => r.language === 'de'),
  );
  const allEn = mergeReviews(
    txtReviews.filter(r => r.language === 'en'),
    apiReviews.filter(r => r.language === 'en'),
  );
  const allIt = txtReviews.filter(r => r.language === 'it');
  const allFr = txtReviews.filter(r => r.language === 'fr');

  console.log(`\n\ud83d\udcca Merged: ${allDe.length} DE, ${allEn.length} EN, ${allIt.length} IT, ${allFr.length} FR`);

  // 4. Für EN/IT/FR auch API-Daten holen (für lokalisierte relativeTimeDescription)
  const apiByLang = { de: apiReviews };
  for (const lang of ['en', 'it', 'fr']) {
    const data = await fetchPlaceData(lang);
    apiByLang[lang] = (data.reviews || [])
      .map(mapApiReview)
      .filter(r => r.rating >= MIN_RATING);
    console.log(`   ${lang.toUpperCase()} API: ${apiByLang[lang].length} reviews`);
  }

  // 5. Pro Sprache: Beste Reviews auswählen
  const now = new Date().toISOString();

  for (const lang of LANGUAGES) {
    let reviews;

    if (lang === 'de') {
      // DE: Nur deutsche Reviews, sortiert nach Länge (aussagekräftigste zuerst)
      reviews = allDe
        .sort((a, b) => b.text.length - a.text.length)
        .slice(0, MAX_REVIEWS);
    } else if (lang === 'en') {
      // EN: Englische Reviews, dann auffüllen mit DE
      reviews = [...allEn.sort((a, b) => b.text.length - a.text.length)];
      // Auffüllen mit DE falls nötig
      for (const r of allDe) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(m => m.authorName === r.authorName)) reviews.push(r);
      }
      reviews = reviews.slice(0, MAX_REVIEWS);
    } else {
      // IT/FR: txt-Reviews der Sprache + API-Reviews + DE-Fallback + EN-Fallback
      const langTxt = lang === 'it' ? allIt : allFr;
      reviews = [...langTxt.sort((a, b) => b.text.length - a.text.length)];
      for (const r of (apiByLang[lang] || [])) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(m => m.authorName === r.authorName)) reviews.push(r);
      }
      for (const r of allDe) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(m => m.authorName === r.authorName)) reviews.push(r);
      }
      for (const r of allEn) {
        if (reviews.length >= MAX_REVIEWS) break;
        if (!reviews.some(m => m.authorName === r.authorName)) reviews.push(r);
      }
      reviews = reviews.slice(0, MAX_REVIEWS);
    }

    const output = {
      placeId: PLACE_ID,
      rating: globalRating,
      totalReviews: globalTotal,
      lastFetched: now,
      summary: SUMMARIES[lang],
      summaryLabel: SUMMARY_LABELS[lang],
      reviews,
    };

    const outPath = resolve(DATA_DIR, `google-reviews-${lang}.json`);
    writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
    console.log(`   \u2705 ${lang.toUpperCase()}: ${reviews.length} reviews saved`);
  }

  // Remove old single-file format if present
  const oldFile = resolve(DATA_DIR, 'google-reviews.json');
  if (existsSync(oldFile)) unlinkSync(oldFile);

  console.log(`\n\u2705 Done! Rating: ${globalRating}/5 (${globalTotal} total)`);

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
}
