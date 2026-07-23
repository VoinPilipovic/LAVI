-- ─────────────────────────────────────────────────────────────────
-- 0005_customers.sql
-- Minimal customer records built from guest bookings. This is NOT a
-- customer account system — there is no login, no password, no
-- customer-facing dashboard in the beta (see architecture doc). It
-- exists so the admin has a running record of who has booked, and so
-- the loyalty ledger (0008) and future customer accounts have a
-- stable id to reference instead of a schema change later.
-- ─────────────────────────────────────────────────────────────────

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.customers is
  'Guest customer records, upserted by phone number when a booking is created. No login/auth associated.';

-- Phone is how a repeat guest is recognized across bookings — one
-- customer record per phone number.
create unique index customers_phone_key on public.customers (phone);

create trigger set_customers_updated_at
  before update on public.customers
  for each row
  execute function public.set_updated_at();
