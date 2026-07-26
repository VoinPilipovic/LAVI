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
    eyebrow: "Cunoaște echipa",
    headlineLines: ["Un singur salon.", "Doi profesioniști."],
    description:
      "Fiecare client primește aceeași atenție la detalii, precizie și grijă. " +
      "Alege bărbierul al cărui stil ți se potrivește cel mai bine.",
    team: {
      lavi: {
        name: "Lavi",
        role: "Fondatoare",
        bio:
          "Lavinika a fondat LAVI cu o viziune clară — ca fiecare client să " +
          "primească mai mult decât o tunsoare. Precizia, atenția la detalii " +
          "și o experiență rafinată au devenit standardul pe care salonul îl " +
          "urmează din prima zi.",
        cta: "Programează-te la Lavi",
      },
      bugi: {
        name: "Bugi",
        role: "Mâna dreaptă a salonului",
        bio:
          "Sebastian a fost primul elev al Lavinicăi și este acum mâna ei " +
          "dreaptă. Abordează fiecare client cu aceeași atenție, precizie și " +
          "filozofie care a devenit semnătura salonului LAVI.",
        cta: "Programează-te la Bugi",
      },
    },
    closingStatement: "Indiferent pe cine alegi, vei experimenta același standard de calitate care definește LAVI.",
    imageAlt: "Lavi și Bugi la lucru în salonul de bărbierit LAVI",
    imageLabel: "Echipa",
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
      { label: "Fade Clasic", alt: "Tunsoare bărbătească din spate — fade clasic cu vârf aranjat" },
      { label: "Șaten Lung", alt: "Păr șaten lung și drept, vedere din spate" },
      { label: "Blond", alt: "Păr blond drept până la umeri, vedere din spate" },
      { label: "Bob", alt: "Tuns bob drept până la umeri, vedere din spate" },
      { label: "Balayage", alt: "Păr lung cu tehnica de colorare balayage, vedere din spate" },
      { label: "Fade cu Model", alt: "Tunsoare bărbătească — fade cu model geometric ras în spate" },
      { label: "Crop Fade", alt: "Tunsoare bărbătească — crop fade texturat, vedere laterală din spate" },
      { label: "Fade pe Păr Creț", alt: "Tunsoare bărbătească — fade cu vârf creț, vedere laterală din spate" },
      { label: "Skin Fade", alt: "Tunsoare bărbătească — skin fade jos, prim-plan din spate" },
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
