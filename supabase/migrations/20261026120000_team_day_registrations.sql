BEGIN;
CREATE TABLE public.team_day_registrations (
  id uuid PRIMARY KEY,
  code uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  first_name text NOT NULL CHECK (length(first_name) BETWEEN 1 AND 80),
  last_name text NOT NULL CHECK (length(last_name) BETWEEN 1 AND 80),
  email text NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))),
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'paypal', 'revolut')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  amount_cents integer NOT NULL DEFAULT 1500 CHECK (amount_cents = 1500),
  privacy_version text NOT NULL DEFAULT 'team-day-2026-10-26',
  privacy_accepted_at timestamptz NOT NULL DEFAULT now(),
  source_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX team_day_source_created ON public.team_day_registrations (source_hash, created_at);
ALTER TABLE public.team_day_registrations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.team_day_registrations FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.team_day_registrations TO service_role;

-- Only the server can register attendees. No public read or client-set paid state.
CREATE FUNCTION public.register_team_day(
  p_request_id uuid, p_first_name text, p_last_name text, p_email text,
  p_payment_method text, p_source_hash text
) RETURNS text LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE existing public.team_day_registrations; registration_code uuid;
BEGIN
  -- Serialize retries of the same request across server instances.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  SELECT * INTO existing FROM public.team_day_registrations WHERE id = p_request_id;
  IF FOUND THEN
    IF existing.email <> p_email OR existing.first_name <> p_first_name
      OR existing.last_name <> p_last_name OR existing.payment_method <> p_payment_method THEN
      RAISE EXCEPTION 'Request mismatch' USING ERRCODE = '22023';
    END IF;
    RETURN existing.code::text;
  END IF;
  IF now() >= '2026-11-09 00:00:00 Europe/Rome'::timestamptz THEN
    RAISE EXCEPTION 'Registration closed' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_source_hash, 1));
  IF (SELECT count(*) FROM public.team_day_registrations
      WHERE source_hash = p_source_hash AND created_at > now() - interval '1 hour') >= 100 THEN
    RAISE EXCEPTION 'Rate limit' USING ERRCODE = '54000';
  END IF;
  INSERT INTO public.team_day_registrations (id, first_name, last_name, email, payment_method, source_hash)
    VALUES (p_request_id, p_first_name, p_last_name, p_email, p_payment_method, p_source_hash)
    RETURNING code INTO registration_code;
  RETURN registration_code::text;
END;
$$;
REVOKE ALL ON FUNCTION public.register_team_day(uuid,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_team_day(uuid,text,text,text,text,text) TO service_role;
COMMIT;
