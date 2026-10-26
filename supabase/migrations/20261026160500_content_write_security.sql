BEGIN;
-- All content mutations are performed by the server after requireAdmin().
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.events, public.open_positions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events, public.open_positions TO service_role;
COMMIT;
