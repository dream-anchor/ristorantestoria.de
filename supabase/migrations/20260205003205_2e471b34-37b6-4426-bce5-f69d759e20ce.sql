-- Add slug columns for EN, IT, FR
ALTER TABLE menus ADD COLUMN IF NOT EXISTS slug_en TEXT;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS slug_it TEXT;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS slug_fr TEXT;

-- Update existing menus with fallback slugs
UPDATE menus SET slug_en = slug WHERE slug_en IS NULL AND slug IS NOT NULL;
UPDATE menus SET slug_it = slug WHERE slug_it IS NULL AND slug IS NOT NULL;
UPDATE menus SET slug_fr = slug WHERE slug_fr IS NULL AND slug IS NOT NULL;