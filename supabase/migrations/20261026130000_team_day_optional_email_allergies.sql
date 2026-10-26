BEGIN;

ALTER TABLE public.team_day_registrations
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE public.team_day_registrations
  DROP CONSTRAINT IF EXISTS team_day_registrations_email_check;

ALTER TABLE public.team_day_registrations
  ADD CONSTRAINT team_day_registrations_email_check
  CHECK (email IS NULL OR (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email))));

ALTER TABLE public.team_day_registrations
  ADD COLUMN IF NOT EXISTS dietary_notes text
  CHECK (dietary_notes IS NULL OR length(dietary_notes) <= 500);

DROP FUNCTION IF EXISTS public.register_team_day(uuid, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.register_team_day(
  p_request_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_payment_method text,
  p_source_hash text,
  p_dietary_notes text DEFAULT NULL
) RETURNS text LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  existing public.team_day_registrations;
  registration_code uuid;
  v_email text;
  v_dietary_notes text;
BEGIN
  v_email := NULLIF(trim(p_email), '');
  v_dietary_notes := NULLIF(trim(p_dietary_notes), '');

  -- Serialize retries of the same request across server instances.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  SELECT * INTO existing FROM public.team_day_registrations WHERE id = p_request_id;
  IF FOUND THEN
    IF existing.email IS DISTINCT FROM v_email
      OR existing.first_name <> p_first_name
      OR existing.last_name <> p_last_name
      OR existing.payment_method <> p_payment_method
      OR existing.dietary_notes IS DISTINCT FROM v_dietary_notes THEN
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
  INSERT INTO public.team_day_registrations (id, first_name, last_name, email, payment_method, source_hash, dietary_notes)
    VALUES (p_request_id, p_first_name, p_last_name, v_email, p_payment_method, p_source_hash, v_dietary_notes)
    RETURNING code INTO registration_code;
  RETURN registration_code::text;
END;
$$;

REVOKE ALL ON FUNCTION public.register_team_day(uuid,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_team_day(uuid,text,text,text,text,text,text) TO service_role;

COMMIT;
