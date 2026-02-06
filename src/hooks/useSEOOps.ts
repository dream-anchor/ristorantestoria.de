/**
 * React Query hooks for SEO Operations
 * Connects to seo-api and seo-pipeline Edge Functions
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// Types
// ============================================================================

export interface SEOBriefing {
  id: string;
  date: string;
  briefing_md: string;
  executive_summary: string;
  highlights: {
    total_clicks: number;
    clicks_change: number;
    total_impressions: number;
    impressions_change: number;
    avg_position: number;
  };
  metrics_snapshot: Record<string, unknown>;
  top_winners: Array<{ path: string; clicks: number; change_pct: number }>;
  top_losers: Array<{ path: string; clicks: number; change_pct: number }>;
  new_alerts_count: number;
  open_tasks_count: number;
  critical_issues: Array<{ title: string; entity: string }>;
  recommendations: string[];
  created_at: string;
}

export interface SEOAlertEvent {
  id: string;
  date_detected: string;
  window: 'daily' | 'wow' | 'mom';
  rule_key: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  scope: 'site' | 'page' | 'query' | 'canonical_group' | 'device' | 'country' | 'appearance';
  entity_key: string;
  entity_label: string | null;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  baseline_value: number | null;
  current_value: number | null;
  change_pct: number | null;
  recommended_actions: string[];
  affected_pages: string[];
  affected_queries: string[];
  status: 'open' | 'acknowledged' | 'resolved' | 'false_positive';
  acknowledged_at: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  rule?: {
    name: string;
    category: string;
  };
}

export interface SEOTask {
  id: string;
  alert_event_id: string | null;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'done' | 'wont_fix';
  category: string;
  entity_key: string | null;
  due_date: string | null;
  follow_up_days: number[];
  next_check_date: string | null;
  completed_at: string | null;
  completion_notes: string | null;
  created_at: string;
  alert?: {
    id: string;
    title: string;
    severity: string;
    rule_key: string;
  };
}

export interface SEOPromptPack {
  id: string;
  task_id: string | null;
  alert_event_id: string | null;
  title: string;
  target_area: 'redirects' | 'titles' | 'content' | 'schema' | 'internal_linking' | 'new_page' | 'canonicalization' | 'technical';
  prompt_text: string;
  context: Record<string, unknown>;
  files_to_inspect: string[];
  acceptance_criteria: string[];
  estimated_complexity: string | null;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
}

export interface SEOStats {
  open_alerts: number;
  open_tasks: number;
  unused_prompts: number;
  latest_briefing_date: string | null;
  last_pipeline_run: {
    id: string;
    date: string;
    status: string;
    started_at: string;
    completed_at: string | null;
    baselines_computed: number;
    alerts_created: number;
    tasks_created: number;
    prompts_generated: number;
  } | null;
}

export interface SEOPageCatalog {
  id: string;
  canonical_path: string;
  page_type: 'money' | 'pillar' | 'cluster' | 'trust' | 'legal' | 'legacy';
  primary_keyword: string | null;
  secondary_keywords: string[];
  pillar_path: string | null;
  target_ctr: number | null;
  target_position: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DuplicateGroup {
  id: string;
  canonical_url: string;
  variant_count: number;
  variants: Array<{
    raw_url: string;
    normalized_url: string;
    variant_type: string;
    clicks?: number;
    impressions?: number;
  }>;
}

export interface CannibalizationItem {
  query: string;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  pages: Array<{
    url: string;
    impressions: number;
    clicks: number;
    avgPosition: number;
  }>;
}

// ============================================================================
// API Helper
// ============================================================================

async function callSeoApi<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('seo-api', {
    body: body ? { ...body, _path: endpoint, _method: method } : { _path: endpoint, _method: method },
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data as T;
}

// Alternative: Direct fetch to Edge Function
async function fetchSeoApi<T>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
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
// Briefing Hooks
// ============================================================================

export function useSEOBriefing(date?: string) {
  return useQuery({
    queryKey: ['seo-briefing', date],
    queryFn: async (): Promise<SEOBriefing | null> => {
      const params = date ? `?date=${date}` : '';
      try {
        return await fetchSeoApi<SEOBriefing>(`/briefing${params}`);
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Alert Hooks
// ============================================================================

export function useSEOAlerts(options?: {
  date?: string;
  severity?: string;
  scope?: string;
  window?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const params = new URLSearchParams();
  if (options?.date) params.set('date', options.date);
  if (options?.severity) params.set('severity', options.severity);
  if (options?.scope) params.set('scope', options.scope);
  if (options?.window) params.set('window', options.window);
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.offset) params.set('offset', options.offset.toString());

  const queryString = params.toString();

  return useQuery({
    queryKey: ['seo-alerts', queryString],
    queryFn: async (): Promise<{ alerts: SEOAlertEvent[]; total: number }> => {
      try {
        return await fetchSeoApi(`/alerts${queryString ? `?${queryString}` : ''}`);
      } catch {
        return { alerts: [], total: 0 };
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useSEOAlert(alertId: string | undefined) {
  return useQuery({
    queryKey: ['seo-alert', alertId],
    queryFn: async (): Promise<SEOAlertEvent | null> => {
      if (!alertId) return null;
      return fetchSeoApi(`/alerts/${alertId}`);
    },
    enabled: !!alertId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSEOAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ alertId, updates }: { alertId: string; updates: Partial<SEOAlertEvent> }) => {
      return fetchSeoApi<SEOAlertEvent>(`/alerts/${alertId}`, 'PATCH', updates);
    },
    onSuccess: (data, { alertId }) => {
      queryClient.invalidateQueries({ queryKey: ['seo-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['seo-alert', alertId] });
      queryClient.invalidateQueries({ queryKey: ['seo-stats'] });
    },
  });
}

// ============================================================================
// Task Hooks
// ============================================================================

export function useSEOTasks(options?: {
  status?: string;
  priority?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.priority) params.set('priority', options.priority);
  if (options?.category) params.set('category', options.category);

  const queryString = params.toString();

  return useQuery({
    queryKey: ['seo-tasks', queryString],
    queryFn: async (): Promise<{ tasks: SEOTask[] }> => {
      try {
        return await fetchSeoApi(`/tasks${queryString ? `?${queryString}` : ''}`);
      } catch {
        return { tasks: [] };
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateSEOTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<SEOTask> }) => {
      return fetchSeoApi<SEOTask>(`/tasks/${taskId}`, 'PATCH', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['seo-stats'] });
    },
  });
}

// ============================================================================
// Prompt Hooks
// ============================================================================

export function useSEOPrompts(options?: {
  taskId?: string;
  alertId?: string;
  area?: string;
  used?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.taskId) params.set('task_id', options.taskId);
  if (options?.alertId) params.set('alert_id', options.alertId);
  if (options?.area) params.set('area', options.area);
  if (options?.used !== undefined) params.set('used', options.used.toString());

  const queryString = params.toString();

  return useQuery({
    queryKey: ['seo-prompts', queryString],
    queryFn: async (): Promise<{ prompts: SEOPromptPack[] }> => {
      try {
        return await fetchSeoApi(`/prompts${queryString ? `?${queryString}` : ''}`);
      } catch {
        return { prompts: [] };
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useSEOPrompt(promptId: string | undefined) {
  return useQuery({
    queryKey: ['seo-prompt', promptId],
    queryFn: async (): Promise<SEOPromptPack | null> => {
      if (!promptId) return null;
      return fetchSeoApi(`/prompts/${promptId}`);
    },
    enabled: !!promptId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarkPromptUsed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promptId: string) => {
      return fetchSeoApi<SEOPromptPack>(`/prompts/${promptId}/mark-used`, 'PATCH');
    },
    onSuccess: (_, promptId) => {
      queryClient.invalidateQueries({ queryKey: ['seo-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['seo-prompt', promptId] });
      queryClient.invalidateQueries({ queryKey: ['seo-stats'] });
    },
  });
}

// ============================================================================
// Duplicate & Cannibalization Hooks
// ============================================================================

export function useSEODuplicates(range: string = '28d') {
  return useQuery({
    queryKey: ['seo-duplicates', range],
    queryFn: async (): Promise<{ duplicates: DuplicateGroup[] }> => {
      return fetchSeoApi(`/duplicates?range=${range}`);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSEOCannibalization(range: string = '28d') {
  return useQuery({
    queryKey: ['seo-cannibalization', range],
    queryFn: async (): Promise<{ cannibalization: CannibalizationItem[] }> => {
      return fetchSeoApi(`/cannibalization?range=${range}`);
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Page Catalog Hooks
// ============================================================================

export function useSEOPageCatalog() {
  return useQuery({
    queryKey: ['seo-catalog'],
    queryFn: async (): Promise<{ catalog: SEOPageCatalog[] }> => {
      return fetchSeoApi('/catalog');
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSEOPageCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SEOPageCatalog>) => {
      return fetchSeoApi<SEOPageCatalog>('/catalog', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-catalog'] });
    },
  });
}

export function useUpdateSEOPageCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ catalogId, updates }: { catalogId: string; updates: Partial<SEOPageCatalog> }) => {
      return fetchSeoApi<SEOPageCatalog>(`/catalog/${catalogId}`, 'PATCH', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-catalog'] });
    },
  });
}

// ============================================================================
// Stats Hook
// ============================================================================

export function useSEOStats() {
  return useQuery({
    queryKey: ['seo-stats'],
    queryFn: async (): Promise<SEOStats> => {
      try {
        return await fetchSeoApi('/stats');
      } catch {
        return {
          open_alerts: 0,
          open_tasks: 0,
          unused_prompts: 0,
          latest_briefing_date: null,
          last_pipeline_run: null,
        };
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// ============================================================================
// Pipeline Hooks
// ============================================================================

export function useTriggerSEOPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date?: string) => {
      const { data, error } = await supabase.functions.invoke('seo-pipeline', {
        body: { date },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all SEO queries
      queryClient.invalidateQueries({ queryKey: ['seo-briefing'] });
      queryClient.invalidateQueries({ queryKey: ['seo-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['seo-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['seo-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['seo-stats'] });
    },
  });
}
