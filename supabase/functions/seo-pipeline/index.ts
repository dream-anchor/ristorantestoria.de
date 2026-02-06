/**
 * SEO Pipeline Edge Function
 * 
 * Daily SEO analysis pipeline:
 * 1. Compute baselines from GSC data
 * 2. Evaluate alert rules
 * 3. Create tasks for critical alerts
 * 4. Generate Claude Code prompt packs
 * 5. Create daily briefing
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
};

// ============================================================================
// Types
// ============================================================================

interface AlertRule {
  id: string;
  slug: string;
  name: string;
  description: string;
  scope: string;
  window: string;
  metric: string;
  operator: string;
  threshold: number;
  base_severity: string;
  boost_money: boolean;
  cooldown_hours: number;
}

interface PageCatalogEntry {
  path: string;
  page_type: string;
}

// ============================================================================
// Helpers
// ============================================================================

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function boostSeverity(base: string, pageType: string): string {
  if (pageType === 'money' || pageType === 'pillar') {
    const map: Record<string, string> = { low: 'medium', medium: 'high', high: 'critical', critical: 'critical' };
    return map[base] || 'critical';
  }
  return base;
}

function normalizePath(url: string): string {
  let path = url.replace(/^https?:\/\/[^/]+/, '');
  if (path.length > 1) path = path.replace(/\/$/, '');
  path = path.replace(/[?#].*$/, '').toLowerCase();
  return path || '/';
}

function compareValue(value: number, operator: string, threshold: number): boolean {
  switch (operator) {
    case 'lt': return value < threshold;
    case 'gt': return value > threshold;
    case 'eq': return value === threshold;
    case 'lte': return value <= threshold;
    case 'gte': return value >= threshold;
    default: return false;
  }
}

// ============================================================================
// Pipeline Steps
// ============================================================================

async function computeBaselines(supabase: ReturnType<typeof createClient>, computeDate: string): Promise<number> {
  console.log('Step 1: Computing baselines...');
  let cached = 0;

  // Site-level baselines from gsc_site_aggregates
  const { data: siteAggs } = await supabase
    .from('gsc_site_aggregates')
    .select('*')
    .order('computed_date', { ascending: false })
    .limit(10);

  if (siteAggs && siteAggs.length > 0) {
    const latest = siteAggs[0];
    const metrics = [
      { metric: 'total_clicks', value: latest.total_clicks, window: 'daily' },
      { metric: 'total_impressions', value: latest.total_impressions, window: 'daily' },
      { metric: 'avg_ctr', value: latest.avg_ctr, window: 'daily' },
      { metric: 'avg_position', value: latest.avg_position, window: 'daily' },
      { metric: 'pct_change_clicks_wow', value: latest.pct_change_clicks_wow, window: 'wow' },
      { metric: 'pct_change_impressions_wow', value: latest.pct_change_impressions_wow, window: 'wow' },
      { metric: 'delta_position_wow', value: latest.delta_position_wow, window: 'wow' },
      { metric: 'pct_change_clicks_mom', value: latest.pct_change_clicks_mom, window: 'mom' },
      { metric: 'pct_change_impressions_mom', value: latest.pct_change_impressions_mom, window: 'mom' },
      { metric: 'delta_position_mom', value: latest.delta_position_mom, window: 'mom' },
    ];

    for (const m of metrics) {
      if (m.value !== null && m.value !== undefined) {
        await supabase.from('seo_baseline_cache').upsert({
          scope: 'site',
          scope_key: 'site',
          window: m.window,
          metric: m.metric,
          baseline_value: m.value,
          sample_count: siteAggs.length,
          computed_date: computeDate,
        }, { onConflict: 'scope,scope_key,window,metric,computed_date' });
        cached++;
      }
    }
  }

  // Page-level baselines from gsc_page_aggregates
  const { data: pageAggs } = await supabase
    .from('gsc_page_aggregates')
    .select('*')
    .eq('window_type', '7d')
    .order('computed_date', { ascending: false })
    .limit(500);

  if (pageAggs) {
    // Group by normalized_url, take latest
    const byUrl = new Map<string, typeof pageAggs[0]>();
    for (const p of pageAggs) {
      if (!byUrl.has(p.normalized_url)) byUrl.set(p.normalized_url, p);
    }

    for (const [url, data] of byUrl) {
      const path = normalizePath(url);
      const metrics = [
        { metric: 'total_clicks', value: data.total_clicks, window: 'daily' as const },
        { metric: 'total_impressions', value: data.total_impressions, window: 'daily' as const },
        { metric: 'pct_change_clicks_wow', value: data.pct_change_clicks_wow, window: 'wow' as const },
        { metric: 'pct_change_clicks_mom', value: data.pct_change_clicks_mom, window: 'mom' as const },
        { metric: 'delta_position_wow', value: data.delta_position_wow, window: 'wow' as const },
      ];

      for (const m of metrics) {
        if (m.value !== null && m.value !== undefined) {
          await supabase.from('seo_baseline_cache').upsert({
            scope: 'page',
            scope_key: path,
            window: m.window,
            metric: m.metric,
            baseline_value: m.value,
            sample_count: 1,
            computed_date: computeDate,
          }, { onConflict: 'scope,scope_key,window,metric,computed_date' });
          cached++;
        }
      }
    }
  }

  console.log(`Baselines cached: ${cached}`);
  return cached;
}

async function evaluateAlerts(
  supabase: ReturnType<typeof createClient>,
  rules: AlertRule[],
  catalog: PageCatalogEntry[],
  computeDate: string
): Promise<{ alertsCreated: number; alertIds: string[] }> {
  console.log('Step 2: Evaluating alert rules...');
  let alertsCreated = 0;
  const alertIds: string[] = [];
  const catalogMap = new Map(catalog.map(c => [c.path, c.page_type]));

  for (const rule of rules) {
    try {
      if (rule.scope === 'site') {
        await evaluateSiteRule(supabase, rule, computeDate, alertIds, () => alertsCreated++);
      } else if (rule.scope === 'page') {
        await evaluatePageRule(supabase, rule, catalogMap, computeDate, alertIds, () => alertsCreated++);
      } else if (rule.scope === 'query') {
        await evaluateQueryRule(supabase, rule, computeDate, alertIds, () => alertsCreated++);
      } else if (rule.scope === 'canonical_group') {
        await evaluateCanonicalRule(supabase, rule, computeDate, alertIds, () => alertsCreated++);
      }
    } catch (err) {
      console.error(`Error evaluating rule ${rule.slug}:`, err);
    }
  }

  // Update alertsCreated from alertIds length since callbacks may not work as expected
  console.log(`Alerts created: ${alertIds.length}`);
  return { alertsCreated: alertIds.length, alertIds };
}

async function evaluateSiteRule(
  supabase: ReturnType<typeof createClient>,
  rule: AlertRule,
  computeDate: string,
  alertIds: string[],
  onCreated: () => void
) {
  const { data: siteAggs } = await supabase
    .from('gsc_site_aggregates')
    .select('*')
    .order('computed_date', { ascending: false })
    .limit(1);

  if (!siteAggs || siteAggs.length === 0) return;
  const latest = siteAggs[0];
  const value = (latest as Record<string, unknown>)[rule.metric] as number | null;
  if (value === null || value === undefined) return;

  if (compareValue(value, rule.operator, rule.threshold)) {
    // Check cooldown
    const cooldownDate = new Date();
    cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);
    
    const { data: existing } = await supabase
      .from('seo_alert_event')
      .select('id')
      .eq('rule_id', rule.id)
      .eq('metric_name', rule.metric)
      .gte('created_at', cooldownDate.toISOString())
      .limit(1);

    if (existing && existing.length > 0) return;

    const { data: alert } = await supabase.from('seo_alert_event').insert({
      rule_id: rule.id,
      severity: rule.base_severity,
      title: rule.name,
      description: `${rule.description}. Aktueller Wert: ${typeof value === 'number' ? value.toFixed(1) : value}`,
      metric_name: rule.metric,
      metric_value: value,
      baseline_value: rule.threshold,
      pct_change: typeof value === 'number' ? value : null,
      window: rule.window,
      detected_date: computeDate,
      details: { source: 'gsc_site_aggregates', window_type: latest.window_type },
    }).select('id').single();

    if (alert) {
      alertIds.push(alert.id);
      onCreated();
    }
  }
}

async function evaluatePageRule(
  supabase: ReturnType<typeof createClient>,
  rule: AlertRule,
  catalogMap: Map<string, string>,
  computeDate: string,
  alertIds: string[],
  onCreated: () => void
) {
  // Special case for legacy CMS
  if (rule.slug === 'legacy-cms-url') {
    const { data: legacyUrls } = await supabase
      .from('gsc_url_registry')
      .select('raw_url, normalized_url, total_clicks, total_impressions')
      .eq('is_legacy_cms', true)
      .limit(50);

    if (legacyUrls && legacyUrls.length > 0) {
      for (const url of legacyUrls.slice(0, 10)) {
        const cooldownDate = new Date();
        cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);
        
        const { data: existing } = await supabase
          .from('seo_alert_event')
          .select('id')
          .eq('rule_id', rule.id)
          .eq('affected_path', url.normalized_url)
          .gte('created_at', cooldownDate.toISOString())
          .limit(1);

        if (existing && existing.length > 0) continue;

        const { data: alert } = await supabase.from('seo_alert_event').insert({
          rule_id: rule.id,
          severity: rule.base_severity,
          title: `Legacy CMS URL: ${url.normalized_url}`,
          description: `Alte /cms/ URL erscheint noch in GSC mit ${url.total_clicks || 0} Klicks.`,
          affected_path: url.normalized_url,
          metric_name: 'is_legacy_cms',
          metric_value: 1,
          window: rule.window,
          detected_date: computeDate,
          details: { raw_url: url.raw_url, clicks: url.total_clicks, impressions: url.total_impressions },
        }).select('id').single();

        if (alert) { alertIds.push(alert.id); onCreated(); }
      }
    }
    return;
  }

  // Zero clicks pages
  if (rule.slug === 'zero-clicks-page') {
    const { data: pageAggs } = await supabase
      .from('gsc_page_aggregates')
      .select('*')
      .eq('window_type', '7d')
      .eq('total_clicks', 0)
      .gt('total_impressions', 10)
      .order('total_impressions', { ascending: false })
      .limit(20);

    if (pageAggs) {
      for (const page of pageAggs.slice(0, 5)) {
        const path = normalizePath(page.normalized_url);
        const pageType = catalogMap.get(path) || 'cluster';
        const severity = rule.boost_money ? boostSeverity(rule.base_severity, pageType) : rule.base_severity;

        const cooldownDate = new Date();
        cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);
        
        const { data: existing } = await supabase
          .from('seo_alert_event')
          .select('id')
          .eq('rule_id', rule.id)
          .eq('affected_path', path)
          .gte('created_at', cooldownDate.toISOString())
          .limit(1);

        if (existing && existing.length > 0) continue;

        const { data: alert } = await supabase.from('seo_alert_event').insert({
          rule_id: rule.id,
          severity,
          title: `Null-Klick-Seite: ${path}`,
          description: `${page.total_impressions} Impressions aber 0 Klicks in 7 Tagen.`,
          affected_path: path,
          metric_name: 'total_clicks',
          metric_value: 0,
          baseline_value: page.total_impressions,
          window: rule.window,
          detected_date: computeDate,
          details: { impressions: page.total_impressions, page_type: pageType },
        }).select('id').single();

        if (alert) { alertIds.push(alert.id); onCreated(); }
      }
    }
    return;
  }

  // Generic page-level metric drops
  const { data: pageAggs } = await supabase
    .from('gsc_page_aggregates')
    .select('*')
    .eq('window_type', '7d')
    .order('computed_date', { ascending: false })
    .limit(200);

  if (!pageAggs) return;

  const byUrl = new Map<string, typeof pageAggs[0]>();
  for (const p of pageAggs) {
    if (!byUrl.has(p.normalized_url)) byUrl.set(p.normalized_url, p);
  }

  for (const [url, data] of byUrl) {
    const value = (data as Record<string, unknown>)[rule.metric] as number | null;
    if (value === null || value === undefined) continue;
    if (!compareValue(value, rule.operator, rule.threshold)) continue;

    const path = normalizePath(url);
    const pageType = catalogMap.get(path) || 'cluster';
    const severity = rule.boost_money ? boostSeverity(rule.base_severity, pageType) : rule.base_severity;

    const cooldownDate = new Date();
    cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);
    
    const { data: existing } = await supabase
      .from('seo_alert_event')
      .select('id')
      .eq('rule_id', rule.id)
      .eq('affected_path', path)
      .gte('created_at', cooldownDate.toISOString())
      .limit(1);

    if (existing && existing.length > 0) continue;

    const { data: alert } = await supabase.from('seo_alert_event').insert({
      rule_id: rule.id,
      severity,
      title: `${rule.name}: ${path}`,
      description: `${rule.description}. Wert: ${typeof value === 'number' ? value.toFixed(1) : value}`,
      affected_path: path,
      metric_name: rule.metric,
      metric_value: value,
      baseline_value: rule.threshold,
      pct_change: typeof value === 'number' ? value : null,
      window: rule.window,
      detected_date: computeDate,
      details: { page_type: pageType, url },
    }).select('id').single();

    if (alert) { alertIds.push(alert.id); onCreated(); }
  }
}

async function evaluateQueryRule(
  supabase: ReturnType<typeof createClient>,
  rule: AlertRule,
  computeDate: string,
  alertIds: string[],
  onCreated: () => void
) {
  if (rule.slug !== 'query-cannibalization') return;

  const { data: queryAggs } = await supabase
    .from('gsc_query_aggregates')
    .select('*')
    .eq('window_type', '7d')
    .eq('is_cannibalized', true)
    .order('total_clicks', { ascending: false })
    .limit(20);

  if (!queryAggs) return;

  for (const q of queryAggs.slice(0, 5)) {
    const cooldownDate = new Date();
    cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);
    
    const { data: existing } = await supabase
      .from('seo_alert_event')
      .select('id')
      .eq('rule_id', rule.id)
      .eq('affected_query', q.query)
      .gte('created_at', cooldownDate.toISOString())
      .limit(1);

    if (existing && existing.length > 0) continue;

    const { data: alert } = await supabase.from('seo_alert_event').insert({
      rule_id: rule.id,
      severity: rule.base_severity,
      title: `Kannibalisierung: "${q.query}"`,
      description: `${q.ranking_page_count} Seiten ranken für "${q.query}". Top-Seite: ${q.top_page_url || 'unbekannt'}`,
      affected_query: q.query,
      metric_name: 'ranking_page_count',
      metric_value: q.ranking_page_count,
      baseline_value: 1,
      window: rule.window,
      detected_date: computeDate,
      details: { ranking_page_count: q.ranking_page_count, top_page_url: q.top_page_url, clicks: q.total_clicks },
    }).select('id').single();

    if (alert) { alertIds.push(alert.id); onCreated(); }
  }
}

async function evaluateCanonicalRule(
  supabase: ReturnType<typeof createClient>,
  rule: AlertRule,
  computeDate: string,
  alertIds: string[],
  onCreated: () => void
) {
  const { data: groups } = await supabase
    .from('gsc_canonical_groups')
    .select('*')
    .eq('is_duplicate_issue', true)
    .order('total_clicks', { ascending: false })
    .limit(20);

  if (!groups) return;

  for (const g of groups.slice(0, 5)) {
    const cooldownDate = new Date();
    cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);
    
    const { data: existing } = await supabase
      .from('seo_alert_event')
      .select('id')
      .eq('rule_id', rule.id)
      .eq('affected_path', g.canonical_url)
      .gte('created_at', cooldownDate.toISOString())
      .limit(1);

    if (existing && existing.length > 0) continue;

    const { data: alert } = await supabase.from('seo_alert_event').insert({
      rule_id: rule.id,
      severity: rule.base_severity,
      title: `Duplicate URL: ${g.canonical_url}`,
      description: `${g.variant_count} URL-Varianten erkannt für ${g.canonical_url}`,
      affected_path: g.canonical_url,
      metric_name: 'variant_count',
      metric_value: g.variant_count,
      baseline_value: 1,
      window: rule.window,
      detected_date: computeDate,
      details: { variant_count: g.variant_count, primary_variant: g.primary_variant, clicks: g.total_clicks },
    }).select('id').single();

    if (alert) { alertIds.push(alert.id); onCreated(); }
  }
}

async function createTasks(
  supabase: ReturnType<typeof createClient>,
  alertIds: string[]
): Promise<number> {
  console.log('Step 3: Creating tasks for critical alerts...');
  let tasksCreated = 0;

  const { data: critAlerts } = await supabase
    .from('seo_alert_event')
    .select('*')
    .in('id', alertIds)
    .in('severity', ['high', 'critical']);

  if (!critAlerts) return 0;

  for (const alert of critAlerts) {
    // Check if task already exists for this alert
    const { data: existingTask } = await supabase
      .from('seo_task')
      .select('id')
      .eq('alert_event_id', alert.id)
      .limit(1);

    if (existingTask && existingTask.length > 0) continue;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (alert.severity === 'critical' ? 1 : 3));

    const { error } = await supabase.from('seo_task').insert({
      alert_event_id: alert.id,
      priority: alert.severity,
      title: alert.title,
      description: alert.description,
      affected_path: alert.affected_path,
      due_date: dueDate.toISOString().split('T')[0],
    });

    if (!error) tasksCreated++;
  }

  console.log(`Tasks created: ${tasksCreated}`);
  return tasksCreated;
}

async function generatePromptPacks(
  supabase: ReturnType<typeof createClient>,
  alertIds: string[]
): Promise<number> {
  console.log('Step 4: Generating prompt packs...');
  let promptsGenerated = 0;

  const { data: alerts } = await supabase
    .from('seo_alert_event')
    .select('*, seo_alert_rule!inner(slug)')
    .in('id', alertIds);

  if (!alerts) return 0;

  for (const alert of alerts) {
    const ruleSlug = (alert as any).seo_alert_rule?.slug || '';
    let area: string;
    let promptText: string;

    if (ruleSlug === 'legacy-cms-url') {
      area = 'redirects';
      promptText = `Erstelle eine 301-Redirect-Regel für die Legacy-URL "${alert.affected_path}". 
Prüfe ob es eine passende neue URL gibt und erstelle den Redirect in der .htaccess Datei.
URL: ${alert.affected_path}
Klicks: ${(alert.details as any)?.clicks || 0}`;
    } else if (ruleSlug === 'duplicate-url') {
      area = 'canonicalization';
      promptText = `Behebe das Duplicate-URL-Problem für "${alert.affected_path}".
${(alert.details as any)?.variant_count || 0} Varianten erkannt.
Stelle sicher dass canonical Tags korrekt gesetzt sind und erstelle ggf. Redirects.`;
    } else if (ruleSlug === 'query-cannibalization') {
      area = 'content';
      promptText = `Behebe die Keyword-Kannibalisierung für "${alert.affected_query}".
${(alert.details as any)?.ranking_page_count || 0} Seiten ranken für dieses Keyword.
Top-Seite: ${(alert.details as any)?.top_page_url || 'unbekannt'}
Konsolidiere die Inhalte oder differenziere die Seiten thematisch.`;
    } else if (ruleSlug.includes('position-drop') || ruleSlug.includes('ranking')) {
      area = 'content';
      promptText = `Die Seite "${alert.affected_path}" hat einen Ranking-Verlust erlitten.
Metrik: ${alert.metric_name}, Wert: ${alert.metric_value}
Analysiere den Content und optimiere Title, Meta-Description und H1.
Prüfe ob interne Verlinkung verbessert werden kann.`;
    } else if (ruleSlug === 'zero-clicks-page') {
      area = 'titles';
      promptText = `Die Seite "${alert.affected_path}" hat ${(alert.details as any)?.impressions || 0} Impressions aber 0 Klicks.
Optimiere Title-Tag und Meta-Description für bessere CTR.
Prüfe ob Structured Data (FAQ, HowTo) hinzugefügt werden kann.`;
    } else {
      area = 'technical';
      promptText = `SEO-Alert: ${alert.title}
${alert.description}
Betroffene Seite: ${alert.affected_path || 'Site-weit'}
Metrik: ${alert.metric_name} = ${alert.metric_value}`;
    }

    const { error } = await supabase.from('seo_prompt_pack').insert({
      alert_event_id: alert.id,
      area,
      title: `Prompt: ${alert.title}`,
      prompt_text: promptText,
      context_data: {
        alert_id: alert.id,
        rule_slug: ruleSlug,
        severity: alert.severity,
        affected_path: alert.affected_path,
        metric_value: alert.metric_value,
      },
    });

    if (!error) promptsGenerated++;
  }

  console.log(`Prompts generated: ${promptsGenerated}`);
  return promptsGenerated;
}

async function createBriefing(
  supabase: ReturnType<typeof createClient>,
  computeDate: string,
  pipelineRunId: string,
  alertsCount: number,
  tasksCreated: number,
  promptsGenerated: number
): Promise<void> {
  console.log('Step 5: Creating daily briefing...');

  // Get latest site metrics
  const { data: siteAggs } = await supabase
    .from('gsc_site_aggregates')
    .select('*')
    .order('computed_date', { ascending: false })
    .limit(1);

  const metrics = siteAggs?.[0] || {};

  // Get open alerts summary
  const { data: openAlerts } = await supabase
    .from('seo_alert_event')
    .select('severity')
    .eq('status', 'open');

  const severityCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  openAlerts?.forEach(a => { severityCounts[a.severity] = (severityCounts[a.severity] || 0) + 1; });

  const summaryDe = [
    `SEO Briefing ${computeDate}:`,
    `${alertsCount} neue Alerts erkannt (${severityCounts.critical} kritisch, ${severityCounts.high} hoch).`,
    `${tasksCreated} Tasks erstellt, ${promptsGenerated} Prompts generiert.`,
    siteAggs?.[0] ? `Site-Metriken: ${(metrics as any).total_clicks || 0} Klicks, ${(metrics as any).total_impressions || 0} Impressions.` : '',
  ].filter(Boolean).join(' ');

  await supabase.from('seo_daily_briefing').upsert({
    briefing_date: computeDate,
    summary_de: summaryDe,
    metrics_snapshot: metrics,
    alerts_count: alertsCount,
    tasks_created: tasksCreated,
    prompts_generated: promptsGenerated,
    pipeline_run_id: pipelineRunId,
  }, { onConflict: 'briefing_date' });
}

// ============================================================================
// HTTP Handler
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth: cron secret or JWT
    const cronSecret = req.headers.get('x-cron-secret');
    const expectedCronSecret = Deno.env.get('CRON_SECRET');

    if (cronSecret) {
      if (cronSecret !== expectedCronSecret) {
        return new Response(JSON.stringify({ error: 'Invalid cron secret' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log('Authenticated via cron secret');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured.');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const startTime = Date.now();
    const computeDate = yesterday();

    // Create pipeline run
    const { data: run } = await supabase.from('seo_pipeline_run').insert({
      status: 'running',
    }).select('id').single();

    const runId = run?.id || '';
    console.log(`Pipeline started: ${runId}, computeDate=${computeDate}`);

    const stepsCompleted: string[] = [];

    try {
      // Step 1: Baselines
      await computeBaselines(supabase, computeDate);
      stepsCompleted.push('baselines');

      // Step 2: Alert rules
      const { data: rules } = await supabase
        .from('seo_alert_rule')
        .select('*')
        .eq('is_enabled', true);

      const { data: catalog } = await supabase
        .from('seo_page_catalog')
        .select('path, page_type')
        .eq('is_active', true);

      const { alertsCreated, alertIds } = await evaluateAlerts(
        supabase,
        (rules || []) as unknown as AlertRule[],
        (catalog || []) as unknown as PageCatalogEntry[],
        computeDate
      );
      stepsCompleted.push('alerts');

      // Step 3: Tasks
      const tasksCreated = await createTasks(supabase, alertIds);
      stepsCompleted.push('tasks');

      // Step 4: Prompts
      const promptsGenerated = await generatePromptPacks(supabase, alertIds);
      stepsCompleted.push('prompts');

      // Step 5: Briefing
      await createBriefing(supabase, computeDate, runId, alertsCreated, tasksCreated, promptsGenerated);
      stepsCompleted.push('briefing');

      const durationMs = Date.now() - startTime;

      // Update pipeline run
      await supabase.from('seo_pipeline_run').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        steps_completed: stepsCompleted,
        alerts_detected: alertsCreated,
        tasks_created: tasksCreated,
        prompts_generated: promptsGenerated,
        duration_ms: durationMs,
      }).eq('id', runId);

      console.log(`Pipeline completed in ${durationMs}ms: ${alertsCreated} alerts, ${tasksCreated} tasks, ${promptsGenerated} prompts`);

      return new Response(JSON.stringify({
        success: true,
        run_id: runId,
        compute_date: computeDate,
        duration_ms: durationMs,
        alerts_detected: alertsCreated,
        tasks_created: tasksCreated,
        prompts_generated: promptsGenerated,
        steps_completed: stepsCompleted,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (pipelineError) {
      const errMsg = pipelineError instanceof Error ? pipelineError.message : String(pipelineError);
      console.error('Pipeline error:', errMsg);

      await supabase.from('seo_pipeline_run').update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        steps_completed: stepsCompleted,
        error_message: errMsg,
        duration_ms: Date.now() - startTime,
      }).eq('id', runId);

      throw pipelineError;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('SEO Pipeline error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
