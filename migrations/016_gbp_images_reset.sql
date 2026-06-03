-- Migration 016: Bild-Pool Reset — 26 alte deaktivieren, 22 neue inserieren
-- Antoine-Freigabe: 2026-05-09 | 6 Tag-Korrekturen eingearbeitet

-- 1. Alle bisherigen Einträge deaktivieren (Altdaten bleiben erhalten)
UPDATE gbp_images SET is_active = FALSE WHERE is_active = TRUE;

-- 2. 22 neue Bilder inserieren
-- Base-URL: https://ristorantestoria.de/gbp-images/<filename>

INSERT INTO gbp_images (filename, storage_url, tags, season, is_active) VALUES

-- FOOD
('calamari-gegrillt-rucola-cherrytomaten-vorspeise-meeresfruechte-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/calamari-gegrillt-rucola-cherrytomaten-vorspeise-meeresfruechte-storia-muenchen.webp',
 ARRAY['antipasti','dinner'], 'allyear', TRUE),

('pizza-margherita-mozzarella-basilikum-steinofen-pizzabaecker-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/pizza-margherita-mozzarella-basilikum-steinofen-pizzabaecker-storia-muenchen.webp',
 ARRAY['pizza','handwerk','team'], 'allyear', TRUE),

('ravioli-tomatensauce-pasta-fatta-in-casa-handarbeit-kueche-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/ravioli-tomatensauce-pasta-fatta-in-casa-handarbeit-kueche-storia-muenchen.webp',
 ARRAY['pasta','handwerk'], 'allyear', TRUE),

('tiramisu-dessert-weisseschokolade-segel-kumquat-platting-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/tiramisu-dessert-weisseschokolade-segel-kumquat-platting-storia-muenchen.webp',
 ARRAY['dessert'], 'allyear', TRUE),

('business-lunch-tisch-carbonara-ossobuco-gemeinsam-essen-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/business-lunch-tisch-carbonara-ossobuco-gemeinsam-essen-storia-muenchen.webp',
 ARRAY['lunch','pasta','innenraum'], 'allyear', TRUE),

('wild-rehruecken-blaubeeren-rotweinsauce-gemuese-hauptgang-feinschmecker-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/wild-rehruecken-blaubeeren-rotweinsauce-gemuese-hauptgang-feinschmecker-storia-muenchen.webp',
 ARRAY['dinner','wein'], 'autumn', TRUE),

-- GETRÄNKE / BAR
('bar-aperitivo-aperolspritz-abendstimmung-marmorwand-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/bar-aperitivo-aperolspritz-abendstimmung-marmorwand-storia-muenchen.webp',
 ARRAY['bar','aperitivo','innenraum'], 'allyear', TRUE),

('cocktails-mango-bellini-erdbeer-mojito-bar-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/cocktails-mango-bellini-erdbeer-mojito-bar-storia-muenchen.webp',
 ARRAY['aperitivo','bar'], 'allyear', TRUE),

('weinservice-sommelier-magnum-flasche-rotwein-tischservice-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/weinservice-sommelier-magnum-flasche-rotwein-tischservice-storia-muenchen.webp',
 ARRAY['wein','dinner','innenraum'], 'allyear', TRUE),

-- LOCATION
('storia-aussenansicht-worle-gebaeude-koenigsplatz-blauer-himmel-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/storia-aussenansicht-worle-gebaeude-koenigsplatz-blauer-himmel-muenchen.webp',
 ARRAY['fassade'], 'allyear', TRUE),

('terrasse-gaeste-kellner-service-fruehlingstag-koenigsplatz-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/terrasse-gaeste-kellner-service-fruehlingstag-koenigsplatz-storia-muenchen.webp',
 ARRAY['terrasse','gaeste','team'], 'spring', TRUE),

('aussenterrasse-abendevent-heizpilze-luftballons-gaeste-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/aussenterrasse-abendevent-heizpilze-luftballons-gaeste-storia-muenchen.webp',
 ARRAY['terrasse','gaeste','event'], 'summer', TRUE),

('business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp',
 ARRAY['lunch','innenraum'], 'allyear', TRUE),

('business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp',
 ARRAY['lunch','innenraum'], 'allyear', TRUE),

-- EVENTS
('firmenfeier-langtafel-weinregal-kerzenlicht-eventlocation-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/firmenfeier-langtafel-weinregal-kerzenlicht-eventlocation-storia-muenchen.webp',
 ARRAY['firmenfeier','event','dinner'], 'allyear', TRUE),

('weihnachtsfeier-anstossen-tannengruen-geschenke-firmenevent-abendstimmung-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/weihnachtsfeier-anstossen-tannengruen-geschenke-firmenevent-abendstimmung-storia-muenchen.webp',
 ARRAY['firmenfeier','event','wein'], 'winter', TRUE),

('geburtstag-dinner-champagner-lammkarree-festtafel-luftballons-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/geburtstag-dinner-champagner-lammkarree-festtafel-luftballons-storia-muenchen.webp',
 ARRAY['geburtstag','dinner','event'], 'allyear', TRUE),

('sommerfest-aussen-aperitivo-empfang-blumendekor-servicekraft-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/sommerfest-aussen-aperitivo-empfang-blumendekor-servicekraft-storia-muenchen.webp',
 ARRAY['event','terrasse','aperitivo'], 'summer', TRUE),

('geburtstag-luftballons-partyhuete-tischdeko-tageslicht-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/geburtstag-luftballons-partyhuete-tischdeko-tageslicht-storia-muenchen.webp',
 ARRAY['geburtstag','event','innenraum'], 'allyear', TRUE),

('romantisches-dinner-rotwein-rote-rosen-kerzenlicht-zweisamkeit-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/romantisches-dinner-rotwein-rote-rosen-kerzenlicht-zweisamkeit-storia-muenchen.webp',
 ARRAY['romantic','dinner','wein'], 'allyear', TRUE),

-- TEAM
('domenico-speranza-gastgeber-portrait-espressobar-segafredo-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/domenico-speranza-gastgeber-portrait-espressobar-segafredo-storia-muenchen.webp',
 ARRAY['team','tradition'], 'allyear', TRUE),

('nicola-speranza-kuechenchef-portrait-kochmuetze-schwarzweiss-storia-muenchen.webp',
 'https://ristorantestoria.de/gbp-images/nicola-speranza-kuechenchef-portrait-kochmuetze-schwarzweiss-storia-muenchen.webp',
 ARRAY['team','handwerk'], 'allyear', TRUE);
