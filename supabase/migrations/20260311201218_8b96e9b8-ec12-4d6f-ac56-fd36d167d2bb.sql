
-- Tabelle 1: seasonal_notifications
CREATE TABLE public.seasonal_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seasonal_event text NOT NULL,
  menu_id uuid REFERENCES public.menus(id) ON DELETE SET NULL,
  trigger_type text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'pending',
  total_recipients integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  email_subject jsonb,
  email_body_html jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_by text
);

-- Validation trigger instead of CHECK for trigger_type
CREATE OR REPLACE FUNCTION public.fn_validate_seasonal_notification()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.trigger_type NOT IN ('auto', 'manual') THEN
    RAISE EXCEPTION 'trigger_type must be auto or manual';
  END IF;
  IF NEW.status NOT IN ('pending', 'sending', 'completed', 'failed') THEN
    RAISE EXCEPTION 'status must be pending, sending, completed, or failed';
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_validate_seasonal_notification
  BEFORE INSERT OR UPDATE ON public.seasonal_notifications
  FOR EACH ROW EXECUTE FUNCTION public.fn_validate_seasonal_notification();

CREATE INDEX idx_seasonal_notifications_event ON public.seasonal_notifications (seasonal_event);
CREATE INDEX idx_seasonal_notifications_status ON public.seasonal_notifications (status);

ALTER TABLE public.seasonal_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access seasonal_notifications"
  ON public.seasonal_notifications FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Tabelle 2: seasonal_notification_recipients
CREATE TABLE public.seasonal_notification_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES public.seasonal_notifications(id) ON DELETE CASCADE,
  signup_id uuid REFERENCES public.seasonal_signups(id) ON DELETE SET NULL,
  email text NOT NULL,
  language text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  resend_id text,
  error_message text,
  sent_at timestamptz
);

-- Validation trigger for recipient status
CREATE OR REPLACE FUNCTION public.fn_validate_notification_recipient()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'sent', 'failed') THEN
    RAISE EXCEPTION 'status must be pending, sent, or failed';
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_validate_notification_recipient
  BEFORE INSERT OR UPDATE ON public.seasonal_notification_recipients
  FOR EACH ROW EXECUTE FUNCTION public.fn_validate_notification_recipient();

CREATE INDEX idx_notification_recipients_notification ON public.seasonal_notification_recipients (notification_id);
CREATE INDEX idx_notification_recipients_status ON public.seasonal_notification_recipients (status);

ALTER TABLE public.seasonal_notification_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access seasonal_notification_recipients"
  ON public.seasonal_notification_recipients FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
