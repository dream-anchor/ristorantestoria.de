-- ROLLBACK Migration 014
UPDATE gbp_images SET is_active = TRUE WHERE filename = 'pasta.webp';
