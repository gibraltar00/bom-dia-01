/*
# Storage policies for the scans bucket

Allows authenticated users to upload, read, and delete their own scan
photos under a folder named by their user id.
*/

-- Allow authenticated users to upload files to their own folder
DROP POLICY IF EXISTS "scans_upload_own" ON storage.objects;
CREATE POLICY "scans_upload_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'scans' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read of scan photos (they are shown in the community feed)
DROP POLICY IF EXISTS "scans_read_all" ON storage.objects;
CREATE POLICY "scans_read_all" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'scans');

-- Allow owners to delete their own scans
DROP POLICY IF EXISTS "scans_delete_own" ON storage.objects;
CREATE POLICY "scans_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'scans' AND (storage.foldername(name))[1] = auth.uid()::text);
