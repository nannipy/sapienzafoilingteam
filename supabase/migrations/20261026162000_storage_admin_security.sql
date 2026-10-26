BEGIN;
-- Restrictive policies combine with existing permissive policies using AND.
-- All images writes use server actions with requireAdmin and service_role.
-- Preserve public reads and other buckets.
CREATE POLICY images_admin_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id <> 'images');
CREATE POLICY images_admin_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (bucket_id <> 'images')
WITH CHECK (bucket_id <> 'images');
CREATE POLICY images_admin_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (bucket_id <> 'images');
UPDATE storage.buckets SET file_size_limit=4194304,
  allowed_mime_types=ARRAY['image/png','image/jpeg','image/gif','image/webp','application/pdf','text/plain']
WHERE id='images';
-- text/plain is needed by the existing empty-folder placeholder workflow.
COMMIT;
