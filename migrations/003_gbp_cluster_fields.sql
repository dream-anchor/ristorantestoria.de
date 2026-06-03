-- Migration 003: Validierungs-Felder zu gbp_theme_clusters hinzufügen
-- + required_tags, allowed_theme_slots, min_chars, max_chars, must_include_usp, must_include_geo_anchor
-- + Befüllen aller 12 Cluster
-- Idempotent.

ALTER TABLE gbp_theme_clusters
  ADD COLUMN IF NOT EXISTS required_tags        TEXT[],
  ADD COLUMN IF NOT EXISTS allowed_theme_slots  TEXT[],
  ADD COLUMN IF NOT EXISTS min_chars            INTEGER DEFAULT 140,
  ADD COLUMN IF NOT EXISTS max_chars            INTEGER DEFAULT 280,
  ADD COLUMN IF NOT EXISTS must_include_usp     BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS must_include_geo_anchor BOOLEAN DEFAULT TRUE;

-- Cluster-Konfigurationen
UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['team','tradition']::text[],
  allowed_theme_slots = ARRAY['brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'mamma_anekdoten';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['team','handwerk']::text[],
  allowed_theme_slots = ARRAY['brand']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'mimmo_kueche';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['cilento','tradition']::text[],
  allowed_theme_slots = ARRAY['brand']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = FALSE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'cilento_hintergrund';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['innenraum']::text[],
  allowed_theme_slots = ARRAY['lunch','brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'karlstrasse_anker';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['team','innenraum']::text[],
  allowed_theme_slots = ARRAY['brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = FALSE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'personal_story';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['pasta','handwerk']::text[],
  allowed_theme_slots = ARRAY['brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'pasta_handarbeit';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['innenraum','dinner']::text[],
  allowed_theme_slots = ARRAY['lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'pinakothek_dinner';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['innenraum']::text[],
  allowed_theme_slots = ARRAY['brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = FALSE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'rezension_highlight';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['pizza','handwerk']::text[],
  allowed_theme_slots = ARRAY['brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'steinofenpizza_muenchen';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['terrasse']::text[],
  allowed_theme_slots = ARRAY['lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'terrasse_lifestyle';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['bar','wein']::text[],
  allowed_theme_slots = ARRAY['lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = FALSE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'weinbar_maxvorstadt';

UPDATE gbp_theme_clusters SET
  required_tags       = ARRAY['dinner','handwerk']::text[],
  allowed_theme_slots = ARRAY['brand','lifestyle']::text[],
  min_chars = 140, max_chars = 280, must_include_usp = TRUE, must_include_geo_anchor = TRUE
WHERE cluster_id = 'wild_kueche';
