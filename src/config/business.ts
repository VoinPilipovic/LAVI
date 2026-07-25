/**
 * ── BUSINESS CONFIGURATION ──────────────────────────────────────────
 * Locale-agnostic business DATA for this client (LAVI) — identity,
 * contact details, social links, and theme. Everything a visitor reads
 * as language content (headlines, section copy, labels) now lives in
 * `src/locales/*.ts` instead, since it must vary per language — see
 * `src/locales/types.ts` for the full translatable shape. This file
 * only holds facts that stay the same across RS/EN/RO: the address
 * doesn't get translated, the phone number doesn't get translated.
 *
 * Services and prices are NOT configured here — they live in the
 * `services` database table (see supabase/migrations and
 * supabase/seed.sql) so the admin can manage them without a code
 * change.
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

  /**
   * One-line site description, used for SEO metadata only (see the
   * note in src/locales/types.ts on why SEO stays in one language).
   * The footer's visible tagline comes from dict.footer.description.
   */
  description:
    "LAVI is a premium barber salon offering precision cuts, grooming, and " +
    "a refined experience. Book your appointment online in under a minute.",

  /** Contact facts — not translated, the same in every locale. */
  contact: {
    address: "Rua do Ourives 14, 1200-159 Lisboa",
    phone: "+351 21 456 7890",
    email: "reserve@lavi.pt",
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
      ink: "#0A0A0B",
      inkElevated: "#141517",
      inkBorder: "#26282C",
      cloud: "#E7E9EB",
      cloudDim: "#D3D6D9",
      accent: "#609CC7",
      accentBright: "#8ABEE0",
      accentDim: "#3A5C74",
      ivory: "#F0F2F5",
      ivoryDim: "#98A0AA",
      ivoryMuted: "#606770",
    },
    fonts: {
      display: "Fraunces",
      body: "Inter",
    },
  },
} as const;

export type BusinessConfig = typeof businessConfig;
