-- ============================================================================
-- GSC Monitoring Schema - Complete Data Model
-- Created: 2024-02-06
-- Description: Tables for Google Search Console data ingestion, normalization,
--              aggregation, anomaly detection, and alerting.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- 1. RAW DATA TABLES
-- ============================================================================

-- Site-level daily metrics (aggregated from GSC)
CREATE TABLE IF NOT EXISTS gsc_site_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type)
);

-- Page-level performance metrics
CREATE TABLE IF NOT EXISTS gsc_page_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    raw_url TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type, raw_url)
);

-- Query-level performance metrics
CREATE TABLE IF NOT EXISTS gsc_query_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    query TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type, query)
);

-- Page x Query cross metrics (for cannibalization detection)
CREATE TABLE IF NOT EXISTS gsc_page_query_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    raw_url TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    query TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type, raw_url, query)
);

-- Device performance metrics
CREATE TABLE IF NOT EXISTS gsc_device_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    device TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type, device)
);

-- Country performance metrics
CREATE TABLE IF NOT EXISTS gsc_country_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    country TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type, country)
);

-- Search appearance metrics (rich results, etc.)
CREATE TABLE IF NOT EXISTS gsc_search_appearance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    search_appearance TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, date, search_type, search_appearance)
);

-- ============================================================================
-- 2. URL NORMALIZATION & CANONICAL GROUPS
-- ============================================================================

-- Canonical URL groups (for duplicate detection) - create first for FK
CREATE TABLE IF NOT EXISTS gsc_canonical_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_url TEXT NOT NULL,
    variant_count INTEGER DEFAULT 1,
    is_duplicate_issue BOOLEAN DEFAULT FALSE,
    total_clicks INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    primary_variant TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- URL registry with normalization metadata
CREATE TABLE IF NOT EXISTS gsc_url_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_url TEXT NOT NULL UNIQUE,
    normalized_url TEXT NOT NULL,
    canonical_group_id UUID REFERENCES gsc_canonical_groups(id) ON DELETE SET NULL,
    host_variant TEXT,
    protocol_variant TEXT,
    trailing_slash_variant BOOLEAN DEFAULT FALSE,
    is_legacy_cms BOOLEAN DEFAULT FALSE,
    is_pdf BOOLEAN DEFAULT FALSE,
    is_image BOOLEAN DEFAULT FALSE,
    language TEXT,
    route_key TEXT,
    first_seen DATE NOT NULL DEFAULT CURRENT_DATE,
    last_seen DATE NOT NULL DEFAULT CURRENT_DATE,
    total_clicks INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    avg_position DECIMAL(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. AGGREGATED METRICS (ROLLING WINDOWS)
-- ============================================================================

-- Site-level rolling aggregates
CREATE TABLE IF NOT EXISTS gsc_site_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    computed_date DATE NOT NULL,
    window_type TEXT NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    avg_ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    avg_position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    delta_clicks_wow INTEGER,
    delta_impressions_wow INTEGER,
    delta_ctr_wow DECIMAL(10, 6),
    delta_position_wow DECIMAL(10, 2),
    delta_clicks_mom INTEGER,
    delta_impressions_mom INTEGER,
    delta_ctr_mom DECIMAL(10, 6),
    delta_position_mom DECIMAL(10, 2),
    pct_change_clicks_wow DECIMAL(10, 2),
    pct_change_impressions_wow DECIMAL(10, 2),
    pct_change_clicks_mom DECIMAL(10, 2),
    pct_change_impressions_mom DECIMAL(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, computed_date, window_type, search_type)
);

