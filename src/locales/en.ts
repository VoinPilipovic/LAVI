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
    eyebrow: "About LAVI",
    title: "No front desk. No rotation of barbers. Just the work.",
    description:
      "LAVI was built around a simple idea: a haircut is a craft, not a " +
      "transaction. There's one chair, one barber, and one appointment at a " +
      "time — so the person in the chair gets full attention from the first " +
      "towel to the final line-up.",
    philosophy: ["Precision over speed.", "Craft over convenience.", "One client, full attention."],
    imageAlt: "The chair at LAVI",
    imageLabel: "The Chair",
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
      { label: "The Salon", alt: "The LAVI salon interior — white cabinetry, black fixtures, chrome tools" },
      { label: "The Chair", alt: "A single barber chair facing the mirror" },
      { label: "Certificates & Awards", alt: "Framed certificates and trophies on display" },
      { label: "The Barber Pole", alt: "The barber pole, its light the one blue accent in the room" },
      { label: "The Atelier at Work", alt: "Inside the working LAVI atelier" },
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
