-- ============================================================================
-- SEO Operations Schema
-- Extends GSC monitoring with daily briefings, tasks, and Claude Code PromptPacks
-- ============================================================================

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

-- Page classification types
CREATE TYPE public.seo_page_type AS ENUM (
    'money',      -- Revenue-generating pages (reservation, catering)
    'pillar',     -- Topic hub pages (main sections)
    'cluster',    -- Supporting content pages
    'trust',      -- Trust signals (about, testimonials)
    'legal',      -- Legal pages (impressum, datenschutz)
    'legacy'      -- Old/deprecated pages
);

-- Alert severity levels
CREATE TYPE public.seo_severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Alert scope types
CREATE TYPE public.seo_scope AS ENUM (
    'site',
    'page',
    'query',
    'canonical_group',
    'device',
    'country',
    'appearance'
);

-- Time windows for comparison
CREATE TYPE public.seo_window AS ENUM (
    'daily',
    'wow',    -- Week-over-Week
    'mom'     -- Month-over-Month
);

-- Task status
CREATE TYPE public.seo_task_status AS ENUM (
    'open',
    'in_progress',
    'done',
    'wont_fix'
);

-- Alert event status
CREATE TYPE public.seo_alert_status AS ENUM (
    'open',
    'acknowledged',
    'resolved',
    'false_positive'
);

-- PromptPack target areas
CREATE TYPE public.seo_prompt_area AS ENUM (
    'redirects',
    'titles',
    'content',
    'schema',
    'internal_linking',
    'new_page',
    'canonicalization',
    'technical'
);

-- ============================================================================
-- 2. SEO PAGE CATALOG
-- Classifies pages by type for severity boosting
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_page_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_path TEXT UNIQUE NOT NULL,
    page_type public.seo_page_type NOT NULL DEFAULT 'cluster',
    primary_keyword TEXT NULL,
    secondary_keywords TEXT[] NULL DEFAULT '{}',
    pillar_path TEXT NULL,
    target_ctr NUMERIC(5,4) NULL,
    target_position NUMERIC(4,1) NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seo_page_catalog_type ON public.seo_page_catalog(page_type);
CREATE INDEX idx_seo_page_catalog_pillar ON public.seo_page_catalog(pillar_path);
CREATE INDEX idx_seo_page_catalog_active ON public.seo_page_catalog(is_active);

COMMENT ON TABLE public.seo_page_catalog IS 'Page classification for SEO priority scoring';
COMMENT ON COLUMN public.seo_page_catalog.canonical_path IS 'Normalized path without domain, e.g. /speisekarte/';
COMMENT ON COLUMN public.seo_page_catalog.page_type IS 'Classification for severity boosting';
COMMENT ON COLUMN public.seo_page_catalog.pillar_path IS 'Parent pillar page for cluster pages';

-- ============================================================================
-- 3. SEO ALERT RULES (Extended)
-- Configurable alert rule definitions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_alert_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'performance',
    config JSONB NOT NULL DEFAULT '{}',
    default_severity public.seo_severity NOT NULL DEFAULT 'medium',
    scope public.seo_scope NOT NULL DEFAULT 'page',
    windows public.seo_window[] NOT NULL DEFAULT '{daily,wow,mom}',
    enabled BOOLEAN NOT NULL DEFAULT true,
    min_impressions INTEGER NOT NULL DEFAULT 30,
    min_clicks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seo_alert_rule_enabled ON public.seo_alert_rule(enabled);
CREATE INDEX idx_seo_alert_rule_category ON public.seo_alert_rule(category);

COMMENT ON TABLE public.seo_alert_rule IS 'Configurable SEO alert rules with thresholds';

