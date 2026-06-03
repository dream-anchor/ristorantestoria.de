-- ROLLBACK Migration 016
DELETE FROM gbp_images WHERE filename IN (
  'calamari-gegrillt-rucola-cherrytomaten-vorspeise-meeresfruechte-storia-muenchen.webp',
  'pizza-margherita-mozzarella-basilikum-steinofen-pizzabaecker-storia-muenchen.webp',
  'ravioli-tomatensauce-pasta-fatta-in-casa-handarbeit-kueche-storia-muenchen.webp',
  'tiramisu-dessert-weisseschokolade-segel-kumquat-platting-storia-muenchen.webp',
  'business-lunch-tisch-carbonara-ossobuco-gemeinsam-essen-storia-muenchen.webp',
  'wild-rehruecken-blaubeeren-rotweinsauce-gemuese-hauptgang-feinschmecker-storia-muenchen.webp',
  'bar-aperitivo-aperolspritz-abendstimmung-marmorwand-storia-muenchen.webp',
  'cocktails-mango-bellini-erdbeer-mojito-bar-storia-muenchen.webp',
  'weinservice-sommelier-magnum-flasche-rotwein-tischservice-storia-muenchen.webp',
  'storia-aussenansicht-worle-gebaeude-koenigsplatz-blauer-himmel-muenchen.webp',
  'terrasse-gaeste-kellner-service-fruehlingstag-koenigsplatz-storia-muenchen.webp',
  'aussenterrasse-abendevent-heizpilze-luftballons-gaeste-storia-muenchen.webp',
  'business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp',
  'business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp',
  'firmenfeier-langtafel-weinregal-kerzenlicht-eventlocation-storia-muenchen.webp',
  'weihnachtsfeier-anstossen-tannengruen-geschenke-firmenevent-abendstimmung-storia-muenchen.webp',
  'geburtstag-dinner-champagner-lammkarree-festtafel-luftballons-storia-muenchen.webp',
  'sommerfest-aussen-aperitivo-empfang-blumendekor-servicekraft-storia-muenchen.webp',
  'geburtstag-luftballons-partyhuete-tischdeko-tageslicht-storia-muenchen.webp',
  'romantisches-dinner-rotwein-rote-rosen-kerzenlicht-zweisamkeit-storia-muenchen.webp',
  'domenico-speranza-gastgeber-portrait-espressobar-segafredo-storia-muenchen.webp',
  'nicola-speranza-kuechenchef-portrait-kochmuetze-schwarzweiss-storia-muenchen.webp'
);
UPDATE gbp_images SET is_active = TRUE WHERE is_active = FALSE;
