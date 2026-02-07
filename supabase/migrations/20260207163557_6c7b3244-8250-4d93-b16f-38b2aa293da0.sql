
-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function that calls classify-seasonal-menu edge function via pg_net
CREATE OR REPLACE FUNCTION public.notify_classify_seasonal_menu()
RETURNS trigger AS $$
BEGIN
  IF NEW.menu_type = 'special' THEN
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger on menus table
CREATE TRIGGER trg_classify_seasonal_menu
  AFTER INSERT OR UPDATE ON public.menus
  FOR EACH ROW
  WHEN (NEW.menu_type = 'special')
  EXECUTE FUNCTION public.notify_classify_seasonal_menu();
