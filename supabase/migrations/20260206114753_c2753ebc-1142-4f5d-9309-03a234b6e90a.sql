
-- SEO Operations System - Complete Schema

-- ENUM types
CREATE TYPE public.seo_page_type AS ENUM ('money', 'pillar', 'cluster', 'trust', 'legal', 'legacy');
CREATE TYPE public.seo_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.seo_scope AS ENUM ('site', 'page', 'query', 'canonical_group', 'device', 'country', 'appearance');
CREATE TYPE public.seo_window AS ENUM ('daily', 'wow', 'mom');
CREATE TYPE public.seo_task_status AS ENUM ('open', 'in_progress', 'done', 'wont_fix');
CREATE TYPE public.seo_alert_status AS ENUM ('open', 'acknowledged', 'resolved', 'false_positive');
CREATE TYPE public.seo_prompt_area AS ENUM ('redirects', 'titles', 'content', 'schema', 'internal_linking', 'new_page', 'canonicalization', 'technical');

-- seo_page_catalog
CREATE TABLE public.seo_page_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  page_type public.seo_page_type NOT NULL DEFAULT 'cluster',
  canonical_url text,
  title_de text,
  title_en text,
  target_keywords text[] DEFAULT '{}',
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_page_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_page_catalog" ON public.seo_page_catalog FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage seo_page_catalog" ON public.seo_page_catalog FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- seo_alert_rule
CREATE TABLE public.seo_alert_rule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  scope public.seo_scope NOT NULL DEFAULT 'site',
  "window" public.seo_window NOT NULL DEFAULT 'wow',
  metric text NOT NULL,
  operator text NOT NULL DEFAULT 'lt',
  threshold numeric NOT NULL,
  base_severity public.seo_severity NOT NULL DEFAULT 'medium',
  boost_money boolean NOT NULL DEFAULT true,
  is_enabled boolean NOT NULL DEFAULT true,
  cooldown_hours integer NOT NULL DEFAULT 24,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_alert_rule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_alert_rule" ON public.seo_alert_rule FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage seo_alert_rule" ON public.seo_alert_rule FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- seo_alert_event
CREATE TABLE public.seo_alert_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES public.seo_alert_rule(id) ON DELETE CASCADE,
  status public.seo_alert_status NOT NULL DEFAULT 'open',
  severity public.seo_severity NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text,
  affected_path text,
  affected_query text,
  metric_name text,
  metric_value numeric,
  baseline_value numeric,
  pct_change numeric,
  "window" public.seo_window,
  detected_date date NOT NULL DEFAULT CURRENT_DATE,
  resolved_at timestamptz,
  resolved_by uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_alert_event ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_alert_event" ON public.seo_alert_event FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage seo_alert_event" ON public.seo_alert_event FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- seo_task
