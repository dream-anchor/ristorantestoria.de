-- Migration 005: min_image_repetition_days auf gbp_theme_clusters
-- Regelt wie oft dasselbe Bild pro Cluster eingesetzt werden darf.
-- Basis: Anzahl passender Bilder (required_tags && gbp_images.tags).
--   1 Bild  → 14 Tage (cilento_hintergrund: nur domenico-speranza.webp)
--   3+ Bilder → 28 Tage (alle anderen Cluster)
-- Idempotent.

ALTER TABLE gbp_theme_clusters
  ADD COLUMN IF NOT EXISTS min_image_repetition_days INTEGER DEFAULT 21;

UPDATE gbp_theme_clusters SET min_image_repetition_days = 14 WHERE cluster_id = 'cilento_hintergrund';
UPDATE gbp_theme_clusters SET min_image_repetition_days = 28 WHERE cluster_id != 'cilento_hintergrund';
