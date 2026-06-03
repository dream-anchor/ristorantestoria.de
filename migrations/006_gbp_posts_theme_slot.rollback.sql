-- Rollback 006: theme_slot aus gbp_posts entfernen + Pool-B-season zurücksetzen
ALTER TABLE gbp_posts DROP COLUMN IF EXISTS theme_slot;

UPDATE gbp_posts SET season = 'summer' WHERE pool = 'B' AND body LIKE 'Wetterfest genießen%';
UPDATE gbp_posts SET season = 'summer' WHERE pool = 'B' AND body LIKE 'Überdachte Terrasse%';
