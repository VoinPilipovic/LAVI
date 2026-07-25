import type { Dictionary } from "./types";

export const ro: Dictionary = {
  nav: {
    about: "Despre",
    services: "Servicii",
    gallery: "Galerie",
    contact: "Contact",
    bookNow: "Programează-te",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
    siteNavigation: "Navigare site",
    language: "Limbă",
  },
  hero: {
    eyebrow: "Lavi — Doar cu programare",
    headlineLines: ["Precizie", "în fiecare detaliu"],
    subheadline:
      "LAVI este un atelier de bărbierit cu un singur scaun — tunsori de " +
      "precizie, bărbierit cu briciul și îngrijire, făcute cum trebuie, fără grabă.",
    marqueeWords: ["TUNSORI FADE", "BĂRBIERIT", "CONTURARE BARBĂ", "ÎNGRIJIRE", "PRECIZIE"],
    secondaryCtaLabel: "Vezi atelierul",
    scrollToReveal: "Derulează pentru a descoperi",
    imageAlt: "Prim-plan din spate al unui fade de precizie la salonul de bărbierit LAVI",
    measurementLabels: ["0 MM", "1.5 MM", "3 MM", "ZONĂ DE TRANZIȚIE"],
  },
  about: {
    eyebrow: "Despre LAVI",
    title: "Fără recepție. Fără rotație de bărbieri. Doar muncă.",
    description:
      "LAVI a fost construit în jurul unei idei simple: o tunsoare este o " +
      "meserie, nu o tranzacție. Există un singur scaun, un singur bărbier și o " +
      "singură programare la un moment dat — astfel încât persoana din scaun " +
      "primește atenție deplină de la primul prosop până la ultimul detaliu.",
    philosophy: ["Precizie înaintea vitezei.", "Meșteșug înaintea confortului.", "Un client, atenție completă."],
    imageAlt: "Scaunul de la LAVI",
    imageLabel: "Scaunul",
  },
  services: {
    eyebrow: "Servicii și prețuri",
    title: "Prețuri clare. Fără surprize la scaun.",
    emptyState: "Serviciile sunt actualizate — reveniți în curând.",
  },
  gallery: {
    eyebrow: "În interiorul LAVI",
    title: "Unde se întâmplă precizia.",
    frames: [
      { label: "Salonul", alt: "Interiorul salonului LAVI — mobilier alb, elemente negre, unelte cromate" },
      { label: "Scaunul", alt: "Un singur scaun de bărbier orientat spre oglindă" },
      { label: "Certificate și premii", alt: "Certificate înrămate și trofee expuse" },
      { label: "Stâlpul de frizerie", alt: "Stâlpul de frizerie, a cărui lumină este singurul accent albastru din încăpere" },
      { label: "Atelierul în lucru", alt: "În interiorul atelierului LAVI în timpul lucrului" },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Găsește scaunul.",
    description:
      "Cei fără programare sunt bineveniți când există loc în calendar, dar o " +
      "programare vă garantează locul.",
    days: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"],
    closed: "Închis",
    followAlong: "Urmărește-ne",
    mapUnavailable: "Harta nu este disponibilă — setați NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL pentru a o activa.",
  },
  cta: {
    eyebrow: "Rezervă-ți scaunul",
    title: "Locurile sunt limitate la o singură programare — rezervă din timp.",
  },
  footer: {
    description:
      "LAVI este un salon de bărbierit premium care oferă tunsori de precizie, " +
      "îngrijire și o experiență rafinată. Programează-te online în mai puțin de un minut.",
    rights: "Toate drepturile rezervate.",
  },
  booking: {
    header: {
      eyebrow: "Programare online",
      title: "Rezervă-ți scaunul",
    },
    steps: {
      service: "Serviciu",
      datetime: "Data și ora",
      details: "Detalii",
      confirm: "Confirmare",
    },
    service: {
      emptyState: "Momentan nu sunt servicii disponibile pentru programare. Reveniți în curând.",
    },
    datetime: {
      selectDate: "Alege o dată",
      selectTime: "Alege o oră",
      changeService: "Schimbă serviciul",
      checkingAvailability: "Se verifică disponibilitatea…",
      noTimesAvailable: "Nu sunt ore disponibile în această zi. Încearcă altă zi.",
      closed: "închis",
    },
    details: {
      title: "Datele tale",
      fullName: "Nume complet",
      fullNamePlaceholder: "Ion Popescu",
      phone: "Număr de telefon",
      phonePlaceholder: "+351 91 234 5678",
      email: "Email (opțional)",
      emailPlaceholder: "ion@example.com",
      back: "Înapoi",
      continue: "Continuă",
    },
    summary: {
      title: "Verifică și confirmă",
      service: "Serviciu",
      when: "Când",
      duration: "Durată",
      price: "Preț",
      name: "Nume",
      phone: "Telefon",
      email: "Email",
      editDetails: "Editează detaliile",
      confirmBooking: "Confirmă programarea",
      confirming: "Se confirmă…",
    },
    confirmation: {
      confirmedEyebrow: "Programare confirmată",
      seeYou: "Ne vedem {when}",
      name: "Nume",
      service: "Serviciu",
      when: "Când",
      duration: "Durată",
      price: "Preț",
      cancelBooking: "Anulează această programare",
      cancelling: "Se anulează…",
      cancellationNotice: "Anulările sunt acceptate cu cel puțin {hours} ore înainte de programare.",
      cancelledTitle: "Programare anulată",
      cancelledMessage: "Programarea ta pentru {service} a fost anulată. Sperăm să te revedem altă dată.",
      notFoundTitle: "Programare negăsită",
      notFoundMessage: "Acest link de confirmare lipsește sau este invalid.",
      bookAppointment: "Programează-te",
    },
    errors: {
      LOAD_SERVICES_FAILED: "Serviciile nu au putut fi încărcate. Încearcă din nou.",
      INVALID_REQUEST: "Verifică formularul și încearcă din nou.",
      SERVICE_UNAVAILABLE: "Acest serviciu nu este disponibil.",
      AVAILABILITY_CHECK_FAILED: "Disponibilitatea nu a putut fi verificată. Încearcă din nou.",
      RATE_LIMIT_PHONE: "Prea multe încercări de programare cu acest număr de telefon. Încearcă din nou mai târziu.",
      RATE_LIMIT_IP: "Prea multe încercări de programare. Încearcă din nou mai târziu.",
      RATE_LIMIT_GENERIC: "Prea multe încercări. Încearcă din nou mai târziu.",
      TIME_ALREADY_PASSED: "Această oră a trecut deja.",
      MINIMUM_NOTICE_REQUIRED: "Programările necesită un preaviz de cel puțin {hours} ore.",
      OUTSIDE_BOOKING_WINDOW: "Programările pot fi făcute cu cel mult {days} zile în avans.",
      OUTSIDE_WORKING_HOURS: "Această oră este în afara programului de lucru.",
      SLOT_TAKEN: "Acea oră a fost rezervată chiar acum de altcineva. Alege alta.",
      SAVE_DETAILS_FAILED: "Datele tale nu au putut fi salvate. Încearcă din nou.",
      CREATE_BOOKING_FAILED: "Programarea nu a putut fi creată. Încearcă din nou.",
      BOOKING_NOT_FOUND: "Programarea nu a fost găsită sau acest link este invalid.",
      ALREADY_CANCELLED: "Această programare a fost deja anulată.",
      CANCELLATION_TOO_LATE: "Anulările trebuie făcute cu cel puțin {hours} ore înainte de programare.",
      CANCEL_BOOKING_FAILED: "Programarea nu a putut fi anulată. Încearcă din nou.",
      GENERIC: "Ceva nu a funcționat. Încearcă din nou.",
    },
    validation: {
      nameRequired: "Introdu numele complet",
      phoneInvalid: "Introdu un număr de telefon valid",
      emailInvalid: "Introdu o adresă de email validă",
    },
  },
};
