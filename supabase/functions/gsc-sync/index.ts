/**
 * GSC Sync Edge Function
 *
 * Fetches data from Google Search Console API using Service Account authentication
 * and stores it in Supabase tables.
 *
 * Supports:
 * - Backfill (last 90 days)
 * - Daily sync (yesterday + last 7 days for late data)
 * - Manual sync for specific date ranges
 * - All dimensions: site, page, query, page_query, device, country, searchAppearance
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

// ============================================================================
// Types
// ============================================================================

interface GSCRequest {
  action: 'backfill' | 'daily_sync' | 'manual_sync';
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  dimensions?: string[]; // Which dimensions to sync
}

interface GSCApiResponse {
  rows?: GSCRow[];
  responseAggregationType?: string;
}

interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SyncStats {
  rowsFetched: number;
  rowsInserted: number;
  rowsUpdated: number;
  errors: string[];
}

// ============================================================================
// Configuration
// ============================================================================

const GSC_SITE_URL = Deno.env.get('GSC_SITE_URL') || 'sc-domain:ristorantestoria.de';
const GSC_CLIENT_EMAIL = Deno.env.get('GSC_CLIENT_EMAIL') || '';
const GSC_PRIVATE_KEY = Deno.env.get('GSC_PRIVATE_KEY') || '';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const GSC_API_BASE = 'https://www.googleapis.com/webmasters/v3';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Dimension configurations
const DIMENSION_CONFIGS = {
  site: { dimensions: [], tableName: 'gsc_site_metrics' },
  page: { dimensions: ['page'], tableName: 'gsc_page_metrics' },
  query: { dimensions: ['query'], tableName: 'gsc_query_metrics' },
  page_query: { dimensions: ['page', 'query'], tableName: 'gsc_page_query_metrics' },
  device: { dimensions: ['device'], tableName: 'gsc_device_metrics' },
  country: { dimensions: ['country'], tableName: 'gsc_country_metrics' },
  searchAppearance: { dimensions: ['searchAppearance'], tableName: 'gsc_search_appearance_metrics' },
};

// ============================================================================
// JWT Authentication for Service Account
// ============================================================================

async function getAccessToken(): Promise<string> {
  // Parse private key (handle escaped newlines)
  const privateKeyPem = GSC_PRIVATE_KEY.replace(/\\n/g, '\n');

  // Import the private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Create JWT
  const now = Math.floor(Date.now() / 1000);
  const jwt = await create(
    { alg: 'RS256', typ: 'JWT' },
    {
      iss: GSC_CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: GOOGLE_TOKEN_URL,
      exp: getNumericDate(3600), // 1 hour
      iat: getNumericDate(0),
    },
    privateKey
  );

  // Exchange JWT for access token
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Remove PEM headers and decode base64
  const base64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ============================================================================
// GSC API Client
// ============================================================================

async function fetchGSCData(
  accessToken: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit = 25000,
  startRow = 0
): Promise<GSCApiResponse> {
  const siteUrl = encodeURIComponent(GSC_SITE_URL);
  const url = `${GSC_API_BASE}/sites/${siteUrl}/searchAnalytics/query`;

  const body: Record<string, unknown> = {
    startDate,
    endDate,
    rowLimit,
    startRow,
    dataState: 'final', // Use final data (not fresh)
  };

  if (dimensions.length > 0) {
    body.dimensions = dimensions;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GSC API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function fetchAllGSCData(
  accessToken: string,
  startDate: string,
  endDate: string,
  dimensions: string[]
): Promise<GSCRow[]> {
  const allRows: GSCRow[] = [];
  let startRow = 0;
  const rowLimit = 25000;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchGSCData(
      accessToken,
      startDate,
      endDate,
      dimensions,
      rowLimit,
      startRow
    );

    const rows = response.rows || [];
    allRows.push(...rows);

    if (rows.length < rowLimit) {
      hasMore = false;
    } else {
      startRow += rowLimit;
    }

    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allRows;
}

// ============================================================================
// URL Normalization
// ============================================================================

function normalizeUrl(rawUrl: string): string {
  let normalized = rawUrl;

  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');

  // Remove www
  normalized = normalized.replace(/^www\./, '');

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');

  // Lowercase
  normalized = normalized.toLowerCase();

  // Remove tracking parameters
  normalized = normalized.replace(/\?.*$/, '');

  return normalized;
}

function extractUrlLanguage(url: string): string {
  const match = url.match(/\/(en|it|fr)(\/|$)/);
  return match ? match[1] : 'de';
}

function analyzeUrlVariants(rawUrl: string) {
  return {
    host_variant: rawUrl.match(/^https?:\/\/www\./) ? 'www' : 'non-www',
    protocol_variant: rawUrl.match(/^https:\/\//) ? 'https' : 'http',
    trailing_slash_variant: rawUrl.endsWith('/'),
    is_legacy_cms: rawUrl.includes('/cms/'),
    is_pdf: rawUrl.endsWith('.pdf'),
    language: extractUrlLanguage(rawUrl),
  };
}

// ============================================================================
// Data Storage
// ============================================================================

async function storeSiteMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  // For site metrics without dimensions, aggregate the single row
  if (rows.length === 0) {
    return stats;
  }

  // When no dimensions, GSC returns a single aggregated row
  const row = rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

  const { error } = await supabase
    .from('gsc_site_metrics')
    .upsert({
      site_property: GSC_SITE_URL,
      date,
      search_type: 'web',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'site_property,date,search_type' });

  if (error) {
    stats.errors.push(`Site metrics error: ${error.message}`);
  } else {
    stats.rowsInserted = 1;
  }

  return stats;
}

async function storePageMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  // Process in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const records = batch.map(row => ({
      site_property: GSC_SITE_URL,
      date,
      search_type: 'web',
      raw_url: row.keys[0],
      normalized_url: normalizeUrl(row.keys[0]),
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('gsc_page_metrics')
      .upsert(records, { onConflict: 'site_property,date,search_type,raw_url' });

    if (error) {
      stats.errors.push(`Page metrics batch ${i} error: ${error.message}`);
    } else {
      stats.rowsInserted += batch.length;
    }
  }

  // Also update URL registry
  await updateUrlRegistry(supabase, rows.map(r => r.keys[0]), date);

  return stats;
}

async function storeQueryMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  const batchSize = 1000;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const records = batch.map(row => ({
      site_property: GSC_SITE_URL,
      date,
      search_type: 'web',
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('gsc_query_metrics')
      .upsert(records, { onConflict: 'site_property,date,search_type,query' });

    if (error) {
      stats.errors.push(`Query metrics batch ${i} error: ${error.message}`);
    } else {
      stats.rowsInserted += batch.length;
    }
  }

  return stats;
}

async function storePageQueryMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  const batchSize = 1000;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const records = batch.map(row => ({
      site_property: GSC_SITE_URL,
      date,
      search_type: 'web',
      raw_url: row.keys[0],
      normalized_url: normalizeUrl(row.keys[0]),
      query: row.keys[1],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('gsc_page_query_metrics')
      .upsert(records, { onConflict: 'site_property,date,search_type,raw_url,query' });

    if (error) {
      stats.errors.push(`Page-query metrics batch ${i} error: ${error.message}`);
    } else {
      stats.rowsInserted += batch.length;
    }
  }

  return stats;
}

async function storeDeviceMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  const records = rows.map(row => ({
    site_property: GSC_SITE_URL,
    date,
    search_type: 'web',
    device: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('gsc_device_metrics')
    .upsert(records, { onConflict: 'site_property,date,search_type,device' });

  if (error) {
    stats.errors.push(`Device metrics error: ${error.message}`);
  } else {
    stats.rowsInserted = records.length;
  }

  return stats;
}

async function storeCountryMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const records = batch.map(row => ({
      site_property: GSC_SITE_URL,
      date,
      search_type: 'web',
      country: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('gsc_country_metrics')
      .upsert(records, { onConflict: 'site_property,date,search_type,country' });

    if (error) {
      stats.errors.push(`Country metrics batch ${i} error: ${error.message}`);
    } else {
      stats.rowsInserted += batch.length;
    }
  }

  return stats;
}

async function storeSearchAppearanceMetrics(
  supabase: ReturnType<typeof createClient>,
  rows: GSCRow[],
  date: string
): Promise<SyncStats> {
  const stats: SyncStats = { rowsFetched: rows.length, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  const records = rows.map(row => ({
    site_property: GSC_SITE_URL,
    date,
    search_type: 'web',
    search_appearance: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('gsc_search_appearance_metrics')
    .upsert(records, { onConflict: 'site_property,date,search_type,search_appearance' });

  if (error) {
    stats.errors.push(`Search appearance metrics error: ${error.message}`);
  } else {
    stats.rowsInserted = records.length;
  }

  return stats;
}

async function updateUrlRegistry(
  supabase: ReturnType<typeof createClient>,
  urls: string[],
  date: string
): Promise<void> {
  const batchSize = 500;
  const uniqueUrls = [...new Set(urls)];

  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    const records = batch.map(rawUrl => {
      const variants = analyzeUrlVariants(rawUrl);
      return {
        raw_url: rawUrl,
        normalized_url: normalizeUrl(rawUrl),
        host_variant: variants.host_variant,
        protocol_variant: variants.protocol_variant,
        trailing_slash_variant: variants.trailing_slash_variant,
        is_legacy_cms: variants.is_legacy_cms,
        is_pdf: variants.is_pdf,
        language: variants.language,
        last_seen: date,
      };
    });

    // Use upsert with conflict on raw_url
    await supabase
      .from('gsc_url_registry')
      .upsert(records, {
        onConflict: 'raw_url',
        ignoreDuplicates: false,
      });
  }
}

// ============================================================================
// Sync Job Management
// ============================================================================

async function createSyncJob(
  supabase: ReturnType<typeof createClient>,
  jobType: string,
  dateFrom: string,
  dateTo: string
): Promise<string> {
  const { data, error } = await supabase
    .from('gsc_sync_jobs')
    .insert({
      job_type: jobType,
      status: 'running',
      started_at: new Date().toISOString(),
      date_from: dateFrom,
      date_to: dateTo,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create sync job: ${error.message}`);
  return data.id;
}

async function updateSyncJob(
  supabase: ReturnType<typeof createClient>,
  jobId: string,
  updates: Record<string, unknown>
): Promise<void> {
  await supabase
    .from('gsc_sync_jobs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', jobId);
}

async function updateSyncState(
  supabase: ReturnType<typeof createClient>,
  dimension: string,
  lastSyncedDate: string
): Promise<void> {
  await supabase
    .from('gsc_sync_state')
    .upsert({
      site_property: GSC_SITE_URL,
      dimension,
      last_synced_date: lastSyncedDate,
      last_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'site_property,dimension' });
}

// ============================================================================
// Main Sync Logic
// ============================================================================

async function syncDimension(
  supabase: ReturnType<typeof createClient>,
  accessToken: string,
  dimension: string,
  startDate: string,
  endDate: string
): Promise<SyncStats> {
  const config = DIMENSION_CONFIGS[dimension as keyof typeof DIMENSION_CONFIGS];
  if (!config) throw new Error(`Unknown dimension: ${dimension}`);

  console.log(`Syncing ${dimension} from ${startDate} to ${endDate}...`);

  // Fetch data from GSC
  const rows = await fetchAllGSCData(accessToken, startDate, endDate, config.dimensions);

  console.log(`Fetched ${rows.length} rows for ${dimension}`);

  // For daily granularity, we need to fetch day by day if dimensions are included
  // GSC API doesn't split by date when using dimensions
  // We'll iterate through each date

  const allStats: SyncStats = { rowsFetched: 0, rowsInserted: 0, rowsUpdated: 0, errors: [] };

  // Generate date range
  const dates: string[] = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // For each date, fetch and store
  for (const date of dates) {
    const dayRows = await fetchAllGSCData(accessToken, date, date, config.dimensions);

    let stats: SyncStats;
    switch (dimension) {
      case 'site':
        stats = await storeSiteMetrics(supabase, dayRows, date);
        break;
      case 'page':
        stats = await storePageMetrics(supabase, dayRows, date);
        break;
      case 'query':
        stats = await storeQueryMetrics(supabase, dayRows, date);
        break;
      case 'page_query':
        stats = await storePageQueryMetrics(supabase, dayRows, date);
        break;
      case 'device':
        stats = await storeDeviceMetrics(supabase, dayRows, date);
        break;
      case 'country':
        stats = await storeCountryMetrics(supabase, dayRows, date);
        break;
      case 'searchAppearance':
        stats = await storeSearchAppearanceMetrics(supabase, dayRows, date);
        break;
      default:
        throw new Error(`Unknown dimension: ${dimension}`);
    }

    allStats.rowsFetched += stats.rowsFetched;
    allStats.rowsInserted += stats.rowsInserted;
    allStats.rowsUpdated += stats.rowsUpdated;
    allStats.errors.push(...stats.errors);

    // Rate limiting between dates
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Update sync state
  await updateSyncState(supabase, dimension, endDate);

  return allStats;
}

async function runBackfill(
  supabase: ReturnType<typeof createClient>,
  accessToken: string,
  dimensions: string[]
): Promise<Record<string, SyncStats>> {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2); // GSC data has 2-day delay
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90); // 90 days backfill

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  console.log(`Starting backfill from ${startDateStr} to ${endDateStr}`);

  const results: Record<string, SyncStats> = {};

  for (const dimension of dimensions) {
    try {
      results[dimension] = await syncDimension(supabase, accessToken, dimension, startDateStr, endDateStr);
    } catch (error) {
      results[dimension] = {
        rowsFetched: 0,
        rowsInserted: 0,
        rowsUpdated: 0,
        errors: [(error as Error).message],
      };
    }
  }

  return results;
}

async function runDailySync(
  supabase: ReturnType<typeof createClient>,
  accessToken: string,
  dimensions: string[]
): Promise<Record<string, SyncStats>> {
  // Sync yesterday + last 7 days for late data
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2); // GSC data has 2-day delay
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7); // Last 7 days

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  console.log(`Starting daily sync from ${startDateStr} to ${endDateStr}`);

  const results: Record<string, SyncStats> = {};

  for (const dimension of dimensions) {
    try {
      results[dimension] = await syncDimension(supabase, accessToken, dimension, startDateStr, endDateStr);
    } catch (error) {
      results[dimension] = {
        rowsFetched: 0,
        rowsInserted: 0,
        rowsUpdated: 0,
        errors: [(error as Error).message],
      };
    }
  }

  return results;
}

// ============================================================================
// HTTP Handler
// ============================================================================

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment
    if (!GSC_CLIENT_EMAIL || !GSC_PRIVATE_KEY) {
      throw new Error('GSC credentials not configured. Set GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY.');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured.');
    }

    // Parse request
    const body: GSCRequest = await req.json();
    const { action, dateFrom, dateTo, dimensions = ['site', 'page', 'query', 'device', 'country', 'searchAppearance'] } = body;

    console.log(`GSC Sync: action=${action}, dimensions=${dimensions.join(',')}`);

    // Initialize clients
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const accessToken = await getAccessToken();

    console.log('Successfully authenticated with Google APIs');

    // Create sync job
    const dateFromStr = dateFrom || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateToStr = dateTo || new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const jobId = await createSyncJob(supabase, action, dateFromStr, dateToStr);

    let results: Record<string, SyncStats>;

    try {
      switch (action) {
        case 'backfill':
          results = await runBackfill(supabase, accessToken, dimensions);
          break;
        case 'daily_sync':
          results = await runDailySync(supabase, accessToken, dimensions);
          break;
        case 'manual_sync':
          if (!dateFrom || !dateTo) {
            throw new Error('manual_sync requires dateFrom and dateTo');
          }
          results = {};
          for (const dimension of dimensions) {
            results[dimension] = await syncDimension(supabase, accessToken, dimension, dateFrom, dateTo);
          }
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Calculate totals
      let totalFetched = 0, totalInserted = 0, totalErrors = 0;
      const allErrors: string[] = [];

      for (const [dim, stats] of Object.entries(results)) {
        totalFetched += stats.rowsFetched;
        totalInserted += stats.rowsInserted;
        totalErrors += stats.errors.length;
        allErrors.push(...stats.errors.map(e => `${dim}: ${e}`));
      }

      // Update job as completed
      await updateSyncJob(supabase, jobId, {
        status: totalErrors > 0 ? 'completed_with_errors' : 'completed',
        completed_at: new Date().toISOString(),
        rows_fetched: totalFetched,
        rows_inserted: totalInserted,
        errors_count: totalErrors,
        error_details: allErrors,
        progress_percent: 100,
      });

      return new Response(JSON.stringify({
        success: true,
        jobId,
        action,
        results,
        summary: {
          totalFetched,
          totalInserted,
          totalErrors,
        },
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      // Update job as failed
      await updateSyncJob(supabase, jobId, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_details: [(error as Error).message],
      });
      throw error;
    }

  } catch (error) {
    console.error('GSC Sync error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
