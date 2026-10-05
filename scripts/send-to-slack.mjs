/**
 * Send Slack notifications for GBP Review Manager
 * Usage (daily): node scripts/send-to-slack.mjs --replied N --skipped N --backlog N
 * Usage (weekly): node scripts/send-to-slack.mjs --mode weekly --intro "..." --backlog N --reviews '[...]'
 */
const WEBHOOK = process.env.SLACK_WEBHOOK_URL;
if (!WEBHOOK) { console.error('SLACK_WEBHOOK_URL not set'); process.exit(1); }

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };

const mode = get('--mode') || 'daily';

async function send(text) {
  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(`Slack error: ${res.status}`);
}

if (mode === 'weekly') {
  const intro = get('--intro') || '';
  const backlog = get('--backlog') || '0';
  const reviewsJson = get('--reviews') || '[]';
  let reviews = [];
  try { reviews = JSON.parse(reviewsJson); } catch {}

  const lines = [
    `📊 *Storia Review-Manager — Wochenbericht KW ${get('--week') || '?'}*`,
    '',
    intro,
    '',
    `Backlog (4–5★, letzte 12 Monate): ${backlog}`,
    reviews.length > 0 ? `Diese Woche beantwortet: ${reviews.length}` : 'Diese Woche beantwortet: 0',
  ];
  if (reviews.length > 0) {
    for (const r of reviews) lines.push(`  • ${r.reviewer} (${r.stars})`);
  }
  await send(lines.join('\n'));
  console.log('Slack weekly report sent.');
} else {
  const replied = get('--replied') || '0';
  const skipped = get('--skipped') || '0';
  const backlog = get('--backlog') || '0';
  const text = [
    `📋 *Review-Manager — ristorantestoria.de*`,
    `✅ Heute beantwortet: ${replied}`,
    `⏭️ Übersprungen: ${skipped}`,
    `📬 Backlog gesamt (4–5★, <12Mo): ${backlog}`,
  ].join('\n');
  await send(text);
  console.log('Slack daily alert sent.');
}
