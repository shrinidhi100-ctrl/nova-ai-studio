REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

DROP POLICY "projects_select" ON public.projects;
CREATE POLICY "projects_select_public" ON public.projects FOR SELECT TO anon USING (is_public);
CREATE POLICY "projects_select_auth" ON public.projects FOR SELECT TO authenticated USING (is_public OR user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));