-- ============================================================================
-- 4. SEO ALERT EVENTS
-- Detected issues with evidence and recommendations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_alert_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_detected DATE NOT NULL,
    window public.seo_window NOT NULL,
    rule_key TEXT NOT NULL REFERENCES public.seo_alert_rule(key) ON DELETE CASCADE,
    severity public.seo_severity NOT NULL,
    scope public.seo_scope NOT NULL,
    entity_key TEXT NOT NULL,
    entity_label TEXT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    evidence JSONB NOT NULL DEFAULT '{}',
    baseline_value NUMERIC NULL,
    current_value NUMERIC NULL,
    change_pct NUMERIC NULL,
    recommended_actions JSONB NOT NULL DEFAULT '[]',
    affected_pages TEXT[] NULL DEFAULT '{}',
    affected_queries TEXT[] NULL DEFAULT '{}',
    status public.seo_alert_status NOT NULL DEFAULT 'open',
    acknowledged_by UUID NULL,
    acknowledged_at TIMESTAMPTZ NULL,
    resolved_at TIMESTAMPTZ NULL,
    resolution_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_alert_per_day UNIQUE (date_detected, window, rule_key, scope, entity_key)
);

CREATE INDEX idx_seo_alert_event_date ON public.seo_alert_event(date_detected DESC);
CREATE INDEX idx_seo_alert_event_rule ON public.seo_alert_event(rule_key);
CREATE INDEX idx_seo_alert_event_severity ON public.seo_alert_event(severity);
CREATE INDEX idx_seo_alert_event_scope ON public.seo_alert_event(scope);
CREATE INDEX idx_seo_alert_event_status ON public.seo_alert_event(status);
CREATE INDEX idx_seo_alert_event_entity ON public.seo_alert_event(entity_key);

COMMENT ON TABLE public.seo_alert_event IS 'Detected SEO issues with evidence and recommendations';

