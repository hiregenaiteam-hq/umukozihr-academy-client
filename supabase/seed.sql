-- UmukoziHR Academy Seed Data
-- Run this AFTER rls_policies.sql in Supabase SQL Editor
-- This creates the initial admin user

-- Note: First create the user in Supabase Auth (email: team@umukozihr.com)
-- Then run this to create the admin author record

-- Insert admin author (update supabase_user_id after user is created in Auth)
insert into authors (
  name,
  email,
  bio,
  approved,
  role,
  organization
) values (
  'UmukoziHR Team',
  'team@umukozihr.com',
  'The official UmukoziHR Academy team. Building Africa''s HR knowledge commons.',
  true,
  'admin',
  'UmukoziHR'
) on conflict (email) do update set
  role = 'admin',
  approved = true;

-- After the admin user signs up via Auth, run this to link the accounts:
-- UPDATE authors SET supabase_user_id = '<user-uuid-from-auth>' WHERE email = 'team@umukozihr.com';
