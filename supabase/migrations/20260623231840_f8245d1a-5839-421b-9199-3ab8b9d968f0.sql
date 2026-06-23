-- seasonal_signups: keep public insert, restrict read/update/delete to admins
DROP POLICY IF EXISTS "Authenticated can select signups" ON public.seasonal_signups;
DROP POLICY IF EXISTS "Authenticated can update signups" ON public.seasonal_signups;
DROP POLICY IF EXISTS "Authenticated can delete signups" ON public.seasonal_signups;
CREATE POLICY "Admins can select signups" ON public.seasonal_signups
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update signups" ON public.seasonal_signups
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete signups" ON public.seasonal_signups
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- seasonal_notification_recipients: admin-only
DROP POLICY IF EXISTS "Authenticated full access seasonal_notification_recipients" ON public.seasonal_notification_recipients;
CREATE POLICY "Admins full access seasonal_notification_recipients" ON public.seasonal_notification_recipients
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- seasonal_notifications: admin-only
DROP POLICY IF EXISTS "Authenticated full access seasonal_notifications" ON public.seasonal_notifications;
CREATE POLICY "Admins full access seasonal_notifications" ON public.seasonal_notifications
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- admin_notifications: admin-only
DROP POLICY IF EXISTS "Authenticated full access admin_notifications" ON public.admin_notifications;
CREATE POLICY "Admins full access admin_notifications" ON public.admin_notifications
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- slug_classifications: admin-only writes/reads (edge function uses service_role)
DROP POLICY IF EXISTS "Authenticated full access slug_classifications" ON public.slug_classifications;
CREATE POLICY "Admins full access slug_classifications" ON public.slug_classifications
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- group_menus: keep public read of active menus, restrict writes to admins
DROP POLICY IF EXISTS "Authenticated full access group_menus" ON public.group_menus;
CREATE POLICY "Admins full access group_menus" ON public.group_menus
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- group_menu_settings: keep public read, restrict writes to admins
DROP POLICY IF EXISTS "Authenticated full access group_menu_settings" ON public.group_menu_settings;
CREATE POLICY "Admins full access group_menu_settings" ON public.group_menu_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));