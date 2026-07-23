-- ─────────────────────────────────────────────────────────────────
-- 0006_appointments.sql
-- The core booking record. Guest details are captured directly on the
-- appointment (source of truth for that booking) plus a link to
-- `customers` (upserted by phone) for repeat-guest recognition.
--
-- Double-booking prevention is enforced HERE, at the database level,
-- via an exclusion constraint — not only in application code. This is
-- the real last line of defense: even a race condition between two
-- simultaneous booking requests cannot create overlapping appointments.
-- Application-level checks (src/domain/booking, built in Phase 3) exist
-- for good UX (rejecting an unavailable slot before the user submits),
-- not as the only safeguard.
-- ─────────────────────────────────────────────────────────────────

create extension if not exists "btree_gist";

create type public.appointment_status as enum (
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),

  -- Guest details as submitted for this specific booking.
  guest_name text not null,
  guest_phone text not null,
  guest_email text,

  -- Recognized repeat customer, if any (upserted by phone at booking time).
  customer_id uuid references public.customers (id) on delete set null,

  service_id uuid not null references public.services (id) on delete restrict,

  start_time timestamptz not null,
  end_time timestamptz not null,

  status public.appointment_status not null default 'confirmed',
  notes text,

  -- Lets a guest cancel their own booking from the confirmation page
  -- link (Phase 4) without an account or login — knowledge of this
  -- token is what authorizes the cancellation.
  cancellation_token uuid not null default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint appointments_time_order check (end_time > start_time)
);

comment on table public.appointments is
  'Bookings. Guest-submitted, no account required. Double-booking is prevented by the exclusion constraint below, independent of application code.';

-- No two non-cancelled appointments may occupy overlapping time ranges.
-- Single-chair salon in the beta, so this applies globally (no
-- per-barber partitioning yet — see architecture doc's multi-staff
-- note for the post-beta version).
alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    tstzrange(start_time, end_time) with &&
  )
  where (status <> 'cancelled');

create index appointments_start_time_idx on public.appointments (start_time);
create index appointments_customer_id_idx on public.appointments (customer_id);
create unique index appointments_cancellation_token_key on public.appointments (cancellation_token);

create trigger set_appointments_updated_at
  before update on public.appointments
  for each row
  execute function public.set_updated_at();
