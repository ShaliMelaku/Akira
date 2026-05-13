-- Run this in your Supabase SQL editor to fix service deployment

-- Create table if not already present
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Voiceover',
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow admin inserts" ON services;
DROP POLICY IF EXISTS "Allow admin reads" ON services;
DROP POLICY IF EXISTS "Allow admin updates" ON services;
DROP POLICY IF EXISTS "Allow admin deletes" ON services;
DROP POLICY IF EXISTS "Allow public reads" ON services;

-- Authenticated users (admin) can do everything
CREATE POLICY "Allow admin full access" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public can only read active services
CREATE POLICY "Allow public reads" ON services
  FOR SELECT TO anon USING (is_active = true);
