-- ROLLBACK Migration 010: Pool B neue Posts entfernen
-- IDs 14, 15, 16 (höchste IDs nach Migration 010)
DELETE FROM gbp_posts WHERE id IN (
  SELECT id FROM gbp_posts
  WHERE pool = 'B'
    AND theme_slot IN ('brand', 'lunch')
    AND body IN (
      'Handgemachte Pasta und Pizzen aus dem 400°C Steinofen — das STORIA in der Karlstraße steht für echtes Handwerk aus dem Cilento. Keine Convenience, keine Kompromisse. Maxvorstadt, seit 2015.',
      'Von Rofrano nach München: Die Cucina del Cilento ist die Seele des STORIA Maxvorstadt. Domenico, Nicola und Familie Speranza stehen täglich in der Küche — Karlstraße 47a, seit 2015.',
      '5 Minuten vom Königsplatz, 30 Minuten Pause: Im STORIA Maxvorstadt gibt es handgemachte Pasta und Tagesgerichte ab 14,90 €. Mo–Fr 11:30–14:30, Karlstraße 47a.'
    )
);
