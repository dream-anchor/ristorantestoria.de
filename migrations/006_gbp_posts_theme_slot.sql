-- Migration 006: theme_slot auf gbp_posts + Pool-B-Lücke Option A
-- 1. Neue Spalte theme_slot mit CHECK-Constraint
-- 2. Backfill aller 13 Posts
-- 3. Pool-B-Terrasse-Posts: season='allyear' (überdacht + Raucher → faktisch ganzjährig)
-- Idempotent.

ALTER TABLE gbp_posts
  ADD COLUMN IF NOT EXISTS theme_slot TEXT
    CHECK (theme_slot IN ('lunch', 'brand', 'lifestyle', 'event'));

-- Pool A
UPDATE gbp_posts SET theme_slot = 'lunch'     WHERE pool = 'A' AND title = 'Mittagsmenü Wochenstart'   AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'A' AND title = 'Late Night Aperitivo'       AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lunch'     WHERE pool = 'A' AND title = 'Italienisches Frühstück'    AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'A' AND title = 'Wochenend-Reservierung'     AND theme_slot IS NULL;

-- Pool B
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'B' AND body LIKE 'Wetterfest genießen%'     AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'B' AND body LIKE 'Trüffel-Saison%'          AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'B' AND body LIKE '4-Gänge-Menü Mare%'       AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'event'     WHERE pool = 'B' AND body LIKE 'Firmenfeier in München%'  AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'event'     WHERE pool = 'B' AND body LIKE 'Adventszeit%'             AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'B' AND body LIKE 'Pizza Napoletana%'        AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'B' AND body LIKE 'Überdachte Terrasse%'     AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'event'     WHERE pool = 'B' AND body LIKE 'Geburtstag, Jubiläum%'    AND theme_slot IS NULL;
UPDATE gbp_posts SET theme_slot = 'lifestyle' WHERE pool = 'B' AND body LIKE 'Über 60 Weine%'           AND theme_slot IS NULL;

-- Pool-B-Lücke Option A: überdachte Terrasse ist faktisch ganzjährig nutzbar
-- (Schiebedach, wetterfest, Raucher — kein saisonaler Bezug nötig)
UPDATE gbp_posts SET season = 'allyear' WHERE pool = 'B' AND body LIKE 'Wetterfest genießen%';
UPDATE gbp_posts SET season = 'allyear' WHERE pool = 'B' AND body LIKE 'Überdachte Terrasse%';
