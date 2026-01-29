-- Create landingpage_content table for storing AI-generated content for SEO landing pages
CREATE TABLE public.landingpage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  
  -- Dynamic content (JSONB for flexibility)
  menu_highlights jsonb DEFAULT '[]'::jsonb,
  featured_items jsonb DEFAULT '[]'::jsonb,
  prices_summary jsonb DEFAULT '{}'::jsonb,
  
  -- AI-generated texts (4 languages)
  intro_de text,
  intro_en text,
  intro_it text,
  intro_fr text,
  
  highlights_text_de text,
  highlights_text_en text,
  highlights_text_it text,
  highlights_text_fr text,
  
  -- Optional seasonal metadata
  season_info jsonb DEFAULT '{}'::jsonb,
  
  -- Tracking metadata
  source_menu_ids uuid[] DEFAULT '{}'::uuid[],
  last_menu_hash text,
  last_successful_update timestamp with time zone,
  last_check timestamp with time zone,
  update_status text DEFAULT 'pending',
  items_found_count integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.landingpage_content ENABLE ROW LEVEL SECURITY;

-- Public read access for all visitors
CREATE POLICY "Public read access for landingpage content"
ON public.landingpage_content
FOR SELECT
USING (true);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
ON public.landingpage_content
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Admin can also manage content
CREATE POLICY "Admins can manage landingpage content"
ON public.landingpage_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_landingpage_content_updated_at
  BEFORE UPDATE ON public.landingpage_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for all 8 landing pages
INSERT INTO public.landingpage_content (page_slug, season_info) VALUES
  ('neapolitanische-pizza-muenchen', '{}'::jsonb),
  ('aperitivo-muenchen', '{}'::jsonb),
  ('wild-essen-muenchen', '{"start_month": 9, "end_month": 1, "label_de": "Wildsaison: September bis Januar", "label_en": "Game season: September to January", "label_it": "Stagione della selvaggina: Settembre a Gennaio", "label_fr": "Saison du gibier: Septembre à Janvier", "in_season_badge_de": "Jetzt verfügbar", "in_season_badge_en": "Now available", "in_season_badge_it": "Disponibile ora", "in_season_badge_fr": "Disponible maintenant", "out_of_season_badge_de": "Vorfreude auf die nächste Saison", "out_of_season_badge_en": "Looking forward to next season", "out_of_season_badge_it": "In attesa della prossima stagione", "out_of_season_badge_fr": "En attendant la prochaine saison"}'::jsonb),
  ('lunch-muenchen-maxvorstadt', '{}'::jsonb),
  ('firmenfeier-muenchen', '{}'::jsonb),
  ('geburtstagsfeier-muenchen', '{}'::jsonb),
  ('romantisches-dinner-muenchen', '{}'::jsonb),
  ('eventlocation-muenchen-maxvorstadt', '{}'::jsonb);