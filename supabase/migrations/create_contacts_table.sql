-- Run this in your Supabase SQL editor
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public contact form submissions)
CREATE POLICY "Allow public inserts" ON contacts
  FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated admin can read
CREATE POLICY "Allow admin reads" ON contacts
  FOR SELECT TO authenticated USING (true);
