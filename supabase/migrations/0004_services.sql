-- ─────────────────────────────────────────────────────────────────
-- 0004_services.sql
-- Services and prices — admin-manageable (Phase 5) instead of
-- hardcoded in the UI. The marketing page's services section (Phase 1)
-- and the booking flow (Phase 4) both read from this table.
-- ─────────────────────────────────────────────────────────────────

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10, 2) not null check (price >= 0),
  is_active boolean not null default true,
  -- Explicit display order rather than relying on created_at, so the
  -- admin can reorder services without changing "newest first" semantics.
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.services is
  'Bookable services and their prices. Managed by the admin (Phase 5); read publicly by the marketing site and booking flow.';

create index services_active_sort_idx
  on public.services (sort_order)
  where is_active = true;

create trigger set_services_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();
