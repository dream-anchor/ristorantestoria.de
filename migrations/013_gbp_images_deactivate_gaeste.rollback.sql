-- ROLLBACK Migration 013
UPDATE gbp_images SET is_active = TRUE WHERE filename = 'gaeste-terrasse-italiener-maxvorstadt-muenchen.webp';
