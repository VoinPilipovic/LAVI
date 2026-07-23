-- ─────────────────────────────────────────────────────────────────
-- 0008_loyalty_placeholder.sql
-- Schema ONLY — no loyalty UI, points-earning logic, or redemption
-- flow is built in the beta (explicitly out of scope, see architecture
-- doc). This exists so that when the loyalty system is built post-beta,
-- it's additive (new server actions, new UI, a trigger that writes to
-- this ledger on appointment completion) rather than a breaking
-- migration on top of a live appointments table.
-- ─────────────────────────────────────────────────────────────────

create table public.loyalty_ledger (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete set null,
  -- Positive = points earned, negative = points redeemed.
  points integer not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

comment on table public.loyalty_ledger is
  'PLACEHOLDER — schema only, not yet used by any application code. A running ledger of loyalty point events per customer.';

create index loyalty_ledger_customer_id_idx on public.loyalty_ledger (customer_id);
