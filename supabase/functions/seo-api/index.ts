/**
 * SEO API Edge Function
 * 
 * REST API for all SEO operations data.
 * Endpoints: /briefing, /alerts, /tasks, /prompts, /duplicates, /cannibalization, /catalog, /stats
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth via Supabase JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: roleData } = await supabaseAuth.from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin role required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // The endpoint is the last part of the path after "seo-api"
    const endpoint = pathParts[pathParts.length - 1] || 'stats';

    console.log(`SEO API: endpoint=${endpoint}`);

    let responseData: unknown;

    switch (endpoint) {
      case 'briefing': {
        const limit = parseInt(url.searchParams.get('limit') || '7');
        const { data } = await supabase
          .from('seo_daily_briefing')
          .select('*')
          .order('briefing_date', { ascending: false })
          .limit(limit);
        responseData = data || [];
        break;
      }

      case 'alerts': {
        const status = url.searchParams.get('status') || 'open';
        const limit = parseInt(url.searchParams.get('limit') || '50');
        let query = supabase
          .from('seo_alert_event')
          .select('*, seo_alert_rule(slug, name)')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (status !== 'all') {
          query = query.eq('status', status);
        }
        
        const { data } = await query;
        responseData = data || [];
        break;
      }

      case 'tasks': {
        const status = url.searchParams.get('status');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        let query = supabase
          .from('seo_task')
          .select('*, seo_alert_event(title, severity)')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }
        
        const { data } = await query;
        responseData = data || [];
        break;
      }

      case 'prompts': {
        const executed = url.searchParams.get('executed');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        let query = supabase
          .from('seo_prompt_pack')
          .select('*, seo_alert_event(title, severity, affected_path)')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (executed === 'true') {
          query = query.eq('is_executed', true);
        } else if (executed === 'false') {
          query = query.eq('is_executed', false);
        }
        
        const { data } = await query;
        responseData = data || [];
        break;
      }

      case 'duplicates': {
        const { data } = await supabase
          .from('gsc_canonical_groups')
          .select('*')
          .eq('is_duplicate_issue', true)
          .order('total_clicks', { ascending: false })
          .limit(50);
        responseData = data || [];
        break;
      }

      case 'cannibalization': {
        const { data } = await supabase
          .from('gsc_query_aggregates')
          .select('*')
          .eq('is_cannibalized', true)
          .eq('window_type', '7d')
          .order('total_clicks', { ascending: false })
          .limit(50);
        responseData = data || [];
        break;
      }

      case 'catalog': {
        const { data } = await supabase
          .from('seo_page_catalog')
          .select('*')
          .eq('is_active', true)
          .order('page_type');
        responseData = data || [];
        break;
      }

      case 'stats':
      case 'seo-api': {
        // Overview stats
        const [
          { count: alertsOpen },
          { count: alertsCritical },
          { count: tasksOpen },
          { count: promptsPending },
          { data: latestBriefing },
          { data: latestRun },
        ] = await Promise.all([
          supabase.from('seo_alert_event').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('seo_alert_event').select('*', { count: 'exact', head: true }).eq('status', 'open').eq('severity', 'critical'),
          supabase.from('seo_task').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('seo_prompt_pack').select('*', { count: 'exact', head: true }).eq('is_executed', false),
          supabase.from('seo_daily_briefing').select('*').order('briefing_date', { ascending: false }).limit(1),
          supabase.from('seo_pipeline_run').select('*').order('created_at', { ascending: false }).limit(1),
        ]);

        responseData = {
          alerts_open: alertsOpen || 0,
          alerts_critical: alertsCritical || 0,
          tasks_open: tasksOpen || 0,
          prompts_pending: promptsPending || 0,
          latest_briefing: latestBriefing?.[0] || null,
          latest_pipeline_run: latestRun?.[0] || null,
        };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown endpoint: ${endpoint}` }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('SEO API error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
