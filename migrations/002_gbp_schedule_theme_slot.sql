-- Migration 002: theme_slot-Spalte zu gbp_schedule hinzufügen
-- CHECK-Constraint: lunch | brand | lifestyle | event
-- Backfill nach Wochentag: mon→lunch, wed→brand, fri→lifestyle
-- Idempotent.

ALTER TABLE gbp_schedule
  ADD COLUMN IF NOT EXISTS theme_slot TEXT
    CHECK (theme_slot IN ('lunch', 'brand', 'lifestyle', 'event'));

UPDATE gbp_schedule SET theme_slot = 'lunch'     WHERE weekday = 'mon' AND theme_slot IS NULL;
UPDATE gbp_schedule SET theme_slot = 'brand'     WHERE weekday = 'wed' AND theme_slot IS NULL;
UPDATE gbp_schedule SET theme_slot = 'lifestyle' WHERE weekday = 'fri' AND theme_slot IS NULL;
-- Samstag (zukünftig möglich): event
