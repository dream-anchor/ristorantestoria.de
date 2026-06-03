-- Migration 014: pasta.webp deaktivieren
-- Grund: KI-generiert — bestätigt von Antoine (2026-05-09)
UPDATE gbp_images SET is_active = FALSE WHERE filename = 'pasta.webp';
