DO $mig$
DECLARE
  h text;
BEGIN
  SELECT substring(pg_get_functiondef('public.maestro_vormerkungen_export(text)'::regprocedure) FROM '''([0-9a-f]{64})''')
    INTO h;
  IF h IS NULL THEN
    RAISE EXCEPTION 'maestro_saisonmenues_export: Vergleichswert nicht gefunden, Abbruch ohne Änderung';
  END IF;

  GRANT SELECT (id, title, is_published, published_at) ON public.menus TO maestro_vormerkungen_leser;
  GRANT SELECT (menu_id, classified_as, created_at) ON public.slug_classifications TO maestro_vormerkungen_leser;
  DROP POLICY IF EXISTS "MAESTRO liest Menues" ON public.menus;
  CREATE POLICY "MAESTRO liest Menues" ON public.menus FOR SELECT TO maestro_vormerkungen_leser USING (is_published);
  DROP POLICY IF EXISTS "MAESTRO liest Klassifizierung" ON public.slug_classifications;
  CREATE POLICY "MAESTRO liest Klassifizierung" ON public.slug_classifications FOR SELECT TO maestro_vormerkungen_leser USING (true);
  GRANT CREATE ON SCHEMA public TO maestro_vormerkungen_leser;

  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION public.maestro_saisonmenues_export(p_schluessel text)
    RETURNS TABLE (id uuid, title text, seasonal_event text, published_at timestamptz)
    LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, extensions
    AS $fn$
      SELECT m.id, m.title, c.classified_as, m.published_at
        FROM public.menus m
        JOIN LATERAL (SELECT sc.classified_as FROM public.slug_classifications sc
                       WHERE sc.menu_id = m.id AND sc.classified_as IS NOT NULL
                       ORDER BY sc.created_at DESC LIMIT 1) c ON true
       WHERE m.is_published
         AND encode(extensions.digest(p_schluessel, 'sha256'), 'hex') = %L
    $fn$
  $f$, h);

  ALTER FUNCTION public.maestro_saisonmenues_export(text) OWNER TO maestro_vormerkungen_leser;
  REVOKE CREATE ON SCHEMA public FROM maestro_vormerkungen_leser;
  REVOKE ALL ON FUNCTION public.maestro_saisonmenues_export(text) FROM public;
  GRANT EXECUTE ON FUNCTION public.maestro_saisonmenues_export(text) TO anon;
END
$mig$;