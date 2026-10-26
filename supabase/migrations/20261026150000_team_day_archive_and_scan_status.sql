BEGIN;
-- Admin archive + payment/entry status returned by the QR scan.
ALTER TABLE public.team_day_participants
 ADD COLUMN archived_at timestamptz,
 ADD COLUMN archived_by uuid;
CREATE INDEX team_day_participants_archived ON public.team_day_participants(archived_at) WHERE archived_at IS NOT NULL;

-- The scan now reports the booking payment state and refuses archived people.
CREATE OR REPLACE FUNCTION public.control_team_day_ticket(p_code uuid,p_event_id text,p_action text,p_actor uuid)
 RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE ticket public.team_day_tickets; person public.team_day_participants; booking public.team_day_registrations;
BEGIN
 IF p_action NOT IN ('verify','check_in','cancel') OR p_actor IS NULL THEN RAISE EXCEPTION 'Invalid action'; END IF;
 SELECT * INTO ticket FROM team_day_tickets WHERE code=p_code AND event_id=p_event_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('result','not_found'); END IF;
 SELECT * INTO person FROM team_day_participants WHERE id=ticket.participant_id;
 SELECT * INTO booking FROM team_day_registrations WHERE id=person.registration_id;
 IF person.archived_at IS NOT NULL THEN
  RETURN jsonb_build_object('result','archived','ticket',to_jsonb(ticket),'firstName',person.first_name,'lastName',person.last_name,
   'paymentStatus',booking.payment_status,'paymentMethod',booking.payment_method,'amountCents',booking.amount_cents,'registrationId',booking.id,'archivedAt',person.archived_at);
 END IF;
 IF p_action='cancel' AND ticket.status='valid' THEN
  UPDATE team_day_tickets SET status='cancelled',cancelled_at=now(),cancelled_by=p_actor WHERE id=ticket.id RETURNING * INTO ticket;
 ELSIF p_action='check_in' AND ticket.status='valid' THEN
  UPDATE team_day_tickets SET status='used',checked_in_at=now(),checked_in_by=p_actor WHERE id=ticket.id RETURNING * INTO ticket;
  RETURN jsonb_build_object('result','admitted','ticket',to_jsonb(ticket),'firstName',person.first_name,'lastName',person.last_name,
   'paymentStatus',booking.payment_status,'paymentMethod',booking.payment_method,'amountCents',booking.amount_cents,'registrationId',booking.id);
 END IF;
 RETURN jsonb_build_object('result',ticket.status,'ticket',to_jsonb(ticket),'firstName',person.first_name,'lastName',person.last_name,
  'paymentStatus',booking.payment_status,'paymentMethod',booking.payment_method,'amountCents',booking.amount_cents,'registrationId',booking.id);
END; $$;

-- Archived people are hidden from the default admin list and its counters.
DROP FUNCTION public.list_team_day_bookings(text,integer);
CREATE FUNCTION public.list_team_day_bookings(p_search text DEFAULT '',p_page integer DEFAULT 0,p_include_archived boolean DEFAULT false)
RETURNS jsonb LANGUAGE sql STABLE SET search_path=public AS $$
 WITH active AS (
 SELECT r.* FROM team_day_registrations r WHERE event_id='sft-day-2026' AND
 (p_include_archived OR EXISTS(SELECT 1 FROM team_day_participants p WHERE p.registration_id=r.id AND p.archived_at IS NULL))
 ), matches AS (
 SELECT r.* FROM active r WHERE
 (p_search='' OR strpos(lower(r.first_name||' '||r.last_name||' '||coalesce(r.email,'')||' '||r.code::text),lower(left(p_search,254)))>0
 OR EXISTS(SELECT 1 FROM team_day_participants p JOIN team_day_tickets t ON t.participant_id=p.id
 WHERE p.registration_id=r.id AND (p_include_archived OR p.archived_at IS NULL)
 AND strpos(lower(p.first_name||' '||p.last_name||' '||coalesce(p.email,'')||' '||t.code::text),lower(left(p_search,254)))>0))
 ), page AS (SELECT * FROM matches ORDER BY created_at DESC,id LIMIT 50 OFFSET greatest(p_page,0)*50)
 SELECT jsonb_build_object('total',(SELECT count(*) FROM matches),
 'people',(SELECT count(*) FROM team_day_participants p JOIN matches m ON m.id=p.registration_id WHERE p_include_archived OR p.archived_at IS NULL),
 'entered',(SELECT count(*) FROM team_day_participants p JOIN matches m ON m.id=p.registration_id JOIN team_day_tickets t ON t.participant_id=p.id
  WHERE t.status='used' AND (p_include_archived OR p.archived_at IS NULL)),
 'received',coalesce((SELECT sum(amount_cents) FROM matches WHERE payment_status='paid'),0),
 'due',coalesce((SELECT sum(amount_cents) FROM matches WHERE payment_status='pending'),0),
 'rows',coalesce((SELECT jsonb_agg(to_jsonb(r)-'source_hash'-'participant_snapshot'||jsonb_build_object('tickets',
 coalesce((SELECT jsonb_agg(jsonb_build_object('id',t.id,'code',t.code,'status',t.status,'checked_in_at',t.checked_in_at,
 'participant_id',p.id,'event_id',p.event_id,'firstName',p.first_name,'lastName',p.last_name,'email',p.email,'deliveryEmail',coalesce(p.email,r.email),'dietaryNotes',p.dietary_notes,
 'paymentStatus',r.payment_status,'paymentMethod',r.payment_method,'archivedAt',p.archived_at,
 'emailStatus',coalesce((SELECT e.status FROM team_day_ticket_emails e WHERE e.ticket_id=t.id ORDER BY created_at DESC LIMIT 1),CASE WHEN p.email IS NULL THEN 'no_email' ELSE 'pending' END),
 'emailSentAt',(SELECT e.sent_at FROM team_day_ticket_emails e WHERE e.ticket_id=t.id ORDER BY created_at DESC LIMIT 1)) ORDER BY p.position)
 FROM team_day_participants p JOIN team_day_tickets t ON t.participant_id=p.id
 WHERE p.registration_id=r.id AND (p_include_archived OR p.archived_at IS NULL)),'[]'::jsonb))) FROM page r),'[]'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.list_team_day_bookings(text,integer,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.list_team_day_bookings(text,integer,boolean) TO service_role;

COMMIT;
