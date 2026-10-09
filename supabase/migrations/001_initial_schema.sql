-- =============================================================
-- Pekanbaru Xchange Mall - Visitor Survey Database Schema
-- =============================================================
-- Run this SQL in the Supabase SQL Editor to create the tables,
-- RLS policies, and required functions.
-- =============================================================

-- 1. Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Section A: Profil Pengunjung
  visitor_name TEXT NOT NULL,
  age_group TEXT NOT NULL CHECK (age_group IN ('< 17 Tahun', '17–24 Tahun', '25–34 Tahun', '35–54 Tahun', '> 55 Tahun')),
  gender TEXT NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
  city TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  promo_consent BOOLEAN NOT NULL DEFAULT false,
  
  -- Section B: Kebiasaan Kunjungan
  visit_frequency TEXT NOT NULL CHECK (visit_frequency IN ('Pertama kali', '1–2 kali per bulan', '1 kali per minggu', '> 2 kali per minggu')),
  visit_purpose TEXT NOT NULL CHECK (visit_purpose IN ('Makan/Kuliner', 'Hiburan/Entertainment', 'Nongkrong/Santai', 'Belanja/Shopping', 'Lainnya')),
  visit_purpose_other TEXT,
  companions TEXT NOT NULL CHECK (companions IN ('Sendiri', 'Pasangan', 'Teman', 'Keluarga')),
  
  -- Section C: Kuliner & Tenant F&B
  food_variety TEXT NOT NULL CHECK (food_variety IN ('Sangat lengkap', 'Cukup lengkap', 'Kurang beragam')),
  desired_fnb_tenants JSONB NOT NULL DEFAULT '[]'::jsonb,
  dining_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
  requested_tenants TEXT NOT NULL,
  
  -- Section D: Hiburan, Event & Aktivitas
  entertainment_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  family_entertainment_importance TEXT NOT NULL CHECK (family_entertainment_importance IN ('Sangat penting', 'Penting', 'Biasa saja', 'Tidak penting')),
  desired_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  event_visit_interest TEXT NOT NULL CHECK (event_visit_interest IN ('Sangat tertarik', 'Tertarik', 'Kurang tertarik')),
  preferred_visit_time TEXT NOT NULL CHECK (preferred_visit_time IN ('Weekdays siang', 'Weekdays sore/malam', 'Weekend siang', 'Weekend sore/malam')),
  
  -- Section E: Promo & Media Informasi
  preferred_promotions JSONB NOT NULL DEFAULT '[]'::jsonb,
  visit_duration TEXT NOT NULL CHECK (visit_duration IN ('< 1 jam', '1–2 jam', '2–3 jam', '> 3 jam')),
  estimated_spending TEXT NOT NULL CHECK (estimated_spending IN ('< Rp100.000', 'Rp100.000–Rp500.000', '> Rp500.000')),
  promotion_information_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  effective_media_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Section F: Evaluasi Pengalaman Pengunjung
  satisfaction_level TEXT NOT NULL CHECK (satisfaction_level IN ('Sangat Puas', 'Puas', 'Cukup', 'Kurang Puas')),
  visitor_suggestions TEXT NOT NULL,
  revisit_intention TEXT NOT NULL CHECK (revisit_intention IN ('Ya', 'Mungkin', 'Tidak')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create indexes for common query patterns
CREATE INDEX idx_survey_responses_created_at ON survey_responses (created_at DESC);
CREATE INDEX idx_survey_responses_age_group ON survey_responses (age_group);
CREATE INDEX idx_survey_responses_gender ON survey_responses (gender);
CREATE INDEX idx_survey_responses_city ON survey_responses (city);
CREATE INDEX idx_survey_responses_satisfaction ON survey_responses (satisfaction_level);
CREATE INDEX idx_survey_responses_visit_purpose ON survey_responses (visit_purpose);

-- 3. Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================

-- 4. Enable RLS on survey_responses
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 5. Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 6. Policy: Allow anonymous users to INSERT survey responses only
CREATE POLICY "Allow anonymous survey submissions"
  ON survey_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 7. Policy: Only authorized admins can SELECT survey responses
CREATE POLICY "Only admins can read survey responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- 8. Policy: Prevent UPDATE on survey responses (no one can update)
-- (No UPDATE policy = no updates allowed with RLS enabled)

-- 9. Policy: Prevent DELETE on survey responses (no one can delete)
-- (No DELETE policy = no deletes allowed with RLS enabled)

-- 10. Policy: Only admins can read admin_users table
CREATE POLICY "Only admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- 11. No INSERT/UPDATE/DELETE policies on admin_users
-- Admin users can only be managed via Supabase Dashboard or service role key

-- =============================================================
-- Helper function to check admin status
-- =============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- SETUP: Creating the first admin user
-- =============================================================
-- After creating a user account in Supabase Auth (Dashboard > Authentication > Users > Add User),
-- run the following SQL in the SQL Editor to grant admin privileges:
--
-- INSERT INTO admin_users (id) VALUES ('paste-the-user-uuid-here');
--
-- You can find the user UUID in the Supabase Dashboard under Authentication > Users.
-- =============================================================
