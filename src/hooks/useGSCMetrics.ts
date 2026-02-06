/**
 * React Query hooks for Google Search Console metrics
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ============================================
// Types
// ============================================

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface GSCSiteMetrics {
  id: string;
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageMetrics {
  id: string;
  date: string;
  page_url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCQueryMetrics {
  id: string;
  date: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageQueryMetrics {
  id: string;
  date: string;
  page_url: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCSiteAggregate {
  id: string;
  window_type: '7d' | '28d' | '90d';
  period_end: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  clicks_prev: number;
  impressions_prev: number;
  ctr_prev: number;
  position_prev: number;
  clicks_pct_change: number | null;
  impressions_pct_change: number | null;
  ctr_pct_change: number | null;
  position_pct_change: number | null;
}

export interface GSCPageAggregate {
  id: string;
  page_url: string;
  window_type: '7d' | '28d' | '90d';
  period_end: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  clicks_prev: number;
  impressions_prev: number;
  clicks_pct_change: number | null;
  impressions_pct_change: number | null;
}

export interface GSCQueryAggregate {
  id: string;
  query: string;
  window_type: '7d' | '28d' | '90d';
  period_end: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  clicks_prev: number;
  impressions_prev: number;
  clicks_pct_change: number | null;
  impressions_pct_change: number | null;
}

export interface GSCAlert {
  id: string;
  rule_id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affected_url: string | null;
  affected_query: string | null;
  metric_value: number | null;
  threshold_value: number | null;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
  rule_name?: string;
}

export interface GSCSyncJob {
  id: string;
  job_type: 'backfill' | 'daily_sync' | 'manual_sync';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  date_from: string | null;
  date_to: string | null;
  rows_processed: number;
  error_message: string | null;
  created_at: string;
}

export interface GSCUrlVariant {
  id: string;
  normalized_url: string;
  variant_url: string;
  variant_type: string;
  first_seen: string;
  last_seen: string;
  total_clicks: number;
  total_impressions: number;
}

// ============================================
// Site-Level Metrics Hooks
// ============================================

/**
 * Fetch site-level daily metrics for a date range
 */
