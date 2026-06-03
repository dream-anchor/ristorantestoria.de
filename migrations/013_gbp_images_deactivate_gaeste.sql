-- Migration 013: gaeste-terrasse-italiener-maxvorstadt-muenchen.webp deaktivieren
-- Grund: kein Brand-Match (nicht passend zum STORIA-Erscheinungsbild).
UPDATE gbp_images SET is_active = FALSE WHERE filename = 'gaeste-terrasse-italiener-maxvorstadt-muenchen.webp';
