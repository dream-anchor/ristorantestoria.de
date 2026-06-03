-- Migration 017: Raucher-Entfernung
-- Antoine-Freigabe: 2026-05-09 | Alerts ID2/ID4/ID8 akzeptiert (kein Auto-Fix)
-- 6 Posts, 3 Cluster-Examples, 2 Bild-Saisons

-- 1. Post-Rewrites (nur Raucher-Bezug gestrichen, sonst unverändert)

UPDATE gbp_posts SET body = 'Aperitivo & Dinner auf der überdachten Terrasse in München Maxvorstadt. 🍹 100 wetterfeste Plätze in der Karlstraße. Italienische Weine, Aperol-Klassiker, Antipasti. Ab 19:00 im STORIA.'
WHERE id = 2;

UPDATE gbp_posts SET body = 'Tisch sichern in der Maxvorstadt — STORIA Karlstraße, bis 180 Gäste. Überdachte Terrasse, wetterfest. Innenraum für Feiern und Events.'
WHERE id = 4;

UPDATE gbp_posts SET body = 'Wetterfest genießen: 100 überdachte Plätze im STORIA Maxvorstadt. ☀️ Ob Sonnenstrahlen oder Maigewitter — unsere Terrasse in der Karlstraße bleibt trocken. Ideal für Gruppen und Geburtstage.'
WHERE id = 5;

UPDATE gbp_posts SET body = 'Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße eignet sich für Firmenfeiern, Geburtstage und Events. Überdachte Terrasse.'
WHERE id = 8;

UPDATE gbp_posts SET body = 'Überdachte Terrasse in der Maxvorstadt — 100 überdachte Plätze, wetterfest. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a.'
WHERE id = 11;

UPDATE gbp_posts SET body = 'München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.'
WHERE id = 19;

-- 2. Cluster-Examples (nur Raucher-Halbsatz gestrichen)

UPDATE gbp_theme_clusters SET examples = ARRAY[
  '100 überdachte Plätze in der Maxvorstadt — wetterfest, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.',
  'Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.',
  'Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.'
]
WHERE cluster_id = 'terrasse_lifestyle';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.',
  'Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen. Nähe Königsplatz.',
  'Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Weinbar München — STORIA in der Maxvorstadt.'
]
WHERE cluster_id = 'pinakothek_dinner';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
  '48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.',
  '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.'
]
WHERE cluster_id = 'rezension_highlight';

-- 3. Bild-Saisons: Weihnachts-Bilder → winter

UPDATE gbp_images SET season = 'winter'
WHERE filename = 'business-lunch-volle-stube-weihnachtsdeko-mittagsservice-storia-muenchen.webp';

UPDATE gbp_images SET season = 'winter'
WHERE filename = 'business-lunch-restaurantuebersicht-weihnachtszeit-maxvorstadt-storia-muenchen.webp';
