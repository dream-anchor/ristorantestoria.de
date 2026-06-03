-- Rollback 005: min_image_repetition_days aus gbp_theme_clusters entfernen
ALTER TABLE gbp_theme_clusters DROP COLUMN IF EXISTS min_image_repetition_days;
