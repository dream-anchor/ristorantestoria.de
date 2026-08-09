/**
 * Preview Migration 017 — Raucher-Entfernung (nur streichen, nichts ersetzen)
 * Alerts bei: Länge < 140 ODER kein USP mehr im Post
 */

import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/antoinemonot/Developer/Websites/ristorantestoria.de/.env', quiet: true });

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL!;

async function slackBlocks(blocks: unknown[]) {
  const res = await fetch(SLACK_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });
  if (!res.ok) console.error('Slack error:', res.status, await res.text());
}

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

// USPs (nach Entfernung von "Raucher willkommen")
const USPS = [
  '48h Teigruhe', '100 überdachte Plätze', 'wetterfeste Terrasse', 'seit 2015',
  'Cucina del Cilento', '400°C Steinofen', 'handgemachte Pasta', 'bis 180 Gäste',
  'Familie Speranza', 'Original-Rezepte aus Rofrano',
];

function hasUSP(body: string): string | null {
  const b = body.toLowerCase();
  return USPS.find(u => b.includes(u.toLowerCase())) ?? null;
}

// --- Pure removals ---

const rewrites: { id: number; label: string; old: string; new: string }[] = [
  {
    id: 2,
    label: 'A/lifestyle — Terrasse Aperitivo',
    old: 'Aperitivo & Dinner auf der überdachten Terrasse in München Maxvorstadt. 🍹 100 wetterfeste Plätze in der Karlstraße — Raucher willkommen. Italienische Weine, Aperol-Klassiker, Antipasti. Ab 19:00 im STORIA.',
    // Entferne " — Raucher willkommen." → ersetze durch "."
    new: 'Aperitivo & Dinner auf der überdachten Terrasse in München Maxvorstadt. 🍹 100 wetterfeste Plätze in der Karlstraße. Italienische Weine, Aperol-Klassiker, Antipasti. Ab 19:00 im STORIA.',
  },
  {
    id: 4,
    label: 'B/brand — Kapazität',
    old: 'Tisch sichern in der Maxvorstadt — STORIA Karlstraße, bis 180 Gäste. Überdachte Terrasse, wetterfest, Raucher willkommen. Innenraum für Feiern und Events.',
    // Entferne ", Raucher willkommen"
    new: 'Tisch sichern in der Maxvorstadt — STORIA Karlstraße, bis 180 Gäste. Überdachte Terrasse, wetterfest. Innenraum für Feiern und Events.',
  },
  {
    id: 5,
    label: 'B/brand — Wetterfest',
    old: 'Wetterfest genießen: 100 überdachte Plätze im STORIA Maxvorstadt. ☀️ Ob Sonnenstrahlen oder Maigewitter — unsere Terrasse in der Karlstraße bleibt trocken. Raucher-freundlich, ideal für Gruppen und Geburtstage.',
    // Entferne "Raucher-freundlich, " → "ideal" beginnt neuen Satz: Großschreiben
    new: 'Wetterfest genießen: 100 überdachte Plätze im STORIA Maxvorstadt. ☀️ Ob Sonnenstrahlen oder Maigewitter — unsere Terrasse in der Karlstraße bleibt trocken. Ideal für Gruppen und Geburtstage.',
  },
  {
    id: 8,
    label: 'A/lifestyle — Eventlocation',
    old: 'Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße eignet sich für Firmenfeiern, Geburtstage und Events. Überdachte Terrasse, Raucher willkommen.',
    // Entferne ", Raucher willkommen"
    new: 'Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße eignet sich für Firmenfeiern, Geburtstage und Events. Überdachte Terrasse.',
  },
  {
    id: 11,
    label: 'A/lifestyle — Terrasse Sommer',
    old: 'Überdachte Terrasse in der Maxvorstadt — 100 überdachte Plätze, wetterfest, Raucher willkommen. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a.',
    // Entferne ", Raucher willkommen"
    new: 'Überdachte Terrasse in der Maxvorstadt — 100 überdachte Plätze, wetterfest. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a.',
  },
  {
    id: 19,
    label: 'A/lifestyle/summer — Abend Terrasse',
    old: 'München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Raucher willkommen, Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.',
    // Entferne "Raucher willkommen, " (Dinner folgt direkt nach —)
    new: 'München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.',
  },
];

// --- Cluster-Rewrites (nur Raucher-Zeilen streichen) ---

