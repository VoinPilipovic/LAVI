-- ─────────────────────────────────────────────────────────────────
-- 0009_rls_policies.sql
-- Enables Row Level Security on every table and defines who can do
-- what. General shape:
--   - Content that's meant to be public (business_profile, active
--     services, blocked_slots) is readable by anyone, writable only
--     by the admin.
--   - Anything containing guest PII (customers, appointments,
--     loyalty_ledger) has NO anonymous policies at all — not even
--     INSERT. Guest booking creation, guest cancellation, and the
--     booking confirmation page (built in Phase 4) go through Server
--     Actions using the service-role admin client
--     (src/lib/supabase/admin.ts), which validates booking rules and
--     the guest's cancellation token in application code before
--     touching these tables. This keeps RLS on these tables simple
--     and strict (admin-only) instead of trying to express
--     "knows the right token" as a policy.
-- ─────────────────────────────────────────────────────────────────

-- Checks whether the currently authenticated user is the admin.
-- SECURITY DEFINER + a fixed search_path avoids recursive-RLS issues
-- when this is used inside a policy on admin_profiles itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_profiles where id = auth.uid()
  );
$$;

-- ── admin_profiles ────────────────────────────────────────────────
alter table public.admin_profiles enable row level security;

create policy "Admin can read own profile"
  on public.admin_profiles for select
  using (id = auth.uid());

create policy "Admin can update own profile"
  on public.admin_profiles for update
  using (id = auth.uid());

-- ── business_profile ──────────────────────────────────────────────
alter table public.business_profile enable row level security;

create policy "Anyone can read business profile"
  on public.business_profile for select
  using (true);

create policy "Admin can update business profile"
  on public.business_profile for update
  using (public.is_admin());

-- ── services ───────────────────────────────────────────────────────
alter table public.services enable row level security;

create policy "Anyone can read active services"
  on public.services for select
  using (is_active = true or public.is_admin());

create policy "Admin can insert services"
  on public.services for insert
  with check (public.is_admin());

create policy "Admin can update services"
  on public.services for update
  using (public.is_admin());

create policy "Admin can delete services"
  on public.services for delete
  using (public.is_admin());

-- ── blocked_slots ─────────────────────────────────────────────────
alter table public.blocked_slots enable row level security;

create policy "Anyone can read blocked slots"
  on public.blocked_slots for select
  using (true);

create policy "Admin can insert blocked slots"
  on public.blocked_slots for insert
  with check (public.is_admin());

create policy "Admin can delete blocked slots"
  on public.blocked_slots for delete
  using (public.is_admin());

-- ── customers ─────────────────────────────────────────────────────
-- No anonymous policies — see file header. Admin-only access; guest
-- booking writes go through the service-role client server-side.
alter table public.customers enable row level security;

create policy "Admin can read customers"
  on public.customers for select
  using (public.is_admin());

create policy "Admin can update customers"
  on public.customers for update
  using (public.is_admin());

-- ── appointments ──────────────────────────────────────────────────
-- No anonymous policies — see file header.
alter table public.appointments enable row level security;

create policy "Admin can read appointments"
  on public.appointments for select
  using (public.is_admin());

create policy "Admin can update appointments"
  on public.appointments for update
  using (public.is_admin());

-- ── loyalty_ledger ────────────────────────────────────────────────
alter table public.loyalty_ledger enable row level security;

create policy "Admin can read loyalty ledger"
  on public.loyalty_ledger for select
  using (public.is_admin());
