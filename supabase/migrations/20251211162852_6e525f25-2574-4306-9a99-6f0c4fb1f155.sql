-- Add Italian and French translation columns to menus table
ALTER TABLE menus ADD COLUMN IF NOT EXISTS title_it TEXT;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS subtitle_it TEXT;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS title_fr TEXT;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS subtitle_fr TEXT;

-- Add Italian and French translation columns to menu_categories table
ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS name_it TEXT;
ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS description_it TEXT;
ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS name_fr TEXT;
ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS description_fr TEXT;

-- Add Italian and French translation columns to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS name_it TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS description_it TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS name_fr TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS description_fr TEXT;