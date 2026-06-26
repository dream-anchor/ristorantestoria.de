#!/usr/bin/env node
/**
 * PageSpeed Insights Runner — holt PSI v5 JSON, druckt kompakte Zusammenfassung,
 * speichert Roh-JSON zum Vergleichen (vor/nach Fix).
 *
 * Key: PSI_API_KEY in .env (gitignored) oder als Umgebungsvariable.
 *
 * Usage:
 *   node scripts/psi.mjs                      # mobile, Startseite
 *   node scripts/psi.mjs --strategy=desktop
 *   node scripts/psi.mjs --strategy=both
 *   node scripts/psi.mjs --url=https://www.ristorantestoria.de/speisekarte/
 *   node scripts/psi.mjs --save               # Roh-JSON nach docs/psi/ schreiben
 *   node scripts/psi.mjs --json               # nur kompaktes JSON ausgeben (für den Loop)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PSI_DIR = resolve(ROOT, 'docs/psi');

// --- .env laden (nur PSI_API_KEY) ---
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

// --- Args ---
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  })
);
const URL_TARGET = args.url || 'https://www.ristorantestoria.de/';
const STRATEGIES = args.strategy === 'both' ? ['mobile', 'desktop'] : [args.strategy || 'mobile'];
const SAVE = !!args.save;
const JSON_ONLY = !!args.json;

const KEY = loadKey();
if (!KEY) {
  console.error('FEHLER: PSI_API_KEY fehlt. In .env eintragen: PSI_API_KEY=...');
  process.exit(1);
}

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const CWV = {
  'largest-contentful-paint': 'LCP',
  'first-contentful-paint': 'FCP',
  'cumulative-layout-shift': 'CLS',
  'total-blocking-time': 'TBT',
  'speed-index': 'SI',
};

async function run(strategy) {
  const u = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  u.searchParams.set('url', URL_TARGET);
  u.searchParams.set('key', KEY);
  u.searchParams.set('strategy', strategy);
  for (const c of CATEGORIES) u.searchParams.append('category', c);

  const res = await fetch(u);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PSI ${strategy} HTTP ${res.status}: ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  const lh = data.lighthouseResult;

  const scores = {};
  for (const c of CATEGORIES) {
    const s = lh.categories[c]?.score;
    scores[c] = s == null ? null : Math.round(s * 100);
  }

  const metrics = {};
  for (const [id, label] of Object.entries(CWV)) {
    const a = lh.audits[id];
    if (a) metrics[label] = { value: a.displayValue, num: a.numericValue, score: a.score };
  }

  // Fehlschlagende / Warn-Audits (score < 0.9, score != null), nach Spar-Potenzial sortiert
  const failing = Object.values(lh.audits)
    .filter((a) => a.score != null && a.score < 0.9 && a.scoreDisplayMode !== 'informative')
    .map((a) => ({
      id: a.id,
      title: a.title,
      score: a.score,
      value: a.displayValue || '',
      savingsMs: a.details?.overallSavingsMs || a.metricSavings?.LCP || 0,
      savingsBytes: a.details?.overallSavingsBytes || 0,
    }))
    .sort((x, y) => (y.savingsMs || 0) - (x.savingsMs || 0) || x.score - y.score);

  return { strategy, fetchTime: lh.fetchTime, scores, metrics, failing };
}

function fmtScore(n) {
  if (n == null) return ' — ';
  const pad = String(n).padStart(3);
  return pad;
}

function printSummary(r) {
  console.log(`\n══ ${r.strategy.toUpperCase()} — ${URL_TARGET}`);
  console.log(`   Perf ${fmtScore(r.scores.performance)} · A11y ${fmtScore(r.scores.accessibility)} · BP ${fmtScore(r.scores['best-practices'])} · SEO ${fmtScore(r.scores.seo)}`);
  const m = r.metrics;
  console.log(`   LCP ${m.LCP?.value} · FCP ${m.FCP?.value} · CLS ${m.CLS?.value} · TBT ${m.TBT?.value} · SI ${m.SI?.value}`);
  console.log(`   — Befunde (score < 0.9), nach Potenzial:`);
  for (const f of r.failing) {
    const sav = f.savingsMs ? `~${Math.round(f.savingsMs)}ms` : f.savingsBytes ? `~${Math.round(f.savingsBytes / 1024)}KiB` : '';
    console.log(`     [${(f.score * 100).toFixed(0).padStart(3)}] ${f.title}${f.value ? ` — ${f.value}` : ''}${sav ? `  (${sav})` : ''}`);
  }
}

const results = [];
for (const s of STRATEGIES) {
  try {
    results.push(await run(s));
  } catch (e) {
    console.error(`FEHLER (${s}):`, e.message);
    process.exitCode = 1;
  }
}

if (JSON_ONLY) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) printSummary(r);
}

if (SAVE) {
  if (!existsSync(PSI_DIR)) mkdirSync(PSI_DIR, { recursive: true });
  for (const r of results) {
    const stamp = (r.fetchTime || new Date().toISOString()).replace(/[:.]/g, '-');
    const file = resolve(PSI_DIR, `psi-${r.strategy}-${stamp}.json`);
    writeFileSync(file, JSON.stringify(r, null, 2));
    console.log(`\n💾 ${file.replace(ROOT + '/', '')}`);
  }
}
