BEGIN;
CREATE TABLE IF NOT EXISTS public.public_action_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0)
);
ALTER TABLE public.public_action_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.public_action_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_action_limits TO service_role;
-- Atomic and shared across instances. Keys contain HMACs, never IPs or emails.
CREATE OR REPLACE FUNCTION public.consume_public_action_limit(p_key text, p_limit integer, p_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE n integer;
BEGIN
  IF p_limit NOT BETWEEN 1 AND 1000 OR p_seconds NOT BETWEEN 1 AND 86400 OR length(p_key) > 150 THEN
    RAISE EXCEPTION 'Invalid limit';
  END IF;
  INSERT INTO public.public_action_limits AS l VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    attempts = CASE WHEN l.window_start <= now() - make_interval(secs => p_seconds) THEN 1 ELSE least(l.attempts + 1, p_limit + 1) END,
    window_start = CASE WHEN l.window_start <= now() - make_interval(secs => p_seconds) THEN now() ELSE l.window_start END
  RETURNING attempts INTO n;
  DELETE FROM public.public_action_limits WHERE window_start < now() - interval '2 days';
  RETURN n <= p_limit;
END $$;
REVOKE ALL ON FUNCTION public.consume_public_action_limit(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_public_action_limit(text,integer,integer) TO service_role;
COMMIT;
