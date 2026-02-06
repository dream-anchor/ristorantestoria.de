/**
 * React Query hooks for Google Search Console metrics
 * Types aligned with database schema from gsc_monitoring migration
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ============================================
// Types - aligned with database schema
// ============================================

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface GSCSiteMetrics {
  id: string;
  site_property: string;
  date: string;
  search_type: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GSCPageMetrics {
  id: string;
  site_property: string;
  date: string;
  search_type: string;
  raw_url: string;
  normalized_url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GSCQueryMetrics {
  id: string;
  site_property: string;
  date: string;
  search_type: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GSCPageQueryMetrics {
  id: string;
  site_property: string;
  date: string;
  search_type: string;
  raw_url: string;
  normalized_url: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GSCSiteAggregate {
  id: string;
  site_property: string;
  computed_date: string;
  window_type: string;
  search_type: string;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
  avg_position: number;
  delta_clicks_wow: number | null;
  delta_impressions_wow: number | null;
  delta_ctr_wow: number | null;
  delta_position_wow: number | null;
  delta_clicks_mom: number | null;
  delta_impressions_mom: number | null;
  delta_ctr_mom: number | null;
  delta_position_mom: number | null;
  pct_change_clicks_wow: number | null;
  pct_change_impressions_wow: number | null;
  pct_change_clicks_mom: number | null;
  pct_change_impressions_mom: number | null;
  created_at: string;
}

export interface GSCPageAggregate {
  id: string;
  site_property: string;
  computed_date: string;
  window_type: string;
  normalized_url: string;
  search_type: string;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
  avg_position: number;
  delta_clicks_wow: number | null;
  delta_impressions_wow: number | null;
  delta_position_wow: number | null;
  delta_clicks_mom: number | null;
  delta_impressions_mom: number | null;
  delta_position_mom: number | null;
  pct_change_clicks_wow: number | null;
  pct_change_impressions_wow: number | null;
  pct_change_clicks_mom: number | null;
  pct_change_impressions_mom: number | null;
  is_winner: boolean;
  is_loser: boolean;
  created_at: string;
}

export interface GSCQueryAggregate {
  id: string;
  site_property: string;
  computed_date: string;
  window_type: string;
  query: string;
  search_type: string;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
  avg_position: number;
  ranking_page_count: number;
  top_page_url: string | null;
  is_cannibalized: boolean;
  delta_clicks_wow: number | null;
  delta_impressions_wow: number | null;
  delta_position_wow: number | null;
  delta_clicks_mom: number | null;
  delta_impressions_mom: number | null;
  delta_position_mom: number | null;
  created_at: string;
}

export interface GSCAlert {
  id: string;
  rule_id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  status: string;
  title: string;
  description: string | null;
  affected_url: string | null;
  affected_query: string | null;
  affected_date: string | null;
  metric_value: number | null;
  threshold_value: number | null;
  comparison_period: string | null;
  details: Record<string, unknown>;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  rule_name?: string;
}

export interface GSCSyncJob {
  id: string;
  job_type: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  date_from: string;
  date_to: string;
  rows_fetched: number;
  rows_inserted: number;
  rows_updated: number;
  errors_count: number;
  error_details: unknown[];
  progress_percent: number;
  current_dimension: string | null;
  created_at: string;
  updated_at: string;
}

export interface GSCUrlRegistry {
  id: string;
  raw_url: string;
  normalized_url: string;
  canonical_group_id: string | null;
  host_variant: string | null;
  protocol_variant: string | null;
  trailing_slash_variant: boolean;
  is_legacy_cms: boolean;
  is_pdf: boolean;
  is_image: boolean;
  language: string | null;
  route_key: string | null;
  first_seen: string;
  last_seen: string;
  total_clicks: number;
  total_impressions: number;
  avg_position: number | null;
  created_at: string;
  updated_at: string;
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
      return (data || []) as unknown as GSCSiteMetrics[];
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
        .order('computed_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as unknown as GSCSiteAggregate[];
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
        .order('computed_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as GSCSiteAggregate | null;
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
        query = query.eq('normalized_url', pageUrl);
      }

      const { data, error } = await query.order('date', { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as GSCPageMetrics[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch top pages by clicks or impressions
 */
