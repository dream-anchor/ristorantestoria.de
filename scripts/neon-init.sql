-- =============================================================
-- Neon Schema – ristorantestoria.de (Stand: 2026-03-09)
-- Bereinigt: Kein RLS, keine Supabase-Policies, keine auth.*
-- =============================================================

-- Enum: menu_type
DO $$ BEGIN
  CREATE TYPE menu_type AS ENUM ('lunch', 'food', 'drinks', 'christmas', 'valentines', 'special');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -------------------------------------------------------------
-- TABLE: menus
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menus (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_type     menu_type NOT NULL DEFAULT 'food',
  title         text,
  title_en      text,
  title_it      text,
  title_fr      text,
  subtitle      text,
  subtitle_en   text,
  subtitle_it   text,
  subtitle_fr   text,
  slug          text,
  slug_en       text,
  slug_it       text,
  slug_fr       text,
  pdf_url       text,
  is_published  boolean DEFAULT false,
  published_at  timestamptz,
  sort_order    integer DEFAULT 0,
  archive_year  integer,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- -------------------------------------------------------------
-- TABLE: menu_categories
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id         uuid NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  name            text NOT NULL,
  name_en         text,
  name_it         text,
  name_fr         text,
  description     text,
  description_en  text,
  description_it  text,
  description_fr  text,
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- -------------------------------------------------------------
-- TABLE: menu_items
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name            text NOT NULL,
  name_en         text,
  name_it         text,
  name_fr         text,
  description     text,
  description_en  text,
  description_it  text,
  description_fr  text,
  price           numeric,
  price_display   text,
  allergens       text,
  is_vegetarian   boolean DEFAULT false,
  is_vegan        boolean DEFAULT false,
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- -------------------------------------------------------------
-- TABLE: google_business_settings
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS google_business_settings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key   text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- -------------------------------------------------------------
-- TABLE: seasonal_signups
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seasonal_signups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL,
  seasonal_event  text NOT NULL,
  language        text,
  created_at      timestamptz DEFAULT now(),
  notified_at     timestamptz
);

-- -------------------------------------------------------------
-- TABLE: landingpage_content
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS landingpage_content (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug               text NOT NULL,
  intro_de                text,
  intro_en                text,
  intro_fr                text,
  intro_it                text,
  highlights_text_de      text,
  highlights_text_en      text,
  highlights_text_fr      text,
  highlights_text_it      text,
  featured_items          jsonb,
  menu_highlights         jsonb,
  prices_summary          jsonb,
  season_info             jsonb,
  source_menu_ids         text[],
  items_found_count       integer,
  last_menu_hash          text,
  last_check              timestamptz,
  last_successful_update  timestamptz,
  update_status           text,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

-- -------------------------------------------------------------
-- FUNCTION: fn_cleanup_menu_item (Trigger)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_cleanup_menu_item()
  RETURNS trigger
  LANGUAGE plpgsql
AS $function$
BEGIN
  -- 1. Extract numeric price from price_display if price is NULL
  IF NEW.price IS NULL AND NEW.price_display IS NOT NULL AND NEW.price_display != '' THEN
    BEGIN
      NEW.price := CAST(
        REPLACE(REPLACE(REPLACE(NEW.price_display, ' €', ''), '€', ''), ',', '.')
        AS numeric
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  -- 2. Extract allergens from description if allergens is empty
  IF (NEW.allergens IS NULL OR NEW.allergens = '') AND NEW.description IS NOT NULL THEN
    DECLARE
      v_match text[];
      v_allergens text;
      v_cleaned text;
    BEGIN
      v_match := regexp_match(
        NEW.description,
        '\s*[\(\[]?\s*([a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*)\s*[\)\]]?\s*$',
        'i'
      );
      IF v_match IS NOT NULL THEN
        v_allergens := v_match[1];
        v_allergens := regexp_replace(v_allergens, '\s+', '', 'g');
        v_allergens := replace(v_allergens, ';', ',');
        v_allergens := replace(v_allergens, '/', ',');
        NEW.allergens := lower(v_allergens);
        v_cleaned := regexp_replace(
          NEW.description,
          '\s*[\(\[]?\s*[a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*\s*[\)\]]?\s*$',
          '', 'i'
        );
        NEW.description := trim(v_cleaned);
      END IF;
    END;
  END IF;

  -- 3. Ensure name_it is always set (fallback: copy from name)
  IF (NEW.name_it IS NULL OR NEW.name_it = '') AND NEW.name IS NOT NULL THEN
    NEW.name_it := NEW.name;
  END IF;

  RETURN NEW;
END;
$function$;

-- -------------------------------------------------------------
-- TRIGGER: trg_cleanup_menu_item
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_cleanup_menu_item ON menu_items;

CREATE TRIGGER trg_cleanup_menu_item
  BEFORE INSERT OR UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION fn_cleanup_menu_item();

-- -------------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_menu_categories_menu_id ON menu_categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menus_menu_type ON menus(menu_type);
CREATE INDEX IF NOT EXISTS idx_menus_is_published ON menus(is_published);
CREATE INDEX IF NOT EXISTS idx_gbp_settings_key ON google_business_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_landingpage_slug ON landingpage_content(page_slug);
