/**
 * ── BUSINESS CONFIGURATION ──────────────────────────────────────────
 * The single source of truth for everything specific to THIS client
 * (LAVI). This codebase is built as a reusable template — adapting it
 * for a different business (auto detailing, restaurant, dental clinic,
 * beauty salon, etc.) should mean editing this file, swapping images
 * under /public/images, and updating the Supabase seed data — not
 * touching component code.
 *
 * Where content still lives in a component instead of here, it's
 * because it's structural (how a section is laid out) rather than
 * content (what it says) — see each component's comments.
 *
 * Services and prices are NOT configured here — they live in the
 * `services` database table (see supabase/migrations and
 * supabase/seed.sql) so the admin can manage them without a code
 * change. This file covers content that isn't yet worth a database
 * round trip: identity, copy, contact details, and the working hours
 * schedule (also mirrored in src/lib/constants.ts for the booking
 * engine — see the note on that file).
 * ─────────────────────────────────────────────────────────────────
 */

export type BusinessVertical =
  | "barber_salon"
  | "auto_detailing"
  | "restaurant"
  | "dental_clinic"
  | "beauty_salon";

export const businessConfig = {
  /** Documents which template variant this deployment is — informational only today. */
  vertical: "barber_salon" as BusinessVertical,

  /** Legal/display name of the business. */
  name: "LAVI",

  /** Short wordmark used by the <Logo /> component (kept distinct from `name` in case they diverge). */
  logoText: "Lavi",

  /** Short category descriptor appended to page titles, e.g. "LAVI — Luxury Barber Salon". */
  category: "Luxury Barber Salon",

  /** One-line site description, used for SEO and the footer. */
  description:
    "LAVI is a premium barber salon offering precision cuts, grooming, and " +
    "a refined experience. Book your appointment online in under a minute.",

  /** Hero section content. */
  hero: {
    eyebrow: "Lisbon — By Appointment",
    headlineLines: ["One chair.", "Undivided attention."],
    subheadline:
      "LAVI is a single-chair barbering atelier — precision cuts, straight-razor " +
      "shaves, and grooming, done properly, with nothing rushed.",
    /** Words cycled through the hero's signature scrolling marquee band. */
    marqueeWords: ["FADES", "SHAVES", "BEARD SCULPT", "GROOMING", "PRECISION"],
    secondaryCtaLabel: "See the atelier",
  },

  /** About section content. */
  about: {
    eyebrow: "About LAVI",
    title: "No front desk. No rotation of barbers. Just the work.",
    description:
      "LAVI was built around a simple idea: a haircut is a craft, not a " +
      "transaction. There's one chair, one barber, and one appointment at a " +
      "time — so the person in the chair gets full attention from the first " +
      "towel to the final line-up.",
    quickFacts: [
      { label: "Founded", value: "2019" },
      { label: "Chairs", value: "One" },
      { label: "Appointment length", value: "30–75 min" },
    ],
  },

  /** Services section heading copy (the services themselves are DB-driven). */
  services: {
    eyebrow: "Services & Pricing",
    title: "Priced plainly. No surprises at the chair.",
  },

  /** Gallery section heading copy. */
  gallery: {
    eyebrow: "Gallery",
    title: "A look inside the work.",
  },

  /** Contact section content. */
  contact: {
    eyebrow: "Contact",
    title: "Find the chair.",
    description:
      "Walk-ins are welcome when there's room on the calendar, but an " +
      "appointment guarantees your slot.",
    address: "Rua do Ourives 14, 1200-159 Lisboa",
    phone: "+351 21 456 7890",
    email: "reserve@lavi.pt",
  },

  /** Final CTA section content. */
  cta: {
    eyebrow: "Reserve Your Chair",
    title: "Slots are limited to one appointment at a time — book ahead.",
  },

  /** Social links. Instagram is a static outbound link in the beta — no API integration. */
  social: {
    instagram: "https://instagram.com/lavi",
  },

  /**
   * Theme reference. These hex values are mirrored (not read at build
   * time) in `src/app/globals.css` (`:root` CSS custom properties) and
   * documented in `tailwind.config.ts`. Re-skinning a client's colors
   * today means updating those two files to match this object — there
   * is no runtime/DB-driven theme engine in the beta. The
   * `business_profile.theme` JSONB column (see Phase 2 migrations)
   * reserves space for a future admin-editable theme without requiring
   * a schema change later.
   */
  theme: {
    colors: {
      ink: "#0B0B0C",
      inkElevated: "#151517",
      inkBorder: "#232324",
      gold: "#C8A464",
      goldBright: "#E4C384",
      goldDim: "#8A7245",
      ivory: "#F6F3EC",
      ivoryDim: "#A8A39A",
      ivoryMuted: "#6E6A62",
    },
    fonts: {
      display: "Fraunces",
      body: "Inter",
    },
  },
} as const;

export type BusinessConfig = typeof businessConfig;
