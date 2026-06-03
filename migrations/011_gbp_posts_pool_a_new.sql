-- Migration 011: Pool A — 3 neue Posts (lunch×2, lifestyle×1)
-- Varianten-Wahl: A/lunch/spring:A, A/lunch/allyear:B, A/lifestyle/summer:B
-- Antoine-Freigabe: 2026-05-09

INSERT INTO gbp_posts (pool, theme_slot, season, body, cta_type, cta_url, image_tags) VALUES
(
  'A', 'lunch', 'spring',
  'Frühling in der Maxvorstadt: handgemachte Pasta mit frischen Zutaten — das Mittagsmenü im STORIA wechselt saisonal. 3 Gänge für 14,90 €, Mo–Fr 11:30–14:30. Karlstraße.',
  'call', 'tel:+498951519696',
  ARRAY['pasta', 'lunch']
),
(
  'A', 'lunch', 'allyear',
  'Schnelle Mittagspause am Königsplatz: Im STORIA Maxvorstadt wartet handgemachte Pasta, frische Antipasti, Dessert — alles in 45 Minuten. 14,90 €, Mo–Fr 11:30–14:30.',
  'reserve', 'https://ristorantestoria.de/reservierung',
  ARRAY['lunch', 'innenraum']
),
(
  'A', 'lifestyle', 'summer',
  'München, Juli, 19 Uhr: Auf der Karlstraße 47a stehen 100 überdachte Plätze bereit — Raucher willkommen, Dinner inklusive. STORIA Maxvorstadt, Reservierung empfohlen.',
  'reserve', 'https://ristorantestoria.de/reservierung',
  ARRAY['terrasse', 'gaeste', 'dinner']
);
