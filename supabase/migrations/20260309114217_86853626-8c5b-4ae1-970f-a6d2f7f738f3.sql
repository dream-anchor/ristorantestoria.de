
-- Trigger function: cleans up menu_items on INSERT/UPDATE
-- Extracts price from price_display, normalizes allergens, ensures name_it is set
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
      -- If conversion fails, leave price as NULL
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
      -- Match allergen codes at end of description: (a,c,g) or a,c,g
      v_match := regexp_match(NEW.description, '\s*[\(\[]?\s*([a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*)\s*[\)\]]?\s*$', 'i');
      IF v_match IS NOT NULL THEN
        v_allergens := v_match[1];
        -- Normalize: remove spaces, replace semicolons with commas
        v_allergens := regexp_replace(v_allergens, '\s+', '', 'g');
        v_allergens := replace(v_allergens, ';', ',');
        v_allergens := replace(v_allergens, '/', ',');
        NEW.allergens := lower(v_allergens);
        -- Remove allergens from description
        v_cleaned := regexp_replace(NEW.description, '\s*[\(\[]?\s*[a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*\s*[\)\]]?\s*$', '', 'i');
        NEW.description := trim(v_cleaned);
      END IF;
    END;
  END IF;

  -- 3. Ensure name_it is always set (copy from name if empty)
  IF (NEW.name_it IS NULL OR NEW.name_it = '') AND NEW.name IS NOT NULL THEN
    NEW.name_it := NEW.name;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger on menu_items for INSERT and UPDATE
DROP TRIGGER IF EXISTS trg_cleanup_menu_item ON public.menu_items;
CREATE TRIGGER trg_cleanup_menu_item
  BEFORE INSERT OR UPDATE
  ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_cleanup_menu_item();
