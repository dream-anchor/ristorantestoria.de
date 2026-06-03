-- Migration 008: CTA-Slot-Korrekturen in gbp_posts
-- Fixes: IDs 3, 4, 8, 12 — CTA-Typ passt nicht zum theme_slot.
-- SLOT_CTA_MAP: lunch=[call,reserve] | brand=[learn_more,website] | lifestyle=[reserve,website] | event=[reserve,call]
-- NUR AUSFÜHREN nach Antoine-Freigabe ("GO 008").

-- ID 3: lunch + learn_more → reserve (Frühstück, Tisch reservieren)
UPDATE gbp_posts SET cta_type = 'reserve', cta_url = 'https://ristorantestoria.de/reservierung'
WHERE id = 3;

-- ID 4: lifestyle + call → reserve (lifestyle erlaubt reserve/website, nicht call)
UPDATE gbp_posts SET cta_type = 'reserve', cta_url = 'https://ristorantestoria.de/reservierung'
WHERE id = 4;

-- ID 8: event + learn_more → reserve (event erlaubt reserve/call)
UPDATE gbp_posts SET cta_type = 'reserve', cta_url = 'https://ristorantestoria.de/reservierung'
WHERE id = 8;

-- ID 12: event + learn_more → reserve (event erlaubt reserve/call)
UPDATE gbp_posts SET cta_type = 'reserve', cta_url = 'https://ristorantestoria.de/reservierung'
WHERE id = 12;
