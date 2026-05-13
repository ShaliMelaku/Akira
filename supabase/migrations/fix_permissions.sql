-- 1. Fix Portfolio Table Permissions
-- Drop the restrictive admin-only policy
DROP POLICY IF EXISTS "Admin can do everything on portfolio." ON public.portfolio;

-- Allow anyone to read the portfolio
CREATE POLICY "Public portfolio is viewable by everyone." ON public.portfolio FOR SELECT USING (true);

-- Allow anyone to insert, update, and delete (For local admin dashboard without Auth)
CREATE POLICY "Allow all inserts to portfolio" ON public.portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates to portfolio" ON public.portfolio FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes to portfolio" ON public.portfolio FOR DELETE USING (true);

-- 2. Fix Storage Bucket Permissions for akira_media
-- Allow public viewing of images
CREATE POLICY "Public media is viewable by everyone." ON storage.objects FOR SELECT USING ( bucket_id = 'akira_media' );

-- Allow public uploading of images (For local admin dashboard without Auth)
CREATE POLICY "Allow all uploads to media" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'akira_media' );
CREATE POLICY "Allow all updates to media" ON storage.objects FOR UPDATE USING ( bucket_id = 'akira_media' );
CREATE POLICY "Allow all deletes to media" ON storage.objects FOR DELETE USING ( bucket_id = 'akira_media' );
