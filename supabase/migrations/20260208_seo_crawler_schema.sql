-- =============================================================================
-- SEO Crawler Schema
-- Adds crawl run/result tables, indexes, RLS, and 8 crawler-specific alert rules
-- =============================================================================

-- seo_crawl_run: Tracks each crawl execution
CREATE TABLE IF NOT EXISTS public.seo_crawl_run (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running',
    urls_crawled INTEGER DEFAULT 0,
    issues_found INTEGER DEFAULT 0,
    alerts_created INTEGER DEFAULT 0,
    duration_ms INTEGER,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);
ALTER TABLE public.seo_crawl_run ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_crawl_run" ON public.seo_crawl_run FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service manage seo_crawl_run" ON public.seo_crawl_run FOR ALL USING (auth.role() = 'service_role');

-- seo_crawl_result: Per-URL results for each crawl run
CREATE TABLE IF NOT EXISTS public.seo_crawl_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crawl_run_id UUID NOT NULL REFERENCES public.seo_crawl_run(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    normalized_path TEXT NOT NULL,
    status_code INTEGER,
    redirect_count INTEGER DEFAULT 0,
    redirect_target TEXT,
    response_time_ms INTEGER,
    canonical_url TEXT,
    canonical_match BOOLEAN,
    has_title BOOLEAN,
    title_text TEXT,
    title_length INTEGER,
    has_meta_description BOOLEAN,
    has_h1 BOOLEAN,
    h1_count INTEGER,
    has_hreflang BOOLEAN,
    hreflang_count INTEGER,
    has_robots_noindex BOOLEAN,
    has_mixed_content BOOLEAN,
    issues JSONB DEFAULT '[]'::jsonb,
    crawled_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_crawl_result ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_crawl_result" ON public.seo_crawl_result FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service manage seo_crawl_result" ON public.seo_crawl_result FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX idx_crawl_run_status ON public.seo_crawl_run(status);
CREATE INDEX idx_crawl_run_started ON public.seo_crawl_run(started_at DESC);
CREATE INDEX idx_crawl_result_run ON public.seo_crawl_result(crawl_run_id);
CREATE INDEX idx_crawl_result_path ON public.seo_crawl_result(normalized_path);
CREATE INDEX idx_crawl_result_issues ON public.seo_crawl_result USING GIN(issues);
CREATE INDEX idx_crawl_result_status ON public.seo_crawl_result(status_code);

-- 8 Crawler-specific alert rules
INSERT INTO public.seo_alert_rule (slug, name, description, scope, "window", metric, operator, threshold, base_severity, boost_money, is_enabled, cooldown_hours)
VALUES
  ('crawler_status_error',       'HTTP Status Error',       'Seite liefert 4xx oder 5xx Status Code',                 'page', 'daily', 'status_code',          'gte', 400,  'critical', true, true, 24),
  ('crawler_redirect_chain',     'Redirect Chain',          'Mehr als 1 Redirect in der Kette',                       'page', 'daily', 'redirect_count',       'gte', 2,    'high',     true, true, 24),
  ('crawler_slow_response',      'Slow Response',           'Antwortzeit über 2 Sekunden',                            'page', 'daily', 'response_time_ms',     'gte', 2000, 'medium',   true, true, 24),
  ('crawler_canonical_mismatch', 'Canonical Mismatch',      'Canonical URL stimmt nicht mit Sitemap-URL überein',      'page', 'daily', 'canonical_match',      'eq',  0,    'high',     true, true, 24),
  ('crawler_missing_title',      'Missing Title',           'Seite hat keinen oder leeren Title-Tag',                  'page', 'daily', 'has_title',            'eq',  0,    'high',     true, true, 24),
  ('crawler_noindex',            'Unerwartetes Noindex',    'Indexierbare Seite hat noindex Meta-Tag',                 'page', 'daily', 'has_robots_noindex',   'eq',  1,    'critical', true, true, 24),
  ('crawler_missing_h1',         'Missing H1',              'Seite hat kein H1-Tag',                                   'page', 'daily', 'has_h1',              'eq',  0,    'medium',   true, true, 24),
  ('crawler_missing_hreflang',   'Missing Hreflang',        'Mehrsprachige Seite ohne hreflang-Tags',                  'page', 'daily', 'has_hreflang',        'eq',  0,    'medium',   true, true, 24)
ON CONFLICT (slug) DO NOTHING;
