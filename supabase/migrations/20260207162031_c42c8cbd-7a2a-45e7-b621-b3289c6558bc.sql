
-- 1. seasonal_signups table
CREATE TABLE public.seasonal_signups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  seasonal_event text NOT NULL,
  language text NOT NULL DEFAULT 'de',
  created_at timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz,
  UNIQUE (email, seasonal_event)
);

CREATE INDEX idx_seasonal_signups_event ON public.seasonal_signups (seasonal_event);
CREATE INDEX idx_seasonal_signups_event_lang ON public.seasonal_signups (seasonal_event, language);

ALTER TABLE public.seasonal_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert signups"
  ON public.seasonal_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can select signups"
  ON public.seasonal_signups FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated can update signups"
  ON public.seasonal_signups FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated can delete signups"
  ON public.seasonal_signups FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 2. archive_year column on menus
ALTER TABLE public.menus ADD COLUMN archive_year integer;

-- 3. Trigger for seasonal menu archive
CREATE OR REPLACE FUNCTION public.fn_seasonal_menu_archive()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $$
DECLARE
  seasonal_slugs text[] := ARRAY[
    'valentinstag-menue','valentines-menu','san-valentino-menu','saint-valentin-menu',
    'weihnachtsmenue','christmas-menu','natale-menu','noel-menu',
    'silvester','new-years-eve','capodanno','nouvel-an'
  ];
BEGIN
  IF OLD.is_published = true
     AND NEW.is_published = false
     AND OLD.menu_type = 'special'
     AND (
       OLD.slug = ANY(seasonal_slugs) OR
       OLD.slug_en = ANY(seasonal_slugs) OR
       OLD.slug_it = ANY(seasonal_slugs) OR
       OLD.slug_fr = ANY(seasonal_slugs)
     )
  THEN
    NEW.archive_year := EXTRACT(YEAR FROM now())::integer;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_seasonal_menu_archive
  BEFORE UPDATE ON public.menus
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_seasonal_menu_archive();

-- 4. slug_classifications table
CREATE TABLE public.slug_classifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_id uuid NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  original_title text NOT NULL,
  classified_as text,
  slugs_updated boolean NOT NULL DEFAULT false,
  conflict boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.slug_classifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access slug_classifications"
  ON public.slug_classifications FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 5. admin_notifications table
CREATE TABLE public.admin_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  message text NOT NULL,
  menu_id uuid REFERENCES public.menus(id) ON DELETE SET NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_notifications_unread ON public.admin_notifications (is_read) WHERE is_read = false;

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access admin_notifications"
  ON public.admin_notifications FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
