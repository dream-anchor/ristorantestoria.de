/**
 * Send error notification via Slack and email (Resend)
 * Usage: node scripts/send-error-notification.mjs --subject "..." --message "..." --hint "..."
 */
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };

const subject = get('--subject') || 'Unbekannter Fehler im Review-Manager';
const message = get('--message') || '';
const hint = get('--hint') || '';

let slackOk = false;
let emailOk = false;

if (SLACK_WEBHOOK_URL) {
  try {
    const text = `🚨 *Storia Review-Manager — FEHLER*\n*${subject}*\n${message}\n${hint ? `_Hinweis: ${hint}_` : ''}`;
    const res = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    slackOk = res.ok;
  } catch {}
}

if (RESEND_API_KEY) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'management@ristorantestoria.de',
        to: ['antoine@monot.com'],
        subject: `🚨 Review-Manager Fehler: ${subject}`,
        text: `${subject}\n\n${message}\n\nHinweis: ${hint}`
      })
    });
    emailOk = res.ok;
  } catch {}
}

if (slackOk || emailOk) {
  console.log(`Error notification sent (slack=${slackOk}, email=${emailOk})`);
} else {
  console.error('Failed to send error notification via both channels');
  process.exit(1);
}