const clusterRewrites = [
  {
    id: 'terrasse_lifestyle',
    oldExamples: [
      '100 überdachte Plätze in der Maxvorstadt — wetterfest, Raucher willkommen, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.',
      'Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, Raucher willkommen, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.',
      'Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach, Raucher willkommen. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.',
    ],
    newExamples: [
      '100 überdachte Plätze in der Maxvorstadt — wetterfest, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.',
      'Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.',
      'Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.',
    ],
  },
  {
    id: 'pinakothek_dinner',
    oldExamples: [
      'Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.',
      'Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen. Nähe Königsplatz.',
      'Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Raucher willkommen, Weinbar München — STORIA in der Maxvorstadt.',
    ],
    newExamples: [
      'Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.',
      'Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen. Nähe Königsplatz.',
      // "Dinner, Raucher willkommen, Weinbar" → "Dinner, Weinbar"
      'Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Weinbar München — STORIA in der Maxvorstadt.',
    ],
  },
  {
    id: 'rezension_highlight',
    oldExamples: [
      '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
      '48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.',
      '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, Raucher willkommen, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.',
    ],
    newExamples: [
      '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
      '48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.',
      // "100 überdachte Plätze, Raucher willkommen, STORIA" → "100 überdachte Plätze, STORIA"
      '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.',
    ],
  },
];

// --- Validation ---

type Alert = { id: number | string; reason: string; body: string };
const alerts: Alert[] = [];

for (const r of rewrites) {
  const len = r.new.length;
  const usp = hasUSP(r.new);
  if (len < 140) alerts.push({ id: r.id, reason: `Länge ${len} < 140`, body: r.new });
  if (!usp) alerts.push({ id: r.id, reason: `KEIN USP mehr im Text`, body: r.new });
}

// --- Build Slack blocks ---

const allBlocks: unknown[] = [];

allBlocks.push({
  type: 'header',
  text: { type: 'plain_text', text: '🧹 017 Preview — Raucher gestrichen (keine Ersetzung)', emoji: true },
});

if (alerts.length > 0) {
  allBlocks.push({ type: 'divider' });
  allBlocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `⚠️ *${alerts.length} Alert(s) — Antoine entscheidet, KEIN Auto-Fix:*`,
    },
  });
  for (const a of alerts) {
    allBlocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*ID${a.id}: ${a.reason}*\n_Text:_ ${a.body}`,
      },
    });
  }
}

allBlocks.push({ type: 'divider' });
allBlocks.push({
  type: 'section',
  text: { type: 'mrkdwn', text: '*6 Post-Rewrites (nur Raucher-Bezug gestrichen):*' },
});

for (const r of rewrites) {
  const len = r.new.length;
  const usp = hasUSP(r.new);
  const lenFlag = len < 140 ? ' ⚠️' : len > 280 ? ' ❌' : ' ✅';
  const uspFlag = usp ? ` USP: "${usp}"` : ' ⚠️ KEIN USP';
  allBlocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*ID${r.id} — ${r.label}*\n*ALT:* ${r.old}\n*NEU:* ${r.new}\n${len} Zeichen${lenFlag}${uspFlag}`,
    },
  });
  allBlocks.push({ type: 'divider' });
}

// Cluster section
allBlocks.push({
  type: 'section',
  text: { type: 'mrkdwn', text: '*3 Cluster-Examples (nur Raucher-Halbsatz gestrichen):*' },
});

for (const c of clusterRewrites) {
  const changed: string[] = [];
  for (let i = 0; i < c.newExamples.length; i++) {
    if (c.newExamples[i] !== c.oldExamples[i]) {
      changed.push(`Ex${i + 1}:\n_ALT:_ ${c.oldExamples[i]}\n_NEU:_ ${c.newExamples[i]}`);
    }
  }
  if (changed.length) {
    allBlocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*${c.id}*\n${changed.join('\n\n')}` },
    });
  }
}

allBlocks.push({ type: 'divider' });
allBlocks.push({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: '➕ Ebenfalls in 017: 2 Weihnachts-Bilder season → *winter*.\n\n→ *GO 017* zum Anwenden (inkl. Alerts klären).',
  },
});

// Send batched
const BATCH = 40;
for (let i = 0; i < allBlocks.length; i += BATCH) {
  await slackBlocks(allBlocks.slice(i, i + BATCH));
  if (i + BATCH < allBlocks.length) await new Promise(r => setTimeout(r, 1000));
}

console.log(`Alerts: ${alerts.length}`);
for (const a of alerts) console.log(`  ID${a.id}: ${a.reason}`);
console.log(`✅ Preview gesendet. ${allBlocks.length} Blöcke.`);
await sql.end();
