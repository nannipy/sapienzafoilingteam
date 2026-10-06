BEGIN;
-- Existing articles stay published. New content starts in preparation.
ALTER TABLE public.posts ADD COLUMN status text NOT NULL DEFAULT 'published'
  CHECK (status IN ('draft', 'published'));
ALTER TABLE public.posts ALTER COLUMN status SET DEFAULT 'draft';
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- Restrictive policies combine with existing policies; even broad public reads
-- must satisfy this guard. Authenticated admin access keeps its existing rules.
CREATE POLICY "Hide article drafts from anonymous readers"
  ON public.posts AS RESTRICTIVE FOR SELECT TO anon
  USING (status = 'published');
COMMIT;
