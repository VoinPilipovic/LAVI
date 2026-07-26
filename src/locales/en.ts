import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    about: "About",
    services: "Services",
    gallery: "Gallery",
    contact: "Contact",
    bookNow: "Book Now",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    siteNavigation: "Site navigation",
    language: "Language",
  },
  hero: {
    eyebrow: "Lavi — By Appointment",
    headlineLines: ["Precision", "in every detail"],
    subheadline:
      "LAVI is a single-chair barbering atelier — precision cuts, straight-razor " +
      "shaves, and grooming, done properly, with nothing rushed.",
    marqueeWords: ["FADES", "SHAVES", "BEARD SCULPT", "GROOMING", "PRECISION"],
    secondaryCtaLabel: "See the atelier",
    scrollToReveal: "Scroll to reveal",
    imageAlt: "Close-up rear view of a precision skin fade at LAVI barber salon",
    measurementLabels: ["0 MM", "1.5 MM", "3 MM", "BLEND ZONE"],
  },
  about: {
    eyebrow: "Meet the Team",
    headlineLines: ["One salon.", "Two professionals."],
    description:
      "Every client receives the same attention to detail, precision and " +
      "care. Choose the barber whose style suits you best.",
    team: {
      lavi: {
        name: "Lavi",
        role: "Founder",
        bio:
          "Lavinika founded LAVI with a clear vision — that every client " +
          "should leave with more than just a haircut. Precision, attention " +
          "to detail, and a refined experience became the standard the salon " +
          "has followed from day one.",
        cta: "Book with Lavi",
      },
      bugi: {
        name: "Bugi",
        role: "Right-Hand Barber",
        bio:
          "Sebastian was Lavi's first student and is now her right hand. He " +
          "brings the same attention, precision, and philosophy that has " +
          "become LAVI's signature to every client.",
        cta: "Book with Bugi",
      },
    },
    closingStatement: "No matter who you choose, you'll experience the same standard of quality that defines LAVI.",
    imageAlt: "Lavi and Bugi at work inside the LAVI barber salon",
    imageLabel: "The Team",
  },
  services: {
    eyebrow: "Services & Pricing",
    title: "Priced plainly. No surprises at the chair.",
    emptyState: "Services are being updated — check back shortly.",
  },
  gallery: {
    eyebrow: "Inside LAVI",
    title: "Where precision happens.",
    frames: [
      { label: "Classic Fade", alt: "Men's haircut from behind — classic fade with a polished top" },
      { label: "Long Brunette", alt: "Long straight brunette hair, back view" },
      { label: "Blonde", alt: "Straight shoulder-length blonde hair, back view" },
      { label: "Bob Cut", alt: "Blunt shoulder-length bob, back view" },
      { label: "Balayage", alt: "Long hair with a balayage color technique, back view" },
      { label: "Design Fade", alt: "Men's haircut — fade with a shaved geometric design at the back" },
      { label: "Crop Fade", alt: "Men's haircut — textured crop fade, side-back view" },
      { label: "Curly Fade", alt: "Men's haircut — fade with a curly top, side-back view" },
      { label: "Skin Fade", alt: "Men's haircut — low skin fade, close-up back view" },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Find the chair.",
    description:
      "Walk-ins are welcome when there's room on the calendar, but an " +
      "appointment guarantees your slot.",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    closed: "Closed",
    followAlong: "Follow along",
    mapUnavailable: "Map unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to enable.",
  },
  cta: {
    eyebrow: "Reserve Your Chair",
    title: "Slots are limited to one appointment at a time — book ahead.",
  },
  footer: {
    description:
      "LAVI is a premium barber salon offering precision cuts, grooming, and " +
      "a refined experience. Book your appointment online in under a minute.",
    rights: "All rights reserved.",
  },
  booking: {
    header: {
      eyebrow: "Book an Appointment",
      title: "Reserve your chair",
    },
    steps: {
      service: "Service",
      datetime: "Date & Time",
      details: "Details",
      confirm: "Confirm",
    },
    service: {
      emptyState: "No services are available for booking right now. Please check back shortly.",
    },
    datetime: {
      selectDate: "Select a date",
      selectTime: "Select a time",
      changeService: "Change service",
      checkingAvailability: "Checking availability…",
      noTimesAvailable: "No times available on this date. Try another day.",
      closed: "closed",
    },
    details: {
      title: "Your details",
      fullName: "Full name",
      fullNamePlaceholder: "Jane Doe",
      phone: "Phone number",
      phonePlaceholder: "+351 91 234 5678",
      email: "Email (optional)",
      emailPlaceholder: "jane@example.com",
      back: "Back",
      continue: "Continue",
    },
    summary: {
      title: "Review & confirm",
      service: "Service",
      when: "When",
      duration: "Duration",
      price: "Price",
      name: "Name",
      phone: "Phone",
      email: "Email",
      editDetails: "Edit details",
      confirmBooking: "Confirm booking",
      confirming: "Confirming…",
    },
    confirmation: {
      confirmedEyebrow: "Booking Confirmed",
      seeYou: "See you {when}",
      name: "Name",
      service: "Service",
      when: "When",
      duration: "Duration",
      price: "Price",
      cancelBooking: "Cancel this booking",
      cancelling: "Cancelling…",
      cancellationNotice: "Cancellations are accepted up to {hours} hours before your appointment.",
      cancelledTitle: "Booking cancelled",
      cancelledMessage:
        "Your appointment for {service} has been cancelled. We hope to see you another time.",
      notFoundTitle: "Booking not found",
      notFoundMessage: "This confirmation link is missing or invalid.",
      bookAppointment: "Book an appointment",
    },
    errors: {
      LOAD_SERVICES_FAILED: "Could not load services. Please try again.",
      INVALID_REQUEST: "Please check the form and try again.",
      SERVICE_UNAVAILABLE: "This service is not available.",
      AVAILABILITY_CHECK_FAILED: "Could not check availability. Please try again.",
      RATE_LIMIT_PHONE: "Too many booking attempts with this phone number. Please try again later.",
      RATE_LIMIT_IP: "Too many booking attempts. Please try again later.",
      RATE_LIMIT_GENERIC: "Too many attempts. Please try again later.",
      TIME_ALREADY_PASSED: "This time has already passed.",
      MINIMUM_NOTICE_REQUIRED: "Bookings require at least {hours} hours' notice.",
      OUTSIDE_BOOKING_WINDOW: "Bookings can only be made up to {days} days in advance.",
      OUTSIDE_WORKING_HOURS: "This time falls outside working hours.",
      SLOT_TAKEN: "That time was just booked by someone else. Please choose another.",
      SAVE_DETAILS_FAILED: "Could not save your details. Please try again.",
      CREATE_BOOKING_FAILED: "Could not create your booking. Please try again.",
      BOOKING_NOT_FOUND: "Booking not found or this link is invalid.",
      ALREADY_CANCELLED: "This booking has already been cancelled.",
      CANCELLATION_TOO_LATE: "Cancellations must be made at least {hours} hours before your appointment.",
      CANCEL_BOOKING_FAILED: "Could not cancel your booking. Please try again.",
      GENERIC: "Something went wrong. Please try again.",
    },
    validation: {
      nameRequired: "Enter your full name",
      phoneInvalid: "Enter a valid phone number",
      emailInvalid: "Enter a valid email address",
    },
  },
};
