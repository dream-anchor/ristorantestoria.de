CREATE TABLE public.google_business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.google_business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.google_business_settings
  FOR ALL TO public
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Admins can read settings" ON public.google_business_settings
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));