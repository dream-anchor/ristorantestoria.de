/**
 * GBP Review Manager — Fetch unanswered reviews and post replies
 * Uses curl for Neon HTTP API (TLS proxy compatible) + native fetch for Google APIs
 */
import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';
import { execSync, spawnSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const ACCOUNT_ID = '114367954632843728381';
const LOCATION_ID = '17586248070861131392';
const DB_URL = process.env.DATABASE_URL;
const ENC_KEY = process.env.GBP_TOKEN_ENCRYPTION_KEY;

if (!DB_URL || !ENC_KEY) {
  process.stderr.write('Error: DATABASE_URL and GBP_TOKEN_ENCRYPTION_KEY required\n');
  process.exit(1);
}

// -- Crypto helpers --

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

// -- Neon HTTP API via curl (avoids Node.js TLS issue in sandbox) --

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

function neonExec(sqlQuery, params = []) {
  return neonQuery(sqlQuery, params);
}

// -- Main logic --

process.stderr.write('=== GBP Review Manager ===\n');
process.stderr.write('Lade OAuth-Token aus Neon DB...\n');

const tokRows = neonQuery('SELECT setting_value FROM google_business_settings WHERE setting_key = $1', ['gbp_oauth_tokens']);
if (!tokRows.length) { process.stderr.write('Kein Token gefunden!\n'); process.exit(1); }
const tokens = JSON.parse(decrypt(tokRows[0].setting_value));

let accessToken = tokens.access_token;
if (!tokens.expiry_date || Date.now() > tokens.expiry_date - 60000) {
  process.stderr.write('Token abgelaufen — erneuere...\n');
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
  if (refreshed.error) { process.stderr.write('Token-Refresh fehlgeschlagen: ' + JSON.stringify(refreshed) + '\n'); process.exit(1); }
  accessToken = refreshed.access_token;
  const updated = { ...tokens, access_token: accessToken, expiry_date: Date.now() + refreshed.expires_in * 1000 };
  neonExec(
    `UPDATE google_business_settings SET setting_value = $1, updated_at = now() WHERE setting_key = 'gbp_oauth_tokens'`,
    [encrypt(JSON.stringify(updated))]
  );
  process.stderr.write('Token erfolgreich erneuert.\n');
} else {
  process.stderr.write('Token gültig.\n');
}

// -- Reviews abrufen --

process.stderr.write('\nLade Reviews von GBP API...\n');
let pageToken = null;
const unanswered = [];
let page = 0;

do {
  const params = new URLSearchParams({ pageSize: '50' });
  if (pageToken) params.set('pageToken', pageToken);
  const r = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/reviews?${params}`,
    { headers: { Authorization: 'Bearer ' + accessToken } }
  );
  const data = await r.json();
  if (data.error) { process.stderr.write('API-Fehler: ' + JSON.stringify(data.error) + '\n'); break; }
  for (const review of (data.reviews || [])) {
    if (!review.reviewReply) {
      const ageHours = Math.floor((Date.now() - new Date(review.createTime).getTime()) / 3600000);
      unanswered.push({
        reviewId: review.name.split('/').pop(),
        reviewer: review.reviewer?.displayName || 'Anonym',
        stars: review.starRating,
        comment: review.comment || '',
        date: review.createTime,
        ageHours
      });
    }
  }
  pageToken = data.nextPageToken;
  page++;
} while (pageToken && page < 5);

process.stderr.write(`Unbeantwortete Reviews gesamt: ${unanswered.length}\n`);
process.stdout.write(JSON.stringify(unanswered, null, 2) + '\n');
