-- Warteliste für Silvester (Freigabe Antoine 15.10.2026, Mockup P3F949gBkgjpguKqdXe9Su).
-- Eigene Tabelle statt Eingriff in seasonal_signups: die dient Valentinstag/BesondererAnlass
-- (nur E-Mail + Double-Opt-in über subscribe-seasonal) und bleibt unverändert.
-- Gäste tragen sich anonym ein (nur INSERT, Status fest 'wartet'); lesen/ändern nur Admins.
-- „Platz anbieten“ ist ein mailto-Link im Admin, keine automatische Mail.
CREATE TABLE public.silvester_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  -- nullable: telefonisch aufgenommene Gäste haben oft keine E-Mail
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 50),
  guests text NOT NULL CHECK (guests IN ('2', '3', '4', '5', '6', '7-10', '10+')),
  time_pref text NOT NULL DEFAULT 'egal' CHECK (time_pref IN ('egal', 'frueh', 'spaet')),
  message text CHECK (message IS NULL OR char_length(message) <= 2000),
  language text NOT NULL DEFAULT 'de' CHECK (language IN ('de', 'en', 'it', 'fr')),
  consent_text text,
  consent_at timestamp with time zone,
  status text NOT NULL DEFAULT 'wartet' CHECK (status IN ('wartet', 'angeboten', 'bestaetigt', 'abgesagt')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

ALTER TABLE public.silvester_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the silvester waitlist"
ON public.silvester_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'wartet' AND consent_at IS NOT NULL);

CREATE POLICY "Admins can manage the silvester waitlist"
ON public.silvester_waitlist
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

GRANT INSERT ON public.silvester_waitlist TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.silvester_waitlist TO authenticated;
GRANT ALL ON public.silvester_waitlist TO service_role;

CREATE TRIGGER update_silvester_waitlist_updated_at
  BEFORE UPDATE ON public.silvester_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- mailto-Vorlage für „Platz anbieten“ (im Admin bearbeitbar, wie die Vormerk-Vorlagen)
INSERT INTO public.seasonal_mailto_templates (seasonal_event, subject, body) VALUES
  (
    'silvester_warteliste',
    'Ein Tisch an Silvester ist frei',
    E'Guten Tag,\n\nSie stehen auf unserer Warteliste für {{EVENT}} – es ist ein Tisch frei geworden. Wenn Sie ihn möchten, antworten Sie bitte kurz auf diese E-Mail oder rufen Sie uns an unter 089 51519696.\n\nViele Grüße\nIhr Team vom Ristorante STORIA'
  )
ON CONFLICT (seasonal_event) DO NOTHING;

-- Schalter „Silvester ausgebucht“ (Admin → Vormerkungen → Silvester). Vorhandene Tabelle
-- group_menu_settings: anon liest (Policy "Public read"), schreiben nur Admins.
-- Startwert true = Warteliste statt Anmeldung (Antoine 15.10.2026: „ab jetzt auf Warteliste“).
INSERT INTO public.group_menu_settings (setting_key, setting_value) VALUES
  ('silvester_ausgebucht', 'true'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;