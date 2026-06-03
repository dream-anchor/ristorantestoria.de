-- Rollback 004: examples aus examples_legacy wiederherstellen + Spalte entfernen
UPDATE gbp_theme_clusters
  SET examples = examples_legacy
  WHERE examples_legacy IS NOT NULL;

ALTER TABLE gbp_theme_clusters DROP COLUMN IF EXISTS examples_legacy;
