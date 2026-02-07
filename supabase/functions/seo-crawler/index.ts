/**
 * SEO Crawler Edge Function
 *
 * Crawls all sitemap URLs and checks technical SEO health.
 * Actions: full_crawl | quick_check | single_url
 *
 * Checks per URL:
 *   status_code, redirect_chain, response_time, canonical_match,
 *   hreflang, title, meta_description, h1, robots_noindex, mixed_content
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITEMAP_URL = "https://www.ristorantestoria.de/sitemap.xml";
const MAX_CONCURRENCY = 3;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 16_384;
const USER_AGENT = "STORIA-SEO-Crawler/1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

// Legal pages only exist in DE — no hreflang expected
const LEGAL_PATHS = new Set([
  "/impressum", "/datenschutz", "/cookie-richtlinie",
  "/agb-restaurant", "/agb-gutscheine", "/widerrufsbelehrung",
  "/zahlungsinformationen", "/lebensmittelhinweise", "/haftungsausschluss",
]);

// ============================================================================
// Types
// ============================================================================

interface CrawlIssue {
  check: string;
  severity: string;
  message: string;
  expected?: string | number;
  actual?: string | number;
}

interface CrawlResult {
  url: string;
  normalized_path: string;
  status_code: number;
  redirect_count: number;
  redirect_target: string | null;
  response_time_ms: number;
  canonical_url: string | null;
  canonical_match: boolean;
  has_title: boolean;
  title_text: string | null;
  title_length: number;
  has_meta_description: boolean;
  has_h1: boolean;
  h1_count: number;
  has_hreflang: boolean;
  hreflang_count: number;
  has_robots_noindex: boolean;
  has_mixed_content: boolean;
  issues: CrawlIssue[];
}

interface AlertRuleRow {
  id: string;
  slug: string;
  base_severity: string;
  boost_money: boolean;
  cooldown_hours: number;
}

// ============================================================================
// Helpers
// ============================================================================

function normalizePath(url: string): string {
  let path = url.replace(/^https?:\/\/[^/]+/, "");
  if (path.length > 1) path = path.replace(/\/$/, "");
  path = path.replace(/[?#].*$/, "").toLowerCase();
  return path || "/";
}

function boostSeverity(base: string, pageType: string): string {
  if (pageType === "money" || pageType === "pillar") {
    const map: Record<string, string> = {
      low: "medium", medium: "high", high: "critical", critical: "critical",
    };
    return map[base] || "critical";
  }
  return base;
}

/** Parse all <loc> URLs from sitemap XML */
function parseSitemapUrls(xml: string): string[] {
  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

/** Extract <head> content from HTML (first 16 KB) */
function extractHead(html: string): string {
  const headMatch = html.match(/<head[\s>]([\s\S]*?)<\/head>/i);
  return headMatch ? headMatch[1] : html;
}

/** Follow redirects manually to count hops */
async function fetchWithRedirectCount(
  url: string
): Promise<{ finalUrl: string; statusCode: number; redirectCount: number; body: string; responseTimeMs: number }> {
  const start = Date.now();
  let currentUrl = url;
  let redirectCount = 0;
  const maxRedirects = 10;

  while (redirectCount < maxRedirects) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const resp = await fetch(currentUrl, {
        method: "GET",
        headers: { "User-Agent": USER_AGENT },
        redirect: "manual",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (resp.status >= 300 && resp.status < 400) {
        const location = resp.headers.get("location");
        if (!location) break;
        currentUrl = location.startsWith("http")
          ? location
          : new URL(location, currentUrl).toString();
        redirectCount++;
        // Consume body to free resources
        await resp.text().catch(() => {});
        continue;
      }

      // Final response — read limited body
      const reader = resp.body?.getReader();
      let body = "";
      if (reader) {
        let totalBytes = 0;
        const decoder = new TextDecoder();
        while (totalBytes < MAX_BODY_BYTES) {
          const { done, value } = await reader.read();
          if (done) break;
          totalBytes += value.length;
          body += decoder.decode(value, { stream: true });
        }
        reader.cancel().catch(() => {});
      }

      return {
        finalUrl: currentUrl,
        statusCode: resp.status,
        redirectCount,
        body,
        responseTimeMs: Date.now() - start,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      const isTimeout = err instanceof DOMException && err.name === "AbortError";
      return {
        finalUrl: currentUrl,
        statusCode: isTimeout ? 408 : 0,
        redirectCount,
        body: "",
        responseTimeMs: Date.now() - start,
      };
    }
  }

  // Max redirects exceeded
  return {
    finalUrl: currentUrl,
    statusCode: 310,
    redirectCount,
    body: "",
    responseTimeMs: Date.now() - start,
  };
}

/** Run all SEO checks on a single URL */
async function crawlUrl(url: string): Promise<CrawlResult> {
  const normalizedPath = normalizePath(url);
  const isLegal = LEGAL_PATHS.has(normalizedPath);
  const issues: CrawlIssue[] = [];

  const { finalUrl, statusCode, redirectCount, body, responseTimeMs } =
    await fetchWithRedirectCount(url);

  const head = extractHead(body);

  // --- Status Code ---
  if (statusCode >= 400) {
    issues.push({
      check: "status_code", severity: "critical",
      message: `HTTP ${statusCode}`, expected: 200, actual: statusCode,
    });
  }

  // --- Redirect Chain ---
  const redirectTarget = redirectCount > 0 ? finalUrl : null;
  if (redirectCount >= 2) {
    issues.push({
      check: "redirect_chain", severity: "high",
      message: `${redirectCount} Redirects`, expected: "0-1", actual: redirectCount,
    });
  }

  // --- Response Time ---
  if (responseTimeMs > 5000) {
    issues.push({
      check: "response_time", severity: "high",
      message: `${responseTimeMs}ms Antwortzeit`, expected: "<2000ms", actual: responseTimeMs,
    });
  } else if (responseTimeMs > 2000) {
    issues.push({
      check: "response_time", severity: "medium",
      message: `${responseTimeMs}ms Antwortzeit`, expected: "<2000ms", actual: responseTimeMs,
    });
  }

  // --- Canonical ---
  const canonicalMatch = head.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;
  const canonicalIsCorrect = canonicalUrl
    ? normalizePath(canonicalUrl) === normalizePath(url)
    : false;

  if (canonicalUrl && !canonicalIsCorrect) {
    issues.push({
      check: "canonical_mismatch", severity: "high",
      message: "Canonical stimmt nicht mit Sitemap-URL überein",
      expected: url, actual: canonicalUrl,
    });
  }

  // --- Title ---
  const titleMatch = head.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : null;
  const hasTitle = !!titleText && titleText.length > 0;
  const titleLength = titleText?.length || 0;

  if (!hasTitle) {
    issues.push({
      check: "missing_title", severity: "high",
      message: "Kein Title-Tag gefunden",
    });
  } else if (titleLength < 30) {
    issues.push({
      check: "title_length", severity: "low",
      message: `Title zu kurz (${titleLength} Zeichen)`, expected: "30-60", actual: titleLength,
    });
  } else if (titleLength > 60) {
    issues.push({
      check: "title_length", severity: "low",
      message: `Title zu lang (${titleLength} Zeichen)`, expected: "30-60", actual: titleLength,
    });
  }

  // --- Meta Description ---
  const metaDescMatch = head.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*?)["']/i
  ) || head.match(
    /<meta[^>]+content=["']([^"']*?)["'][^>]+name=["']description["']/i
  );
  const hasMetaDesc = !!metaDescMatch && metaDescMatch[1].trim().length > 0;

  if (!hasMetaDesc) {
    issues.push({
      check: "missing_meta_description", severity: "medium",
      message: "Keine Meta Description gefunden",
    });
  }

  // --- H1 ---
  const h1Matches = body.match(/<h1[\s>]/gi);
  const h1Count = h1Matches ? h1Matches.length : 0;
  const hasH1 = h1Count > 0;

  if (!hasH1) {
    issues.push({
      check: "missing_h1", severity: "medium",
      message: "Kein H1-Tag gefunden",
    });
  } else if (h1Count > 1) {
    issues.push({
      check: "multiple_h1", severity: "low",
      message: `${h1Count} H1-Tags gefunden (erwartet: 1)`,
    });
  }

  // --- Hreflang ---
  const hreflangMatches = head.match(/hreflang=["'][^"']+["']/gi);
  const hreflangCount = hreflangMatches ? hreflangMatches.length : 0;
  const hasHreflang = hreflangCount > 0;

  if (!hasHreflang && !isLegal) {
    issues.push({
      check: "missing_hreflang", severity: "medium",
      message: "Keine hreflang-Tags gefunden",
    });
  }

  // --- Robots Noindex ---
  const robotsMeta = head.match(
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i
  );
  const hasNoindex = robotsMeta
    ? robotsMeta[1].toLowerCase().includes("noindex")
    : false;

  if (hasNoindex) {
    issues.push({
      check: "noindex", severity: "critical",
      message: "noindex Meta-Tag auf indexierbarer Seite",
    });
  }

  // --- Mixed Content ---
  const mixedContentRe = /(?:src|href)=["']http:\/\//gi;
  const hasMixedContent = mixedContentRe.test(body);

  if (hasMixedContent) {
    issues.push({
      check: "mixed_content", severity: "medium",
      message: "HTTP-Links auf HTTPS-Seite gefunden",
    });
  }

  return {
    url,
    normalized_path: normalizedPath,
    status_code: statusCode,
    redirect_count: redirectCount,
    redirect_target: redirectTarget,
    response_time_ms: responseTimeMs,
    canonical_url: canonicalUrl,
    canonical_match: canonicalIsCorrect,
    has_title: hasTitle,
    title_text: titleText,
    title_length: titleLength,
    has_meta_description: hasMetaDesc,
    has_h1: hasH1,
    h1_count: h1Count,
    has_hreflang: hasHreflang,
    hreflang_count: hreflangCount,
    has_robots_noindex: hasNoindex,
    has_mixed_content: hasMixedContent,
    issues,
  };
}

/** Run crawl on a batch of URLs with concurrency limit */
async function crawlBatch(urls: string[]): Promise<CrawlResult[]> {
  const results: CrawlResult[] = [];
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift()!;
      try {
        const result = await crawlUrl(url);
        results.push(result);
      } catch (err) {
        console.error(`Error crawling ${url}:`, err);
        results.push({
          url,
          normalized_path: normalizePath(url),
          status_code: 0,
          redirect_count: 0,
          redirect_target: null,
          response_time_ms: 0,
          canonical_url: null,
          canonical_match: false,
          has_title: false,
          title_text: null,
          title_length: 0,
          has_meta_description: false,
          has_h1: false,
          h1_count: 0,
          has_hreflang: false,
          hreflang_count: 0,
          has_robots_noindex: false,
          has_mixed_content: false,
          issues: [{ check: "fetch_error", severity: "critical", message: String(err) }],
        });
      }
    }
  }

  const workers = Array.from({ length: MAX_CONCURRENCY }, () => worker());
  await Promise.all(workers);
  return results;
}

/** Create alerts for issues, respecting cooldown */
async function createAlerts(
  supabase: ReturnType<typeof createClient>,
  results: CrawlResult[],
  crawlerRules: AlertRuleRow[],
  catalogMap: Map<string, string>
): Promise<number> {
  let alertsCreated = 0;
  const ruleBySlug = new Map(crawlerRules.map((r) => [r.slug, r]));
  const today = new Date().toISOString().split("T")[0];

  for (const result of results) {
    for (const issue of result.issues) {
      const ruleSlug = mapIssueToRuleSlug(issue.check);
      if (!ruleSlug) continue;

      const rule = ruleBySlug.get(ruleSlug);
      if (!rule) continue;

      // Cooldown check
      const cooldownDate = new Date();
      cooldownDate.setHours(cooldownDate.getHours() - rule.cooldown_hours);

      const { data: existing } = await supabase
        .from("seo_alert_event")
        .select("id")
        .eq("rule_id", rule.id)
        .eq("affected_path", result.normalized_path)
        .gte("created_at", cooldownDate.toISOString())
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Severity boost for money/pillar pages
      const pageType = catalogMap.get(result.normalized_path) || "cluster";
      const severity = rule.boost_money
        ? boostSeverity(rule.base_severity, pageType)
        : rule.base_severity;

      const { error } = await supabase.from("seo_alert_event").insert({
        rule_id: rule.id,
        severity,
        title: `${issue.check}: ${result.normalized_path}`,
        description: issue.message,
        affected_path: result.normalized_path,
        metric_name: issue.check,
        metric_value: issue.actual ?? null,
        baseline_value: issue.expected ?? null,
        window: "daily",
        detected_date: today,
        details: {
          source: "seo-crawler",
          url: result.url,
          status_code: result.status_code,
          response_time_ms: result.response_time_ms,
        },
      });

      if (!error) alertsCreated++;
    }
  }

  return alertsCreated;
}

function mapIssueToRuleSlug(check: string): string | null {
  const map: Record<string, string> = {
    status_code: "crawler_status_error",
    redirect_chain: "crawler_redirect_chain",
    response_time: "crawler_slow_response",
    canonical_mismatch: "crawler_canonical_mismatch",
    missing_title: "crawler_missing_title",
    noindex: "crawler_noindex",
    missing_h1: "crawler_missing_h1",
    missing_hreflang: "crawler_missing_hreflang",
  };
  return map[check] || null;
}

// ============================================================================
// HTTP Handler
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth: cron secret or JWT
    const cronSecret = req.headers.get("x-cron-secret");
    const expectedCronSecret = Deno.env.get("CRON_SECRET");

    if (cronSecret) {
      if (cronSecret !== expectedCronSecret) {
        return new Response(
          JSON.stringify({ error: "Invalid cron secret" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log("Authenticated via cron secret");
    } else {
      // JWT auth fallback
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Missing authorization" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const { data: roleData } = await supabaseAuth
        .from("user_roles").select("role")
        .eq("user_id", user.id).eq("role", "admin").single();
      if (!roleData) {
        return new Response(
          JSON.stringify({ error: "Forbidden: admin role required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`Authenticated via JWT: ${user.email}`);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const startTime = Date.now();

    // Parse action from body
    let action = "full_crawl";
    let singleUrl: string | null = null;
    try {
      const body = await req.json();
      action = body.action || "full_crawl";
      singleUrl = body.url || null;
    } catch {
      // No body or invalid JSON — use defaults
    }

    console.log(`SEO Crawler started: action=${action}`);

    // Create crawl run
    const { data: run } = await supabase
      .from("seo_crawl_run")
      .insert({ action, status: "running" })
      .select("id")
      .single();

    const runId = run?.id || "";

    try {
      // Determine URLs to crawl
      let urlsToCrawl: string[] = [];

      if (action === "single_url" && singleUrl) {
        urlsToCrawl = [singleUrl];
      } else if (action === "quick_check") {
        // Only money/pillar pages from catalog
        const { data: catalog } = await supabase
          .from("seo_page_catalog")
          .select("path, page_type")
          .eq("is_active", true)
          .in("page_type", ["money", "pillar"]);

        if (catalog) {
          urlsToCrawl = catalog.map(
            (c) => `https://www.ristorantestoria.de${c.path}/`
          );
        }
      } else {
        // full_crawl — fetch sitemap
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15_000);
        const sitemapResp = await fetch(SITEMAP_URL, {
          headers: { "User-Agent": USER_AGENT },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!sitemapResp.ok) {
          throw new Error(`Sitemap fetch failed: ${sitemapResp.status}`);
        }
        const sitemapXml = await sitemapResp.text();
        urlsToCrawl = parseSitemapUrls(sitemapXml);
      }

      console.log(`URLs to crawl: ${urlsToCrawl.length}`);

      // Crawl all URLs
      const results = await crawlBatch(urlsToCrawl);

      // Save results to DB
      const resultRows = results.map((r) => ({
        crawl_run_id: runId,
        url: r.url,
        normalized_path: r.normalized_path,
        status_code: r.status_code,
        redirect_count: r.redirect_count,
        redirect_target: r.redirect_target,
        response_time_ms: r.response_time_ms,
        canonical_url: r.canonical_url,
        canonical_match: r.canonical_match,
        has_title: r.has_title,
        title_text: r.title_text,
        title_length: r.title_length,
        has_meta_description: r.has_meta_description,
        has_h1: r.has_h1,
        h1_count: r.h1_count,
        has_hreflang: r.has_hreflang,
        hreflang_count: r.hreflang_count,
        has_robots_noindex: r.has_robots_noindex,
        has_mixed_content: r.has_mixed_content,
        issues: r.issues,
      }));

      // Insert in batches of 25
      for (let i = 0; i < resultRows.length; i += 25) {
        const batch = resultRows.slice(i, i + 25);
        const { error: insertErr } = await supabase.from("seo_crawl_result").insert(batch);
        if (insertErr) console.error("Insert batch error:", insertErr.message);
      }

      // Load crawler alert rules
      const { data: crawlerRules } = await supabase
        .from("seo_alert_rule")
        .select("id, slug, base_severity, boost_money, cooldown_hours")
        .like("slug", "crawler_%")
        .eq("is_enabled", true);

      // Load page catalog for severity boosting
      const { data: catalog } = await supabase
        .from("seo_page_catalog")
        .select("path, page_type")
        .eq("is_active", true);

      const catalogMap = new Map(
        (catalog || []).map((c) => [c.path, c.page_type])
      );

      // Create alerts
      const alertsCreated = await createAlerts(
        supabase,
        results,
        (crawlerRules || []) as AlertRuleRow[],
        catalogMap as Map<string, string>
      );

      // Compute summary
      const issuesFound = results.reduce((sum, r) => sum + r.issues.length, 0);
      const durationMs = Date.now() - startTime;

      const statusCounts: Record<string, number> = {};
      let totalResponseTime = 0;
      for (const r of results) {
        const bucket =
          r.status_code >= 500 ? "status_5xx"
          : r.status_code >= 400 ? "status_4xx"
          : r.status_code >= 300 ? "status_301"
          : `status_${r.status_code}`;
        statusCounts[bucket] = (statusCounts[bucket] || 0) + 1;
        totalResponseTime += r.response_time_ms;
      }

      // Update crawl run
      await supabase
        .from("seo_crawl_run")
        .update({
          status: "completed",
          urls_crawled: results.length,
          issues_found: issuesFound,
          alerts_created: alertsCreated,
          duration_ms: durationMs,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);

      console.log(
        `Crawl completed: ${results.length} URLs, ${issuesFound} issues, ${alertsCreated} alerts in ${durationMs}ms`
      );

      return new Response(
        JSON.stringify({
          success: true,
          run_id: runId,
          urls_crawled: results.length,
          issues_found: issuesFound,
          alerts_created: alertsCreated,
          duration_ms: durationMs,
          summary: {
            ...statusCounts,
            avg_response_ms: results.length
              ? Math.round(totalResponseTime / results.length)
              : 0,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (crawlError) {
      const errMsg = crawlError instanceof Error ? crawlError.message : String(crawlError);
      console.error("Crawl error:", errMsg);

      await supabase
        .from("seo_crawl_run")
        .update({
          status: "failed",
          error_message: errMsg,
          duration_ms: Date.now() - startTime,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);

      throw crawlError;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("SEO Crawler error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
