/**
 * GBP Batch Reply Poster
 * Uses curl for Neon token fetch, native fetch for GBP API posts
 */
import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';
import { spawnSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const ACCOUNT_ID = '114367954632843728381';
const LOCATION_ID = '17586248070861131392';
const DB_URL = process.env.DATABASE_URL;
const ENC_KEY = process.env.GBP_TOKEN_ENCRYPTION_KEY;

function decrypt(encoded) {
  const key = Buffer.from(ENC_KEY, 'hex');
  const [ivB64, tagB64, dataB64] = encoded.split(':');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf-8');
}

function encrypt(plaintext) {
  const key = Buffer.from(ENC_KEY, 'hex');
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join(':');
}

function neonQuery(sqlQuery, params = []) {
  const tmpFile = join(tmpdir(), `neon-query-${Date.now()}.json`);
  try {
    writeFileSync(tmpFile, JSON.stringify({ query: sqlQuery, params }));
    const result = spawnSync('curl', [
      '-s', '--connect-timeout', '15',
      '-X', 'POST',
      'https://api.c-3.eu-central-1.aws.neon.tech/sql',
      '-H', `Neon-Connection-String: ${DB_URL}`,
      '-H', 'Content-Type: application/json',
      '--data-binary', `@${tmpFile}`
    ], { encoding: 'utf-8', timeout: 20000 });
    if (result.status !== 0) throw new Error(`curl failed: ${result.stderr}`);
    const parsed = JSON.parse(result.stdout);
    if (parsed.message || parsed.errorFields) throw new Error(`Neon error: ${JSON.stringify(parsed)}`);
    return parsed.rows || [];
  } finally {
    if (existsSync(tmpFile)) unlinkSync(tmpFile);
  }
}

// Get token
const tokRows = neonQuery('SELECT setting_value FROM google_business_settings WHERE setting_key = $1', ['gbp_oauth_tokens']);
const tokens = JSON.parse(decrypt(tokRows[0].setting_value));

let accessToken = tokens.access_token;
if (!tokens.expiry_date || Date.now() > tokens.expiry_date - 60000) {
  const credRows = neonQuery('SELECT setting_value FROM google_business_settings WHERE setting_key = $1', ['gbp_client_secret']);
  const creds = JSON.parse(decrypt(credRows[0].setting_value));
  const c = creds.installed || creds.web;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: c.client_id,
      client_secret: c.client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token'
    })
  });
  const refreshed = await res.json();
  if (refreshed.error) { process.stderr.write('Token-Refresh failed: ' + JSON.stringify(refreshed) + '\n'); process.exit(1); }
  accessToken = refreshed.access_token;
  const updated = { ...tokens, access_token: accessToken, expiry_date: Date.now() + refreshed.expires_in * 1000 };
  neonQuery(`UPDATE google_business_settings SET setting_value = $1, updated_at = now() WHERE setting_key = 'gbp_oauth_tokens'`, [encrypt(JSON.stringify(updated))]);
}

