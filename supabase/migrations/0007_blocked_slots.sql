-- ─────────────────────────────────────────────────────────────────
-- 0007_blocked_slots.sql
-- Admin-defined unavailable time ranges (holidays, personal time,
-- maintenance) layered on top of the standing WORKING_HOURS schedule.
-- The availability engine (Phase 3) excludes any candidate slot that
-- overlaps a blocked_slots row, in addition to respecting working hours
-- and existing appointments.
-- ─────────────────────────────────────────────────────────────────

create table public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),

  constraint blocked_slots_time_order check (end_time > start_time)
);

comment on table public.blocked_slots is
  'Admin-defined unavailable time ranges (e.g. holidays, personal time). Layered on top of standing working hours when computing availability.';

create index blocked_slots_start_time_idx on public.blocked_slots (start_time);
