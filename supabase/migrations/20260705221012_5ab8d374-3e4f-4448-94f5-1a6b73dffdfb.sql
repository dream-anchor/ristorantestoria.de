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
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Nur Administratoren dürfen Menüs veröffentlichen';
  END IF;

  SELECT * INTO v_staging FROM public.menus WHERE id = p_staging_menu_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Staging-Menü % nicht gefunden', p_staging_menu_id;
  END IF;

  IF p_target_menu_id IS NULL OR p_target_menu_id = p_staging_menu_id THEN
    UPDATE public.menus
    SET is_published = true, published_at = now(), updated_at = now()
    WHERE id = p_staging_menu_id;
    RETURN p_staging_menu_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.menus WHERE id = p_target_menu_id) THEN
    RAISE EXCEPTION 'Ziel-Menü % nicht gefunden', p_target_menu_id;
  END IF;

  DELETE FROM public.menu_categories WHERE menu_id = p_target_menu_id;

  UPDATE public.menu_categories
  SET menu_id = p_target_menu_id
  WHERE menu_id = p_staging_menu_id;

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

  DELETE FROM public.menus WHERE id = p_staging_menu_id;

  RETURN p_target_menu_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.publish_menu_atomic(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.publish_menu_atomic(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.publish_menu_atomic(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_menu_atomic(uuid, uuid) TO service_role;