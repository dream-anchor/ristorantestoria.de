-- ROLLBACK Migration 012
UPDATE gbp_images SET is_active = TRUE WHERE filename = 'chefs.webp';
ALTER TABLE gbp_images DROP COLUMN IF EXISTS is_active;
