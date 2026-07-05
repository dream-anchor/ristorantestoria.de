-- Fix Mehrsprachigkeit: Kein deutsches Kopieren mehr nach name_it
--
-- Der Cleanup-Trigger (Migration 20260309114217) kopierte bisher bei leerem
-- name_it den deutschen Namen in die IT-Spalte. Dadurch galten Felder als
-- "übersetzt", obwohl sie deutschen Text enthielten – italienische Gäste
-- sahen deutsche Texte. Der Fallback auf Deutsch passiert jetzt zur
-- RENDER-Zeit im Frontend (name_it || name), nicht mehr in den Daten.
-- Schritt 1 (Preis-Extraktion) und Schritt 2 (Allergen-Extraktion) bleiben.
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

  -- 3. ENTFERNT: name_it wird NICHT mehr mit dem deutschen Namen befüllt.
  --    Leere Übersetzungsfelder bleiben leer; das Frontend rendert dann
  --    das deutsche Original als Fallback.

  RETURN NEW;
END;
$function$;

-- Bestandsdaten bereinigen: Durch den alten Trigger erzeugte deutsche Kopien
-- in name_it auf NULL setzen – aber NUR wenn der Name erkennbar deutsch ist.
-- Legitime Eigennamen ("Pizza Margherita", "Tiramisu") bleiben unverändert.
-- Anzeige ändert sich nicht (Frontend-Fallback zeigt weiterhin Deutsch),
-- aber die Felder gelten nicht mehr fälschlich als übersetzt.
UPDATE public.menu_items
SET name_it = NULL
WHERE name_it = name
  AND name ~* '[äöüß]|\y(und|mit|aus|für|der|die|das|vom|im|auf|hausgemacht)\y';
