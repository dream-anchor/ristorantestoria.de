/**
 * Send weekly HTML report via Resend API
 * Usage: node scripts/send-email-resend.mjs --to info@... --week KW --intro "..." --replied N --backlog N --star-breakdown '...'
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) { console.error('RESEND_API_KEY not set'); process.exit(1); }

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };

const to = get('--to') || 'info@ristorantestoria.de';
const week = get('--week') || '?';
const intro = get('--intro') || '';
const replied = parseInt(get('--replied') || '0', 10);
const backlog = parseInt(get('--backlog') || '0', 10);
const skipped = parseInt(get('--skipped') || '0', 10);
const starBreakdown = get('--star-breakdown') || '';
const daysToEmpty = Math.ceil(backlog / 5);

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Google Reviews KW ${week}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #fff; }
  h1 { font-size: 20px; font-weight: 600; border-bottom: 2px solid #e8d5b0; padding-bottom: 12px; margin-bottom: 24px; }
  .intro { background: #fdf8f0; border-left: 3px solid #c9a96e; padding: 16px; border-radius: 4px; margin-bottom: 24px; line-height: 1.6; }
  .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .stat { background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: center; }
  .stat .num { font-size: 28px; font-weight: 700; color: #2d5a27; }
  .stat .label { font-size: 12px; color: #666; margin-top: 4px; }
  .breakdown { margin-bottom: 24px; }
  .breakdown h2 { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
  .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; font-size: 13px; }
  .bar { height: 16px; background: #c9a96e; border-radius: 2px; min-width: 4px; }
  .footer { font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 12px; margin-top: 24px; }
</style>
</head>
<body>
<h1>📋 Google Reviews — KW ${week}</h1>
<div class="intro">${intro}</div>
<div class="stats">
  <div class="stat"><div class="num">${replied}</div><div class="label">Beantwortet diese Woche</div></div>
  <div class="stat"><div class="num">${backlog}</div><div class="label">Backlog (4–5★, &lt;12Mo)</div></div>
  <div class="stat"><div class="num">${daysToEmpty}</div><div class="label">Tage bis Backlog leer</div></div>
</div>
${starBreakdown ? `<div class="breakdown"><h2>Aufschlüsselung unbeantworteter Reviews</h2><pre style="font-size:13px;background:#f5f5f5;padding:12px;border-radius:4px;">${starBreakdown}</pre></div>` : ''}
<div class="footer">Automatisch generiert am ${new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · Storia Review-Manager</div>
</body>
</html>`;

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'management@ristorantestoria.de',
    to: [to],
    subject: `Google Reviews KW ${week} — Storia Review-Manager`,
    html
  })
});

const result = await res.json();
if (res.ok) {
  console.log('Email sent, id:', result.id);
} else {
  console.error('Resend error:', JSON.stringify(result));
  process.exit(1);
}
