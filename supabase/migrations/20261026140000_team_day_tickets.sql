BEGIN;
-- Additive migration: preserve registration IDs, codes, payments and privacy evidence.
CREATE TABLE public.team_day_events (
 id text PRIMARY KEY, title text NOT NULL, starts_at timestamptz NOT NULL,
 location text NOT NULL, closes_at timestamptz NOT NULL
);
INSERT INTO public.team_day_events VALUES ('sft-day-2026','SFT Day','2026-11-08 11:00 Europe/Rome',
 'Aeroporto dell’Urbe, Via Salaria 825, Roma','2026-11-09 00:00 Europe/Rome');
ALTER TABLE public.team_day_registrations
 ADD COLUMN event_id text NOT NULL DEFAULT 'sft-day-2026' REFERENCES public.team_day_events(id),
 ADD COLUMN participant_snapshot jsonb,
 DROP CONSTRAINT team_day_registrations_amount_cents_check;
ALTER TABLE public.team_day_registrations ADD CONSTRAINT team_day_amount CHECK (amount_cents BETWEEN 1500 AND 15000 AND amount_cents % 1500 = 0);
ALTER TABLE public.team_day_registrations ADD CONSTRAINT team_day_registration_event_unique UNIQUE(id,event_id);
CREATE TABLE public.team_day_participants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 registration_id uuid NOT NULL REFERENCES public.team_day_registrations(id),
 event_id text NOT NULL REFERENCES public.team_day_events(id),
 position integer NOT NULL CHECK (position BETWEEN 0 AND 9),
 first_name text NOT NULL CHECK (length(trim(first_name)) BETWEEN 1 AND 80),
 last_name text NOT NULL CHECK (length(trim(last_name)) BETWEEN 1 AND 80),
 email text CHECK (email IS NULL OR (length(email) BETWEEN 3 AND 254 AND email = lower(trim(email)) AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
 dietary_notes text CHECK (length(dietary_notes) <= 500),
 UNIQUE(registration_id,position), UNIQUE(id,event_id),
 FOREIGN KEY(registration_id,event_id) REFERENCES public.team_day_registrations(id,event_id)
);
CREATE TABLE public.team_day_tickets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 participant_id uuid NOT NULL UNIQUE,
 event_id text NOT NULL REFERENCES public.team_day_events(id),
 code uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
 status text NOT NULL DEFAULT 'valid' CHECK (status IN ('valid','used','cancelled')),
 checked_in_at timestamptz, checked_in_by uuid, cancelled_at timestamptz, cancelled_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(participant_id,event_id) REFERENCES public.team_day_participants(id,event_id)
);
CREATE TABLE public.team_day_ticket_emails (
 id uuid PRIMARY KEY, ticket_id uuid NOT NULL REFERENCES public.team_day_tickets(id),
 recipient text NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sending','sent','failed','review','suppressed')),
 payload jsonb, attempts integer NOT NULL DEFAULT 0, lease_id uuid, lease_until timestamptz,
 first_attempt_at timestamptz, sent_at timestamptz, provider_id text, error text,
 created_at timestamptz NOT NULL DEFAULT now(), next_attempt_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX team_day_participants_registration ON public.team_day_participants(registration_id);
CREATE INDEX team_day_emails_ticket ON public.team_day_ticket_emails(ticket_id,created_at);
CREATE INDEX team_day_emails_pending ON public.team_day_ticket_emails(status,lease_until);

CREATE FUNCTION public.issue_team_day_ticket() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE ticket_id uuid; recipient_email text;
BEGIN
 INSERT INTO team_day_tickets(participant_id,event_id) VALUES(NEW.id,NEW.event_id) RETURNING id INTO ticket_id;
 SELECT coalesce(NEW.email,r.email) INTO recipient_email FROM team_day_registrations r WHERE r.id=NEW.registration_id;
 IF recipient_email IS NOT NULL THEN
  INSERT INTO team_day_ticket_emails(id,ticket_id,recipient) VALUES(ticket_id,ticket_id,recipient_email);
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER issue_team_day_ticket AFTER INSERT ON public.team_day_participants FOR EACH ROW EXECUTE FUNCTION public.issue_team_day_ticket();

-- Backfill exactly one participant and ticket for every existing booking, including no-email bookings.
INSERT INTO public.team_day_participants(registration_id,event_id,position,first_name,last_name,email,dietary_notes)
 SELECT id,event_id,0,first_name,last_name,email,dietary_notes FROM public.team_day_registrations;
UPDATE public.team_day_registrations r SET participant_snapshot=(SELECT jsonb_agg(jsonb_build_object(
 'firstName',p.first_name,'lastName',p.last_name,'email',p.email,'dietaryNotes',p.dietary_notes) ORDER BY position)
 FROM public.team_day_participants p WHERE p.registration_id=r.id);

ALTER FUNCTION public.register_team_day(uuid,text,text,text,text,text,text) RENAME TO register_team_day_legacy;

CREATE FUNCTION public.register_team_day_booking(
 p_request_id uuid,p_first_name text,p_last_name text,p_email text,p_payment_method text,p_source_hash text,
 p_dietary_notes text DEFAULT NULL,p_participants jsonb DEFAULT '[]'
) RETURNS text LANGUAGE plpgsql SET search_path=public AS $$
DECLARE booking public.team_day_registrations; snapshot jsonb; person jsonb; i integer:=0; result text;
BEGIN
 IF jsonb_typeof(p_participants) <> 'array' OR jsonb_array_length(p_participants)>9 THEN RAISE EXCEPTION 'Invalid participants' USING ERRCODE='22023'; END IF;
 snapshot:=jsonb_build_array(jsonb_build_object('firstName',p_first_name,'lastName',p_last_name,'email',NULLIF(trim(p_email),''),'dietaryNotes',NULLIF(trim(p_dietary_notes),''))) || p_participants;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_request_id::text,0));
 SELECT * INTO booking FROM team_day_registrations WHERE id=p_request_id;
 IF FOUND THEN
  IF booking.participant_snapshot IS DISTINCT FROM snapshot OR booking.payment_method<>p_payment_method THEN RAISE EXCEPTION 'Request mismatch' USING ERRCODE='22023'; END IF;
  RETURN booking.code::text;
 END IF;
 result:=public.register_team_day_legacy(p_request_id,p_first_name,p_last_name,p_email,p_payment_method,p_source_hash,p_dietary_notes);
 UPDATE team_day_registrations SET participant_snapshot=snapshot,amount_cents=1500*jsonb_array_length(snapshot) WHERE id=p_request_id;
 FOR person IN SELECT value FROM jsonb_array_elements(snapshot) LOOP
  IF jsonb_typeof(person)<>'object' OR jsonb_typeof(person->'firstName')<>'string' OR jsonb_typeof(person->'lastName')<>'string'
   OR person->>'firstName' ~ '[[:cntrl:]]' OR person->>'lastName' ~ '[[:cntrl:]]'
  THEN RAISE EXCEPTION 'Invalid participant' USING ERRCODE='22023'; END IF;
  INSERT INTO team_day_participants(registration_id,event_id,position,first_name,last_name,email,dietary_notes)
   VALUES(p_request_id,'sft-day-2026',i,person->>'firstName',person->>'lastName',person->>'email',person->>'dietaryNotes');
  i:=i+1;
 END LOOP;
 RETURN result;
