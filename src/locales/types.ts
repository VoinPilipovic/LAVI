/**
 * Shape of every translatable string on the public marketing site. Kept
 * separate from `businessConfig` (src/config/business.ts), which now
 * holds only locale-agnostic business DATA — name, contact details,
 * social links, theme — while this holds language CONTENT. Each locale
 * file (rs.ts, en.ts, ro.ts) implements this interface in full so a
 * missing translation is a type error, not a silent English fallback.
 *
 * SEO metadata (document <title>/<meta description>, generated
 * server-side in src/lib/seo.ts) is intentionally NOT part of this
 * dictionary — it's rendered before the client can know the visitor's
 * chosen locale, so it stays in the site's default language. Everything
 * inside the rendered page is covered here.
 */
export interface Dictionary {
  nav: {
    about: string;
    services: string;
    gallery: string;
    contact: string;
    bookNow: string;
    openMenu: string;
    closeMenu: string;
    siteNavigation: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    headlineLines: [string, string];
    subheadline: string;
    marqueeWords: string[];
    secondaryCtaLabel: string;
    scrollToReveal: string;
    imageAlt: string;
    /** The four measurement callouts, in FADE_POINTS order: 0mm, 1.5mm, 3mm, blend zone. */
    measurementLabels: [string, string, string, string];
  };
  about: {
    eyebrow: string;
    /** Two-line editorial headline, revealed as separate lines. */
    headlineLines: [string, string];
    description: string;
    team: {
      lavi: { name: string; role: string; bio: string; cta: string };
      bugi: { name: string; role: string; bio: string; cta: string };
    };
    closingStatement: string;
    imageAlt: string;
    imageLabel: string;
  };
  services: {
    eyebrow: string;
    title: string;
    emptyState: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    frames: {
      label: string;
      alt: string;
    }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    /** Sunday through Saturday, matching WORKING_HOURS's 0=Sunday indexing. */
    days: [string, string, string, string, string, string, string];
    closed: string;
    followAlong: string;
    mapUnavailable: string;
  };
  cta: {
    eyebrow: string;
    title: string;
  };
  footer: {
    description: string;
    rights: string;
  };
  booking: {
    header: {
      eyebrow: string;
      title: string;
    };
    steps: {
      service: string;
      datetime: string;
      details: string;
      confirm: string;
    };
    service: {
      emptyState: string;
    };
    datetime: {
      selectDate: string;
      selectTime: string;
      changeService: string;
      checkingAvailability: string;
      noTimesAvailable: string;
      /** Suffix used in the closed-day aria-label: "{weekday} {day} — {closed}". */
      closed: string;
    };
    details: {
      title: string;
      fullName: string;
      fullNamePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      back: string;
      continue: string;
    };
    summary: {
      title: string;
      service: string;
      when: string;
      duration: string;
      price: string;
      name: string;
      phone: string;
      email: string;
      editDetails: string;
      confirmBooking: string;
      confirming: string;
    };
    confirmation: {
      confirmedEyebrow: string;
      /** "{when}" placeholder, replaced with the formatted appointment date/time. */
      seeYou: string;
      name: string;
      service: string;
      when: string;
      duration: string;
      price: string;
      cancelBooking: string;
      cancelling: string;
      /** "{hours}" placeholder, replaced with CANCELLATION_CUTOFF_HOURS. */
      cancellationNotice: string;
      cancelledTitle: string;
      /** "{service}" placeholder, replaced with the service name. */
      cancelledMessage: string;
      notFoundTitle: string;
      notFoundMessage: string;
      bookAppointment: string;
    };
    /**
     * Server Actions (src/actions/booking.actions.ts) return a stable
     * error CODE (e.g. "SLOT_TAKEN"), never an English sentence — the
     * server has no way to know the visitor's locale, since locale is
     * client-only state. `src/lib/booking-errors.ts` maps a code to
     * this locale's text. GENERIC is the fallback for an unrecognized
     * code. MINIMUM_NOTICE_REQUIRED/OUTSIDE_BOOKING_WINDOW/
     * CANCELLATION_TOO_LATE contain a "{hours}"/"{days}" placeholder.
     */
    errors: {
      LOAD_SERVICES_FAILED: string;
      INVALID_REQUEST: string;
      SERVICE_UNAVAILABLE: string;
      AVAILABILITY_CHECK_FAILED: string;
      RATE_LIMIT_PHONE: string;
      RATE_LIMIT_IP: string;
      RATE_LIMIT_GENERIC: string;
      TIME_ALREADY_PASSED: string;
      MINIMUM_NOTICE_REQUIRED: string;
      OUTSIDE_BOOKING_WINDOW: string;
      OUTSIDE_WORKING_HOURS: string;
      SLOT_TAKEN: string;
      SAVE_DETAILS_FAILED: string;
      CREATE_BOOKING_FAILED: string;
      BOOKING_NOT_FOUND: string;
      ALREADY_CANCELLED: string;
      CANCELLATION_TOO_LATE: string;
      CANCEL_BOOKING_FAILED: string;
      GENERIC: string;
    };
    /** Client-side form validation messages (react-hook-form + zod). */
    validation: {
      nameRequired: string;
      phoneInvalid: string;
      emailInvalid: string;
    };
  };
}
