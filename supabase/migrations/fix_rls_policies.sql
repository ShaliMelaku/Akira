-- Relax RLS policies to allow management without full auth setup for now
-- This ensures that admin operations (delete/update) actually persist in the database

DROP POLICY IF EXISTS "Admin can do everything on services." ON public.services;
CREATE POLICY "Manage services" ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do everything on settings." ON public.settings;
CREATE POLICY "Manage settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do everything on portfolio." ON public.portfolio;
CREATE POLICY "Manage portfolio" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can do everything on customers." ON public.customers;
CREATE POLICY "Manage customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
