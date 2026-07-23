# LAVI — Project Handoff (Post-Beta-Review, after Phase 6)

**Purpose of this document:** a new conversation with no prior context
should be able to read this file alone and understand the full state
of the project, including the full-codebase review that followed
Phase 6 and every fix it produced.

---

## 1. Project summary

LAVI is a Beta MVP web application for a luxury barber salon, built as
a **reusable, white-label template** — the same codebase should be
easy to re-skin for other service businesses (auto detailing,
restaurants, dental clinics, beauty salons) by editing configuration,
not component code.

**Stack (locked in, do not substitute):** Next.js 15 (App Router) +
TypeScript, Tailwind CSS + shadcn/ui, Supabase (Postgres/Auth),
Framer Motion + GSAP, React Hook Form + Zod, date-fns + date-fns-tz.
No React Native/Expo.

**Explicitly OUT of scope** (unchanged, do not build until explicitly
told): customer accounts/registration/dashboard, multiple barbers/
staff management, analytics/revenue charts, cron jobs/automated
reminders, webhooks, Instagram API integration, advanced loyalty
dashboard, reviews management, SR/EN localization.

---

## 2. Status

All six phases (0–6) of the approved beta scope are complete, **plus**
a full-codebase review pass (this document's primary update) that
found and fixed 6 confirmed issues without changing architecture,
without redesigning anything, and without adding new files beyond
what Phase 6 already introduced. See §8 for full detail.

**There is still no Phase 7 in the approved plan.** Any further work
(multi-barber, SR/EN localization, real loyalty system, customer
accounts, analytics, a `business_profile` settings UI) is new scope
the user must explicitly request.

---

## 3–7: Architecture, database, auth, white-label, domain logic, hardening

**Unchanged in shape from the Phase 6 handoff.** Refer to that
content (prior conversation / version history) for full detail on:
- Clean Architecture layering
- The full 9-migration Supabase schema and RLS policy shape
- The admin-vs-guest Supabase client split (`requireAdmin()` vs
  `createAdminClient()`)
- The booking domain logic and its DST-safe timezone handling
- The Phase 6 rate limiter and its documented single-instance caveat

**What changed in this review pass:** several long-standing
white-label consistency gaps in `src/config/business.ts`-adjacent code
were found and closed (see §8) — the white-label *system* itself
(the config file, the CSS-variable theme bridge, the DB-driven
services table) was already correctly designed; what was wrong was a
handful of components built in earlier phases that never got updated
to actually *read* from it.

---

## 8. Full beta review (this session)

### Methodology and a real limitation, stated plainly

This review was conducted by systematic static reading and
cross-referencing — extracting every internal `@/...` import across
the codebase and verifying it resolves to a real file and a real
exported symbol, cross-checking every Supabase Server Action against
the actual migration column definitions, tracing the booking/admin
flows by hand, and grep-based scans for typos, `any` usage,
inconsistent naming, and stale docs.

**This environment has no network access**, so `npm install` fails
(confirmed: `npm error 403` against the registry), meaning **no
`tsc`, `next build`, or `vitest` run was possible.** Everything below
was verified by careful manual reading, not by an actual compiler or
test run. Before shipping, run this yourself as the authoritative
check:
```bash
npm install
npm run type-check
npm run build
npm run test
```

### Confirmed issues found and fixed

1. **White-label hardcoding regressions** — several components built
   in earlier phases never got updated to read from
   `business.ts`/`site.ts`, despite the white-label refactor's own
   rule that business-specific content belongs there:
   - `components/shared/loader.tsx` hardcoded the wordmark text
     `"Lavi"` → now reads `businessConfig.logoText`.
   - `components/marketing/google-map.tsx` hardcoded
     `title="LAVI location..."` and didn't import `businessConfig` at
     all → now uses `businessConfig.name`.
   - `components/marketing/instagram-link.tsx` hardcoded literal
     `"@lavi"` text → now derives the handle from
     `siteConfig.links.instagram`.
   - `src/config/site.ts`'s `defaultTitle` hardcoded
     `"— Luxury Barber Salon"` directly → added a new
     `businessConfig.category` field ("Luxury Barber Salon") and
     `site.ts` now references it, so the category descriptor is
     config-driven like everything else.
   - `src/app/manifest.ts` and `src/app/layout.tsx`'s `viewport` both
     hardcoded `"#0B0B0C"` → both now reference
     `businessConfig.theme.colors.ink`, the same value already
     documented there as the theme reference.

2. **Dead config wiring:**
   - `src/lib/seo.ts`'s `buildMetadata()` declared `siteConfig.ogImage`
     but never actually used it in the `openGraph`/`twitter` blocks —
     social previews got no image even after a real one was added at
     that path. Now wired into both.
   - `.env.local.example` documented `NEXT_PUBLIC_SITE_NAME` but no
     code anywhere reads it (only `NEXT_PUBLIC_SITE_URL` is used) —
     removed the line, added a comment pointing to `business.ts` as
     the actual place to change the site name.

3. **Admin flow edge case:** `updateAppointmentStatus()` didn't
   special-case the Postgres `23P01` exclusion-constraint error the
   way `createBooking()` already did. Scenario: admin cancels an
   appointment → someone else books that freed slot → admin tries to
   un-cancel the original appointment → the update now collides with
   the new booking's time range. Previously this returned a generic
   "Could not update this appointment." Now it returns "This time slot
   is no longer free — another appointment now overlaps it."

4. **Security consistency gap:** `cancelBooking()` and
   `getBookingConfirmation()` returned different messages for
   "appointment id doesn't exist" vs. "id exists but token is wrong" —
   a minor enumeration side-channel that directly contradicted the
   precedent `signInAdmin()` set in Phase 2 (never reveal which half of
   a check failed). Both now return the same message
   ("Booking not found or this link is invalid.") for both cases.

5. **Seed script idempotency bug:** `supabase/seed.sql`'s services
   insert used `on conflict do nothing` with **no matching unique
   constraint** — `services` has no unique index on `name`, only on
   the auto-generated `id`. Re-running `supabase db reset` would
   silently insert duplicate services rather than skip them, despite
   looking guarded. Rewritten as an explicit
   `INSERT ... SELECT ... WHERE NOT EXISTS` guard, which is actually
   idempotent.

6. **Accessibility gap (cross-cutting):** none of the four forms in
   the app (`guest-details-form.tsx`, `admin-login/page.tsx`,
   `services-manager.tsx`'s `ServiceForm`, `availability-manager.tsx`)
   associated their validation error text with the corresponding input
   via `aria-invalid`/`aria-describedby`. A screen reader user tabbing
   to an invalid field got no indication anything was wrong. All four
   now have `aria-invalid`/`aria-describedby` wired to a matching
   `id="<field>-error"` on the error paragraph (which also already had,
   or now has, `role="alert"` for when the error first appears).

### Reviewed, found clean (no action needed)

- Every `@/...` import across the codebase resolves to a real file and
  a real exported symbol — checked exhaustively, not spot-checked.
- Every Server Action's Supabase `.insert()`/`.update()`/`.select()`
  column list matches the actual migration schema exactly (checked
  `services`, `customers`, `appointments`, `blocked_slots` column by
  column).
- Every RLS policy's actual permission shape matches what each Server
  Action assumes (e.g. `getAllServices()` relying on `is_admin()`
  making inactive services visible to the admin — confirmed correct).
- File naming is consistently kebab-case throughout; no typos found
  via targeted grep; no explicit `any` usage anywhere; no stray
  `console.log`; no `TODO`/`FIXME` markers left behind.
- The `contact-section.tsx` working-hours grouping algorithm was
  traced by hand against the real `WORKING_HOURS` data and confirmed
  to produce the correct "Mon–Wed / Thu–Fri / Sat / Sun" grouping.
- The booking flow's zone-safety pattern (pass `"YYYY-MM-DD"` strings
  across the Server Action boundary, anchor to local noon server-side)
  is applied consistently everywhere it needs to be.
- `next/navigation`'s `redirect()` being typed `never` correctly
  enables the `if (!user) redirect(...)` / use-after narrowing pattern
  used in `(admin)/layout.tsx` and `auth.actions.ts` — not a bug.
- Every package imported in source code is declared in `package.json`
  (`@radix-ui/react-dialog`, `-toast`, `-select` are declared but
  currently unused — harmless, not a functional issue, left alone).
- Every environment variable read via `process.env` in code is
  documented in `.env.local.example` (after fixing item 2 above).

### Remaining risks (not fixed — explained why, not silently dropped)

- **`public/` directory doesn't exist on disk at all** — `manifest.ts`
  references `/icons/icon-192.png` / `icon-512.png`, and `site.ts`
  references `/images/og-image.jpg` (now actually wired into metadata,
  see fix #2 above), and none of these files exist. This has been true
  since Phase 0 (no real photography/brand assets have ever been
  supplied) and is **not something to fix by inventing placeholder
  binary files** — that would ship worse-than-nothing fake assets. Add
  real icon/OG-image files under `public/` before launch.
- **Cancellation/confirmation tokens travel in the URL query string**
  (`?token=...`). This is a standard, accepted tradeoff for a
  no-login, no-account guest flow (the same pattern as password-reset
  or unsubscribe links) — not a code bug, but worth knowing it means
  the token can end up in browser history or reverse-proxy access
  logs. No clean fix exists within the beta's no-account design; flag
  to the user if this becomes a real concern.
- **GSAP's `gsap/dist/ScrollTrigger` import path** (used in
  `use-smooth-scroll.ts` and `use-scroll-animation.ts`) could not be
  verified against an actual installed `node_modules` in this
  environment. It matches a widely-used pattern from GSAP + Next.js
  integration guides and is very likely fine, but confirm it resolves
  cleanly on the first real `npm install`/`npm run build`.
- **No automated test coverage for `src/lib/rate-limit.ts`** — the
  domain layer (`booking-rules.ts`, `availability.ts`) has unit tests;
  the Phase 6 rate limiter does not. Consider adding
  `tests/unit/rate-limit.test.ts` if this logic becomes more complex
  than the current simple fixed-window counter.
- **`@radix-ui/react-dialog`, `-toast`, `-select` are declared
  dependencies but never imported anywhere** — harmless dead weight,
  not a functional risk, left alone per "don't create/remove things
  without a confirmed reason."

---

## 9. Complete current folder structure

**Unchanged from the Phase 6 handoff's tree** — this review pass
edited 15 existing files and created zero new ones. See that handoff
for the full tree; every path listed there is still accurate.

---

## 10. Remaining phases

**None, within the originally approved beta scope.** Explicitly still
out of scope until requested: multi-barber/multi-resource scheduling,
SR/EN (or any) localization, a `business_profile` settings UI,
real loyalty system, customer accounts, analytics.

---

## 11. Process rules established across this project

Carry every one of these forward into any future work:

- Generate/edit ONLY the requested scope; never jump ahead.
- Complete files only — never partial, never silently truncated.
- Never regenerate an existing file from scratch; edit via targeted
  replacement, and **explain the reason before editing**.
- Print `FILE:` + the relative path immediately before each new file.
- End each unit of work with an explicit **Completed** / **Remaining**
  list, then stop and wait for approval before continuing.
- Keep the codebase white-label friendly: business-specific copy goes
  in `business.ts`; business-specific *data* goes in Supabase. **This
  review found several places where earlier phases broke this rule —
  re-check new components against `business.ts` before assuming
  they're white-label-clean just because the pattern exists
  elsewhere in the codebase.**
- Never pass a bare `Date` instant across a Server Action boundary for
  "a calendar day" — pass a `"YYYY-MM-DD"` string and anchor it
  server-side in `SALON_TIMEZONE`.
- Authenticated-admin Server Actions use the RLS-respecting client
  (`requireAdmin()`); no-session/guest Server Actions use the
  service-role admin client (`createAdminClient()`).
- Document known limitations honestly in code/docs rather than hiding
  them (rate limiter's single-instance caveat, the `public/` assets
  gap, the token-in-URL tradeoff — all stated plainly, not glossed
  over).
- **New from this review:** when a security-sensitive check has
  multiple failure branches (wrong id vs. wrong token, wrong email vs.
  wrong password), return the SAME generic message for all of them —
  don't let error text become an enumeration side-channel. Apply this
  test to any new auth/token-based check added later.
- **New from this review:** an `ON CONFLICT DO NOTHING` clause is only
  as good as the unique constraint it targets — verify one actually
  exists before relying on it for idempotency, in any future seed data
  or upsert logic.
