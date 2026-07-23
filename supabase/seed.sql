-- ─────────────────────────────────────────────────────────────────
-- seed.sql
-- Local/staging seed data. Run automatically by `supabase db reset`.
--
-- NOTE ON THE ADMIN USER: Supabase Auth users (auth.users) are not
-- seeded here — creating one requires the GoTrue admin API, not plain
-- SQL. Create the salon owner's account with the Supabase CLI:
--
--   supabase auth users create owner@lavi.pt --password <password>
--
-- then insert their admin_profiles row using the printed user id:
--
--   insert into public.admin_profiles (id, full_name)
--   values ('<user-id-from-above>', 'LAVI Owner');
-- ─────────────────────────────────────────────────────────────────

-- Business profile (singleton). Mirrors src/config/business.ts —
-- see that file's comment on keeping the two in sync during the beta.
insert into public.business_profile (
  id, name, description, address, phone, email, instagram_url, working_hours
) values (
  true,
  'LAVI',
  'LAVI is a premium barber salon offering precision cuts, grooming, and a refined experience. Book your appointment online in under a minute.',
  'Rua do Ourives 14, 1200-159 Lisboa',
  '+351 21 456 7890',
  'reserve@lavi.pt',
  'https://instagram.com/lavi',
  '{
    "0": null,
    "1": {"open": "09:00", "close": "19:00"},
    "2": {"open": "09:00", "close": "19:00"},
    "3": {"open": "09:00", "close": "19:00"},
    "4": {"open": "09:00", "close": "20:00"},
    "5": {"open": "09:00", "close": "20:00"},
    "6": {"open": "10:00", "close": "18:00"}
  }'::jsonb
)
on conflict (id) do nothing;

-- Services — matches the static array previously hardcoded in
-- src/components/marketing/services-preview.tsx (now DB-driven).
--
-- Uses a WHERE NOT EXISTS guard rather than ON CONFLICT DO NOTHING:
-- `services` has no unique constraint on `name` (only on the
-- auto-generated `id`), so ON CONFLICT DO NOTHING would never actually
-- trigger here — re-running this script would silently insert
-- duplicate rows. This guard makes re-running `supabase db reset`
-- safe to do more than once.
insert into public.services (name, description, duration_minutes, price, sort_order)
select v.name, v.description, v.duration_minutes, v.price, v.sort_order
from (
  values
    ('Signature Cut', 'Consultation, precision scissor-and-clipper cut, styled finish.', 45, 35.00, 1),
    ('Skin Fade', 'Zero-blend fade with sharp, defined lines.', 45, 40.00, 2),
    ('Beard Sculpt', 'Shape, trim, and line-up with straight razor detailing.', 30, 25.00, 3),
    ('Hot Towel Shave', 'Traditional straight-razor shave, hot towel, finishing balm.', 30, 30.00, 4),
    ('Cut & Beard Combo', 'Signature cut and beard sculpt in one appointment.', 75, 55.00, 5),
    ('Grey Blending', 'Natural-looking colour blend for a lived-in grey.', 50, 45.00, 6)
) as v(name, description, duration_minutes, price, sort_order)
where not exists (
  select 1 from public.services where services.name = v.name
);
