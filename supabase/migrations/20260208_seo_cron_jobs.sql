-- =============================================================================
-- SEO Cron Jobs
-- Täglicher SEO-Flow: GSC Sync → GSC Aggregate → SEO Pipeline → SEO Crawler
--
-- VORAUSSETZUNGEN:
--   1. pg_cron Extension muss aktiviert sein (Supabase Dashboard → Database → Extensions)
--   2. pg_net Extension muss aktiviert sein (für net.http_post)
--   3. Die Platzhalter unten MÜSSEN vor dem Ausführen ersetzt werden:
--      - YOUR_SUPABASE_URL  → z.B. https://abc123.supabase.co
--      - YOUR_CRON_SECRET   → Der Wert von SEO_CRON_SECRET (Supabase Secrets)
--
-- Alternativ: Cron-Jobs über das Supabase Dashboard unter
-- Database → pg_cron einrichten (selbe URLs und Headers verwenden).
-- =============================================================================

-- 1. GSC Sync: 06:00 UTC — Holt neue Search Console Daten
SELECT cron.schedule(
  'gsc-daily-sync',
  '0 6 * * *',
  $$SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/gsc-sync',
    body := '{"action": "daily_sync"}'::jsonb,
    headers := '{"Content-Type": "application/json", "x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  )$$
);

-- 2. GSC Aggregate: 06:10 UTC — Aggregiert GSC-Daten (Duplikate, Kannibalisierung)
SELECT cron.schedule(
  'gsc-daily-aggregate',
  '10 6 * * *',
  $$SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/gsc-aggregate',
    body := '{"action": "aggregate"}'::jsonb,
    headers := '{"Content-Type": "application/json", "x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  )$$
);

-- 3. SEO Pipeline: 06:15 UTC — Analysiert Daten, erstellt Alerts und Briefings
SELECT cron.schedule(
  'seo-daily-pipeline',
  '15 6 * * *',
  $$SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/seo-pipeline',
    body := '{}'::jsonb,
    headers := '{"Content-Type": "application/json", "x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  )$$
);

-- 4. SEO Crawler: 06:30 UTC — Crawlt alle Seiten, prüft technisches SEO
SELECT cron.schedule(
  'seo-daily-crawler',
  '30 6 * * *',
  $$SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/seo-crawler',
    body := '{"action": "full_crawl"}'::jsonb,
    headers := '{"Content-Type": "application/json", "x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  )$$
);
