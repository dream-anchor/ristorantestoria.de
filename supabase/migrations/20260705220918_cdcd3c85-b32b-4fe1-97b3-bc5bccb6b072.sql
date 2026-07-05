CREATE OR REPLACE FUNCTION public.fn_cleanup_menu_item()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $function$
BEGIN
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

  IF (NEW.allergens IS NULL OR NEW.allergens = '') AND NEW.description IS NOT NULL THEN
    DECLARE
      v_match text[];
      v_allergens text;
      v_cleaned text;
    BEGIN
      v_match := regexp_match(NEW.description, '\s*[\(\[]?\s*([a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*)\s*[\)\]]?\s*$', 'i');
      IF v_match IS NOT NULL THEN
        v_allergens := v_match[1];
        v_allergens := regexp_replace(v_allergens, '\s+', '', 'g');
        v_allergens := replace(v_allergens, ';', ',');
        v_allergens := replace(v_allergens, '/', ',');
        NEW.allergens := lower(v_allergens);
        v_cleaned := regexp_replace(NEW.description, '\s*[\(\[]?\s*[a-h1-9](?:\s*[,;/\s]\s*[a-h1-9])*\s*[\)\]]?\s*$', '', 'i');
        NEW.description := trim(v_cleaned);
      END IF;
    END;
  END IF;

  RETURN NEW;
END;
$function$;