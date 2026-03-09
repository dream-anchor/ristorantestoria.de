-- =============================================================
-- init.sql – Schema-Snapshot (Stand: 2026-03-09)
-- Tabellen: menu_items, google_business_settings
-- Trigger:  trg_cleanup_menu_item (fn_cleanup_menu_item)
-- =============================================================

-- -------------------------------------------------------------
-- TABLE: menu_items
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid NOT NULL REFERENCES public.menu_categories(id),
  name          text NOT NULL,
  name_en       text,
  name_it       text,
  name_fr       text,
  description   text,
  description_en text,
  description_it text,
  description_fr text,
  price         numeric,
  price_display text,
  allergens     text,
  is_vegetarian boolean DEFAULT false,
  is_vegan      boolean DEFAULT false,
  sort_order    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can delete items"
  ON public.menu_items FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert items"
  ON public.menu_items FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update items"
  ON public.menu_items FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all items"
  ON public.menu_items FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Items of published menus are viewable by everyone"
  ON public.menu_items FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1
      FROM menu_categories
      JOIN menus ON menus.id = menu_categories.menu_id
      WHERE menu_categories.id = menu_items.category_id
        AND menus.is_published = true
    )
  );

-- -------------------------------------------------------------
-- TABLE: google_business_settings
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.google_business_settings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key   text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.google_business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings"
  ON public.google_business_settings FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role full access"
  ON public.google_business_settings FOR ALL TO public
  USING  (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- -------------------------------------------------------------
-- FUNCTION: fn_cleanup_menu_item  (used by trigger)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_cleanup_menu_item()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
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
DROP TRIGGER IF EXISTS trg_cleanup_menu_item ON public.menu_items;

CREATE TRIGGER trg_cleanup_menu_item
  BEFORE INSERT OR UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_cleanup_menu_item();
