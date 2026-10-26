BEGIN;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- Remove permissive legacy policies, including policies applying to PUBLIC.
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='posts'
  LOOP EXECUTE format('DROP POLICY %I ON public.posts', p.policyname); END LOOP;
END $$;
REVOKE ALL ON public.posts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO service_role;
CREATE POLICY posts_public_read_published ON public.posts
  FOR SELECT TO anon, authenticated USING (status = 'published');
COMMIT;
