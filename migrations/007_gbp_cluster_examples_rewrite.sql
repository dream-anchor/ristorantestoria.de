-- Migration 007: Cluster-Examples rewrite — Validation-Gate geprüft, alle Pass.
-- Fixes: Hooks mit Geo/USP in ersten 80 Zeichen, exakte USP-Phrasen (48h Teigruhe, 400°C Steinofen, etc.)
-- NUR AUSFÜHREN nach Antoine-Freigabe ("GO 007").
-- Alte Beispiele in examples_legacy gesichert (Migration 004).

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Handgemachte Pasta im STORIA Maxvorstadt: Mamma Speranza kocht nach Rofrano-Rezept — Original aus dem Cilento, täglich frisch. Karlstraße 47a, München.',
  'Im STORIA Maxvorstadt: Mamma hat heute frische Burrata aus Apulien mitgebracht. Zum Mittagsmenü als Antipasto — handgemachte Pasta, 3 Gänge für 14,90 €, Mo–Fr 11:30.',
  'Mamma Speranza und ihre Familie kochen seit 2015 in der Karlstraße — Cucina del Cilento, Original-Rezepte aus Rofrano. Maxvorstadt, nahe den Pinakotheken.'
]::text[] WHERE cluster_id = 'mamma_anekdoten';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  '48h Teigruhe: Mimmo testet heute einen neuen Tagliolini-Teig im STORIA München. Mehl aus dem Cilento — wenn er passt, kommt er auf die Karte. Karlstraße, nahe Königsplatz.',
  'Steinofenpizza München: Mimmo heizt den 400°C Steinofen, 48h Teigruhe im Teig. Probier die aktuelle Cilento-Variante — STORIA Karlstraße, Maxvorstadt.',
  'Handgemachte Pasta täglich frisch — Mimmos Küche im STORIA Maxvorstadt arbeitet mit Lieferanten aus dem Cilento und dem regionalen Großmarkt. Karlstraße 47a, München.'
]::text[] WHERE cluster_id = 'mimmo_kueche';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Cucina del Cilento in München: Das Strozzapreti-Rezept stammt aus Rofrano, 30 km südlich von Salerno. Familie Speranza bringt es seit 2015 in die Maxvorstadt.',
  'Karlstraße, Maxvorstadt: Im Cilento isst man Pasta dünner als in Neapel und schwört auf lokales Olivenöl. Was Mamma Speranza hier kocht, kommt aus dieser Tradition.'
]::text[] WHERE cluster_id = 'cilento_hintergrund';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Pinakotheken-Besucher: 5 Minuten bis zur Karlstraße — dann bist du im STORIA. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr 11:30–14:30 in der Maxvorstadt.',
  'TU oder LMU Mensa ausgebucht? Das STORIA Karlstraße ist 8 Minuten entfernt — 5 Gehminuten von den Pinakotheken. Mittagsmenü 14,90 €, handgemachte Pasta, Mo–Fr.'
]::text[] WHERE cluster_id = 'karlstrasse_anker';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'STORIA Karlstraße: Nicola erklärt dir den Unterschied zwischen Gavi und Vermentino — zwei Weine, die anders schmecken, obwohl beide von der Küste kommen. Maxvorstadt.',
  'Seit 2015 läuft das STORIA durch Gutes wie durch ruhigere Phasen. Was sich nicht geändert hat: handgemachte Pasta und Familie Speranza am Herd — Cucina del Cilento in München.'
]::text[] WHERE cluster_id = 'personal_story';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Hausgemachte Pasta München: jeder Streifen per Hand gerollt, kein Automat. Im STORIA Karlstraße seit 2015 — täglich frisch ab 11:30, 5 Gehminuten von den Pinakotheken.',
  'Pasta Maxvorstadt: Familie Speranza rollt Teig nach Cilento-Tradition — dünn, handgemachte Pasta ohne Ei-Pulver. Karlstraße 47a, täglich frisch ab 11:30.',
  'Der Tagliolini-Teig für heute wurde gestern Abend angesetzt. Handgemachte Pasta München — 48h Teigruhe, dann frisch im STORIA, Karlstraße Maxvorstadt.'
]::text[] WHERE cluster_id = 'pasta_handarbeit';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Nach dem Königsplatz kommt der Hunger. Das STORIA ist 5 Gehminuten — Dinner in der Maxvorstadt mit 100 überdachte Plätze auf der Terrasse. Karlstraße.',
  'Pinakothek-Abend in München? Das STORIA Karlstraße liegt auf dem Rückweg. Aperitivo, Pasta, Wein — bis 180 Gäste, auch für spontane Gruppen. Nähe Königsplatz.',
  'Wer nach den Museen noch essen will: Karlstraße 47a, Gehminuten vom Königsplatz. Dinner, Raucher willkommen, Weinbar München — STORIA in der Maxvorstadt.'
]::text[] WHERE cluster_id = 'pinakothek_dinner';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  '"Beste Pasta der Maxvorstadt" — das schreiben Gäste, die zum dritten Mal kommen. Wir lesen jede Rezension. STORIA Karlstraße, München — handgemachte Pasta seit 2015.',
  '48h Teigruhe und Original-Rezepte aus Rofrano: Gäste fragen oft nach dem Rezept der Strozzapreti. Das ist die Antwort — täglich frisch im STORIA, Karlstraße Maxvorstadt.',
  '"Die Terrasse ist auch im Regen trocken" — stimmt. 100 überdachte Plätze, Raucher willkommen, STORIA Maxvorstadt. Auch bei Münchner Gewitter draußen sitzen.'
]::text[] WHERE cluster_id = 'rezension_highlight';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Steinofenpizza München: 400°C Steinofen, 48h Teigruhe, Cilento-Salami oder Burrata-Variante. Mimmo zieht jede Pizza selbst aus dem Ofen — STORIA Karlstraße, Maxvorstadt.',
  'Neapolitanische Pizza München: der Teig hat 48h Teigruhe, dann in den 400°C Steinofen. Im STORIA Karlstraße Maxvorstadt — täglich frisch gebacken.',
  'Was Steinofenpizza in München bedeutet: 48h Teigruhe im Teig, 400°C Steinofen, Mimmos Handwerk. STORIA Karlstraße — Mittwochabend meist ruhiger für spontane Tische.'
]::text[] WHERE cluster_id = 'steinofenpizza_muenchen';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  '100 überdachte Plätze in der Maxvorstadt — wetterfest, Raucher willkommen, auch bei Münchner Maigewitter. STORIA Karlstraße, Aperitivo auf der Terrasse ab 17:00.',
  'Terrasse in München, die wirklich überdacht ist: 100 überdachte Plätze, Raucher willkommen, kein Wintergarten-Feeling. STORIA Karlstraße Maxvorstadt — auch spontan.',
  'Wetterfeste Terrasse Maxvorstadt: 100 überdachte Plätze, Schiebedach, Raucher willkommen. Aperitivo ab 17:00 auf der Karlstraße — STORIA München, seit 2015.'
]::text[] WHERE cluster_id = 'terrasse_lifestyle';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Weinbar München Maxvorstadt: Über 60 Weine — Vermentino von der Küste, Amarone aus dem Valpolicella, Rosato aus dem Cilento. STORIA Karlstraße.',
  'Maxvorstadt Weinbar-Tipp: Nicola empfiehlt zum Tagliolini einen Fiano di Avellino — weniger bekannt als Pinot Grigio, passt aber besser. STORIA Karlstraße München.',
  'Wer in München eine Weinbar sucht, die auch ehrliches Essen hat: Karlstraße 47a. STORIA — 60+ Weine, handgemachte Pasta, überdachte Terrasse.'
]::text[] WHERE cluster_id = 'weinbar_maxvorstadt';

UPDATE gbp_theme_clusters SET examples = ARRAY[
  'Wild essen München: Mimmo verarbeitet Reh und Hirsch seit 2015 — kein Supermarkt-Wild, regionale Lieferanten, handgemachte Pasta dazu. STORIA Karlstraße, Maxvorstadt.',
  'Wild essen München — Herbst im STORIA: Wildschweinragù auf handgemachte Pasta, Rehkeule aus dem Ofen. Wenn die Saison stimmt, steht es auf der Karte. Karlstraße Maxvorstadt.',
  'Wer Wild in München sucht, übersieht oft kleine Restaurants. Im STORIA kommen Reh und Hirsch von heimischen Lieferanten — Cucina del Cilento trifft Münchner Herbst.'
]::text[] WHERE cluster_id = 'wild_kueche';
