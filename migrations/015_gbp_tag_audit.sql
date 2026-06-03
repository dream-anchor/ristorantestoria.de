-- Migration 015: Bild-Tag-Audit — 4 Korrekturen (Antoine-Freigabe 2026-05-09)

-- 1. Duplikat deaktivieren (identisch zu firmenfeier-event.webp)
UPDATE gbp_images SET is_active = FALSE
WHERE filename = 'firmenfeier-eventlocation-storia-muenchen.webp';

-- 2. Duplikat deaktivieren (identisch zu weihnachtsfeier-event.webp)
UPDATE gbp_images SET is_active = FALSE
WHERE filename = 'weihnachtsfeier-italiener-storia-muenchen.webp';

-- 3. silvester-dinner-gala: Saison + Tags korrigieren
--    (Bild zeigt Geburtstagsdeko/Innenraum, keine Silvester-Szene)
UPDATE gbp_images
SET season = 'allyear',
    tags   = ARRAY['innenraum', 'geburtstag', 'event']
WHERE filename = 'silvester-dinner-gala-storia-muenchen.webp';

-- 4. Post ID 14 (B/brand/1 "Handwerk"): image_tags ['pasta','handwerk'] → ['pasta','pizza']
--    Begründung: 'handwerk'-Tag führte zu tiramisu.webp; Post bewirbt Pasta+Pizza aus 400°C Ofen.
UPDATE gbp_posts
SET image_tags = ARRAY['pasta', 'pizza']
WHERE id = 14;
