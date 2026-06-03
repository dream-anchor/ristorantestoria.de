-- Migration 009: USP-Rewrites Pool A/B — Validation-Gate-kompatible Texte
-- body_legacy sichert Original vor Überschreiben (analog examples_legacy).
-- NUR AUSFÜHREN nach Antoine-Freigabe ("GO 009").

-- 0. body_legacy Spalte hinzufügen (idempotent)
ALTER TABLE gbp_posts ADD COLUMN IF NOT EXISTS body_legacy TEXT;

-- 1. Originals sichern (nur für betroffene IDs, nur wenn body_legacy noch leer)
UPDATE gbp_posts SET body_legacy = body
WHERE id IN (3, 4, 6, 7, 8, 9, 10, 11, 13) AND body_legacy IS NULL;

-- 2. ID 3 [A/lunch] — "seit 2015" eingefügt
UPDATE gbp_posts SET body = 'Italienisches Frühstück in der Maxvorstadt: Cornetti, Caffè, frischer Saft ab 9 Uhr — seit 2015. ☕ STORIA Karlstraße, 5 Minuten vom Königsplatz, Mo–Fr.'
WHERE id = 3;

-- 3. ID 4 [A/lifestyle] — "bis 180 Gäste" + "Raucher willkommen" exakt, Tel entfernt
UPDATE gbp_posts SET body = 'Tisch sichern in der Maxvorstadt — STORIA Karlstraße, bis 180 Gäste. Überdachte Terrasse, wetterfest, Raucher willkommen. Innenraum für Feiern und Events.'
WHERE id = 4;

-- 4. ID 6 [B/lifestyle] — "Handgemachte Pasta" als Hook, Geo ergänzt
UPDATE gbp_posts SET body = 'Handgemachte Pasta trifft Trüffel-Saison — im STORIA Maxvorstadt Tagliolini mit schwarzem Trüffel, frisch gehobelt am Tisch. Im 4-Gänge-Menü Mare oder à la carte. Karlstraße.'
WHERE id = 6;

-- 5. ID 7 [A/lifestyle] — Geo + "handgemachte Pasta" ergänzt, Länge auf ≥140
UPDATE gbp_posts SET body = '4-Gänge-Menü Mare im STORIA Maxvorstadt: handgemachte Pasta, Hummersalat, Saltimbocca vom Seeteufel, Schokoladen-Soufflé. 78 € / 108 € mit Weinbegleitung. Karlstraße.'
WHERE id = 7;

-- 6. ID 8 [B/event] — "bis 180 Gäste" + "Raucher willkommen", Kapazität korrigiert
UPDATE gbp_posts SET body = 'Bis 180 Gäste in der Maxvorstadt: das STORIA Karlstraße eignet sich für Firmenfeiern, Geburtstage und Events. Überdachte Terrasse, Raucher willkommen.'
WHERE id = 8;

-- 7. ID 9 [B/event] — "Handgemachte Pasta" als Hook, Geo + "seit 2015" ergänzt
UPDATE gbp_posts SET body = 'Handgemachte Pasta und Trüffel in der Adventszeit — das STORIA Karlstraße ist die ruhige Pause zwischen Christkindlmarkt und Büro. Maxvorstadt, seit 2015. 🕯️'
WHERE id = 9;

-- 8. ID 10 [B/lifestyle] — "48h Teigruhe" + "400°C Steinofen" exakt, Geo ergänzt
UPDATE gbp_posts SET body = '48h Teigruhe, 400°C Steinofen — Mimmos Pizza Napoletana im STORIA Maxvorstadt. Wer sie noch nicht probiert hat: Mittwochabend ist meist ruhiger. Karlstraße.'
WHERE id = 10;

-- 9. ID 11 [A/lifestyle] — "100 überdachte Plätze" + "Raucher willkommen" exakt
UPDATE gbp_posts SET body = 'Überdachte Terrasse in der Maxvorstadt — 100 überdachte Plätze, wetterfest, Raucher willkommen. ☀️ Steinofenpizza oder Aperitivo im Freien, egal ob Sonne oder Regen. STORIA, Karlstraße 47a.'
WHERE id = 11;

-- 10. ID 13 [B/lifestyle] — "seit 2015" als Hook-USP
UPDATE gbp_posts SET body = 'Seit 2015 kuratiert Nicola die Weinkarte im STORIA Maxvorstadt — über 60 Positionen, von Vermentino bis Amarone. Weinbar-Atmosphäre, Karlstraße 47a. 🥂'
WHERE id = 13;
