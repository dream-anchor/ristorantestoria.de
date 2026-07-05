-- Race-Condition-Fix für publish_menu_atomic (Codex-Review PR #32)
--
-- Die zuvor via Lovable eingespielte Version tauscht Kategorien destruktiv,
-- ohne die Ziel-Menü-Zeile zu sperren. Zwei gleichzeitige Publish-Vorgänge
-- auf dasselbe Ziel (z. B. zwei Admin-Tabs) können so interleaven und
-- Kategorien verlieren bzw. doppelt anhängen. Diese Migration ersetzt die
-- Funktion 1:1 – ergänzt aber ein SELECT ... FOR UPDATE auf die Zielzeile,
-- das gleichzeitige Aufrufe serialisiert.
CREATE OR REPLACE FUNCTION public.publish_menu_atomic(
  p_staging_menu_id uuid,
  p_target_menu_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_staging public.menus%ROWTYPE;
BEGIN
  -- Nur Admins dürfen veröffentlichen (SECURITY DEFINER umgeht RLS!)
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Nur Administratoren dürfen Menüs veröffentlichen';
  END IF;

  SELECT * INTO v_staging FROM public.menus WHERE id = p_staging_menu_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Staging-Menü % nicht gefunden', p_staging_menu_id;
  END IF;

  -- Kein bestehendes Ziel-Menü: Staging-Menü direkt veröffentlichen
  IF p_target_menu_id IS NULL OR p_target_menu_id = p_staging_menu_id THEN
    UPDATE public.menus
    SET is_published = true,
        published_at = now(),
        updated_at = now()
    WHERE id = p_staging_menu_id;
    RETURN p_staging_menu_id;
  END IF;

  -- Ziel-Menü-Zeile sperren, bevor destruktiv getauscht wird. Serialisiert
  -- gleichzeitige Publish-Vorgänge auf dasselbe Ziel (z. B. zwei Admin-Tabs):
  -- der zweite Aufruf wartet, bis der erste committet/rollt, und arbeitet dann
  -- auf einem konsistenten Stand statt mit dem ersten zu interleaven.
  PERFORM 1 FROM public.menus WHERE id = p_target_menu_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Ziel-Menü % nicht gefunden', p_target_menu_id;
  END IF;

  -- Alte Kategorien (und deren Items via ON DELETE CASCADE) entfernen
  DELETE FROM public.menu_categories WHERE menu_id = p_target_menu_id;

  -- Neue Kategorien vom Staging- auf das Ziel-Menü umhängen
  UPDATE public.menu_categories
  SET menu_id = p_target_menu_id
  WHERE menu_id = p_staging_menu_id;

  -- Titel/Untertitel übernehmen und veröffentlichen
  -- (Slugs/sort_order des Ziel-Menüs bleiben erhalten – SEO-relevant)
  UPDATE public.menus
  SET title = v_staging.title,
      title_en = v_staging.title_en,
      title_it = v_staging.title_it,
      title_fr = v_staging.title_fr,
      subtitle = v_staging.subtitle,
      subtitle_en = v_staging.subtitle_en,
      subtitle_it = v_staging.subtitle_it,
      subtitle_fr = v_staging.subtitle_fr,
      is_published = true,
      published_at = now(),
      updated_at = now()
  WHERE id = p_target_menu_id;

  -- Staging-Menü aufräumen
  DELETE FROM public.menus WHERE id = p_staging_menu_id;

  RETURN p_target_menu_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.publish_menu_atomic(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.publish_menu_atomic(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.publish_menu_atomic(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_menu_atomic(uuid, uuid) TO service_role;
