-- ─────────────────────────────────────────────────────────────────
-- 0002_admin_profile.sql
-- Links a Supabase Auth user to the admin role. The beta has exactly
-- one admin (the salon owner), provisioned manually — see seed.sql —
-- but modeling this as its own table (rather than checking a hardcoded
-- user id in RLS policies) means supporting a second admin later is a
-- row insert, not a schema change.
-- ─────────────────────────────────────────────────────────────────

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admin_profiles is
  'One row per admin user. Existence of a row = admin access, checked by RLS policies and the auth server actions.';

create trigger set_admin_profiles_updated_at
  before update on public.admin_profiles
  for each row
  execute function public.set_updated_at();
