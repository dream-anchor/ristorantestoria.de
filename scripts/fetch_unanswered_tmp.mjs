import { createDecipheriv } from 'crypto';
import postgres from '/Users/antoinemonot/Documents/Websites/VISUAL STUDIO CODE/ristorantestoria.de/node_modules/postgres/src/index.js';
import { config } from 'dotenv';
config({ path: '/Users/antoinemonot/Documents/Websites/VISUAL STUDIO CODE/ristorantestoria.de/.env' });

const ACCOUNT_ID = '114367954632843728381';
const LOCATION_ID = '17586248070861131392';

function decrypt(encoded) {
  const key = Buffer.from(process.env.GBP_TOKEN_ENCRYPTION_KEY, 'hex');
  const [ivB64, tagB64, dataB64] = encoded.split(':');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf-8');
}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
const [row] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_oauth_tokens'`;
const tokens = JSON.parse(decrypt(row.setting_value));

let accessToken = tokens.access_token;
if (!tokens.expiry_date || Date.now() > tokens.expiry_date - 60000) {
  const [credRow] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_client_secret'`;
  const creds = JSON.parse(decrypt(credRow.setting_value));
  const c = creds.installed || creds.web;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({client_id: c.client_id, client_secret: c.client_secret, refresh_token: tokens.refresh_token, grant_type: 'refresh_token'})
  });
  const refreshed = await res.json();
  accessToken = refreshed.access_token;
}

let pageToken = null;
let unanswered = [];
let page = 0;
do {
  const params = new URLSearchParams({ pageSize: '50' });
  if (pageToken) params.set('pageToken', pageToken);
  const r = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/reviews?${params}`, {
    headers: { Authorization: 'Bearer ' + accessToken }
  });
  const data = await r.json();
  if (data.error) { console.error('API Error:', JSON.stringify(data.error)); break; }
  for (const review of (data.reviews || [])) {
    if (!review.reviewReply) {
      unanswered.push({
        name: review.name,
        reviewer: review.reviewer?.displayName || 'Anonym',
        stars: review.starRating,
        comment: (review.comment || '').substring(0, 200),
        date: review.createTime
      });
    }
  }
  pageToken = data.nextPageToken;
  page++;
} while (pageToken && page < 5);

console.log(`Unbeantwortete Reviews: ${unanswered.length}`);
console.log(JSON.stringify(unanswered.slice(0, 15), null, 2));
await sql.end();
