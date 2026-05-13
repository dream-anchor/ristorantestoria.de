/**
 * GBP fetch via Neon HTTP API (no TCP, works in sandboxed environments)
 */
import { createDecipheriv } from 'crypto';

const ACCOUNT_ID = '114367954632843728381';
const LOCATION_ID = '17586248070861131392';
const NEON_HTTP = 'https://ep-spring-wind-all2zrwz-pooler.c-3.eu-central-1.aws.neon.tech/sql';
const NEON_CONN = 'postgresql://neondb_owner:npg_pcAxIsd9MOQ3@ep-spring-wind-all2zrwz-pooler.c-3.eu-central-1.aws.neon.tech/neondb';

async function dbQuery(query) {
  const r = await fetch(NEON_HTTP, {
    method: 'POST',
    headers: { 'Neon-Connection-String': NEON_CONN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const d = await r.json();
  if (d.message) throw new Error('DB error: ' + d.message);
  return d.rows;
}

function decrypt(encoded) {
  const key = Buffer.from(process.env.GBP_TOKEN_ENCRYPTION_KEY, 'hex');
  const [ivB64, tagB64, dataB64] = encoded.split(':');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf-8');
}

const [tokenRow] = await dbQuery("SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_oauth_tokens'");
const tokens = JSON.parse(decrypt(tokenRow.setting_value));

let accessToken = tokens.access_token;
if (!tokens.expiry_date || Date.now() > tokens.expiry_date - 60000) {
  const [credRow] = await dbQuery("SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_client_secret'");
  const creds = JSON.parse(decrypt(credRow.setting_value));
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
  if (refreshed.error) throw new Error('Token refresh failed: ' + refreshed.error_description);
  accessToken = refreshed.access_token;
  process.stderr.write('Token refreshed successfully\n');
}

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
  if (data.error) { process.stderr.write('API Error: ' + JSON.stringify(data.error) + '\n'); break; }
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

process.stdout.write(JSON.stringify(unanswered, null, 2) + '\n');
