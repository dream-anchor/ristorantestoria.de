-- Migration 001: Kontrolliertes Tag-Vokabular für gbp_images + gbp_posts
-- Controlled vocabulary: terrasse, innenraum, bar, fassade | lunch, aperitivo, dinner, event, firmenfeier, geburtstag, romantic
--                        pasta, pizza, antipasti, dessert, wein, truffel | familie, mamma, team, gaeste | cilento, tradition, handwerk
-- Idempotent: Wiederholtes Ausführen setzt dieselben Werte.

-- 1. gbp_images: Tag-Update auf controlled vocab
UPDATE gbp_images SET tags = ARRAY['aperitivo','bar','dinner']::text[]       WHERE filename = 'aperitivo-muenchen-italienische-bar-storia.webp';
UPDATE gbp_images SET tags = ARRAY['fassade','terrasse']::text[]              WHERE filename = 'aussen.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','lunch']::text[]               WHERE filename = 'business-lunch-atmosphere.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','lunch']::text[]                   WHERE filename = 'business-lunch-food.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','lunch','innenraum']::text[]       WHERE filename = 'business-lunch-mittagessen-maxvorstadt-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['team','handwerk']::text[]                 WHERE filename = 'chefs.webp';
UPDATE gbp_images SET tags = ARRAY['bar','aperitivo','dinner']::text[]        WHERE filename = 'cocktails.webp';
UPDATE gbp_images SET tags = ARRAY['team','handwerk','tradition','cilento']::text[] WHERE filename = 'domenico-speranza.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','firmenfeier','event']::text[] WHERE filename = 'firmenfeier-event.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','firmenfeier','event']::text[] WHERE filename = 'firmenfeier-eventlocation-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','gaeste','dinner']::text[]      WHERE filename = 'gaeste-terrasse-italiener-maxvorstadt-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','geburtstag','event']::text[] WHERE filename = 'geburtstagsfeier-event.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','geburtstag','event']::text[] WHERE filename = 'geburtstagsfeier-restaurant-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['fassade','terrasse']::text[]              WHERE filename = 'haus-aussen-2.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','gaeste','dinner']::text[]      WHERE filename = 'italiener-koenigsplatz-terrasse-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['antipasti','dinner']::text[]              WHERE filename = 'meeresfruchte.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','gaeste','dinner']::text[]      WHERE filename = 'menschen-aussen.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','lunch','innenraum']::text[]       WHERE filename = 'mittagsmenue-pasta-lunch-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['pizza','handwerk']::text[]                WHERE filename = 'neapolitan-pizza-hero.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','team']::text[]       WHERE filename = 'nicola-speranza.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','handwerk']::text[]                WHERE filename = 'pasta.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','lunch']::text[]                   WHERE filename = 'ravioli-lunch.webp';
UPDATE gbp_images SET tags = ARRAY['pasta','handwerk']::text[]                WHERE filename = 'ravioli.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','romantic']::text[]   WHERE filename = 'romantisches-dinner-kerzenlicht-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','event']::text[]      WHERE filename = 'silvester-dinner-gala-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['terrasse','event','gaeste']::text[]       WHERE filename = 'sommerfest-event.webp';
UPDATE gbp_images SET tags = ARRAY['dessert','handwerk']::text[]              WHERE filename = 'tiramisu.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','event']::text[]      WHERE filename = 'weihnachtsfeier-event.webp';
UPDATE gbp_images SET tags = ARRAY['innenraum','dinner','event']::text[]      WHERE filename = 'weihnachtsfeier-italiener-storia-muenchen.webp';
UPDATE gbp_images SET tags = ARRAY['bar','wein','dinner']::text[]             WHERE filename = 'weinservice.webp';
UPDATE gbp_images SET tags = ARRAY['dinner','handwerk']::text[]               WHERE filename = 'wild-venison-hero.webp';

-- 2. gbp_posts: image_tags auf controlled vocab aktualisieren
-- Pool A
UPDATE gbp_posts SET image_tags = ARRAY['pasta','lunch','innenraum']::text[]
  WHERE pool = 'A' AND title = 'Mittagsmenü Wochenstart';
UPDATE gbp_posts SET image_tags = ARRAY['bar','aperitivo','dinner']::text[]
  WHERE pool = 'A' AND title = 'Late Night Aperitivo';
UPDATE gbp_posts SET image_tags = ARRAY['innenraum','lunch']::text[]
  WHERE pool = 'A' AND title = 'Italienisches Frühstück';
UPDATE gbp_posts SET image_tags = ARRAY['terrasse','innenraum','dinner']::text[]
  WHERE pool = 'A' AND title = 'Wochenend-Reservierung';

-- Pool B (identifiziert über body-Prefix)
UPDATE gbp_posts SET image_tags = ARRAY['terrasse','dinner','gaeste']::text[]
  WHERE pool = 'B' AND body LIKE 'Wetterfest genießen%';
UPDATE gbp_posts SET image_tags = ARRAY['pasta','dinner','innenraum']::text[]
  WHERE pool = 'B' AND body LIKE 'Trüffel-Saison%';
UPDATE gbp_posts SET image_tags = ARRAY['antipasti','dinner','innenraum']::text[]
  WHERE pool = 'B' AND body LIKE '4-Gänge-Menü Mare%';
UPDATE gbp_posts SET image_tags = ARRAY['innenraum','dinner','firmenfeier','event']::text[]
  WHERE pool = 'B' AND body LIKE 'Firmenfeier in München%';
UPDATE gbp_posts SET image_tags = ARRAY['pasta','dinner','innenraum']::text[]
  WHERE pool = 'B' AND body LIKE 'Adventszeit%';
UPDATE gbp_posts SET image_tags = ARRAY['pizza','dinner','innenraum']::text[]
  WHERE pool = 'B' AND body LIKE 'Pizza Napoletana%';
UPDATE gbp_posts SET image_tags = ARRAY['terrasse','gaeste','dinner']::text[]
  WHERE pool = 'B' AND body LIKE 'Überdachte Terrasse%';
UPDATE gbp_posts SET image_tags = ARRAY['innenraum','dinner','geburtstag','event']::text[]
  WHERE pool = 'B' AND body LIKE 'Geburtstag, Jubiläum%';
UPDATE gbp_posts SET image_tags = ARRAY['bar','wein','dinner']::text[]
  WHERE pool = 'B' AND body LIKE 'Über 60 Weine%';
