CREATE TABLE public.seasonal_mailto_templates (
  seasonal_event text PRIMARY KEY,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  updated_at timestamp with time zone DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seasonal_mailto_templates TO authenticated;
GRANT ALL ON public.seasonal_mailto_templates TO service_role;

ALTER TABLE public.seasonal_mailto_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage seasonal mailto templates"
ON public.seasonal_mailto_templates
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_seasonal_mailto_templates_updated_at
  BEFORE UPDATE ON public.seasonal_mailto_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.seasonal_mailto_templates (seasonal_event, subject, body) VALUES
  (
    'valentinstag',
    'Ihr Valentinstag-Menü im STORIA ist da',
    E'Guten Tag,\n\nwir freuen uns, Ihnen mitteilen zu dürfen, dass unser {{EVENT}}-Menü jetzt verfügbar ist. Reservieren Sie gerne Ihren Tisch:\n\nhttps://www.ristorantestoria.de/valentinstag-muenchen/\n\nWir freuen uns auf Ihren Besuch!\n\nViele Grüße\nIhr Team vom Ristorante STORIA'
  ),
  (
    'weihnachten',
    'Ihr Weihnachtsmenü im STORIA ist da',
    E'Guten Tag,\n\nwir freuen uns, Ihnen mitteilen zu dürfen, dass unser {{EVENT}}-Menü jetzt verfügbar ist. Reservieren Sie gerne Ihren Tisch:\n\nhttps://www.ristorantestoria.de/weihnachten-muenchen/\n\nWir freuen uns auf Ihren Besuch!\n\nViele Grüße\nIhr Team vom Ristorante STORIA'
  ),
  (
    'silvester',
    'Ihr Silvester-Menü im STORIA ist da',
    E'Guten Tag,\n\nwir freuen uns, Ihnen mitteilen zu dürfen, dass unser {{EVENT}}-Menü jetzt verfügbar ist. Reservieren Sie gerne Ihren Tisch:\n\nhttps://www.ristorantestoria.de/besondere-anlaesse/silvester/\n\nWir freuen uns auf Ihren Besuch!\n\nViele Grüße\nIhr Team vom Ristorante STORIA'
  );