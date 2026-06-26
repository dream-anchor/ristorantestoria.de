#!/usr/bin/env node
/**
 * PSI Batch-Scanner — misst ALLE Seiten aus der Live-sitemap.xml, gedrosselt,
 * und gibt eine nach Score sortierte Tabelle aus (schlechteste zuerst).
 * Zweck: Ausreißer-Seiten finden (schwere Hero-Bilder etc.), nicht globale Themen.
 *
 * Key: PSI_API_KEY in .env (gitignored) oder als Umgebungsvariable.
 *
 * Usage:
 *   node scripts/psi-batch.mjs                 # DE-Seiten, mobile
 *   node scripts/psi-batch.mjs --all           # alle 4 Sprachen
 *   node scripts/psi-batch.mjs --desktop       # Desktop statt mobile
 *   node scripts/psi-batch.mjs --limit=10      # nur erste 10 (Test)
 *   node scripts/psi-batch.mjs --filter=anlaesse   # nur URLs mit Substring
 *   node scripts/psi-batch.mjs --concurrency=4 # parallele Läufe (Default 5)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PSI_DIR = resolve(ROOT, 'docs/psi');
const SITEMAP = 'https://www.ristorantestoria.de/sitemap.xml';

function loadKey() {
  if (process.env.PSI_API_KEY) return process.env.PSI_API_KEY;
  const envPath = resolve(ROOT, '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*PSI_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  })
);
const STRATEGY = args.desktop ? 'desktop' : (args.strategy || 'mobile');
const ALL_LANGS = !!args.all;
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;
const FILTER = typeof args.filter === 'string' ? args.filter : null;
const CONCURRENCY = args.concurrency ? parseInt(args.concurrency, 10) : 5;

const KEY = loadKey();
if (!KEY) {
  console.error('FEHLER: PSI_API_KEY fehlt. In .env eintragen: PSI_API_KEY=...');
  process.exit(1);
}

async function getUrls() {
  const xml = await (await fetch(SITEMAP)).text();
  let urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  // DE = ohne /en/ /it/ /fr/ Sprachpräfix
  if (!ALL_LANGS) urls = urls.filter((u) => !/\/(en|it|fr)\//.test(u));
  if (FILTER) urls = urls.filter((u) => u.includes(FILTER));
  return urls.slice(0, LIMIT);
}

async function measure(url, attempt = 1) {
  const u = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  u.searchParams.set('url', url);
  u.searchParams.set('key', KEY);
  u.searchParams.set('strategy', STRATEGY);
  u.searchParams.append('category', 'performance');
  u.searchParams.append('category', 'accessibility');
  try {
    const res = await fetch(u);
    if (res.status === 429 && attempt <= 3) {
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      return measure(url, attempt + 1);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const lh = (await res.json()).lighthouseResult;
    const perf = Math.round((lh.categories.performance?.score ?? 0) * 100);
    const a11y = Math.round((lh.categories.accessibility?.score ?? 0) * 100);
    const lcp = lh.audits['largest-contentful-paint']?.displayValue || '';
    // wichtigstes performance-Finding mit Spar-Potenzial
    const top = Object.values(lh.audits)
      .filter((a) => a.score != null && a.score < 0.9 && a.details?.overallSavingsBytes)
      .sort((a, b) => (b.details.overallSavingsBytes || 0) - (a.details.overallSavingsBytes || 0))[0];
    return { url, perf, a11y, lcp, top: top ? `${top.title} (${Math.round(top.details.overallSavingsBytes / 1024)}KiB)` : '' };
  } catch (e) {
    if (attempt <= 3) {
      await new Promise((r) => setTimeout(r, 3000 * attempt));
      return measure(url, attempt + 1);
    }
    return { url, perf: null, a11y: null, lcp: 'FEHLER', top: e.message };
  }
}

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  let done = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
      done++;
      process.stderr.write(`\r  ${done}/${items.length} gemessen...`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  process.stderr.write('\n');
  return results;
}

const urls = await getUrls();
console.log(`PSI Batch — ${STRATEGY.toUpperCase()} — ${urls.length} URLs (${ALL_LANGS ? 'alle Sprachen' : 'DE'}), Concurrency ${CONCURRENCY}\n`);

const results = await mapPool(urls, CONCURRENCY, (u) => measure(u));

// sortieren: schlechteste Perf zuerst (Fehler ganz oben)
results.sort((a, b) => (a.perf ?? -1) - (b.perf ?? -1));

const pathOf = (u) => u.replace('https://www.ristorantestoria.de', '') || '/';
console.log('Perf  A11y  LCP      Seite');
console.log('────  ────  ───────  ' + '─'.repeat(40));
for (const r of results) {
  const p = (r.perf ?? '—').toString().padStart(3);
  const a = (r.a11y ?? '—').toString().padStart(3);
  const lcp = (r.lcp || '').padEnd(7);
  console.log(` ${p}   ${a}  ${lcp}  ${pathOf(r.url)}`);
  if (r.top) console.log(`                       └─ ${r.top}`);
}

// Zusammenfassung
const valid = results.filter((r) => r.perf != null);
if (valid.length) {
  const avg = Math.round(valid.reduce((s, r) => s + r.perf, 0) / valid.length);
  const below = valid.filter((r) => r.perf < 90);
  console.log(`\nØ Perf: ${avg} · Seiten < 90: ${below.length}/${valid.length} · Fehler: ${results.length - valid.length}`);
}

if (!existsSync(PSI_DIR)) mkdirSync(PSI_DIR, { recursive: true });
const file = resolve(PSI_DIR, `batch-${STRATEGY}-${urls.length}urls.json`);
writeFileSync(file, JSON.stringify(results, null, 2));
console.log(`\n💾 ${file.replace(ROOT + '/', '')}`);
