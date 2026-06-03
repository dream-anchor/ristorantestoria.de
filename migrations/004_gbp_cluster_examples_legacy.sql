-- Migration 004: examples_legacy-Spalte als Backup vor Phase-2-Rewrite
-- Sichert die aktuellen examples in examples_legacy (rollback-fähig).
-- Idempotent: überschreibt examples_legacy nur wenn noch NULL.

ALTER TABLE gbp_theme_clusters
  ADD COLUMN IF NOT EXISTS examples_legacy TEXT[];

-- Backup: nur setzen wenn noch nicht befüllt
UPDATE gbp_theme_clusters
  SET examples_legacy = examples
  WHERE examples_legacy IS NULL AND examples IS NOT NULL;
