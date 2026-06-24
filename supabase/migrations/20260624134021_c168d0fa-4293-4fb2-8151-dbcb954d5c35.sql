-- Newsletter (Double-Opt-In) fields for seasonal_signups
ALTER TABLE public.seasonal_signups
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS confirm_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_ip text,
  ADD COLUMN IF NOT EXISTS consent_text text,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_version text;

-- Validate status values via trigger (CHECK avoided per guidance)
CREATE OR REPLACE FUNCTION public.fn_validate_seasonal_signup_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'confirmed', 'unsubscribed') THEN
    RAISE EXCEPTION 'status must be pending, confirmed, or unsubscribed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_seasonal_signup_status ON public.seasonal_signups;
CREATE TRIGGER trg_validate_seasonal_signup_status
  BEFORE INSERT OR UPDATE ON public.seasonal_signups
  FOR EACH ROW EXECUTE FUNCTION public.fn_validate_seasonal_signup_status();

-- Revoke anon direct insert: the only way in is now the subscribe-seasonal edge function (service_role).
DROP POLICY IF EXISTS "Anon can insert signups" ON public.seasonal_signups;
REVOKE INSERT ON public.seasonal_signups FROM anon;

-- Ensure service_role retains full access (used by edge functions)
GRANT ALL ON public.seasonal_signups TO service_role;

-- Index for confirm/unsubscribe token lookups
CREATE INDEX IF NOT EXISTS idx_seasonal_signups_confirm_token ON public.seasonal_signups(confirm_token);
CREATE INDEX IF NOT EXISTS idx_seasonal_signups_status ON public.seasonal_signups(status);