/**
 * React Query hooks for SEO Crawler
 * Connects to seo-api (crawl-runs, crawl-results) and seo-crawler Edge Functions
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// Types
// ============================================================================

export interface CrawlRun {
  id: string;
  action: string;
  status: string;
  urls_crawled: number;
  issues_found: number;
  alerts_created: number;
  duration_ms: number | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface CrawlResult {
  id: string;
  crawl_run_id: string;
  url: string;
  normalized_path: string;
  status_code: number | null;
  redirect_count: number;
  redirect_target: string | null;
  response_time_ms: number | null;
  canonical_url: string | null;
  canonical_match: boolean | null;
  has_title: boolean | null;
  title_text: string | null;
  title_length: number | null;
  has_meta_description: boolean | null;
  has_h1: boolean | null;
  h1_count: number | null;
  has_hreflang: boolean | null;
  hreflang_count: number | null;
  has_robots_noindex: boolean | null;
  has_mixed_content: boolean | null;
  issues: CrawlIssue[];
  crawled_at: string;
}

export interface CrawlIssue {
  check: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  value?: string | number | boolean;
}

// ============================================================================
// API Helper (same pattern as useSEOOps.ts)
// ============================================================================

async function fetchSeoApi<T>(
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const url = `${supabaseUrl}/functions/v1/seo-api${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// Crawl Runs
// ============================================================================

export function useCrawlRuns(limit = 10) {
  return useQuery({
    queryKey: ['seo-crawl-runs', limit],
    queryFn: async (): Promise<CrawlRun[]> => {
      try {
        return await fetchSeoApi<CrawlRun[]>(`/crawl-runs?limit=${limit}`);
      } catch {
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ============================================================================
// Crawl Results
// ============================================================================

export function useCrawlResults(options?: {
  runId?: string;
  hasIssues?: boolean;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (options?.runId) params.set('run_id', options.runId);
  if (options?.hasIssues) params.set('has_issues', 'true');
  if (options?.limit) params.set('limit', options.limit.toString());

  const queryString = params.toString();

  return useQuery({
    queryKey: ['seo-crawl-results', queryString],
    queryFn: async (): Promise<CrawlResult[]> => {
      try {
        return await fetchSeoApi<CrawlResult[]>(`/crawl-results${queryString ? `?${queryString}` : ''}`);
      } catch {
        return [];
      }
    },
    enabled: !!options?.runId,
    staleTime: 2 * 60 * 1000,
  });
}

// ============================================================================
// Crawler Stats (from extended /stats endpoint)
// ============================================================================

export function useCrawlerStats() {
  return useQuery({
    queryKey: ['seo-crawler-stats'],
    queryFn: async (): Promise<{
      last_crawl_run: CrawlRun | null;
      crawl_issues_count: number;
    }> => {
      try {
        const stats = await fetchSeoApi<Record<string, unknown>>('/stats');
        return {
          last_crawl_run: (stats.last_crawl_run as CrawlRun) || null,
          crawl_issues_count: (stats.crawl_issues_count as number) || 0,
        };
      } catch {
        return { last_crawl_run: null, crawl_issues_count: 0 };
      }
    },
    staleTime: 60 * 1000,
  });
}

// ============================================================================
// Trigger Crawl (mutation)
// ============================================================================

export function useTriggerCrawl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      action: 'full_crawl' | 'quick_check' | 'single_url';
      url?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('seo-crawler', {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-crawl-runs'] });
      queryClient.invalidateQueries({ queryKey: ['seo-crawl-results'] });
      queryClient.invalidateQueries({ queryKey: ['seo-crawler-stats'] });
      queryClient.invalidateQueries({ queryKey: ['seo-stats'] });
    },
  });
}
