
CREATE TABLE public.group_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  menu_key text NOT NULL UNIQUE,
  title jsonb NOT NULL,
  subtitle jsonb NOT NULL,
  badge jsonb,
  items jsonb NOT NULL,
  duration jsonb NOT NULL,
  price_label jsonb NOT NULL,
  price_note jsonb,
  price_amount numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_group_menus_sort ON public.group_menus (sort_order);
CREATE INDEX idx_group_menus_active ON public.group_menus (is_active);

ALTER TABLE public.group_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access group_menus"
  ON public.group_menus FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Public read active group_menus"
  ON public.group_menus FOR SELECT
  USING (is_active = true);

CREATE TABLE public.group_menu_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.group_menu_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access group_menu_settings"
  ON public.group_menu_settings FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Public read group_menu_settings"
  ON public.group_menu_settings FOR SELECT
  USING (true);
