-- Rollback 001: Stellt die Original-Tags aus seed-images.ts wieder her
-- Idempotent.

UPDATE gbp_images SET tags = ARRAY['aperitivo','bar','abend']::text[]                WHERE filename = 'aperitivo-muenchen-italienische-bar-storia.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','tageslicht','keine-personen']::text[]  WHERE filename = 'aussen.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','mittag','tageslicht']::text[]         WHERE filename = 'business-lunch-atmosphere.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','mittag','tageslicht']::text[]             WHERE filename = 'business-lunch-food.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','mittag','innenraum']::text[]              WHERE filename = 'business-lunch-mittagessen-maxvorstadt-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['kueche','keine-personen']::text[]                 WHERE filename = 'chefs.webp';
UPDATE gbp_images SET tags = ARRAY['bar','aperitivo','abend']::text[]                 WHERE filename = 'cocktails.webp';
UPDATE gbp_images SET tags = ARRAY['kueche']::text[]                                  WHERE filename = 'domenico-speranza.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'firmenfeier-event.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'firmenfeier-eventlocation-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','sommer','tageslicht']::text[]          WHERE filename = 'gaeste-terrasse-italiener-maxvorstadt-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'geburtstagsfeier-event.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'geburtstagsfeier-restaurant-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','tageslicht','keine-personen']::text[]  WHERE filename = 'haus-aussen-2.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','tageslicht','sommer']::text[]          WHERE filename = 'italiener-koenigsplatz-terrasse-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['fisch','keine-personen']::text[]                  WHERE filename = 'meeresfruchte.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','sommer','tageslicht']::text[]          WHERE filename = 'menschen-aussen.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','mittag','innenraum']::text[]              WHERE filename = 'mittagsmenue-pasta-lunch-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['pizza','keine-personen']::text[]                  WHERE filename = 'neapolitan-pizza-hero.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'nicola-speranza.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','keine-personen']::text[]                  WHERE filename = 'pasta.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','mittag']::text[]                          WHERE filename = 'ravioli-lunch.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','keine-personen']::text[]                  WHERE filename = 'ravioli.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend','warm']::text[]                WHERE filename = 'romantisches-dinner-kerzenlicht-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'silvester-dinner-gala-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','sommer']::text[]                       WHERE filename = 'sommerfest-event.webp';
UPDATE gbp_images SET tags = ARRAY['dolci','keine-personen']::text[]                  WHERE filename = 'tiramisu.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'weihnachtsfeier-event.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','abend']::text[]                       WHERE filename = 'weihnachtsfeier-italiener-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['bar','abend']::text[]                             WHERE filename = 'weinservice.webp';
UPDATE gbp_images SET tags = ARRAY['fleisch','keine-personen']::text[]                WHERE filename = 'wild-venison-hero.webp';

-- gbp_posts zurücksetzen
UPDATE gbp_posts SET image_tags = ARRAY['pasta','mittag','innenraum']::text[]  WHERE pool = 'A' AND title = 'Mittagsmenü Wochenstart';
UPDATE gbp_posts SET image_tags = ARRAY['bar','aperitivo','abend']::text[]     WHERE pool = 'A' AND title = 'Late Night Aperitivo';
UPDATE gbp_posts SET image_tags = ARRAY['innenraum','morgens','tageslicht']::text[] WHERE pool = 'A' AND title = 'Italienisches Frühstück';
UPDATE gbp_posts SET image_tags = ARRAY['terrasse','innenraum','abend']::text[] WHERE pool = 'A' AND title = 'Wochenend-Reservierung';
UPDATE gbp_posts SET image_tags = ARRAY['terrasse','sommer','abend']::text[]   WHERE pool = 'B' AND body LIKE 'Wetterfest genießen%';
UPDATE gbp_posts SET image_tags = ARRAY['pasta','abend','innenraum']::text[]   WHERE pool = 'B' AND body LIKE 'Trüffel-Saison%';
UPDATE gbp_posts SET image_tags = ARRAY['fisch','abend','innenraum']::text[]   WHERE pool = 'B' AND body LIKE '4-Gänge-Menü Mare%';
UPDATE gbp_posts SET image_tags = ARRAY['innenraum','abend']::text[]           WHERE pool = 'B' AND body LIKE 'Firmenfeier in München%';
UPDATE gbp_posts SET image_tags = ARRAY['pasta','abend','innenraum']::text[]   WHERE pool = 'B' AND body LIKE 'Adventszeit%';
UPDATE gbp_posts SET image_tags = ARRAY['pizza','abend','innenraum']::text[]   WHERE pool = 'B' AND body LIKE 'Pizza Napoletana%';
UPDATE gbp_posts SET image_tags = ARRAY['terrasse','sommer','tageslicht']::text[] WHERE pool = 'B' AND body LIKE 'Überdachte Terrasse%';
UPDATE gbp_posts SET image_tags = ARRAY['innenraum','abend']::text[]           WHERE pool = 'B' AND body LIKE 'Geburtstag, Jubiläum%';
UPDATE gbp_posts SET image_tags = ARRAY['bar','weinservice','abend']::text[]   WHERE pool = 'B' AND body LIKE 'Über 60 Weine%';
