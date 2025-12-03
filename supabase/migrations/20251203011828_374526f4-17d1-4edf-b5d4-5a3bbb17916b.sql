-- Add slug column to menus table for SEO-friendly URLs
ALTER TABLE menus ADD COLUMN slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_menus_slug ON menus(slug);

-- Update existing special menus with slugs
UPDATE menus SET slug = 'weihnachtsmenues' WHERE id = 'e3bf8775-f881-4e8e-879a-185bb097ee74';
UPDATE menus SET slug = 'silvesterparty' WHERE id = '06ef75e0-f22e-4a71-b992-1bad64e64b0c';