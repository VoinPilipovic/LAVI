-- ─────────────────────────────────────────────────────────────────
-- 0003_business_profile.sql
-- Singleton table holding the business's editable identity/contact
-- info. In the beta this mirrors src/config/business.ts (which is
-- still what the site actually renders — see that file's comments);
-- this table exists so Phase 5's admin settings page has a real place
-- to write changes to once it's built, without a schema migration at
-- that point. Enforced as a singleton via the CHECK constraint below.
-- ─────────────────────────────────────────────────────────────────

create table public.business_profile (
  id boolean primary key default true,
  name text not null,
  description text not null,
  address text not null,
  phone text not null,
  email text not null,
  instagram_url text,
  -- Keyed by ISO weekday number as text ("0" = Sunday .. "6" = Saturday),
  -- value null means closed. Mirrors the shape of WORKING_HOURS in
  -- src/lib/constants.ts so a future settings UI can write here and
  -- have the booking engine read it directly instead of a code constant.
  working_hours jsonb not null default '{}'::jsonb,
  -- Reserved for a future admin-editable theme (see business.ts theme
  -- comment). Not read at runtime by the beta.
  theme jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),

  constraint business_profile_singleton check (id = true)
);

comment on table public.business_profile is
  'Singleton row (id is always true) holding the business''s customizable identity/contact info.';

create trigger set_business_profile_updated_at
  before update on public.business_profile
  for each row
  execute function public.set_updated_at();
