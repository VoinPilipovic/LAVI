-- ─────────────────────────────────────────────────────────────────
-- 0001_init_schema.sql
-- Extensions and shared utilities used across every later migration.
-- ─────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- Generic trigger function: keeps an `updated_at` column current on
-- every UPDATE. Attached per-table in each table's own migration so
-- each migration stays self-contained and re-orderable.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Sets updated_at = now() on row update. Attach as a BEFORE UPDATE trigger.';
