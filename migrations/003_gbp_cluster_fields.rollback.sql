-- Rollback 003: Validierungs-Felder aus gbp_theme_clusters entfernen
ALTER TABLE gbp_theme_clusters
  DROP COLUMN IF EXISTS required_tags,
  DROP COLUMN IF EXISTS allowed_theme_slots,
  DROP COLUMN IF EXISTS min_chars,
  DROP COLUMN IF EXISTS max_chars,
  DROP COLUMN IF EXISTS must_include_usp,
  DROP COLUMN IF EXISTS must_include_geo_anchor;
