-- ROLLBACK Migration 015

UPDATE gbp_images SET is_active = TRUE
WHERE filename = 'firmenfeier-eventlocation-storia-muenchen.webp';

UPDATE gbp_images SET is_active = TRUE
WHERE filename = 'weihnachtsfeier-italiener-storia-muenchen.webp';

UPDATE gbp_images
SET season = 'winter',
    tags   = ARRAY['innenraum', 'dinner', 'event']
WHERE filename = 'silvester-dinner-gala-storia-muenchen.webp';

UPDATE gbp_posts
SET image_tags = ARRAY['pasta', 'handwerk']
WHERE id = 14;
