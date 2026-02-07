
INSERT INTO public.seo_alert_rule (slug, name, description, scope, "window", metric, operator, threshold, base_severity, boost_money, is_enabled, cooldown_hours)
VALUES
  ('crawler_status_error', 'HTTP Status Error', 'Seite liefert 4xx oder 5xx Status Code', 'page', 'daily', 'status_code', 'gte', 400, 'critical', true, true, 24),
  ('crawler_redirect_chain', 'Redirect Chain', 'Mehr als 1 Redirect in der Kette', 'page', 'daily', 'redirect_count', 'gte', 2, 'high', true, true, 24),
  ('crawler_slow_response', 'Slow Response', 'Antwortzeit über 2 Sekunden', 'page', 'daily', 'response_time_ms', 'gte', 2000, 'medium', true, true, 24),
  ('crawler_canonical_mismatch', 'Canonical Mismatch', 'Canonical URL stimmt nicht mit Sitemap-URL überein', 'page', 'daily', 'canonical_match', 'eq', 0, 'high', true, true, 24),
  ('crawler_missing_title', 'Missing Title', 'Seite hat keinen oder leeren Title-Tag', 'page', 'daily', 'has_title', 'eq', 0, 'high', true, true, 24),
  ('crawler_noindex', 'Unerwartetes Noindex', 'Indexierbare Seite hat noindex Meta-Tag', 'page', 'daily', 'has_robots_noindex', 'eq', 1, 'critical', true, true, 24),
  ('crawler_missing_h1', 'Missing H1', 'Seite hat kein H1-Tag', 'page', 'daily', 'has_h1', 'eq', 0, 'medium', true, true, 24),
  ('crawler_missing_hreflang', 'Missing Hreflang', 'Mehrsprachige Seite ohne hreflang-Tags', 'page', 'daily', 'has_hreflang', 'eq', 0, 'medium', true, true, 24)
ON CONFLICT (slug) DO NOTHING;
