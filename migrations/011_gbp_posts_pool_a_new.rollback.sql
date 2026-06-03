-- ROLLBACK Migration 011: Pool A neue Posts entfernen
DELETE FROM gbp_posts WHERE id IN (
  SELECT id FROM gbp_posts
  WHERE pool = 'A'
    AND body IN (
      'Frühling in der Maxvorstadt: handgemachte Pasta mit frischen Zutaten — das Mittagsmenü im STORIA wechselt saisonal. 3 Gänge für 14,90 €, Mo–Fr 11:30–14:30. Karlstraße.',
      'Schnelle Mittagspause am Königsplatz: Im STORIA Maxvorstadt wartet handgemachte Pasta, frische Antipasti, Dessert — alles in 45 Minuten. 14,90 €, Mo–Fr 11:30–14:30.',
      'München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Raucher willkommen, Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.'
    )
);
