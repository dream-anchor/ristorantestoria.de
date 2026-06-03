-- Rollback 007: examples aus examples_legacy wiederherstellen
UPDATE gbp_theme_clusters
  SET examples = examples_legacy
  WHERE examples_legacy IS NOT NULL;
