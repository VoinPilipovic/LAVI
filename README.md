# LAVI — Luxury Barber Salon

Ultra-premium salon website and booking platform. Beta MVP.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage)
- Framer Motion + GSAP
- React Hook Form + Zod

## Getting started

```bash
npm install
cp .env.local.example .env.local
# fill in Supabase project URL/keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

- **Palette:** `ink` (#0B0B0C, near-black), `gold` (#C8A464, muted brass
  accent), `ivory` (#F6F3EC, warm off-white). Defined as named Tailwind
  tokens in `tailwind.config.ts` and bridged to shadcn/ui's CSS-variable
  convention in `src/app/globals.css`.
- **Typography:** `Fraunces` (display — tracked-out uppercase for
  headlines, evokes engraved brass signage) paired with `Inter` (body/UI).
  Loaded via `next/font/google` in `src/app/layout.tsx`.
- **Signature motif:** the thin gold hairline divider (`.divider-gold`)
  and widely tracked uppercase eyebrow labels (`.text-eyebrow`), used
  throughout instead of generic card/shadow decoration.
- **Corners:** intentionally sharp (`--radius: 0.25rem`) — precision over
  softness, in keeping with a barbershop's tools-and-craft identity.

## Project structure

See the approved architecture document for the full folder tree and
phase breakdown. Key top-level directories:

- `src/app/` — routes only (App Router), grouped by `(marketing)`,
  `(auth)`, `(admin)`
- `src/actions/` — Server Actions (application layer)
- `src/domain/` — framework-agnostic business rules (booking, etc.)
- `src/schemas/` — Zod validation, shared by forms and server actions
- `src/lib/` — infrastructure (Supabase clients, utils, constants)
- `src/components/` — UI, split by domain area
- `supabase/` — SQL migrations and local project config

## Beta MVP scope

Public marketing site, guest booking (no customer accounts), single
admin login with appointment/availability/service management. Customer
accounts, multi-staff scheduling, analytics, and automated reminders are
out of scope for this release — see the approved architecture doc for
the full post-beta roadmap.

## Build phases

- [x] **Phase 0 — Foundation.** Project scaffolding, design tokens,
      Supabase client setup, base layout/providers, smooth scroll setup.
- [x] **Phase 1 — Marketing landing page.**
- [x] **Phase 2 — Database schema & admin auth.**
- [x] **Phase 3 — Booking domain logic.**
- [x] **Phase 4 — Public booking flow.**
- [x] **Phase 5 — Admin dashboard.**
- [x] **Phase 6 — Hardening & polish.**

See `HANDOFF.md` for the full detail behind each phase.

## Environment variables

See `.env.local.example` for the full list. Supabase keys are required
for the app to run past Phase 2; the marketing page (Phase 1) does not
need a live Supabase project.

## Production deployment checklist

Nothing below has been executed against a real environment yet — this
is the checklist for whoever deploys this for the first time.

1. **Create the Supabase project** and run every migration in
   `supabase/migrations/` in order (`0001` through `0009`).
2. **Create the admin user.** There is no signup flow — run:
   ```bash
   supabase auth users create owner@yourdomain.com --password <password>
   ```
   then insert the matching `admin_profiles` row using the printed user
   id (see `supabase/seed.sql` for the exact statement). Until this is
   done, `/admin-login` has no account that can sign in.
3. **Run `supabase/seed.sql`** for the business profile row and initial
   services (or replace its contents with the real business's data
   before running it).
4. **Set every variable in `.env.local.example`** in the hosting
   provider's environment settings — in particular
   `SUPABASE_SERVICE_ROLE_KEY` must be set server-side only and never
   exposed to the client bundle (it isn't `NEXT_PUBLIC_`-prefixed,
   which is what keeps it server-only in Next.js — do not rename it).
5. **Confirm `NEXT_PUBLIC_SITE_URL`** matches the real production
   domain — it feeds `sitemap.ts`, `robots.ts`, and all OpenGraph tags.
6. **Set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`** to a real embed URL (the
   contact section falls back to a placeholder without it — harmless,
   but not what a paying client wants live).
7. **Read the rate-limiting caveat** in `src/lib/rate-limit.ts` before
   deploying to more than one server instance — its in-memory store
   does not share state across instances. Fine for a single instance;
   needs a shared store (Redis/Vercel KV) otherwise.
8. **Sanity-check `npm run build`** and `npm run test` both pass clean
   before the first deploy, and on every deploy after.
