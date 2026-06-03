-- Migration 010: Pool B — 3 neue Posts (brand×2, lunch×1)
-- Varianten-Wahl: B/brand/1:A, B/brand/2:B, B/lunch/1:B
-- Antoine-Freigabe: 2026-05-09

INSERT INTO gbp_posts (pool, theme_slot, season, body, cta_type, cta_url, image_tags) VALUES
(
  'B', 'brand', 'allyear',
  'Handgemachte Pasta und Pizzen aus dem 400°C Steinofen — das STORIA in der Karlstraße steht für echtes Handwerk aus dem Cilento. Keine Convenience, keine Kompromisse. Maxvorstadt, seit 2015.',
  'learn_more', 'https://ristorantestoria.de',
  ARRAY['pasta', 'handwerk']
),
(
  'B', 'brand', 'allyear',
  'Von Rofrano nach München: Die Cucina del Cilento ist die Seele des STORIA Maxvorstadt. Domenico, Nicola und Familie Speranza stehen täglich in der Küche — Karlstraße 47a, seit 2015.',
  'website', 'https://ristorantestoria.de',
  ARRAY['team', 'cilento']
),
(
  'B', 'lunch', 'allyear',
  '5 Minuten vom Königsplatz, 30 Minuten Pause: Im STORIA Maxvorstadt gibt es handgemachte Pasta und Tagesgerichte ab 14,90 €. Mo–Fr 11:30–14:30, Karlstraße 47a.',
  'call', 'tel:+498951519696',
  ARRAY['pasta', 'lunch']
);
