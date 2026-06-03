-- Migration 012: is_active-Flag für gbp_images
-- Ermöglicht weiche Deaktivierung ohne Datenverlust.
-- chefs.webp sofort deaktiviert (KI-generiert bestätigt).

ALTER TABLE gbp_images ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE gbp_images SET is_active = FALSE WHERE filename = 'chefs.webp';
