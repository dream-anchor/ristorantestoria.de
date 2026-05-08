import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';
import postgres from 'postgres';
import { config } from 'dotenv';
config({ path: '/Users/antoinemonot/Documents/Websites/VISUAL STUDIO CODE/ristorantestoria.de/.env' });

const ACCOUNT_ID = '114367954632843728381';
const LOCATION_ID = '17586248070861131392';
const REVIEW_ID = 'AbFvOqlBv6Az27T6n9UbYP7AJYWggazChAAvSQB_yfJAN-u-MrTWcLLvdUVGN5sdRrL9-wCqrpq7';

const REPLY = `Albin, vi är uppriktigt ledsna att din kväll hos oss inte levde upp till dina förväntningar. På STORIA i Maxvorstadt tar vi hand om varje gäst som familj — det är standarden vi håller varje kväll. Skriv till oss på info@ristorantestoria.de, vi vill förstå vad som gick fel.

Varma hälsningar från Karlstraße, ditt STORIA-team


Sehr geehrter Herr Hedin, es tut uns aufrichtig leid, dass Ihr Abend bei uns nicht so verlaufen ist, wie Sie es erwartet hatten. Im STORIA in der Maxvorstadt empfangen wir unsere Gäste wie Familie — das ist der Anspruch, den wir an jeden Abend haben. Schreiben Sie uns an info@ristorantestoria.de, wir möchten verstehen, was passiert ist.

Herzliche Grüße aus der Karlstraße, Ihr Storia-Team`;

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
    body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token: tokens.refresh_token, grant_type: 'refresh_token' })
  });
  const refreshed = await res.json();
  accessToken = refreshed.access_token;
  const updated = { ...tokens, access_token: accessToken, expiry_date: Date.now() + refreshed.expires_in * 1000 };
  await sql`UPDATE google_business_settings SET setting_value = ${encrypt(JSON.stringify(updated))}, updated_at = now() WHERE setting_key = 'gbp_oauth_tokens'`;
}

const url = `https://mybusiness.googleapis.com/v4/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/reviews/${REVIEW_ID}/reply`;
const r = await fetch(url, {
  method: 'PUT',
  headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
  body: JSON.stringify({ comment: REPLY })
});

const result = await r.json();
if (r.ok) {
  console.log('✅ Antwort gepostet!');
  console.log('Text:', result.comment);
} else {
  console.error('❌ Fehler:', JSON.stringify(result, null, 2));
}

await sql.end();