CREATE TABLE public.seo_task (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_event_id uuid REFERENCES public.seo_alert_event(id) ON DELETE SET NULL,
  status public.seo_task_status NOT NULL DEFAULT 'open',
  priority public.seo_severity NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text,
  affected_path text,
  prompt_pack_id uuid,
  assigned_to uuid,
  due_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_task ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_task" ON public.seo_task FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage seo_task" ON public.seo_task FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- seo_prompt_pack
CREATE TABLE public.seo_prompt_pack (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_event_id uuid REFERENCES public.seo_alert_event(id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.seo_task(id) ON DELETE SET NULL,
  area public.seo_prompt_area NOT NULL,
  title text NOT NULL,
  prompt_text text NOT NULL,
  context_data jsonb DEFAULT '{}',
  is_executed boolean NOT NULL DEFAULT false,
  executed_at timestamptz,
  result_summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_prompt_pack ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_prompt_pack" ON public.seo_prompt_pack FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage seo_prompt_pack" ON public.seo_prompt_pack FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- seo_daily_briefing
CREATE TABLE public.seo_daily_briefing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_date date NOT NULL UNIQUE,
  summary_de text,
  summary_en text,
  metrics_snapshot jsonb DEFAULT '{}',
  alerts_count integer DEFAULT 0,
  tasks_created integer DEFAULT 0,
  prompts_generated integer DEFAULT 0,
  pipeline_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_daily_briefing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_daily_briefing" ON public.seo_daily_briefing FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage seo_daily_briefing" ON public.seo_daily_briefing FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- seo_baseline_cache
CREATE TABLE public.seo_baseline_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope public.seo_scope NOT NULL,
  scope_key text NOT NULL,
  "window" public.seo_window NOT NULL,
  metric text NOT NULL,
  baseline_value numeric NOT NULL,
  sample_count integer DEFAULT 0,
  computed_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(scope, scope_key, "window", metric, computed_date)
);
ALTER TABLE public.seo_baseline_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_baseline_cache" ON public.seo_baseline_cache FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service manage seo_baseline_cache" ON public.seo_baseline_cache FOR ALL USING (auth.role() = 'service_role');

-- seo_pipeline_run
CREATE TABLE public.seo_pipeline_run (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  steps_completed text[] DEFAULT '{}',
  alerts_detected integer DEFAULT 0,
  tasks_created integer DEFAULT 0,
  prompts_generated integer DEFAULT 0,
  error_message text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_pipeline_run ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read seo_pipeline_run" ON public.seo_pipeline_run FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service manage seo_pipeline_run" ON public.seo_pipeline_run FOR ALL USING (auth.role() = 'service_role');

-- FK seo_task -> seo_prompt_pack
ALTER TABLE public.seo_task ADD CONSTRAINT seo_task_prompt_pack_id_fkey FOREIGN KEY (prompt_pack_id) REFERENCES public.seo_prompt_pack(id) ON DELETE SET NULL;

-- Helper Functions
CREATE OR REPLACE FUNCTION public.get_page_type(p_path text)
RETURNS public.seo_page_type LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE v_type public.seo_page_type;
BEGIN
  SELECT page_type INTO v_type FROM public.seo_page_catalog WHERE path = p_path AND is_active = true;
  IF FOUND THEN RETURN v_type; END IF;
  IF p_path ~ '^/(impressum|datenschutz|agb|haftungsausschluss|widerrufsbelehrung|cookie)' THEN RETURN 'legal';
  ELSIF p_path ~ '^/cms/' THEN RETURN 'legacy';
  ELSIF p_path IN ('/', '/speisekarte', '/reservierung') THEN RETURN 'money';
  ELSIF p_path ~ '^/(ueber-uns|kontakt|faq)' THEN RETURN 'trust';
  ELSIF p_path ~ '^/(italiener-koenigsplatz|neapolitanische-pizza|lunch-muenchen|romantisches-dinner|wild-essen|aperitivo|firmenfeier|geburtstagsfeier|eventlocation)' THEN RETURN 'pillar';
  ELSE RETURN 'cluster';
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.boost_severity(p_base public.seo_severity, p_page_type public.seo_page_type)
RETURNS public.seo_severity LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
BEGIN
  IF p_page_type IN ('money', 'pillar') THEN
    CASE p_base WHEN 'low' THEN RETURN 'medium'; WHEN 'medium' THEN RETURN 'high'; WHEN 'high' THEN RETURN 'critical'; ELSE RETURN 'critical'; END CASE;
  END IF;
  RETURN p_base;
END; $$;

CREATE OR REPLACE FUNCTION public.normalize_seo_path(p_url text)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE v_path text;
BEGIN
  v_path := regexp_replace(p_url, '^https?://[^/]+', '');
  IF length(v_path) > 1 THEN v_path := regexp_replace(v_path, '/$', ''); END IF;
  v_path := regexp_replace(v_path, '[?#].*$', '');
  v_path := lower(v_path);
  IF v_path = '' OR v_path IS NULL THEN v_path := '/'; END IF;
  RETURN v_path;
END; $$;

-- Triggers
CREATE TRIGGER update_seo_page_catalog_updated_at BEFORE UPDATE ON public.seo_page_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_alert_rule_updated_at BEFORE UPDATE ON public.seo_alert_rule FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_alert_event_updated_at BEFORE UPDATE ON public.seo_alert_event FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_task_updated_at BEFORE UPDATE ON public.seo_task FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_seo_alert_event_status ON public.seo_alert_event(status);
CREATE INDEX idx_seo_alert_event_detected ON public.seo_alert_event(detected_date DESC);
CREATE INDEX idx_seo_alert_event_rule ON public.seo_alert_event(rule_id);
CREATE INDEX idx_seo_task_status ON public.seo_task(status);
CREATE INDEX idx_seo_task_priority ON public.seo_task(priority);
CREATE INDEX idx_seo_baseline_lookup ON public.seo_baseline_cache(scope, scope_key, "window", metric);
CREATE INDEX idx_seo_pipeline_run_status ON public.seo_pipeline_run(status);
CREATE INDEX idx_seo_daily_briefing_date ON public.seo_daily_briefing(briefing_date DESC);

-- Seed: Alert Rules
INSERT INTO public.seo_alert_rule (slug, name, description, scope, "window", metric, operator, threshold, base_severity, boost_money, cooldown_hours) VALUES
  ('clicks-drop-wow', 'Klick-Einbruch (WoW)', 'Klicks sind WoW um mehr als 20% gefallen', 'site', 'wow', 'pct_change_clicks_wow', 'lt', -20, 'medium', true, 24),
  ('clicks-drop-mom', 'Klick-Einbruch (MoM)', 'Klicks sind MoM um mehr als 30% gefallen', 'site', 'mom', 'pct_change_clicks_mom', 'lt', -30, 'high', true, 72),
  ('impressions-drop-wow', 'Impressions-Einbruch (WoW)', 'Impressions sind WoW um mehr als 25% gefallen', 'site', 'wow', 'pct_change_impressions_wow', 'lt', -25, 'medium', true, 24),
  ('position-drop-wow', 'Positions-Verschlechterung (WoW)', 'Position hat sich WoW um >2 verschlechtert', 'site', 'wow', 'delta_position_wow', 'gt', 2, 'medium', true, 24),
  ('page-clicks-drop-wow', 'Seiten-Klick-Einbruch (WoW)', 'Klicks einer Seite WoW >30% gefallen', 'page', 'wow', 'pct_change_clicks_wow', 'lt', -30, 'medium', true, 48),
  ('page-clicks-drop-mom', 'Seiten-Klick-Einbruch (MoM)', 'Klicks einer Seite MoM >40% gefallen', 'page', 'mom', 'pct_change_clicks_mom', 'lt', -40, 'high', true, 72),
  ('page-position-drop', 'Seiten-Ranking-Verlust', 'Position einer Seite um >5 verschlechtert', 'page', 'wow', 'delta_position_wow', 'gt', 5, 'high', true, 48),
  ('query-cannibalization', 'Keyword-Kannibalisierung', 'Mehrere Seiten ranken für dasselbe Keyword', 'query', 'wow', 'ranking_page_count', 'gt', 1, 'medium', false, 168),
  ('duplicate-url', 'Duplicate URLs', 'URL-Varianten in GSC erkannt', 'canonical_group', 'daily', 'variant_count', 'gt', 1, 'medium', false, 168),
  ('legacy-cms-url', 'Legacy CMS URLs', 'Alte /cms/ URLs in GSC', 'page', 'daily', 'is_legacy_cms', 'eq', 1, 'high', false, 168),
  ('zero-clicks-page', 'Null-Klick-Seite', 'Seite hat Impressions aber keine Klicks', 'page', 'wow', 'total_clicks', 'eq', 0, 'low', true, 168),
  ('ctr-drop-wow', 'CTR-Einbruch (WoW)', 'CTR ist WoW um >30% gefallen', 'site', 'wow', 'pct_change_ctr_wow', 'lt', -30, 'medium', true, 48);

-- Seed: Page Catalog
INSERT INTO public.seo_page_catalog (path, page_type, title_de, target_keywords) VALUES
  ('/', 'money', 'Startseite', ARRAY['ristorante storia', 'italienisches restaurant münchen']),
  ('/speisekarte', 'money', 'Speisekarte', ARRAY['speisekarte', 'italienische küche münchen']),
  ('/reservierung', 'money', 'Reservierung', ARRAY['tisch reservieren', 'restaurant reservierung münchen']),
  ('/mittagsmenu', 'money', 'Mittagsmenü', ARRAY['mittagsmenü münchen', 'lunch münchen']),
  ('/ueber-uns', 'trust', 'Über Uns', ARRAY['über uns', 'storia münchen']),
  ('/kontakt', 'trust', 'Kontakt', ARRAY['kontakt', 'adresse storia']),
  ('/faq', 'trust', 'FAQ', ARRAY['häufige fragen', 'faq restaurant']),
  ('/italiener-koenigsplatz', 'pillar', 'Italiener Königsplatz', ARRAY['italiener königsplatz']),
  ('/neapolitanische-pizza-muenchen', 'pillar', 'Neapolitanische Pizza', ARRAY['neapolitanische pizza münchen']),
  ('/lunch-muenchen', 'pillar', 'Lunch München', ARRAY['lunch münchen']),
  ('/romantisches-dinner-muenchen', 'pillar', 'Romantisches Dinner', ARRAY['romantisches dinner münchen']),
  ('/wild-essen-muenchen', 'pillar', 'Wild essen', ARRAY['wild essen münchen']),
  ('/aperitivo-muenchen', 'pillar', 'Aperitivo', ARRAY['aperitivo münchen']),
  ('/firmenfeier-muenchen', 'pillar', 'Firmenfeier', ARRAY['firmenfeier münchen']),
  ('/geburtstagsfeier-muenchen', 'pillar', 'Geburtstagsfeier', ARRAY['geburtstagsfeier münchen']),
  ('/eventlocation-muenchen', 'pillar', 'Eventlocation', ARRAY['eventlocation münchen']),
  ('/besondere-anlaesse', 'cluster', 'Besondere Anlässe', ARRAY['besondere anlässe']),
  ('/catering', 'cluster', 'Catering', ARRAY['catering münchen']),
  ('/getraenke', 'cluster', 'Getränke', ARRAY['getränkekarte']),
  ('/impressum', 'legal', 'Impressum', ARRAY[]::text[]),
  ('/datenschutz', 'legal', 'Datenschutz', ARRAY[]::text[]),
  ('/agb-restaurant', 'legal', 'AGB Restaurant', ARRAY[]::text[]),
  ('/agb-gutscheine', 'legal', 'AGB Gutscheine', ARRAY[]::text[])
ON CONFLICT (path) DO NOTHING;
