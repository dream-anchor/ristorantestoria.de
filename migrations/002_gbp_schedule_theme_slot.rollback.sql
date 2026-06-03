-- Rollback 002: theme_slot-Spalte aus gbp_schedule entfernen
ALTER TABLE gbp_schedule DROP COLUMN IF EXISTS theme_slot;
