BEGIN;
ALTER TABLE public.team_day_registrations
  DROP CONSTRAINT team_day_registrations_payment_method_check;
ALTER TABLE public.team_day_registrations
  ADD CONSTRAINT team_day_registrations_payment_method_check
  CHECK (payment_method IN ('cash', 'paypal', 'revolut', 'bank_transfer'));
COMMIT;
