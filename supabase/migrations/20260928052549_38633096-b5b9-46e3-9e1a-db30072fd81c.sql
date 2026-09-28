DO $mig$
DECLARE
  h text;
BEGIN
  SELECT substring(pg_get_functiondef('public.maestro_vormerkungen_export(text)'::regprocedure) FROM '''([0-9a-f]{64})''')
    INTO h;
  IF h IS NULL THEN
    RAISE EXCEPTION 'maestro_vormerkungen_export: Vergleichswert nicht gefunden, Abbruch ohne Änderung';
  END IF;

  GRANT SELECT (confirm_token) ON public.seasonal_signups TO maestro_vormerkungen_leser;
  GRANT CREATE ON SCHEMA public TO maestro_vormerkungen_leser;

  DROP FUNCTION public.maestro_vormerkungen_export(text);

  EXECUTE format($f$
    CREATE FUNCTION public.maestro_vormerkungen_export(p_schluessel text)
    RETURNS TABLE (id uuid, email text, seasonal_event text, language text, status text,
                   consent_text text, consent_at timestamptz, consent_ip text,
                   consent_version text, confirmed_at timestamptz, confirm_token uuid)
    LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, extensions
    AS $fn$
      SELECT s.id, s.email, s.seasonal_event, s.language, s.status, s.consent_text,
             s.consent_at, s.consent_ip, s.consent_version, s.confirmed_at, s.confirm_token
        FROM public.seasonal_signups s
       WHERE s.status IN ('confirmed', 'unsubscribed')
         AND encode(extensions.digest(p_schluessel, 'sha256'), 'hex') = %L
    $fn$
  $f$, h);

  ALTER FUNCTION public.maestro_vormerkungen_export(text) OWNER TO maestro_vormerkungen_leser;
  REVOKE CREATE ON SCHEMA public FROM maestro_vormerkungen_leser;
  REVOKE ALL ON FUNCTION public.maestro_vormerkungen_export(text) FROM public;
  GRANT EXECUTE ON FUNCTION public.maestro_vormerkungen_export(text) TO anon;
END
$mig$;