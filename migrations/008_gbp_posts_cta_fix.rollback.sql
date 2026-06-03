-- ROLLBACK Migration 008
UPDATE gbp_posts SET cta_type = 'learn_more', cta_url = 'https://ristorantestoria.de' WHERE id = 3;
UPDATE gbp_posts SET cta_type = 'call',        cta_url = 'tel:+4989515196960'          WHERE id = 4;
UPDATE gbp_posts SET cta_type = 'learn_more', cta_url = 'https://ristorantestoria.de' WHERE id = 8;
UPDATE gbp_posts SET cta_type = 'learn_more', cta_url = 'https://ristorantestoria.de' WHERE id = 12;
