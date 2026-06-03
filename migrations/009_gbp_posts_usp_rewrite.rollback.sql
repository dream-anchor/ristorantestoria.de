-- ROLLBACK Migration 009 — stellt body aus body_legacy wieder her
UPDATE gbp_posts SET body = body_legacy WHERE id IN (3, 4, 6, 7, 8, 9, 10, 11, 13) AND body_legacy IS NOT NULL;