// Reviews to process with their replies
const replies = [
  {
    reviewId: 'AbFvOqkLXvQd1cFskg6t0WYXlG7dD2LHNEOCXY6RJExrPyGO1TTB7sAoRNnFsabXhA7CbOeU3p0S',
    reviewer: 'Alessandro Gisonna',
    stars: 'FIVE',
    reply: `Herr Gisonna, herzlichen Dank für fünf Sterne — das freut das gesamte Storia-Team sehr! Unsere neapolitanische Pizza aus dem Steinofen und die hausgemachten Pasta nach Familienrezepten aus dem Cilento warten beim nächsten Besuch in der Maxvorstadt auf Sie.

Herzliche Grüße aus der Karlstraße, Ihr Storia-Team`
  },
  {
    reviewId: 'AbFvOqneEZTcQocIIfo4lQ8u4Dc8vgmKWB9mTNxGkpi_AlJrLdScDJ0GfdLONpxf4DoGKFx47waEqA',
    reviewer: 'Ester Frontera',
    stars: 'FIVE',
    reply: `Ester e Franca, che piacere leggere queste parole! Un pranzo tra cugine, buon cibo, atmosfera curata e un servizio attento — è esattamente quello che il nostro team cerca di offrire ogni giorno. Nel STORIA portiamo a Monaco la tradizione napoletana della famiglia Speranza, dal Cilento: paste fatte in casa, pizza nel forno a legna. Vi aspettiamo presto alla Karlstraße!

Un caro saluto dalla Karlstraße, il vostro STORIA-team


Sehr geehrte Frau Frontera, ein Mittagessen mit der Cousine im STORIA in der Maxvorstadt — genau dafür sind wir gerne da. Unsere hausgemachten Pasta nach Familienrezepten aus dem Cilento und die neapolitanische Steinofen-Pizza stehen täglich frisch bereit. Zum nächsten Besuch reservieren Sie gerne unter +49 89 51519696.

Herzliche Grüße aus der Karlstraße, Ihr Storia-Team`
  },
  {
    reviewId: 'AbFvOqnSPcEojbjuGebkc2gr5ksvHWq8MsDo0iX0MF2ggyx5BfZtRghoWMVSzpcbdcdXVgdl4-DUwA',
    reviewer: 'Ayobami Adesola',
    stars: 'FIVE',
    reply: `Herzlichen Dank für fünf Sterne — das freut das Team im STORIA sehr! Als Familienbetrieb in der Maxvorstadt bringen wir täglich die neapolitanische Küche aus dem Cilento auf den Tisch: hausgemachte Pasta und Steinofen-Pizza bei 400°C. Für den nächsten Besuch reservieren Sie gerne unter +49 89 51519696.

Herzliche Grüße aus der Karlstraße, Ihr Storia-Team`
  },
  {
    reviewId: 'AbFvOqmOxNBsbgoUMAKAkLSsmmbeR_L83h1ZuBnFq0pJ2obn0r1t_mm5A8x35hXu8DzTkh5vK6XQ',
    reviewer: 'Elmar Höttges',
    stars: 'FOUR',
    reply: `Herr Höttges, herzlichen Dank für Ihre vier Sterne! Das Storia-Team in der Karlstraße freut sich. Beim nächsten Besuch in der Maxvorstadt empfehlen wir unser täglich wechselndes Mittagsmenü oder die neapolitanische Steinofen-Pizza — reservieren Sie gerne unter +49 89 51519696.

Herzliche Grüße aus der Karlstraße, Ihr Storia-Team`
  }
];

let posted = 0;
const postedIds = [];
const errors = [];

for (const review of replies) {
  process.stderr.write(`\nPoste Antwort für ${review.reviewer} [${review.stars}]...\n`);

  const url = `https://mybusiness.googleapis.com/v4/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/reviews/${review.reviewId}/reply`;
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comment: review.reply })
  });

  const result = await r.json();
  if (r.ok) {
    process.stderr.write(`✅ OK: ${review.reviewer}\n`);
    posted++;
    postedIds.push(review.reviewId);
  } else {
    process.stderr.write(`❌ Fehler: ${JSON.stringify(result, null, 2)}\n`);
    errors.push({ reviewer: review.reviewer, reviewId: review.reviewId, error: result });
  }

  // Kurze Pause zwischen Posts
  await new Promise(r => setTimeout(r, 1000));
}

process.stdout.write('\n=== ZUSAMMENFASSUNG ===\n');
process.stdout.write(`Bearbeitete Reviews: ${replies.length}\n`);
process.stdout.write(`Erfolgreich gepostet: ${posted}\n`);
process.stdout.write(`Gepostete Review-IDs:\n`);
for (const id of postedIds) process.stdout.write(`  - ${id}\n`);
if (errors.length > 0) {
  process.stdout.write(`Fehler (${errors.length}):\n`);
  for (const e of errors) process.stdout.write(`  - ${e.reviewer}: ${JSON.stringify(e.error)}\n`);
} else {
  process.stdout.write('Keine Fehler aufgetreten.\n');
}
