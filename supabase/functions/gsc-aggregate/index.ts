/**
 * GSC Aggregate Edge Function
 *
 * Computes rolling window aggregates and detects anomalies:
 * - Site, page, query level aggregates (7d, 28d, 90d)
 * - WoW and MoM comparisons
 * - Duplicate URL detection
 * - Cannibalization detection
 * - Performance drop alerts
 * - Legacy /cms/ URL alerts
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ============================================================================
// Types
// ============================================================================

interface AggregateRequest {
  action: 'compute_all' | 'compute_aggregates' | 'detect_anomalies' | 'detect_duplicates' | 'detect_cannibalization';
  computeDate?: string; // YYYY-MM-DD, defaults to today
}

interface AlertData {
  rule_id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  affected_url?: string;
  affected_query?: string;
  affected_date?: string;
  metric_value?: number;
  threshold_value?: number;
  comparison_period?: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Configuration
// ============================================================================

const GSC_SITE_URL = Deno.env.get('GSC_SITE_URL') || 'sc-domain:ristorantestoria.de';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

// Window configurations
const WINDOWS = {
  '7d': 7,
  '28d': 28,
  '90d': 90,
};

// ============================================================================
// Aggregate Computation
// ============================================================================

async function computeSiteAggregates(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<number> {
  let insertCount = 0;

  for (const [windowType, days] of Object.entries(WINDOWS)) {
    const startDate = new Date(computeDate);
    startDate.setDate(startDate.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Calculate current period aggregate
    const { data: currentPeriod } = await supabase
      .from('gsc_site_metrics')
      .select('clicks, impressions, ctr, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', startDateStr)
      .lte('date', computeDate);

    if (!currentPeriod || currentPeriod.length === 0) continue;

    const totalClicks = currentPeriod.reduce((sum, r) => sum + (r.clicks || 0), 0);
    const totalImpressions = currentPeriod.reduce((sum, r) => sum + (r.impressions || 0), 0);
    const avgCtr = currentPeriod.reduce((sum, r) => sum + (r.ctr || 0), 0) / currentPeriod.length;
    const avgPosition = currentPeriod.reduce((sum, r) => sum + (r.position || 0), 0) / currentPeriod.length;

    // Calculate previous week for WoW
    const prevWeekStart = new Date(startDateStr);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(computeDate);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

    const { data: prevWeek } = await supabase
      .from('gsc_site_metrics')
      .select('clicks, impressions, ctr, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', prevWeekStart.toISOString().split('T')[0])
      .lte('date', prevWeekEnd.toISOString().split('T')[0]);

    const prevWeekClicks = prevWeek?.reduce((sum, r) => sum + (r.clicks || 0), 0) || 0;
    const prevWeekImpressions = prevWeek?.reduce((sum, r) => sum + (r.impressions || 0), 0) || 0;
    const prevWeekCtr = prevWeek && prevWeek.length > 0
      ? prevWeek.reduce((sum, r) => sum + (r.ctr || 0), 0) / prevWeek.length
      : 0;
    const prevWeekPosition = prevWeek && prevWeek.length > 0
      ? prevWeek.reduce((sum, r) => sum + (r.position || 0), 0) / prevWeek.length
      : 0;

    // Calculate previous month for MoM
    const prevMonthStart = new Date(startDateStr);
    prevMonthStart.setDate(prevMonthStart.getDate() - 28);
    const prevMonthEnd = new Date(computeDate);
    prevMonthEnd.setDate(prevMonthEnd.getDate() - 28);

    const { data: prevMonth } = await supabase
      .from('gsc_site_metrics')
      .select('clicks, impressions, ctr, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', prevMonthStart.toISOString().split('T')[0])
      .lte('date', prevMonthEnd.toISOString().split('T')[0]);

    const prevMonthClicks = prevMonth?.reduce((sum, r) => sum + (r.clicks || 0), 0) || 0;
    const prevMonthImpressions = prevMonth?.reduce((sum, r) => sum + (r.impressions || 0), 0) || 0;
    const prevMonthCtr = prevMonth && prevMonth.length > 0
      ? prevMonth.reduce((sum, r) => sum + (r.ctr || 0), 0) / prevMonth.length
      : 0;
    const prevMonthPosition = prevMonth && prevMonth.length > 0
      ? prevMonth.reduce((sum, r) => sum + (r.position || 0), 0) / prevMonth.length
      : 0;

    // Calculate deltas and percentages
    const calcPctChange = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100 * 100) / 100 : null;

    const { error } = await supabase
      .from('gsc_site_aggregates')
      .upsert({
        site_property: GSC_SITE_URL,
        computed_date: computeDate,
        window_type: windowType,
        search_type: 'web',
        total_clicks: totalClicks,
        total_impressions: totalImpressions,
        avg_ctr: avgCtr,
        avg_position: avgPosition,
        delta_clicks_wow: totalClicks - prevWeekClicks,
        delta_impressions_wow: totalImpressions - prevWeekImpressions,
        delta_ctr_wow: avgCtr - prevWeekCtr,
        delta_position_wow: avgPosition - prevWeekPosition,
        delta_clicks_mom: totalClicks - prevMonthClicks,
        delta_impressions_mom: totalImpressions - prevMonthImpressions,
        delta_ctr_mom: avgCtr - prevMonthCtr,
        delta_position_mom: avgPosition - prevMonthPosition,
        pct_change_clicks_wow: calcPctChange(totalClicks, prevWeekClicks),
        pct_change_impressions_wow: calcPctChange(totalImpressions, prevWeekImpressions),
        pct_change_clicks_mom: calcPctChange(totalClicks, prevMonthClicks),
        pct_change_impressions_mom: calcPctChange(totalImpressions, prevMonthImpressions),
      }, { onConflict: 'site_property,computed_date,window_type,search_type' });

    if (!error) insertCount++;
  }

  return insertCount;
}

async function computePageAggregates(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<number> {
  let insertCount = 0;

  for (const [windowType, days] of Object.entries(WINDOWS)) {
    const startDate = new Date(computeDate);
    startDate.setDate(startDate.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get all pages with their aggregated metrics
    const { data: pageData } = await supabase
      .from('gsc_page_metrics')
      .select('normalized_url, clicks, impressions, ctr, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', startDateStr)
      .lte('date', computeDate);

    if (!pageData) continue;

    // Group by normalized_url
    const pageAggregates = new Map<string, {
      clicks: number;
      impressions: number;
      ctrSum: number;
      positionSum: number;
      count: number;
    }>();

    for (const row of pageData) {
      const existing = pageAggregates.get(row.normalized_url) || {
        clicks: 0, impressions: 0, ctrSum: 0, positionSum: 0, count: 0
      };
      existing.clicks += row.clicks || 0;
      existing.impressions += row.impressions || 0;
      existing.ctrSum += row.ctr || 0;
      existing.positionSum += row.position || 0;
      existing.count++;
      pageAggregates.set(row.normalized_url, existing);
    }

    // Get previous week data for WoW comparison
    const prevWeekStart = new Date(startDateStr);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(computeDate);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

    const { data: prevWeekData } = await supabase
      .from('gsc_page_metrics')
      .select('normalized_url, clicks, impressions, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', prevWeekStart.toISOString().split('T')[0])
      .lte('date', prevWeekEnd.toISOString().split('T')[0]);

    const prevWeekAggregates = new Map<string, { clicks: number; impressions: number; position: number; count: number }>();
    for (const row of prevWeekData || []) {
      const existing = prevWeekAggregates.get(row.normalized_url) || { clicks: 0, impressions: 0, position: 0, count: 0 };
      existing.clicks += row.clicks || 0;
      existing.impressions += row.impressions || 0;
      existing.position += row.position || 0;
      existing.count++;
      prevWeekAggregates.set(row.normalized_url, existing);
    }

    // Get previous month data for MoM comparison
    const prevMonthStart = new Date(startDateStr);
    prevMonthStart.setDate(prevMonthStart.getDate() - 28);
    const prevMonthEnd = new Date(computeDate);
    prevMonthEnd.setDate(prevMonthEnd.getDate() - 28);

    const { data: prevMonthData } = await supabase
      .from('gsc_page_metrics')
      .select('normalized_url, clicks, impressions, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', prevMonthStart.toISOString().split('T')[0])
      .lte('date', prevMonthEnd.toISOString().split('T')[0]);

    const prevMonthAggregates = new Map<string, { clicks: number; impressions: number; position: number; count: number }>();
    for (const row of prevMonthData || []) {
      const existing = prevMonthAggregates.get(row.normalized_url) || { clicks: 0, impressions: 0, position: 0, count: 0 };
      existing.clicks += row.clicks || 0;
      existing.impressions += row.impressions || 0;
      existing.position += row.position || 0;
      existing.count++;
      prevMonthAggregates.set(row.normalized_url, existing);
    }

    // Prepare and insert aggregates in batches
    const calcPctChange = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100 * 100) / 100 : null;

    const records = Array.from(pageAggregates.entries()).map(([url, agg]) => {
      const prevWeek = prevWeekAggregates.get(url);
      const prevMonth = prevMonthAggregates.get(url);

      const avgCtr = agg.count > 0 ? agg.ctrSum / agg.count : 0;
      const avgPosition = agg.count > 0 ? agg.positionSum / agg.count : 0;
      const prevWeekPosition = prevWeek && prevWeek.count > 0 ? prevWeek.position / prevWeek.count : 0;
      const prevMonthPosition = prevMonth && prevMonth.count > 0 ? prevMonth.position / prevMonth.count : 0;

      const deltaClicksWow = agg.clicks - (prevWeek?.clicks || 0);
      const deltaClicksMom = agg.clicks - (prevMonth?.clicks || 0);
      const pctChangeClicksWow = calcPctChange(agg.clicks, prevWeek?.clicks || 0);
      const pctChangeClicksMom = calcPctChange(agg.clicks, prevMonth?.clicks || 0);

      // Determine winners/losers (>25% change with >50 clicks difference)
      const isWinner = (pctChangeClicksWow && pctChangeClicksWow > 25 && deltaClicksWow > 50) ||
                       (pctChangeClicksMom && pctChangeClicksMom > 40 && deltaClicksMom > 100);
      const isLoser = (pctChangeClicksWow && pctChangeClicksWow < -25 && deltaClicksWow < -50) ||
                      (pctChangeClicksMom && pctChangeClicksMom < -40 && deltaClicksMom < -100);

      return {
        site_property: GSC_SITE_URL,
        computed_date: computeDate,
        window_type: windowType,
        normalized_url: url,
        search_type: 'web',
        total_clicks: agg.clicks,
        total_impressions: agg.impressions,
        avg_ctr: avgCtr,
        avg_position: avgPosition,
        delta_clicks_wow: deltaClicksWow,
        delta_impressions_wow: agg.impressions - (prevWeek?.impressions || 0),
        delta_position_wow: avgPosition - prevWeekPosition,
        delta_clicks_mom: deltaClicksMom,
        delta_impressions_mom: agg.impressions - (prevMonth?.impressions || 0),
        delta_position_mom: avgPosition - prevMonthPosition,
        pct_change_clicks_wow: pctChangeClicksWow,
        pct_change_impressions_wow: calcPctChange(agg.impressions, prevWeek?.impressions || 0),
        pct_change_clicks_mom: pctChangeClicksMom,
        pct_change_impressions_mom: calcPctChange(agg.impressions, prevMonth?.impressions || 0),
        is_winner: isWinner,
        is_loser: isLoser,
      };
    });

    // Batch insert
    const batchSize = 500;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { error } = await supabase
        .from('gsc_page_aggregates')
        .upsert(batch, { onConflict: 'site_property,computed_date,window_type,normalized_url,search_type' });

      if (!error) insertCount += batch.length;
    }
  }

  return insertCount;
}

async function computeQueryAggregates(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<number> {
  let insertCount = 0;

  for (const [windowType, days] of Object.entries(WINDOWS)) {
    const startDate = new Date(computeDate);
    startDate.setDate(startDate.getDate() - days + 1);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get all queries with their aggregated metrics
    const { data: queryData } = await supabase
      .from('gsc_query_metrics')
      .select('query, clicks, impressions, ctr, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', startDateStr)
      .lte('date', computeDate);

    if (!queryData) continue;

    // Group by query
    const queryAggregates = new Map<string, {
      clicks: number;
      impressions: number;
      ctrSum: number;
      positionSum: number;
      count: number;
    }>();

    for (const row of queryData) {
      const existing = queryAggregates.get(row.query) || {
        clicks: 0, impressions: 0, ctrSum: 0, positionSum: 0, count: 0
      };
      existing.clicks += row.clicks || 0;
      existing.impressions += row.impressions || 0;
      existing.ctrSum += row.ctr || 0;
      existing.positionSum += row.position || 0;
      existing.count++;
      queryAggregates.set(row.query, existing);
    }

    // Check for cannibalization: Get page_query data
    const { data: pageQueryData } = await supabase
      .from('gsc_page_query_metrics')
      .select('query, normalized_url, clicks, impressions, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', startDateStr)
      .lte('date', computeDate);

    // Group by query to count ranking pages
    const cannibalizationData = new Map<string, {
      pages: Map<string, { clicks: number; impressions: number; position: number }>;
    }>();

    for (const row of pageQueryData || []) {
      let queryEntry = cannibalizationData.get(row.query);
      if (!queryEntry) {
        queryEntry = { pages: new Map() };
        cannibalizationData.set(row.query, queryEntry);
      }

      const pageData = queryEntry.pages.get(row.normalized_url) || { clicks: 0, impressions: 0, position: 0 };
      pageData.clicks += row.clicks || 0;
      pageData.impressions += row.impressions || 0;
      pageData.position += row.position || 0;
      queryEntry.pages.set(row.normalized_url, pageData);
    }

    const calcPctChange = (curr: number, prev: number) =>
      prev > 0 ? Math.round(((curr - prev) / prev) * 100 * 100) / 100 : null;

    // Get previous periods for comparison (simplified for queries)
    const prevWeekStart = new Date(startDateStr);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(computeDate);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

    const { data: prevWeekQueries } = await supabase
      .from('gsc_query_metrics')
      .select('query, clicks, impressions, position')
      .eq('site_property', GSC_SITE_URL)
      .gte('date', prevWeekStart.toISOString().split('T')[0])
      .lte('date', prevWeekEnd.toISOString().split('T')[0]);

    const prevWeekAgg = new Map<string, { clicks: number; impressions: number }>();
    for (const row of prevWeekQueries || []) {
      const existing = prevWeekAgg.get(row.query) || { clicks: 0, impressions: 0 };
      existing.clicks += row.clicks || 0;
      existing.impressions += row.impressions || 0;
      prevWeekAgg.set(row.query, existing);
    }

    // Prepare records
    const records = Array.from(queryAggregates.entries()).map(([query, agg]) => {
      const cannibData = cannibalizationData.get(query);
      const rankingPageCount = cannibData ? cannibData.pages.size : 1;

      // Find top page (most clicks)
      let topPageUrl: string | null = null;
      let topPageClicks = 0;
      if (cannibData) {
        for (const [url, data] of cannibData.pages) {
          if (data.clicks > topPageClicks) {
            topPageClicks = data.clicks;
            topPageUrl = url;
          }
        }
      }

      // Cannibalization threshold: 2+ pages with >50 impressions each
      let isCannibalized = false;
      if (cannibData && cannibData.pages.size >= 2) {
        const pagesWithSignificantImpressions = Array.from(cannibData.pages.values())
          .filter(p => p.impressions >= 50);
        isCannibalized = pagesWithSignificantImpressions.length >= 2;
      }

      const avgCtr = agg.count > 0 ? agg.ctrSum / agg.count : 0;
      const avgPosition = agg.count > 0 ? agg.positionSum / agg.count : 0;

      const prevWeek = prevWeekAgg.get(query);
      const deltaClicksWow = agg.clicks - (prevWeek?.clicks || 0);
      const deltaImpressionsWow = agg.impressions - (prevWeek?.impressions || 0);

      return {
        site_property: GSC_SITE_URL,
        computed_date: computeDate,
        window_type: windowType,
        query,
        search_type: 'web',
        total_clicks: agg.clicks,
        total_impressions: agg.impressions,
        avg_ctr: avgCtr,
        avg_position: avgPosition,
        ranking_page_count: rankingPageCount,
        top_page_url: topPageUrl,
        is_cannibalized: isCannibalized,
        delta_clicks_wow: deltaClicksWow,
        delta_impressions_wow: deltaImpressionsWow,
        delta_position_wow: 0, // Would need more data
        delta_clicks_mom: 0,
        delta_impressions_mom: 0,
        delta_position_mom: 0,
      };
    });

    // Batch insert
    const batchSize = 500;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { error } = await supabase
        .from('gsc_query_aggregates')
        .upsert(batch, { onConflict: 'site_property,computed_date,window_type,query,search_type' });

      if (!error) insertCount += batch.length;
    }
  }

  return insertCount;
}

// ============================================================================
// Anomaly Detection
// ============================================================================

async function detectDuplicateUrls(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<AlertData[]> {
  const alerts: AlertData[] = [];

  // Get rule config
  const { data: rule } = await supabase
    .from('gsc_alert_rules')
    .select('*')
    .eq('name', 'Duplicate URL Detection')
    .single();

  if (!rule || !rule.is_enabled) return alerts;

  const minImpressions = rule.thresholds?.min_impressions || 10;

  // Find URLs that appear in multiple variants
  const { data: urlRegistry } = await supabase
    .from('gsc_url_registry')
    .select('raw_url, normalized_url, host_variant, protocol_variant, total_impressions')
    .gte('total_impressions', minImpressions);

  if (!urlRegistry) return alerts;

  // Group by normalized_url
  const groups = new Map<string, Array<{ raw_url: string; host_variant: string; protocol_variant: string; impressions: number }>>();

  for (const url of urlRegistry) {
    const group = groups.get(url.normalized_url) || [];
    group.push({
      raw_url: url.raw_url,
      host_variant: url.host_variant,
      protocol_variant: url.protocol_variant,
      impressions: url.total_impressions || 0,
    });
    groups.set(url.normalized_url, group);
  }

  // Find groups with multiple variants
  for (const [normalizedUrl, variants] of groups) {
    if (variants.length >= 2) {
      // Check if there are actual different variants (not just same URL)
      const uniqueVariants = new Set(variants.map(v => `${v.protocol_variant}://${v.host_variant}`));
      if (uniqueVariants.size >= 2) {
        const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);

        alerts.push({
          rule_id: rule.id,
          alert_type: 'duplicate_urls',
          severity: rule.severity,
          title: `Duplicate URL variants detected`,
          description: `URL "${normalizedUrl}" has ${variants.length} variants receiving impressions`,
          affected_url: normalizedUrl,
          affected_date: computeDate,
          metric_value: totalImpressions,
          threshold_value: minImpressions,
          details: { variants },
        });
      }
    }
  }

  return alerts;
}

async function detectLegacyCmsUrls(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<AlertData[]> {
  const alerts: AlertData[] = [];

  // Get rule config
  const { data: rule } = await supabase
    .from('gsc_alert_rules')
    .select('*')
    .eq('name', 'Legacy CMS Detection')
    .single();

  if (!rule || !rule.is_enabled) return alerts;

  // Find /cms/ URLs with impressions
  const { data: cmsUrls } = await supabase
    .from('gsc_url_registry')
    .select('raw_url, normalized_url, total_clicks, total_impressions')
    .eq('is_legacy_cms', true)
    .gt('total_impressions', 0);

  for (const url of cmsUrls || []) {
    alerts.push({
      rule_id: rule.id,
      alert_type: 'legacy_cms',
      severity: rule.severity,
      title: `Legacy /cms/ URL receiving traffic`,
      description: `URL "${url.raw_url}" is a legacy CMS URL but still receiving impressions`,
      affected_url: url.raw_url,
      affected_date: computeDate,
      metric_value: url.total_impressions || 0,
      threshold_value: 0,
      details: {
        clicks: url.total_clicks,
        impressions: url.total_impressions,
      },
    });
  }

  return alerts;
}

async function detectCannibalization(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<AlertData[]> {
  const alerts: AlertData[] = [];

  // Get rule config
  const { data: rule } = await supabase
    .from('gsc_alert_rules')
    .select('*')
    .eq('name', 'Query Cannibalization')
    .single();

  if (!rule || !rule.is_enabled) return alerts;

  // Find cannibalized queries
  const { data: cannibalized } = await supabase
    .from('gsc_query_aggregates')
    .select('query, ranking_page_count, total_impressions, top_page_url')
    .eq('site_property', GSC_SITE_URL)
    .eq('computed_date', computeDate)
    .eq('window_type', '28d')
    .eq('is_cannibalized', true)
    .gte('total_impressions', 100)
    .order('total_impressions', { ascending: false })
    .limit(50);

  for (const query of cannibalized || []) {
    alerts.push({
      rule_id: rule.id,
      alert_type: 'cannibalization',
      severity: rule.severity,
      title: `Query cannibalization detected`,
      description: `Query "${query.query}" has ${query.ranking_page_count} pages competing`,
      affected_query: query.query,
      affected_date: computeDate,
      metric_value: query.ranking_page_count,
      threshold_value: 2,
      details: {
        impressions: query.total_impressions,
        topPage: query.top_page_url,
        pageCount: query.ranking_page_count,
      },
    });
  }

  return alerts;
}

async function detectPerformanceDrops(
  supabase: ReturnType<typeof createClient>,
  computeDate: string
): Promise<AlertData[]> {
  const alerts: AlertData[] = [];

  // Get rule configs
  const { data: rules } = await supabase
    .from('gsc_alert_rules')
    .select('*')
    .eq('alert_type', 'performance_drop')
    .eq('is_enabled', true);

  for (const rule of rules || []) {
    const metric = rule.thresholds?.metric;
    const period = rule.thresholds?.period;
    const minDropPct = rule.thresholds?.min_drop_pct || 25;
    const minAbsoluteDrop = rule.thresholds?.min_absolute_drop || 50;

    if (metric === 'clicks') {
      // Check site-level clicks drop
      const { data: siteAgg } = await supabase
        .from('gsc_site_aggregates')
        .select('*')
        .eq('site_property', GSC_SITE_URL)
        .eq('computed_date', computeDate)
        .eq('window_type', '7d')
        .single();

      if (siteAgg) {
        const pctChange = period === 'wow' ? siteAgg.pct_change_clicks_wow : siteAgg.pct_change_clicks_mom;
        const absoluteChange = period === 'wow' ? siteAgg.delta_clicks_wow : siteAgg.delta_clicks_mom;

        if (pctChange !== null && pctChange < -minDropPct && Math.abs(absoluteChange || 0) > minAbsoluteDrop) {
          alerts.push({
            rule_id: rule.id,
            alert_type: 'performance_drop',
            severity: rule.severity,
            title: `Site clicks dropped ${Math.abs(pctChange)}% ${period.toUpperCase()}`,
            description: `Total clicks dropped by ${Math.abs(absoluteChange || 0)} (${pctChange}%)`,
            affected_date: computeDate,
            metric_value: pctChange,
            threshold_value: -minDropPct,
            comparison_period: period,
            details: {
              currentClicks: siteAgg.total_clicks,
              previousClicks: siteAgg.total_clicks - (absoluteChange || 0),
              absoluteChange,
              percentChange: pctChange,
            },
          });
        }
      }

      // Check top page drops
      const { data: pageDrops } = await supabase
        .from('gsc_page_aggregates')
        .select('*')
        .eq('site_property', GSC_SITE_URL)
        .eq('computed_date', computeDate)
        .eq('window_type', '7d')
        .eq('is_loser', true)
        .order('delta_clicks_wow', { ascending: true })
        .limit(10);

      for (const page of pageDrops || []) {
        const pctChange = period === 'wow' ? page.pct_change_clicks_wow : page.pct_change_clicks_mom;
        const absoluteChange = period === 'wow' ? page.delta_clicks_wow : page.delta_clicks_mom;

        if (pctChange !== null && pctChange < -minDropPct && Math.abs(absoluteChange || 0) > minAbsoluteDrop / 2) {
          alerts.push({
            rule_id: rule.id,
            alert_type: 'performance_drop',
            severity: 'warning',
            title: `Page clicks dropped ${Math.abs(pctChange)}% ${period.toUpperCase()}`,
            description: `Page "${page.normalized_url}" lost ${Math.abs(absoluteChange || 0)} clicks`,
            affected_url: page.normalized_url,
            affected_date: computeDate,
            metric_value: pctChange,
            threshold_value: -minDropPct,
            comparison_period: period,
            details: {
              currentClicks: page.total_clicks,
              absoluteChange,
              percentChange: pctChange,
            },
          });
        }
      }
    }

    if (metric === 'impressions') {
      // Check site-level impressions crash
      const { data: siteAgg } = await supabase
        .from('gsc_site_aggregates')
        .select('*')
        .eq('site_property', GSC_SITE_URL)
        .eq('computed_date', computeDate)
        .eq('window_type', '7d')
        .single();

      if (siteAgg) {
        const pctChange = siteAgg.pct_change_impressions_wow;
        const absoluteChange = siteAgg.delta_impressions_wow;

        if (pctChange !== null && pctChange < -minDropPct && Math.abs(absoluteChange || 0) > minAbsoluteDrop) {
          alerts.push({
            rule_id: rule.id,
            alert_type: 'performance_drop',
            severity: rule.severity,
            title: `Site impressions crashed ${Math.abs(pctChange)}%`,
            description: `Possible indexing issue - impressions dropped by ${Math.abs(absoluteChange || 0)}`,
            affected_date: computeDate,
            metric_value: pctChange,
            threshold_value: -minDropPct,
            comparison_period: 'wow',
            details: {
              currentImpressions: siteAgg.total_impressions,
              absoluteChange,
              percentChange: pctChange,
            },
          });
        }
      }
    }
  }

  return alerts;
}

async function saveAlerts(
  supabase: ReturnType<typeof createClient>,
  alerts: AlertData[]
): Promise<number> {
  if (alerts.length === 0) return 0;

  // Check for existing open alerts to avoid duplicates
  const { data: existingAlerts } = await supabase
    .from('gsc_alerts')
    .select('id, affected_url, affected_query, alert_type')
    .eq('status', 'open');

  const existingKeys = new Set(
    (existingAlerts || []).map(a =>
      `${a.alert_type}:${a.affected_url || ''}:${a.affected_query || ''}`
    )
  );

  // Filter out duplicates
  const newAlerts = alerts.filter(a => {
    const key = `${a.alert_type}:${a.affected_url || ''}:${a.affected_query || ''}`;
    return !existingKeys.has(key);
  });

  if (newAlerts.length === 0) return 0;

  const { error } = await supabase
    .from('gsc_alerts')
    .insert(newAlerts);

  return error ? 0 : newAlerts.length;
}

// ============================================================================
// Update URL Registry Totals
// ============================================================================

async function updateUrlRegistryTotals(
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  // Update total clicks/impressions from page metrics
  await supabase.rpc('update_url_registry_totals');

  // If RPC doesn't exist, use direct update
  // This is a fallback - ideally use a database function
  const { data: pageTotals } = await supabase
    .from('gsc_page_metrics')
    .select('raw_url, clicks, impressions, position')
    .eq('site_property', GSC_SITE_URL);

  if (!pageTotals) return;

  // Aggregate by raw_url
  const totals = new Map<string, { clicks: number; impressions: number; positions: number[]; }>();

  for (const row of pageTotals) {
    const existing = totals.get(row.raw_url) || { clicks: 0, impressions: 0, positions: [] };
    existing.clicks += row.clicks || 0;
    existing.impressions += row.impressions || 0;
    existing.positions.push(row.position || 0);
    totals.set(row.raw_url, existing);
  }

  // Update registry in batches
  const batchSize = 100;
  const entries = Array.from(totals.entries());

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);

    for (const [rawUrl, data] of batch) {
      const avgPosition = data.positions.length > 0
        ? data.positions.reduce((a, b) => a + b, 0) / data.positions.length
        : null;

      await supabase
        .from('gsc_url_registry')
        .update({
          total_clicks: data.clicks,
          total_impressions: data.impressions,
          avg_position: avgPosition,
          updated_at: new Date().toISOString(),
        })
        .eq('raw_url', rawUrl);
    }
  }
}

// ============================================================================
// Canonical Group Detection
// ============================================================================

async function updateCanonicalGroups(
  supabase: ReturnType<typeof createClient>
): Promise<number> {
  // Get all URLs grouped by normalized_url
  const { data: urls } = await supabase
    .from('gsc_url_registry')
    .select('id, raw_url, normalized_url, total_clicks, total_impressions')
    .order('normalized_url');

  if (!urls) return 0;

  // Group by normalized URL
  const groups = new Map<string, Array<{
    id: string;
    raw_url: string;
    clicks: number;
    impressions: number;
  }>>();

  for (const url of urls) {
    const group = groups.get(url.normalized_url) || [];
    group.push({
      id: url.id,
      raw_url: url.raw_url,
      clicks: url.total_clicks || 0,
      impressions: url.total_impressions || 0,
    });
    groups.set(url.normalized_url, group);
  }

  let createdCount = 0;

  for (const [normalizedUrl, variants] of groups) {
    // Find or create canonical group
    const { data: existingGroup } = await supabase
      .from('gsc_canonical_groups')
      .select('id')
      .eq('canonical_url', normalizedUrl)
      .single();

    let groupId: string;
    const totalClicks = variants.reduce((sum, v) => sum + v.clicks, 0);
    const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);

    // Find primary variant (most clicks)
    const primaryVariant = variants.reduce((best, current) =>
      current.clicks > best.clicks ? current : best
    ).raw_url;

    if (existingGroup) {
      groupId = existingGroup.id;
      await supabase
        .from('gsc_canonical_groups')
        .update({
          variant_count: variants.length,
          is_duplicate_issue: variants.length > 1,
          total_clicks: totalClicks,
          total_impressions: totalImpressions,
          primary_variant: primaryVariant,
          updated_at: new Date().toISOString(),
        })
        .eq('id', groupId);
    } else {
      const { data: newGroup } = await supabase
        .from('gsc_canonical_groups')
        .insert({
          canonical_url: normalizedUrl,
          variant_count: variants.length,
          is_duplicate_issue: variants.length > 1,
          total_clicks: totalClicks,
          total_impressions: totalImpressions,
          primary_variant: primaryVariant,
        })
        .select('id')
        .single();

      if (newGroup) {
        groupId = newGroup.id;
        createdCount++;
      } else {
        continue;
      }
    }

    // Update URL registry with group ID
    for (const variant of variants) {
      await supabase
        .from('gsc_url_registry')
        .update({ canonical_group_id: groupId })
        .eq('id', variant.id);
    }
  }

  return createdCount;
}

// ============================================================================
// HTTP Handler
// ============================================================================

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for cron secret (for scheduled jobs)
    const cronSecret = req.headers.get('x-cron-secret');
    const expectedCronSecret = Deno.env.get('CRON_SECRET');
    
    if (cronSecret) {
      if (cronSecret !== expectedCronSecret) {
        return new Response(JSON.stringify({ error: 'Invalid cron secret' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log('Authenticated via cron secret');
    }
    // Note: For non-cron requests, Supabase JWT verification handles auth

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured.');
    }

    const body: AggregateRequest = await req.json();
    const { action, computeDate } = body;

    // Default to yesterday if not specified
    const date = computeDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    })();

    console.log(`GSC Aggregate: action=${action}, computeDate=${date}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const results: Record<string, unknown> = {};

    switch (action) {
      case 'compute_all':
        // Update URL registry totals first
        await updateUrlRegistryTotals(supabase);
        results.urlTotalsUpdated = true;

        // Update canonical groups
        results.canonicalGroupsCreated = await updateCanonicalGroups(supabase);

        // Compute aggregates
        results.siteAggregates = await computeSiteAggregates(supabase, date);
        results.pageAggregates = await computePageAggregates(supabase, date);
        results.queryAggregates = await computeQueryAggregates(supabase, date);

        // Detect anomalies
        const allAlerts: AlertData[] = [];
        allAlerts.push(...await detectDuplicateUrls(supabase, date));
        allAlerts.push(...await detectLegacyCmsUrls(supabase, date));
        allAlerts.push(...await detectCannibalization(supabase, date));
        allAlerts.push(...await detectPerformanceDrops(supabase, date));

        results.alertsCreated = await saveAlerts(supabase, allAlerts);
        results.alertsTotal = allAlerts.length;
        break;

      case 'compute_aggregates':
        results.siteAggregates = await computeSiteAggregates(supabase, date);
        results.pageAggregates = await computePageAggregates(supabase, date);
        results.queryAggregates = await computeQueryAggregates(supabase, date);
        break;

      case 'detect_anomalies':
        const anomalyAlerts: AlertData[] = [];
        anomalyAlerts.push(...await detectPerformanceDrops(supabase, date));
        results.alertsCreated = await saveAlerts(supabase, anomalyAlerts);
        break;

      case 'detect_duplicates':
        const dupAlerts = await detectDuplicateUrls(supabase, date);
        results.alertsCreated = await saveAlerts(supabase, dupAlerts);
        break;

      case 'detect_cannibalization':
        const cannibAlerts = await detectCannibalization(supabase, date);
        results.alertsCreated = await saveAlerts(supabase, cannibAlerts);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({
      success: true,
      action,
      computeDate: date,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GSC Aggregate error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
