/**
 * GBP Routine Script — Post a reply to a review
 * Requires env vars: DATABASE_URL, GBP_TOKEN_ENCRYPTION_KEY, REVIEW_ID, REPLY_TEXT
 * Usage: REVIEW_ID=xxx REPLY_TEXT="..." node scripts/gbp-post-reply.mjs
 */
import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';
import postgres from 'postgres';

const ACCOUNT_ID = '114367954632843728381';
const LOCATION_ID = '17586248070861131392';
const REVIEW_ID = process.env.REVIEW_ID;
const REPLY_TEXT = process.env.REPLY_TEXT;

if (!REVIEW_ID || !REPLY_TEXT) {
  process.stderr.write('Error: REVIEW_ID and REPLY_TEXT env vars required\n');
  process.exit(1);
}

function decrypt(encoded) {
  const key = Buffer.from(process.env.GBP_TOKEN_ENCRYPTION_KEY, 'hex');
  const [ivB64, tagB64, dataB64] = encoded.split(':');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf-8');
}

function encrypt(plaintext) {
  const key = Buffer.from(process.env.GBP_TOKEN_ENCRYPTION_KEY, 'hex');
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join(':');
}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const [tokRow] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_oauth_tokens'`;
const tokens = JSON.parse(decrypt(tokRow.setting_value));

let accessToken = tokens.access_token;
if (!tokens.expiry_date || Date.now() > tokens.expiry_date - 60000) {
  const [credRow] = await sql`SELECT setting_value FROM google_business_settings WHERE setting_key = 'gbp_client_secret'`;
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
  accessToken = refreshed.access_token;
  const updated = { ...tokens, access_token: accessToken, expiry_date: Date.now() + refreshed.expires_in * 1000 };
  await sql`UPDATE google_business_settings SET setting_value = ${encrypt(JSON.stringify(updated))}, updated_at = now() WHERE setting_key = 'gbp_oauth_tokens'`;
}

const url = `https://mybusiness.googleapis.com/v4/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/reviews/${REVIEW_ID}/reply`;
const r = await fetch(url, {
  method: 'PUT',
  headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
  body: JSON.stringify({ comment: REPLY_TEXT })
});

const result = await r.json();
if (r.ok) {
  process.stdout.write('OK: ' + result.comment + '\n');
} else {
  process.stderr.write('Error: ' + JSON.stringify(result, null, 2) + '\n');
  process.exit(1);
}

await sql.end();