-- ============================================================================
-- 5. SEO TASKS
-- Actionable items derived from alerts
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_task (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_event_id UUID NULL REFERENCES public.seo_alert_event(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority public.seo_severity NOT NULL DEFAULT 'medium',
    status public.seo_task_status NOT NULL DEFAULT 'open',
    category TEXT NOT NULL DEFAULT 'general',
    entity_key TEXT NULL,
    due_date DATE NULL,
    follow_up_days INTEGER[] NOT NULL DEFAULT '{7,14,28}',
    next_check_date DATE NULL,
    assigned_to UUID NULL,
    completed_at TIMESTAMPTZ NULL,
    completion_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seo_task_status ON public.seo_task(status);
CREATE INDEX idx_seo_task_priority ON public.seo_task(priority);
CREATE INDEX idx_seo_task_alert ON public.seo_task(alert_event_id);
CREATE INDEX idx_seo_task_due ON public.seo_task(due_date);
CREATE INDEX idx_seo_task_next_check ON public.seo_task(next_check_date);

COMMENT ON TABLE public.seo_task IS 'SEO tasks with follow-up scheduling';

-- ============================================================================
-- 6. SEO PROMPT PACKS
-- Ready-to-paste Claude Code prompts
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_prompt_pack (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NULL REFERENCES public.seo_task(id) ON DELETE SET NULL,
    alert_event_id UUID NULL REFERENCES public.seo_alert_event(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    target_area public.seo_prompt_area NOT NULL,
    prompt_text TEXT NOT NULL,
    context JSONB NOT NULL DEFAULT '{}',
    files_to_inspect TEXT[] NULL DEFAULT '{}',
    acceptance_criteria TEXT[] NULL DEFAULT '{}',
    estimated_complexity TEXT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seo_prompt_pack_task ON public.seo_prompt_pack(task_id);
CREATE INDEX idx_seo_prompt_pack_alert ON public.seo_prompt_pack(alert_event_id);
CREATE INDEX idx_seo_prompt_pack_area ON public.seo_prompt_pack(target_area);
CREATE INDEX idx_seo_prompt_pack_used ON public.seo_prompt_pack(is_used);

COMMENT ON TABLE public.seo_prompt_pack IS 'Claude Code prompts for implementing SEO fixes';

-- ============================================================================
-- 7. SEO DAILY BRIEFING
-- Human-readable summary of daily SEO status
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_daily_briefing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    briefing_md TEXT NOT NULL,
    executive_summary TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '{}',
    metrics_snapshot JSONB NOT NULL DEFAULT '{}',
    top_winners JSONB NOT NULL DEFAULT '[]',
    top_losers JSONB NOT NULL DEFAULT '[]',
    new_alerts_count INTEGER NOT NULL DEFAULT 0,
    open_tasks_count INTEGER NOT NULL DEFAULT 0,
    critical_issues JSONB NOT NULL DEFAULT '[]',
    recommendations JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seo_daily_briefing_date ON public.seo_daily_briefing(date DESC);

COMMENT ON TABLE public.seo_daily_briefing IS 'Daily SEO briefing like an experienced SEO employee would write';

-- ============================================================================
-- 8. SEO BASELINE CACHE
-- Pre-computed baselines for faster alert detection
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_baseline_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    scope public.seo_scope NOT NULL,
    entity_key TEXT NOT NULL,
    window public.seo_window NOT NULL,
    clicks_baseline NUMERIC NULL,
    clicks_current NUMERIC NULL,
    clicks_change_pct NUMERIC NULL,
    impressions_baseline NUMERIC NULL,
    impressions_current NUMERIC NULL,
    impressions_change_pct NUMERIC NULL,
    ctr_baseline NUMERIC NULL,
    ctr_current NUMERIC NULL,
    ctr_change_pct NUMERIC NULL,
    position_baseline NUMERIC NULL,
    position_current NUMERIC NULL,
    position_change_pct NUMERIC NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_baseline UNIQUE (date, scope, entity_key, window)
);

CREATE INDEX idx_seo_baseline_date ON public.seo_baseline_cache(date DESC);
CREATE INDEX idx_seo_baseline_scope ON public.seo_baseline_cache(scope, entity_key);

COMMENT ON TABLE public.seo_baseline_cache IS 'Pre-computed metric baselines for each comparison window';

-- ============================================================================
-- 9. SEO PIPELINE RUNS
-- Track pipeline execution history
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seo_pipeline_run (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    status TEXT NOT NULL DEFAULT 'running',
    steps_completed TEXT[] NOT NULL DEFAULT '{}',
    baselines_computed INTEGER NOT NULL DEFAULT 0,
    alerts_created INTEGER NOT NULL DEFAULT 0,
    tasks_created INTEGER NOT NULL DEFAULT 0,
    prompts_generated INTEGER NOT NULL DEFAULT 0,
    briefing_created BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT NULL,
    duration_ms INTEGER NULL
);

CREATE INDEX idx_seo_pipeline_run_date ON public.seo_pipeline_run(date DESC);
CREATE INDEX idx_seo_pipeline_run_status ON public.seo_pipeline_run(status);

COMMENT ON TABLE public.seo_pipeline_run IS 'SEO pipeline execution history';

-- ============================================================================
-- 10. HELPER FUNCTIONS
-- ============================================================================

-- Get page type for severity boosting
CREATE OR REPLACE FUNCTION public.get_page_type(p_path TEXT)
RETURNS public.seo_page_type
LANGUAGE SQL STABLE
AS $$
    SELECT COALESCE(
        (SELECT page_type FROM public.seo_page_catalog WHERE canonical_path = p_path),
        'cluster'::public.seo_page_type
    )
$$;

-- Boost severity based on page type
CREATE OR REPLACE FUNCTION public.boost_severity(
    base_severity public.seo_severity,
    page_type public.seo_page_type
)
RETURNS public.seo_severity
LANGUAGE PLPGSQL IMMUTABLE
AS $$
DECLARE
    severity_order TEXT[] := ARRAY['low', 'medium', 'high', 'critical'];
    base_idx INTEGER;
    new_idx INTEGER;
BEGIN
    base_idx := array_position(severity_order, base_severity::TEXT);

    CASE page_type
        WHEN 'money' THEN new_idx := LEAST(base_idx + 2, 4);
        WHEN 'pillar' THEN new_idx := LEAST(base_idx + 1, 4);
        WHEN 'legacy' THEN new_idx := 4; -- Always critical for legacy
        WHEN 'legal' THEN new_idx := GREATEST(base_idx - 1, 1);
        ELSE new_idx := base_idx;
    END CASE;

    RETURN severity_order[new_idx]::public.seo_severity;
END;
$$;

-- Normalize path for matching
CREATE OR REPLACE FUNCTION public.normalize_seo_path(p_url TEXT)
RETURNS TEXT
LANGUAGE PLPGSQL IMMUTABLE
AS $$
DECLARE
    result TEXT;
BEGIN
    result := p_url;

    -- Remove protocol and domain
    result := regexp_replace(result, '^https?://[^/]+', '');

    -- Ensure leading slash
    IF NOT result LIKE '/%' THEN
        result := '/' || result;
    END IF;

    -- Ensure trailing slash (except for files)
    IF result !~ '\.[a-z0-9]+$' AND NOT result LIKE '%/' THEN
        result := result || '/';
    END IF;

    -- Lowercase
    result := lower(result);

    -- Remove query params
    result := regexp_replace(result, '\?.*$', '');

    -- Remove fragment
    result := regexp_replace(result, '#.*$', '');

    RETURN result;
END;
$$;

-- ============================================================================
-- 11. TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_seo_page_catalog
    BEFORE UPDATE ON public.seo_page_catalog
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at_seo_alert_rule
    BEFORE UPDATE ON public.seo_alert_rule
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at_seo_alert_event
    BEFORE UPDATE ON public.seo_alert_event
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at_seo_task
    BEFORE UPDATE ON public.seo_task
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 12. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.seo_page_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_alert_rule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_alert_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_task ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_prompt_pack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_daily_briefing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_baseline_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pipeline_run ENABLE ROW LEVEL SECURITY;

-- Admin read policies
CREATE POLICY "Admins can read seo_page_catalog"
    ON public.seo_page_catalog FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_alert_rule"
    ON public.seo_alert_rule FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_alert_event"
    ON public.seo_alert_event FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_task"
    ON public.seo_task FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_prompt_pack"
    ON public.seo_prompt_pack FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_daily_briefing"
    ON public.seo_daily_briefing FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_baseline_cache"
    ON public.seo_baseline_cache FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read seo_pipeline_run"
    ON public.seo_pipeline_run FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Admin write policies (for status updates)
CREATE POLICY "Admins can update seo_alert_event"
    ON public.seo_alert_event FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update seo_task"
    ON public.seo_task FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update seo_prompt_pack"
    ON public.seo_prompt_pack FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage seo_page_catalog"
    ON public.seo_page_catalog FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage seo_alert_rule"
    ON public.seo_alert_rule FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Service role full access (for Edge Functions)
CREATE POLICY "Service role full access seo_page_catalog"
    ON public.seo_page_catalog FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_alert_rule"
    ON public.seo_alert_rule FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_alert_event"
    ON public.seo_alert_event FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_task"
    ON public.seo_task FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_prompt_pack"
    ON public.seo_prompt_pack FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_daily_briefing"
    ON public.seo_daily_briefing FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_baseline_cache"
    ON public.seo_baseline_cache FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access seo_pipeline_run"
    ON public.seo_pipeline_run FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- 13. SEED DEFAULT PAGE CATALOG
-- Known important pages for STORIA
-- ============================================================================

INSERT INTO public.seo_page_catalog (canonical_path, page_type, primary_keyword, pillar_path, notes)
VALUES
    -- Money Pages
    ('/', 'money', 'italienisches restaurant münchen', NULL, 'Homepage - highest priority'),
    ('/reservierung/', 'money', 'restaurant reservierung münchen', NULL, 'Primary conversion page'),
    ('/catering/', 'money', 'catering münchen italienisch', NULL, 'B2B revenue page'),

    -- Pillar Pages
    ('/speisekarte/', 'pillar', 'italienische speisekarte', NULL, 'Menu hub'),
    ('/besondere-anlaesse/', 'pillar', 'restaurant besondere anlässe münchen', NULL, 'Events hub'),
    ('/eventlocation-muenchen-maxvorstadt/', 'pillar', 'eventlocation münchen maxvorstadt', NULL, 'Events pillar'),

    -- Cluster Pages - Menu
    ('/mittags-menu/', 'cluster', 'mittagsmenü münchen italienisch', '/speisekarte/', 'Lunch menu'),
    ('/getraenke/', 'cluster', 'italienische getränke münchen', '/speisekarte/', 'Drinks menu'),

    -- Cluster Pages - Events
    ('/firmenfeier-muenchen/', 'cluster', 'firmenfeier münchen', '/eventlocation-muenchen-maxvorstadt/', 'Corporate events'),
    ('/geburtstagsfeier-muenchen/', 'cluster', 'geburtstagsfeier münchen restaurant', '/eventlocation-muenchen-maxvorstadt/', 'Birthday events'),
    ('/romantisches-dinner-muenchen/', 'cluster', 'romantisches dinner münchen', '/eventlocation-muenchen-maxvorstadt/', 'Romantic dinners'),

    -- Cluster Pages - SEO Landing Pages
    ('/lunch-muenchen-maxvorstadt/', 'cluster', 'lunch münchen maxvorstadt', '/mittags-menu/', 'Lunch SEO page'),
    ('/aperitivo-muenchen/', 'cluster', 'aperitivo münchen', '/', 'Aperitivo SEO page'),
    ('/neapolitanische-pizza-muenchen/', 'cluster', 'neapolitanische pizza münchen', '/speisekarte/', 'Pizza SEO page'),
    ('/wild-essen-muenchen/', 'cluster', 'wild essen münchen restaurant', '/speisekarte/', 'Game dishes page'),
    ('/italiener-koenigsplatz/', 'cluster', 'italiener königsplatz münchen', '/', 'Location SEO page'),

    -- Trust Pages
    ('/ueber-uns/', 'trust', 'italienisches restaurant familie', NULL, 'About page'),
    ('/kontakt/', 'trust', 'restaurant kontakt münchen', NULL, 'Contact page'),
    ('/faq/', 'trust', 'restaurant fragen antworten', NULL, 'FAQ page'),

    -- Legal Pages
    ('/impressum/', 'legal', NULL, NULL, 'Imprint'),
    ('/datenschutz/', 'legal', NULL, NULL, 'Privacy policy'),
    ('/cookie-richtlinie/', 'legal', NULL, NULL, 'Cookie policy'),
    ('/agb-restaurant/', 'legal', NULL, NULL, 'Terms - restaurant'),
    ('/agb-gutscheine/', 'legal', NULL, NULL, 'Terms - vouchers'),
    ('/widerrufsbelehrung/', 'legal', NULL, NULL, 'Cancellation policy'),
    ('/zahlungsinformationen/', 'legal', NULL, NULL, 'Payment info'),
    ('/lebensmittelhinweise/', 'legal', NULL, NULL, 'Food info'),
    ('/haftungsausschluss/', 'legal', NULL, NULL, 'Disclaimer')
ON CONFLICT (canonical_path) DO NOTHING;

-- ============================================================================
-- 14. SEED DEFAULT ALERT RULES
-- ============================================================================

INSERT INTO public.seo_alert_rule (key, name, description, category, config, default_severity, scope, windows, min_impressions)
VALUES
    -- Performance Drops
    (
        'drop_clicks_site',
        'Site Clicks Drop',
        'Gesamte Klicks der Website sind deutlich gesunken',
        'performance',
        '{"threshold_pct": -15, "min_absolute_drop": 50}'::JSONB,
        'high',
        'site',
        '{daily,wow,mom}',
        100
    ),
    (
        'drop_clicks_page',
        'Page Clicks Drop',
        'Klicks einer Seite sind deutlich gesunken',
        'performance',
        '{"threshold_pct": -25, "min_absolute_drop": 10}'::JSONB,
        'medium',
        'page',
        '{wow,mom}',
        30
    ),
    (
        'drop_impressions_page',
        'Page Impressions Drop',
        'Impressionen einer Seite sind deutlich gesunken (Sichtbarkeitsverlust)',
        'performance',
        '{"threshold_pct": -30, "min_absolute_drop": 100}'::JSONB,
        'medium',
        'page',
        '{wow,mom}',
        100
    ),
    (
        'position_drop',
        'Ranking Drop',
        'Durchschnittliche Position einer Seite ist gesunken',
        'ranking',
        '{"threshold_positions": 3, "max_baseline_position": 20}'::JSONB,
        'high',
        'page',
        '{wow,mom}',
        50
    ),
    (
        'ctr_drop_stable_position',
        'CTR Drop (Stable Position)',
        'CTR gesunken obwohl Position stabil - Title/Description Problem',
        'content',
        '{"ctr_threshold_pct": -20, "position_tolerance": 2}'::JSONB,
        'medium',
        'page',
        '{wow,mom}',
        100
    ),

    -- Technical Issues
    (
        'duplicate_variants',
        'Duplicate URL Variants',
        'Mehrere URL-Varianten ranken (http/https, www/non-www, trailing slash)',
        'technical',
        '{"min_variant_impressions": 10}'::JSONB,
        'high',
        'canonical_group',
        '{daily}',
        0
    ),
    (
        'legacy_cms_traffic',
        'Legacy CMS Traffic',
        'Alte /cms/ URLs haben noch Traffic',
        'technical',
        '{"patterns": ["/cms/", "?page_id=", "/wp-content/"]}'::JSONB,
        'critical',
        'page',
        '{daily}',
        1
    ),

    -- Content Issues
    (
        'cannibalization',
        'Keyword Cannibalization',
        'Mehrere Seiten ranken für dasselbe Keyword',
        'content',
        '{"min_pages": 2, "max_position_spread": 10, "min_query_impressions": 50}'::JSONB,
        'high',
        'query',
        '{wow}',
        50
    ),
    (
        'appearance_loss',
        'Rich Result Loss',
        'Rich Snippet (FAQ, Review) verloren',
        'content',
        '{"appearance_types": ["FAQ rich result", "Review snippet", "Event"]}'::JSONB,
        'medium',
        'appearance',
        '{wow}',
        20
    ),

    -- Device/Geographic Issues
    (
        'mobile_gap',
        'Mobile Performance Gap',
        'Mobile Position deutlich schlechter als Desktop',
        'technical',
        '{"position_gap": 5, "min_mobile_impressions": 100}'::JSONB,
        'medium',
        'device',
        '{wow}',
        100
    ),

    -- Opportunities
    (
        'rising_query',
        'Rising Query',
        'Query mit starkem Impressionswachstum - Optimierungspotential',
        'opportunity',
        '{"threshold_pct": 50, "min_impressions": 100, "max_position": 15}'::JSONB,
        'low',
        'query',
        '{wow}',
        100
    ),
    (
        'striking_distance',
        'Striking Distance',
        'Seite auf Position 4-10 - mit Optimierung auf Seite 1 möglich',
        'opportunity',
        '{"min_position": 4, "max_position": 10, "min_impressions": 200}'::JSONB,
        'low',
        'page',
        '{wow}',
        200
    )
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    config = EXCLUDED.config,
    default_severity = EXCLUDED.default_severity,
    updated_at = NOW();
