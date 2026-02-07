
-- Drop the old trigger (from first migration, survived the failed attempts)
DROP TRIGGER IF EXISTS trg_classify_seasonal_menu ON public.menus;

-- Update the trigger function to check title change internally
CREATE OR REPLACE FUNCTION public.notify_classify_seasonal_menu()
RETURNS trigger AS $$
BEGIN
  -- Only fire for special menus
  IF NEW.menu_type = 'special' THEN
    -- On INSERT: always classify
    -- On UPDATE: only if title changed (prevents cascade from slug updates)
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.title IS DISTINCT FROM NEW.title) THEN
      PERFORM net.http_post(
        url := 'https://iieethejhwfsyzhbweps.supabase.co/functions/v1/classify-seasonal-menu',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZWV0aGVqaHdmc3l6aGJ3ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTkyMTcsImV4cCI6MjA4MDI3NTIxN30.s6hsm234IxF3NbYc2oNCjWZ28huDNSt588WLDxlV1hM'
        ),
        body := jsonb_build_object(
          'record', jsonb_build_object(
            'id', NEW.id,
            'title', NEW.title,
            'title_en', NEW.title_en,
            'title_it', NEW.title_it,
            'title_fr', NEW.title_fr,
            'slug', NEW.slug,
            'slug_en', NEW.slug_en,
            'slug_it', NEW.slug_it,
            'slug_fr', NEW.slug_fr,
            'menu_type', NEW.menu_type,
            'is_published', NEW.is_published
          ),
          'type', TG_OP
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger with simple WHEN condition (title check is inside function)
CREATE TRIGGER trg_classify_seasonal_menu
  AFTER INSERT OR UPDATE ON public.menus
  FOR EACH ROW
  WHEN (NEW.menu_type = 'special')
  EXECUTE FUNCTION public.notify_classify_seasonal_menu();
