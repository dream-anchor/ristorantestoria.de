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
const MAX_REVIEWS = 50;
const MIN_RATING = 4;
const MIN_TEXT_LENGTH = 50;

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
  it: "Riepilogo di oltre 780 recensioni",
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
