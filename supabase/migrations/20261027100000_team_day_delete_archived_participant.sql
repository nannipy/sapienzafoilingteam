BEGIN;

-- Permanently remove one archived participant and its ticket/email data.
-- Keep a shared booking while any other participant remains.
CREATE FUNCTION public.delete_archived_team_day_participant(p_participant_id uuid, p_event_id text)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  person public.team_day_participants;
  remaining_people integer;
BEGIN
  SELECT * INTO person
  FROM public.team_day_participants
  WHERE id = p_participant_id AND event_id = p_event_id
  FOR UPDATE;

  IF NOT FOUND OR person.archived_at IS NULL THEN
    RAISE EXCEPTION 'Archived participant not found' USING ERRCODE = '22023';
  END IF;

  -- Serialize cleanup for participants sharing a booking.
  PERFORM 1 FROM public.team_day_registrations WHERE id = person.registration_id FOR UPDATE;

  DELETE FROM public.team_day_ticket_emails
  WHERE ticket_id IN (SELECT id FROM public.team_day_tickets WHERE participant_id = person.id);
  DELETE FROM public.team_day_tickets WHERE participant_id = person.id;
  DELETE FROM public.team_day_participants WHERE id = person.id;

  SELECT count(*) INTO remaining_people
  FROM public.team_day_participants
  WHERE registration_id = person.registration_id;

  IF remaining_people = 0 THEN
    DELETE FROM public.team_day_registrations WHERE id = person.registration_id;
    RETURN jsonb_build_object('bookingDeleted', true);
  END IF;

  RETURN jsonb_build_object('bookingDeleted', false);
END;
$$;

REVOKE ALL ON FUNCTION public.delete_archived_team_day_participant(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_archived_team_day_participant(uuid, text) TO service_role;

COMMIT;