export const useGSCSiteMetrics = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ['gsc-site-metrics', dateRange],
    queryFn: async (): Promise<GSCSiteMetrics[]> => {
      const { data, error } = await supabase
        .from('gsc_site_metrics')
        .select('*')
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch site-level aggregates (7d, 28d, 90d windows)
 */
export const useGSCSiteAggregates = () => {
  return useQuery({
    queryKey: ['gsc-site-aggregates'],
    queryFn: async (): Promise<GSCSiteAggregate[]> => {
      const { data, error } = await supabase
        .from('gsc_site_aggregates')
        .select('*')
        .order('period_end', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get latest site aggregate for a specific window
 */
export const useLatestSiteAggregate = (windowType: '7d' | '28d' | '90d') => {
  return useQuery({
    queryKey: ['gsc-site-aggregate-latest', windowType],
    queryFn: async (): Promise<GSCSiteAggregate | null> => {
      const { data, error } = await supabase
        .from('gsc_site_aggregates')
        .select('*')
        .eq('window_type', windowType)
        .order('period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Page-Level Metrics Hooks
// ============================================

/**
 * Fetch page-level daily metrics for a date range
 */
export const useGSCPageMetrics = (dateRange: DateRange, pageUrl?: string) => {
  return useQuery({
    queryKey: ['gsc-page-metrics', dateRange, pageUrl],
    queryFn: async (): Promise<GSCPageMetrics[]> => {
      let query = supabase
        .from('gsc_page_metrics')
        .select('*')
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate);

      if (pageUrl) {
        query = query.eq('page_url', pageUrl);
      }

      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch top pages by clicks or impressions
 */
export const useGSCTopPages = (
  windowType: '7d' | '28d' | '90d' = '28d',
  sortBy: 'clicks' | 'impressions' = 'clicks',
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['gsc-top-pages', windowType, sortBy, limit],
    queryFn: async (): Promise<GSCPageAggregate[]> => {
      const { data, error } = await supabase
        .from('gsc_page_aggregates')
        .select('*')
        .eq('window_type', windowType)
        .order(sortBy, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch pages with biggest drops (performance decline)
 */
export const useGSCDecliningPages = (windowType: '7d' | '28d' = '7d', limit: number = 10) => {
  return useQuery({
    queryKey: ['gsc-declining-pages', windowType, limit],
    queryFn: async (): Promise<GSCPageAggregate[]> => {
      const { data, error } = await supabase
        .from('gsc_page_aggregates')
        .select('*')
        .eq('window_type', windowType)
        .not('clicks_pct_change', 'is', null)
        .lt('clicks_pct_change', -10)
        .gt('clicks_prev', 5) // Only pages that had significant traffic
        .order('clicks_pct_change', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Query-Level Metrics Hooks
// ============================================

/**
 * Fetch query-level daily metrics for a date range
 */
export const useGSCQueryMetrics = (dateRange: DateRange, queryFilter?: string) => {
  return useQuery({
    queryKey: ['gsc-query-metrics', dateRange, queryFilter],
    queryFn: async (): Promise<GSCQueryMetrics[]> => {
      let query = supabase
        .from('gsc_query_metrics')
        .select('*')
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate);

      if (queryFilter) {
        query = query.ilike('query', `%${queryFilter}%`);
      }

      const { data, error } = await query.order('clicks', { ascending: false }).limit(1000);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch top queries by clicks or impressions
 */
export const useGSCTopQueries = (
  windowType: '7d' | '28d' | '90d' = '28d',
  sortBy: 'clicks' | 'impressions' = 'clicks',
  limit: number = 50
) => {
  return useQuery({
    queryKey: ['gsc-top-queries', windowType, sortBy, limit],
    queryFn: async (): Promise<GSCQueryAggregate[]> => {
      const { data, error } = await supabase
        .from('gsc_query_aggregates')
        .select('*')
        .eq('window_type', windowType)
        .order(sortBy, { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch page-query combinations (for cannibalization detection)
 */
export const useGSCPageQueryMetrics = (dateRange: DateRange, queryFilter?: string) => {
  return useQuery({
    queryKey: ['gsc-page-query-metrics', dateRange, queryFilter],
    queryFn: async (): Promise<GSCPageQueryMetrics[]> => {
      let query = supabase
        .from('gsc_page_query_metrics')
        .select('*')
        .gte('date', dateRange.startDate)
        .lte('date', dateRange.endDate);

      if (queryFilter) {
        query = query.ilike('query', `%${queryFilter}%`);
      }

      const { data, error } = await query.order('impressions', { ascending: false }).limit(1000);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// URL Variants & Duplicates Hooks
// ============================================

/**
 * Fetch URL variants (potential duplicates)
 */
export const useGSCUrlVariants = () => {
  return useQuery({
    queryKey: ['gsc-url-variants'],
    queryFn: async (): Promise<GSCUrlVariant[]> => {
      const { data, error } = await supabase
        .from('gsc_url_variants')
        .select('*')
        .order('total_impressions', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch URLs with duplicates (normalized URLs that have variants)
 */
export const useGSCDuplicateUrls = () => {
  return useQuery({
    queryKey: ['gsc-duplicate-urls'],
    queryFn: async () => {
      // Get URLs that have variants
      const { data, error } = await supabase
        .from('gsc_url_variants')
        .select('normalized_url, variant_url, variant_type, total_clicks, total_impressions')
        .order('total_impressions', { ascending: false });

      if (error) throw error;

      // Group by normalized URL
      const grouped = (data || []).reduce((acc, item) => {
        if (!acc[item.normalized_url]) {
          acc[item.normalized_url] = {
            canonicalUrl: item.normalized_url,
            variants: [],
            totalClicks: 0,
            totalImpressions: 0,
          };
        }
        acc[item.normalized_url].variants.push({
          url: item.variant_url,
          type: item.variant_type,
          clicks: item.total_clicks,
          impressions: item.total_impressions,
        });
        acc[item.normalized_url].totalClicks += item.total_clicks;
        acc[item.normalized_url].totalImpressions += item.total_impressions;
        return acc;
      }, {} as Record<string, any>);

      return Object.values(grouped);
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Alerts Hooks
// ============================================

/**
 * Fetch active alerts
 */
export const useGSCAlerts = (includeAcknowledged: boolean = false) => {
  return useQuery({
    queryKey: ['gsc-alerts', includeAcknowledged],
    queryFn: async (): Promise<GSCAlert[]> => {
      let query = supabase
        .from('gsc_alerts')
        .select(`
          *,
          gsc_alert_rules!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (!includeAcknowledged) {
        query = query.eq('is_acknowledged', false);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      // Map rule name to alert
      return (data || []).map(alert => ({
        ...alert,
        rule_name: (alert as any).gsc_alert_rules?.name,
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for alerts
  });
};

/**
 * Acknowledge an alert
 */
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('gsc_alerts')
        .update({
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gsc-alerts'] });
    },
  });
};

// ============================================
// Sync Job Hooks
// ============================================

/**
 * Fetch sync jobs
 */
export const useGSCSyncJobs = (limit: number = 10) => {
  return useQuery({
    queryKey: ['gsc-sync-jobs', limit],
    queryFn: async (): Promise<GSCSyncJob[]> => {
      const { data, error } = await supabase
        .from('gsc_sync_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Trigger a manual sync job
 */
export const useTriggerGSCSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { action: 'backfill' | 'daily_sync' | 'manual_sync'; days?: number }) => {
      const { data, error } = await supabase.functions.invoke('gsc-sync', {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gsc-sync-jobs'] });
    },
  });
};

/**
 * Trigger aggregation job
 */
export const useTriggerGSCAggregate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('gsc-aggregate', {
        body: { action: 'aggregate' },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gsc-site-aggregates'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-top-pages'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-top-queries'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-alerts'] });
    },
  });
};

// ============================================
// Dashboard Summary Hook
// ============================================

export interface GSCDashboardSummary {
  site28d: GSCSiteAggregate | null;
  site7d: GSCSiteAggregate | null;
  alertCount: number;
  topPages: GSCPageAggregate[];
  topQueries: GSCQueryAggregate[];
  lastSync: GSCSyncJob | null;
}

/**
 * Fetch all data needed for dashboard overview
 */
export const useGSCDashboard = () => {
  return useQuery({
    queryKey: ['gsc-dashboard'],
    queryFn: async (): Promise<GSCDashboardSummary> => {
      // Fetch all in parallel
      const [site28dRes, site7dRes, alertsRes, topPagesRes, topQueriesRes, syncRes] = await Promise.all([
        supabase
          .from('gsc_site_aggregates')
          .select('*')
          .eq('window_type', '28d')
          .order('period_end', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('gsc_site_aggregates')
          .select('*')
          .eq('window_type', '7d')
          .order('period_end', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('gsc_alerts')
          .select('id', { count: 'exact' })
          .eq('is_acknowledged', false),
        supabase
          .from('gsc_page_aggregates')
          .select('*')
          .eq('window_type', '28d')
          .order('clicks', { ascending: false })
          .limit(5),
        supabase
          .from('gsc_query_aggregates')
          .select('*')
          .eq('window_type', '28d')
          .order('clicks', { ascending: false })
          .limit(5),
        supabase
          .from('gsc_sync_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      return {
        site28d: site28dRes.data,
        site7d: site7dRes.data,
        alertCount: alertsRes.count || 0,
        topPages: topPagesRes.data || [],
        topQueries: topQueriesRes.data || [],
        lastSync: syncRes.data,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
