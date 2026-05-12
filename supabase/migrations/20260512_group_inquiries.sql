-- group_inquiries: stores all incoming group dining enquiries from /reisegruppen/
CREATE TABLE IF NOT EXISTS public.group_inquiries (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name              text,
  contact_name              text NOT NULL,
  email                     text NOT NULL,
  phone                     text,
  group_size                integer NOT NULL,
  preferred_date            date,
  preferred_date_flexible   boolean NOT NULL DEFAULT false,
  arrival_time              text,
  preferred_menu            text,
  message                   text,
  has_travel_plan           boolean NOT NULL DEFAULT false,
  travel_plan_filename      text,
  language                  text NOT NULL DEFAULT 'de',
  source                    text NOT NULL DEFAULT 'web',
  status                    text NOT NULL DEFAULT 'new',  -- new | in_progress | done | archived
  internal_notes            text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_group_inquiries_email   ON public.group_inquiries (email);
CREATE INDEX idx_group_inquiries_status  ON public.group_inquiries (status);
CREATE INDEX idx_group_inquiries_created ON public.group_inquiries (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_group_inquiries_updated_at
  BEFORE UPDATE ON public.group_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: edge function uses service_role (bypasses RLS).
-- Authenticated admins can read all; no public reads.
ALTER TABLE public.group_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access group_inquiries"
  ON public.group_inquiries FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
