/**
 * Go Live: Verify + Slack-Bestätigung
 */
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/antoinemonot/Developer/Websites/ristorantestoria.de/.env', quiet: true });

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL!;
const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

// Verify (is_dry_run already set to FALSE in previous run)
const slots = await sql`SELECT weekday, theme_slot, pool_priority, is_dry_run FROM gbp_schedule WHERE is_active = TRUE ORDER BY weekday`;
for (const s of slots) {
  console.log(`  ${s.weekday} / ${s.theme_slot} / Pool ${s.pool_priority} — dry_run: ${s.is_dry_run}`);
}

const allLive = slots.every(s => s.is_dry_run === false);
console.log(allLive ? '✅ Alle Slots LIVE' : '❌ Noch dry_run aktiv!');

// Slack confirmation
const res = await fetch(SLACK_WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🟢 STORIA GBP Pipeline LIVE', emoji: true },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Erster Post: Montag 09:00*\n\n*Zeitplan:*\n• Mo 09:00 — Lunch\n• Mi 11:00 — Brand\n• Fr 17:00 — Lifestyle\n\n*Backlog (nach Live, nicht jetzt):*\n• ID2/4/8 USP- und Längen-Alerts — Pool A hat Fallbacks\n• cilento_hintergrund Hook-Fix\n\n*Rollback:*\n`UPDATE gbp_schedule SET is_dry_run = TRUE WHERE is_active = TRUE;`',
        },
      },
    ],
  }),
});

console.log(res.ok ? '✅ Slack gesendet.' : `❌ Slack ${res.status}: ${await res.text()}`);
await sql.end();