export const useGSCTopPages = (
  windowType: '7d' | '28d' | '90d' = '28d',
  sortBy: 'total_clicks' | 'total_impressions' = 'total_clicks',
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
      return (data || []) as unknown as GSCPageAggregate[];
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
        .eq('is_loser', true)
        .order('pct_change_clicks_wow', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data || []) as unknown as GSCPageAggregate[];
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
      return (data || []) as unknown as GSCQueryMetrics[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch top queries by clicks or impressions
 */
export const useGSCTopQueries = (
  windowType: '7d' | '28d' | '90d' = '28d',
  sortBy: 'total_clicks' | 'total_impressions' = 'total_clicks',
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
      return (data || []) as unknown as GSCQueryAggregate[];
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
      return (data || []) as unknown as GSCPageQueryMetrics[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// URL Registry Hooks
// ============================================

/**
 * Fetch URL registry entries (for duplicate/variant detection)
 */
export const useGSCUrlRegistry = () => {
  return useQuery({
    queryKey: ['gsc-url-registry'],
    queryFn: async (): Promise<GSCUrlRegistry[]> => {
      const { data, error } = await supabase
        .from('gsc_url_registry')
        .select('*')
        .order('total_impressions', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as GSCUrlRegistry[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch URLs with duplicates (grouped by canonical)
 */
export const useGSCDuplicateUrls = () => {
  return useQuery({
    queryKey: ['gsc-duplicate-urls'],
    queryFn: async () => {
      // Get URLs that have variants
      const { data, error } = await supabase
        .from('gsc_url_registry')
        .select('*')
        .not('canonical_group_id', 'is', null)
        .order('total_impressions', { ascending: false });

      if (error) throw error;

      // Group by canonical_group_id
      const grouped = (data || []).reduce((acc, item: any) => {
        const groupId = item.canonical_group_id;
        if (!groupId) return acc;
        
        if (!acc[groupId]) {
          acc[groupId] = {
            canonicalUrl: item.normalized_url,
            variants: [],
            totalClicks: 0,
            totalImpressions: 0,
          };
        }
        acc[groupId].variants.push({
          url: item.raw_url,
          type: item.host_variant || 'unknown',
          clicks: item.total_clicks || 0,
          impressions: item.total_impressions || 0,
        });
        acc[groupId].totalClicks += item.total_clicks || 0;
        acc[groupId].totalImpressions += item.total_impressions || 0;
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
export const useGSCAlerts = (includeResolved: boolean = false) => {
  return useQuery({
    queryKey: ['gsc-alerts', includeResolved],
    queryFn: async (): Promise<GSCAlert[]> => {
      let query = supabase
        .from('gsc_alerts')
        .select(`
          *,
          gsc_alert_rules!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (!includeResolved) {
        query = query.eq('status', 'open');
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      // Map rule name to alert
      return ((data || []) as any[]).map(alert => ({
        ...alert,
        rule_name: alert.gsc_alert_rules?.name,
      })) as GSCAlert[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for alerts
  });
};

/**
 * Acknowledge/update an alert status
 */
export const useUpdateAlertStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ alertId, status, notes }: { alertId: string; status: string; notes?: string }) => {
      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }
      if (notes) {
        updateData.resolution_notes = notes;
      }

      const { error } = await supabase
        .from('gsc_alerts')
        .update(updateData)
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
 * Fetch recent sync jobs
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
      return (data || []) as unknown as GSCSyncJob[];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Trigger a GSC sync (via edge function)
 */
export const useTriggerGSCSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: 'backfill' | 'daily_sync' | 'manual_sync') => {
      const { data, error } = await supabase.functions.invoke('gsc-sync', {
        body: { action },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gsc-sync-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-site-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-page-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-query-metrics'] });
    },
  });
};

/**
 * Trigger GSC aggregation (via edge function)
 */
export const useTriggerGSCAggregate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('gsc-aggregate', {
        body: { action: 'compute_all' },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gsc-site-aggregates'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-page-aggregates'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-query-aggregates'] });
      queryClient.invalidateQueries({ queryKey: ['gsc-alerts'] });
    },
  });
};

// ============================================
// Dashboard Combined Hook
// ============================================

export interface GSCDashboardData {
  siteAggregates: GSCSiteAggregate[];
  topPages: GSCPageAggregate[];
  topQueries: GSCQueryAggregate[];
  alerts: GSCAlert[];
  recentSync: GSCSyncJob | null;
}

/**
 * Combined hook for dashboard - fetches all data needed for the overview
 */
export const useGSCDashboard = (windowType: '7d' | '28d' | '90d' = '28d') => {
  return useQuery({
    queryKey: ['gsc-dashboard', windowType],
    queryFn: async (): Promise<GSCDashboardData> => {
      // Fetch all data in parallel
      const [
        siteAggResult,
        topPagesResult,
        topQueriesResult,
        alertsResult,
        syncJobsResult,
      ] = await Promise.all([
        supabase
          .from('gsc_site_aggregates')
          .select('*')
          .eq('window_type', windowType)
          .order('computed_date', { ascending: false })
          .limit(3),
        supabase
          .from('gsc_page_aggregates')
          .select('*')
          .eq('window_type', windowType)
          .order('total_clicks', { ascending: false })
          .limit(10),
        supabase
          .from('gsc_query_aggregates')
          .select('*')
          .eq('window_type', windowType)
          .order('total_clicks', { ascending: false })
          .limit(10),
        supabase
          .from('gsc_alerts')
          .select('*, gsc_alert_rules!inner(name)')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('gsc_sync_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1),
      ]);

      return {
        siteAggregates: (siteAggResult.data || []) as unknown as GSCSiteAggregate[],
        topPages: (topPagesResult.data || []) as unknown as GSCPageAggregate[],
        topQueries: (topQueriesResult.data || []) as unknown as GSCQueryAggregate[],
        alerts: ((alertsResult.data || []) as any[]).map(a => ({
          ...a,
          rule_name: a.gsc_alert_rules?.name,
        })) as GSCAlert[],
        recentSync: (syncJobsResult.data?.[0] as unknown as GSCSyncJob) || null,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};
