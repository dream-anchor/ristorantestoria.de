-- ============================================================================
-- GSC Monitoring Schema - Complete Data Model
-- Created: 2024-02-06
-- Description: Tables for Google Search Console data ingestion, normalization,
--              aggregation, anomaly detection, and alerting.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For text similarity matching

-- ============================================================================
-- 1. RAW DATA TABLES
-- ============================================================================

-- Site-level daily metrics (aggregated from GSC)
CREATE TABLE IF NOT EXISTS gsc_site_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    date DATE NOT NULL,
    search_type TEXT NOT NULL DEFAULT 'web', -- web, image, video, news
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
    device TEXT NOT NULL, -- DESKTOP, MOBILE, TABLET
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
    country TEXT NOT NULL, -- ISO 3166-1 alpha-3 code
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
    search_appearance TEXT NOT NULL, -- RICHCARD, REVIEW_SNIPPET, FAQ, etc.
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

-- URL registry with normalization metadata
CREATE TABLE IF NOT EXISTS gsc_url_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_url TEXT NOT NULL UNIQUE,
    normalized_url TEXT NOT NULL,
    canonical_group_id UUID,
    -- URL variants
    host_variant TEXT, -- www, non-www
    protocol_variant TEXT, -- http, https
    trailing_slash_variant BOOLEAN DEFAULT FALSE,
    -- Classification
    is_legacy_cms BOOLEAN DEFAULT FALSE,
    is_pdf BOOLEAN DEFAULT FALSE,
    is_image BOOLEAN DEFAULT FALSE,
    -- Language detection
    language TEXT, -- de, en, it, fr
    route_key TEXT, -- Internal route identifier
    -- First/last seen
    first_seen DATE NOT NULL DEFAULT CURRENT_DATE,
    last_seen DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Metrics summary (updated by aggregation job)
    total_clicks INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    avg_position DECIMAL(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Canonical URL groups (for duplicate detection)
CREATE TABLE IF NOT EXISTS gsc_canonical_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_url TEXT NOT NULL,
    variant_count INTEGER DEFAULT 1,
    is_duplicate_issue BOOLEAN DEFAULT FALSE,
    total_clicks INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    primary_variant TEXT, -- The main URL that should be used
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key after both tables exist
ALTER TABLE gsc_url_registry
    ADD CONSTRAINT fk_canonical_group
    FOREIGN KEY (canonical_group_id)
    REFERENCES gsc_canonical_groups(id) ON DELETE SET NULL;

-- ============================================================================
-- 3. AGGREGATED METRICS (ROLLING WINDOWS)
-- ============================================================================

-- Site-level rolling aggregates
CREATE TABLE IF NOT EXISTS gsc_site_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    computed_date DATE NOT NULL, -- Date when this aggregate was computed
    window_type TEXT NOT NULL, -- 7d, 28d, 90d
    search_type TEXT NOT NULL DEFAULT 'web',
    -- Aggregated metrics
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    avg_ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    avg_position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    -- Comparison deltas (vs previous period)
    delta_clicks_wow INTEGER, -- Week over Week
    delta_impressions_wow INTEGER,
    delta_ctr_wow DECIMAL(10, 6),
    delta_position_wow DECIMAL(10, 2),
    delta_clicks_mom INTEGER, -- Month over Month
    delta_impressions_mom INTEGER,
    delta_ctr_mom DECIMAL(10, 6),
    delta_position_mom DECIMAL(10, 2),
    -- Percentage changes
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
    -- Aggregated metrics
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    avg_ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    avg_position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    -- Deltas
    delta_clicks_wow INTEGER,
    delta_impressions_wow INTEGER,
    delta_position_wow DECIMAL(10, 2),
    delta_clicks_mom INTEGER,
    delta_impressions_mom INTEGER,
    delta_position_mom DECIMAL(10, 2),
    -- Percentage changes
    pct_change_clicks_wow DECIMAL(10, 2),
    pct_change_impressions_wow DECIMAL(10, 2),
    pct_change_clicks_mom DECIMAL(10, 2),
    pct_change_impressions_mom DECIMAL(10, 2),
    -- Flags
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
    -- Aggregated metrics
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    avg_ctr DECIMAL(10, 6) NOT NULL DEFAULT 0,
    avg_position DECIMAL(10, 2) NOT NULL DEFAULT 0,
    -- Cannibalization data
    ranking_page_count INTEGER DEFAULT 1,
    top_page_url TEXT,
    is_cannibalized BOOLEAN DEFAULT FALSE,
    -- Deltas
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
    alert_type TEXT NOT NULL, -- duplicate_urls, legacy_cms, cannibalization, performance_drop, appearance_loss
    severity TEXT NOT NULL DEFAULT 'warning', -- info, warning, critical
    is_enabled BOOLEAN DEFAULT TRUE,
    -- Thresholds (JSON for flexibility)
    thresholds JSONB NOT NULL DEFAULT '{}',
    -- Notification settings
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
    status TEXT NOT NULL DEFAULT 'open', -- open, acknowledged, resolved, dismissed
    title TEXT NOT NULL,
    description TEXT,
    -- Affected entities
    affected_url TEXT,
    affected_query TEXT,
    affected_date DATE,
    -- Metrics context
    metric_value DECIMAL(15, 4),
    threshold_value DECIMAL(15, 4),
    comparison_period TEXT, -- wow, mom
    -- Details (JSON for flexibility)
    details JSONB DEFAULT '{}',
    -- Resolution
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
    job_type TEXT NOT NULL, -- backfill, daily_sync, manual_sync
    status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    -- Date range processed
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    -- Statistics
    rows_fetched INTEGER DEFAULT 0,
    rows_inserted INTEGER DEFAULT 0,
    rows_updated INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    error_details JSONB DEFAULT '[]',
    -- Progress tracking
    progress_percent INTEGER DEFAULT 0,
    current_dimension TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Track last sync state per dimension
CREATE TABLE IF NOT EXISTS gsc_sync_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_property TEXT NOT NULL DEFAULT 'sc-domain:ristorantestoria.de',
    dimension TEXT NOT NULL, -- site, page, query, page_query, device, country, searchAppearance
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

-- Site metrics indexes
CREATE INDEX IF NOT EXISTS idx_gsc_site_metrics_date ON gsc_site_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_site_metrics_lookup ON gsc_site_metrics(site_property, date, search_type);

-- Page metrics indexes
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_date ON gsc_page_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_normalized ON gsc_page_metrics(normalized_url);
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_lookup ON gsc_page_metrics(site_property, date, search_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_metrics_clicks ON gsc_page_metrics(clicks DESC);

-- Query metrics indexes
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_date ON gsc_query_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_query ON gsc_query_metrics(query);
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_lookup ON gsc_query_metrics(site_property, date, search_type);
CREATE INDEX IF NOT EXISTS idx_gsc_query_metrics_impressions ON gsc_query_metrics(impressions DESC);

-- Page-Query metrics indexes
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_date ON gsc_page_query_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_lookup ON gsc_page_query_metrics(site_property, date, search_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_query ON gsc_page_query_metrics(query);
CREATE INDEX IF NOT EXISTS idx_gsc_page_query_url ON gsc_page_query_metrics(normalized_url);

-- URL registry indexes
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_normalized ON gsc_url_registry(normalized_url);
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_language ON gsc_url_registry(language);
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_legacy ON gsc_url_registry(is_legacy_cms) WHERE is_legacy_cms = TRUE;
CREATE INDEX IF NOT EXISTS idx_gsc_url_registry_group ON gsc_url_registry(canonical_group_id);

-- Aggregates indexes
CREATE INDEX IF NOT EXISTS idx_gsc_site_agg_lookup ON gsc_site_aggregates(site_property, computed_date DESC, window_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_agg_lookup ON gsc_page_aggregates(site_property, computed_date DESC, window_type);
CREATE INDEX IF NOT EXISTS idx_gsc_page_agg_losers ON gsc_page_aggregates(is_loser) WHERE is_loser = TRUE;
CREATE INDEX IF NOT EXISTS idx_gsc_query_agg_lookup ON gsc_query_aggregates(site_property, computed_date DESC, window_type);
CREATE INDEX IF NOT EXISTS idx_gsc_query_agg_cannibalized ON gsc_query_aggregates(is_cannibalized) WHERE is_cannibalized = TRUE;

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_status ON gsc_alerts(status);
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_type ON gsc_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_created ON gsc_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_alerts_open ON gsc_alerts(status, created_at DESC) WHERE status = 'open';

-- ============================================================================
-- 7. DEFAULT ALERT RULES
-- ============================================================================

INSERT INTO gsc_alert_rules (name, description, alert_type, severity, thresholds) VALUES
('Duplicate URL Detection', 'Detects URLs with multiple variants (http/https, www/non-www) receiving impressions', 'duplicate_urls', 'warning',
 '{"min_impressions": 10, "min_variants": 2}'::jsonb),
('Legacy CMS Detection', 'Alerts when /cms/* URLs receive any impressions', 'legacy_cms', 'critical',
 '{"min_impressions": 1, "url_pattern": "/cms/"}'::jsonb),
('Query Cannibalization', 'Detects queries where 2+ pages rank with significant impressions', 'cannibalization', 'warning',
 '{"min_pages": 2, "min_impressions_per_page": 50, "position_gap_threshold": 5}'::jsonb),
('Clicks Drop WoW', 'Major click decrease week over week', 'performance_drop', 'warning',
 '{"metric": "clicks", "period": "wow", "min_drop_pct": 25, "min_absolute_drop": 50}'::jsonb),
('Clicks Drop MoM', 'Major click decrease month over month', 'performance_drop', 'critical',
 '{"metric": "clicks", "period": "mom", "min_drop_pct": 40, "min_absolute_drop": 100}'::jsonb),
('Position Regression', 'Average position worsened significantly', 'performance_drop', 'warning',
 '{"metric": "position", "period": "wow", "min_position_increase": 3}'::jsonb),
('Rich Result Loss', 'Lost rich result eligibility', 'appearance_loss', 'warning',
 '{"appearance_types": ["REVIEW_SNIPPET", "FAQ", "PRODUCT"], "min_previous_impressions": 100}'::jsonb),
('Impressions Crash', 'Sudden impressions drop (potential indexing issue)', 'performance_drop', 'critical',
 '{"metric": "impressions", "period": "wow", "min_drop_pct": 50, "min_absolute_drop": 500}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
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

-- Admin-only read/write policies (using existing has_role function)
-- Note: Adjust these based on your actual auth setup

CREATE POLICY "Admin can read GSC site metrics" ON gsc_site_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read GSC page metrics" ON gsc_page_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read GSC query metrics" ON gsc_query_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read GSC page query metrics" ON gsc_page_query_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read GSC device metrics" ON gsc_device_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read GSC country metrics" ON gsc_country_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read GSC search appearance metrics" ON gsc_search_appearance_metrics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read URL registry" ON gsc_url_registry
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read canonical groups" ON gsc_canonical_groups
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read site aggregates" ON gsc_site_aggregates
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read page aggregates" ON gsc_page_aggregates
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read query aggregates" ON gsc_query_aggregates
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read alert rules" ON gsc_alert_rules
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can manage alerts" ON gsc_alerts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read sync jobs" ON gsc_sync_jobs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can read sync state" ON gsc_sync_state
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Service role bypass (for Edge Functions)
-- Note: Service role key bypasses RLS by default

-- ============================================================================
-- 9. HELPER FUNCTIONS
-- ============================================================================

-- Function to normalize URLs
CREATE OR REPLACE FUNCTION normalize_url(raw_url TEXT)
RETURNS TEXT AS $$
DECLARE
    normalized TEXT;
BEGIN
    normalized := raw_url;

    -- Remove protocol
    normalized := regexp_replace(normalized, '^https?://', '');

    -- Remove www
    normalized := regexp_replace(normalized, '^www\.', '');

    -- Remove trailing slash
    normalized := regexp_replace(normalized, '/$', '');

    -- Lowercase
    normalized := lower(normalized);

    -- Remove common tracking parameters
    normalized := regexp_replace(normalized, '\?.*$', '');

    RETURN normalized;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract language from URL
CREATE OR REPLACE FUNCTION extract_url_language(url TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Check for language prefix
    IF url ~ '/(en|it|fr)(/|$)' THEN
        RETURN (regexp_match(url, '/(en|it|fr)(/|$)'))[1];
    ELSE
        RETURN 'de'; -- Default German
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to detect URL variant info
CREATE OR REPLACE FUNCTION analyze_url_variants(raw_url TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    result := jsonb_build_object(
        'host_variant', CASE
            WHEN raw_url ~ '^https?://www\.' THEN 'www'
            ELSE 'non-www'
        END,
        'protocol_variant', CASE
            WHEN raw_url ~ '^https://' THEN 'https'
            WHEN raw_url ~ '^http://' THEN 'http'
            ELSE 'unknown'
        END,
        'trailing_slash', raw_url ~ '/$',
        'is_legacy_cms', raw_url ~ '/cms/',
        'is_pdf', raw_url ~ '\.pdf$',
        'language', extract_url_language(raw_url)
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate percentage change
CREATE OR REPLACE FUNCTION calc_pct_change(current_val NUMERIC, previous_val NUMERIC)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
    IF previous_val IS NULL OR previous_val = 0 THEN
        RETURN NULL;
    END IF;
    RETURN ROUND(((current_val - previous_val) / previous_val * 100)::DECIMAL, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE gsc_site_metrics IS 'Daily site-level metrics from Google Search Console';
COMMENT ON TABLE gsc_page_metrics IS 'Daily page-level metrics with raw and normalized URLs';
COMMENT ON TABLE gsc_query_metrics IS 'Daily query-level metrics for search term performance';
COMMENT ON TABLE gsc_page_query_metrics IS 'Cross metrics for page-query combinations (cannibalization detection)';
COMMENT ON TABLE gsc_device_metrics IS 'Daily metrics split by device type';
COMMENT ON TABLE gsc_country_metrics IS 'Daily metrics split by country';
COMMENT ON TABLE gsc_search_appearance_metrics IS 'Rich result and search appearance tracking';
COMMENT ON TABLE gsc_url_registry IS 'Registry of all discovered URLs with normalization metadata';
COMMENT ON TABLE gsc_canonical_groups IS 'Groups of URL variants that should be consolidated';
COMMENT ON TABLE gsc_site_aggregates IS 'Rolling window aggregates at site level';
COMMENT ON TABLE gsc_page_aggregates IS 'Rolling window aggregates at page level';
COMMENT ON TABLE gsc_query_aggregates IS 'Rolling window aggregates at query level with cannibalization flags';
COMMENT ON TABLE gsc_alert_rules IS 'Configurable alert rule definitions';
COMMENT ON TABLE gsc_alerts IS 'Triggered alert instances';
COMMENT ON TABLE gsc_sync_jobs IS 'Tracking for data sync jobs';
COMMENT ON TABLE gsc_sync_state IS 'Last sync state per dimension';