-- Page-level rolling aggregates
CREATE TABLE IF NOT EXISTS gsc_page_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    computed_date DATE NOT NULL,
    window_type TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    avg_ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    avg_position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    delta_clicks_wow INTEGER,
    delta_impressions_wow INTEGER,
    delta_position_wow DECIMAL(10, 2),
    delta_clicks_mom INTEGER,
    delta_impressions_mom INTEGER,
    delta_position_mom DECIMAL(10, 2),
    pct_change_clicks_wow DECIMAL(10, 2),
    pct_change_impressions_wow DECIMAL(10, 2),
    pct_change_clicks_mom DECIMAL(10, 2),
    pct_change_impressions_mom DECIMAL(10, 2),
    is_winner BOOLEAN DEFAULT FALSE,
    is_loser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, computed_date, window_type, normalized_url, search_type)
);

-- Query-level rolling aggregates
CREATE TABLE IF NOT EXISTS gsc_query_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    computed_date DATE NOT NULL,
    window_type TEXT NOT NULL,
    query TEXT NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web',
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    avg_ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    avg_position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ranking_page_count INTEGER DEFAULT 1,
    top_page_url TEXT,
    is_cannibalized BOOLEAN DEFAULT FALSE,
    delta_clicks_wow INTEGER,
    delta_impressions_wow INTEGER,
    delta_position_wow DECIMAL(10, 2),
    delta_clicks_mom INTEGER,
    delta_impressions_mom INTEGER,
    delta_position_mom DECIMAL(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, computed_date, window_type, query, search_type)
);

-- ============================================================================
-- 4. ALERTS & ANOMALY DETECTION
-- ============================================================================

-- Alert definitions/rules
CREATE TABLE IF NOT EXISTS gsc_alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'warning',
    is_enabled BOOLEAN DEFAULT TRUE,
    thresholds JSONB NOT NULL DEFAULT '{}',
    notify_email BOOLEAN DEFAULT FALSE,
    notify_slack BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alert instances (triggered alerts)
CREATE TABLE IF NOT EXISTS gsc_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL REFERENCES gsc_alert_rules(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'warning',
    status TEXT NOT NULL DEFAULT 'open',
    title TEXT NOT NULL,
    description TEXT,
    affected_url TEXT,
    affected_query TEXT,
    affected_date DATE,
    metric_value DECIMAL(15, 4),
    threshold_value DECIMAL(15, 4),
    comparison_period TEXT,
    details JSONB DEFAULT '{}',
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. SYNC STATE & JOB TRACKING
-- ============================================================================

-- Track sync jobs and progress
CREATE TABLE IF NOT EXISTS gsc_sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    rows_fetched INTEGER DEFAULT 0,
    rows_inserted INTEGER DEFAULT 0,
    rows_updated INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    error_details JSONB DEFAULT '[]',
    progress_percent INTEGER DEFAULT 0,
    current_dimension TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Track last sync state per dimension
CREATE TABLE IF NOT EXISTS gsc_sync_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    dimension TEXT NOT NULL,
    last_synced_date DATE,
    last_sync_at TIMESTAMPTZ,
    next_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_property, dimension)
);

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_gsc_site_metrics_date ON gsc_site_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_site_metrics_lookup ON gsc_site_metrics(site_property, date, search_type);

CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_date ON gsc_page_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_normalized ON gsc_page_metrics(normalized_url);
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_lookup ON gsc_page_metrics(site_property, date, search_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_clicks ON gsc_page_metrics(clicks DESC);

CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_date ON gsc_query_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_query ON gsc_query_metrics(query);
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_lookup ON gsc_query_metrics(site_property, date, search_type);
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_impressions ON gsc_query_metrics(impressions DESC);

CREATE INDEX IF NOT EXISTS idx_gsc_page_query_date ON gsc_page_query_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_lookup ON gsc_page_query_metrics(site_property, date, search_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_query ON gsc_page_query_metrics(query);
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_url ON gsc_page_query_metrics(normalized_url);

CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_normalized ON gsc_url_registry(normalized_url);
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_language ON gsc_url_registry(language);
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_legacy ON gsc_url_registry(is_legacy_cms) WHERE is_legacy_cms = TRUE;
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_group ON gsc_url_registry(canonical_group_id);

CREATE INDEX IF NOT EXISTS idx_gsc_site_agg_lookup ON gsc_site_aggregates(site_property, computed_date DESC, window_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_agg_lookup ON gsc_page_aggregates(site_property, computed_date DESC, window_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_agg_losers ON gsc_page_aggregates(is_loser) WHERE is_loser = TRUE;
CREATE INDEX IF NOT EXISTS idx_gsc_query_agg_lookup ON gsc_query_aggregates(site_property, computed_date DESC, window_type);
CREATE INDEX IF NOT EXISTS idx_gsc_query_agg_cannibalized ON gsc_query_aggregates(is_cannibalized) WHERE is_cannibalized = TRUE;

CREATE INDEX IF NOT EXISTS idx_gsc_alerts_status ON gsc_alerts(status);
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_type ON gsc_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_created ON gsc_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_open ON gsc_alerts(status, created_at DESC) WHERE status = 'open';

-- ============================================================================
-- 7. DEFAULT ALERT RULES
-- ============================================================================

INSERT INTO gsc_alert_rules (name, description, alert_type, severity, thresholds) VALUES
('Duplicate URL Detection', 'Detects URLs with multiple variants receiving impressions', 'duplicate_urls', 'warning', '{"min_impressions": 10, "min_variants": 2}'::jsonb),
('Legacy CMS URL Alert', 'Alerts when legacy /cms/ URLs are still receiving traffic', 'legacy_cms', 'critical', '{"min_impressions": 1}'::jsonb),
('Query Cannibalization', 'Detects queries ranking for multiple pages', 'cannibalization', 'warning', '{"min_pages": 2, "min_impressions": 50}'::jsonb),
('Performance Drop WoW', 'Week-over-week traffic drops', 'performance_drop', 'warning', '{"threshold_pct": -20, "min_clicks": 50}'::jsonb),
('Performance Drop MoM', 'Month-over-month traffic drops', 'performance_drop', 'critical', '{"threshold_pct": -30, "min_clicks": 100}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE gsc_site_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_page_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_query_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_page_query_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_device_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_country_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_search_appearance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_url_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_canonical_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_site_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_page_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_query_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_sync_state ENABLE ROW LEVEL SECURITY;

-- Admin read access for all GSC tables
CREATE POLICY "Admins can read gsc_site_metrics" ON gsc_site_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_page_metrics" ON gsc_page_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_query_metrics" ON gsc_query_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_page_query_metrics" ON gsc_page_query_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_device_metrics" ON gsc_device_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_country_metrics" ON gsc_country_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_search_appearance_metrics" ON gsc_search_appearance_metrics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_url_registry" ON gsc_url_registry FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_canonical_groups" ON gsc_canonical_groups FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_site_aggregates" ON gsc_site_aggregates FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_page_aggregates" ON gsc_page_aggregates FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_query_aggregates" ON gsc_query_aggregates FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_alert_rules" ON gsc_alert_rules FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_alerts" ON gsc_alerts FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_sync_jobs" ON gsc_sync_jobs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read gsc_sync_state" ON gsc_sync_state FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Admins can manage alerts
CREATE POLICY "Admins can update gsc_alerts" ON gsc_alerts FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage gsc_alert_rules" ON gsc_alert_rules FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Service role full access for edge functions
CREATE POLICY "Service role gsc_site_metrics" ON gsc_site_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_page_metrics" ON gsc_page_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_query_metrics" ON gsc_query_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_page_query_metrics" ON gsc_page_query_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_device_metrics" ON gsc_device_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_country_metrics" ON gsc_country_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_search_appearance_metrics" ON gsc_search_appearance_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_url_registry" ON gsc_url_registry FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_canonical_groups" ON gsc_canonical_groups FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_site_aggregates" ON gsc_site_aggregates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_page_aggregates" ON gsc_page_aggregates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_query_aggregates" ON gsc_query_aggregates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_alert_rules" ON gsc_alert_rules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_alerts" ON gsc_alerts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_sync_jobs" ON gsc_sync_jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role gsc_sync_state" ON gsc_sync_state FOR ALL USING (auth.role() = 'service_role');