END; $$;

-- Keep the previous server deployment compatible during migration rollout.
CREATE FUNCTION public.register_team_day(
 p_request_id uuid,p_first_name text,p_last_name text,p_email text,p_payment_method text,p_source_hash text,p_dietary_notes text DEFAULT NULL
) RETURNS text LANGUAGE sql SET search_path=public AS $$
 SELECT public.register_team_day_booking(p_request_id,p_first_name,p_last_name,p_email,p_payment_method,p_source_hash,p_dietary_notes,'[]'::jsonb);
$$;
REVOKE ALL ON FUNCTION public.register_team_day(uuid,text,text,text,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.register_team_day(uuid,text,text,text,text,text,text) TO service_role;

CREATE FUNCTION public.control_team_day_ticket(p_code uuid,p_event_id text,p_action text,p_actor uuid)
 RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE ticket public.team_day_tickets; person public.team_day_participants;
BEGIN
 IF p_action NOT IN ('verify','check_in','cancel') OR p_actor IS NULL THEN RAISE EXCEPTION 'Invalid action'; END IF;
 SELECT * INTO ticket FROM team_day_tickets WHERE code=p_code AND event_id=p_event_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('result','not_found'); END IF;
 SELECT * INTO person FROM team_day_participants WHERE id=ticket.participant_id;
 IF p_action='cancel' AND ticket.status='valid' THEN
  UPDATE team_day_tickets SET status='cancelled',cancelled_at=now(),cancelled_by=p_actor WHERE id=ticket.id RETURNING * INTO ticket;
 ELSIF p_action='check_in' AND ticket.status='valid' THEN
  UPDATE team_day_tickets SET status='used',checked_in_at=now(),checked_in_by=p_actor WHERE id=ticket.id RETURNING * INTO ticket;
  RETURN jsonb_build_object('result','admitted','ticket',to_jsonb(ticket),'firstName',person.first_name,'lastName',person.last_name);
 END IF;
 RETURN jsonb_build_object('result',ticket.status,'ticket',to_jsonb(ticket),'firstName',person.first_name,'lastName',person.last_name);
END; $$;

CREATE FUNCTION public.queue_team_day_email(p_ticket_id uuid,p_request_id uuid) RETURNS uuid LANGUAGE plpgsql SET search_path=public AS $$
DECLARE ticket public.team_day_tickets; recipient_email text; existing public.team_day_ticket_emails;
BEGIN
 SELECT * INTO ticket FROM team_day_tickets WHERE id=p_ticket_id FOR UPDATE;
 IF NOT FOUND OR ticket.status='cancelled' THEN RAISE EXCEPTION 'Ticket unavailable'; END IF;
 SELECT * INTO existing FROM team_day_ticket_emails WHERE id=p_request_id;
 IF FOUND THEN
  IF existing.ticket_id<>p_ticket_id THEN RAISE EXCEPTION 'Request mismatch'; END IF;
  RETURN existing.id;
 END IF;
 SELECT coalesce(p.email,r.email) INTO recipient_email FROM team_day_participants p JOIN team_day_registrations r ON r.id=p.registration_id WHERE p.id=ticket.participant_id;
 IF recipient_email IS NULL THEN RAISE EXCEPTION 'No recipient'; END IF;
 -- Recovery uses the existing failed/unfinished job, including its provider idempotency key.
 SELECT * INTO existing FROM team_day_ticket_emails WHERE ticket_id=p_ticket_id AND status<>'sent' ORDER BY created_at DESC LIMIT 1;
 IF FOUND THEN RETURN existing.id; END IF;
 IF EXISTS(SELECT 1 FROM team_day_ticket_emails WHERE ticket_id=p_ticket_id AND created_at>now()-interval '1 minute') THEN RAISE EXCEPTION 'Wait before resending'; END IF;
 INSERT INTO team_day_ticket_emails(id,ticket_id,recipient) VALUES(p_request_id,p_ticket_id,recipient_email);
 RETURN p_request_id;
END; $$;

CREATE FUNCTION public.claim_team_day_email(p_id uuid,p_lease uuid) RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE job public.team_day_ticket_emails;
BEGIN
 SELECT * INTO job FROM team_day_ticket_emails WHERE id=p_id FOR UPDATE;
 IF NOT FOUND OR job.status IN ('sent','review','suppressed') OR job.lease_until>now() THEN RETURN NULL; END IF;
 -- Never retry an uncertain provider outcome beyond its 24h deduplication window.
 IF job.first_attempt_at<now()-interval '23 hours' THEN
  UPDATE team_day_ticket_emails SET status='review',error='provider_reconciliation_required' WHERE id=p_id;
  RETURN NULL;
 END IF;
 UPDATE team_day_ticket_emails SET status='sending',lease_id=p_lease,lease_until=now()+interval '2 minutes',attempts=attempts+1
 WHERE id=p_id RETURNING * INTO job;
 RETURN to_jsonb(job);
END; $$;

-- All tables and RPCs are server-only; normal logged-in users cannot bypass admin actions.
ALTER TABLE public.team_day_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_day_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_day_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_day_ticket_emails ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.team_day_events,public.team_day_participants,public.team_day_tickets,public.team_day_ticket_emails FROM anon,authenticated;
GRANT SELECT,INSERT,UPDATE ON public.team_day_events,public.team_day_participants,public.team_day_tickets,public.team_day_ticket_emails TO service_role;
REVOKE ALL ON FUNCTION public.issue_team_day_ticket(),public.register_team_day_booking(uuid,text,text,text,text,text,text,jsonb),public.control_team_day_ticket(uuid,text,text,uuid),public.queue_team_day_email(uuid,uuid),public.claim_team_day_email(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.issue_team_day_ticket(),public.register_team_day_booking(uuid,text,text,text,text,text,text,jsonb),public.control_team_day_ticket(uuid,text,text,uuid),public.queue_team_day_email(uuid,uuid),public.claim_team_day_email(uuid,uuid) TO service_role;
CREATE FUNCTION public.list_team_day_bookings(p_search text DEFAULT '',p_page integer DEFAULT 0)
RETURNS jsonb LANGUAGE sql STABLE SET search_path=public AS $$
 WITH matches AS (
 SELECT r.* FROM team_day_registrations r WHERE event_id='sft-day-2026' AND
 (p_search='' OR strpos(lower(r.first_name||' '||r.last_name||' '||coalesce(r.email,'')||' '||r.code::text),lower(left(p_search,254)))>0
 OR EXISTS(SELECT 1 FROM team_day_participants p JOIN team_day_tickets t ON t.participant_id=p.id
 WHERE p.registration_id=r.id AND strpos(lower(p.first_name||' '||p.last_name||' '||coalesce(p.email,'')||' '||t.code::text),lower(left(p_search,254)))>0))
 ), page AS (SELECT * FROM matches ORDER BY created_at DESC,id LIMIT 50 OFFSET greatest(p_page,0)*50)
 SELECT jsonb_build_object('total',(SELECT count(*) FROM matches),
 'received',coalesce((SELECT sum(amount_cents) FROM matches WHERE payment_status='paid'),0),
 'due',coalesce((SELECT sum(amount_cents) FROM matches WHERE payment_status='pending'),0),
 'rows',coalesce((SELECT jsonb_agg(to_jsonb(r)-'source_hash'-'participant_snapshot'||jsonb_build_object('tickets',
 coalesce((SELECT jsonb_agg(jsonb_build_object('id',t.id,'code',t.code,'status',t.status,'checked_in_at',t.checked_in_at,
 'participant_id',p.id,'event_id',p.event_id,'firstName',p.first_name,'lastName',p.last_name,'email',p.email,'deliveryEmail',coalesce(p.email,r.email),'dietaryNotes',p.dietary_notes,
 'emailStatus',coalesce((SELECT e.status FROM team_day_ticket_emails e WHERE e.ticket_id=t.id ORDER BY created_at DESC LIMIT 1),CASE WHEN p.email IS NULL THEN 'no_email' ELSE 'pending' END),
 'emailSentAt',(SELECT e.sent_at FROM team_day_ticket_emails e WHERE e.ticket_id=t.id ORDER BY created_at DESC LIMIT 1)) ORDER BY p.position)
 FROM team_day_participants p JOIN team_day_tickets t ON t.participant_id=p.id WHERE p.registration_id=r.id),'[]'::jsonb))) FROM page r),'[]'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.list_team_day_bookings(text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.list_team_day_bookings(text,integer) TO service_role;

COMMIT;
