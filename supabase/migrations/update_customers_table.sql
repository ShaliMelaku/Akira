-- 1. Rename domain to website_url
ALTER TABLE public.customers RENAME COLUMN domain TO website_url;

-- 2. Add logo_url column
ALTER TABLE public.customers ADD COLUMN logo_url TEXT;

-- 3. Fix Row Level Security permissions for Customers (to allow public viewing and local admin uploading)
DROP POLICY IF EXISTS "Admin can do everything on customers." ON public.customers;
DROP POLICY IF EXISTS "Public customers is viewable by everyone." ON public.customers;
DROP POLICY IF EXISTS "Allow all inserts to customers" ON public.customers;
DROP POLICY IF EXISTS "Allow all updates to customers" ON public.customers;
DROP POLICY IF EXISTS "Allow all deletes to customers" ON public.customers;

CREATE POLICY "Public customers is viewable by everyone." ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow all inserts to customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates to customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes to customers" ON public.customers FOR DELETE USING (true);
