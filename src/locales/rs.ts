import type { Dictionary } from "./types";

export const rs: Dictionary = {
  nav: {
    about: "O nama",
    services: "Usluge",
    gallery: "Galerija",
    contact: "Kontakt",
    bookNow: "Zakaži termin",
    openMenu: "Otvori meni",
    closeMenu: "Zatvori meni",
    siteNavigation: "Navigacija sajta",
    language: "Jezik",
  },
  hero: {
    eyebrow: "Lavi — Po zakazivanju",
    headlineLines: ["Preciznost", "u svakom detalju"],
    subheadline:
      "LAVI je berbernica sa jednom stolicom — precizno šišanje, brijanje " +
      "oštrom britvom i nega, izvedeni kako treba, bez žurbe.",
    marqueeWords: ["FEJDOVI", "BRIJANJE", "OBLIKOVANJE BRADE", "NEGA", "PRECIZNOST"],
    secondaryCtaLabel: "Pogledaj atelje",
    scrollToReveal: "Skrolujte da otkrijete",
    imageAlt: "Krupni plan preciznog fejda posmatran otpozadi u LAVI berbernici",
    measurementLabels: ["0 MM", "1.5 MM", "3 MM", "ZONA PRELAZA"],
  },
  about: {
    eyebrow: "Upoznajte tim",
    headlineLines: ["Jedan salon.", "Dva profesionalca."],
    description:
      "Svaki klijent dobija istu pažnju posvećenu detaljima, preciznosti i " +
      "nezi. Izaberite berberina čiji stil vama najviše odgovara.",
    team: {
      lavi: {
        name: "Lavi",
        role: "Osnivačica",
        bio:
          "Lavinika je osnovala LAVI sa jasnom vizijom — da svaki klijent " +
          "dobije više od šišanja. Preciznost, posvećenost detaljima i " +
          "vrhunsko iskustvo postali su standard koji salon prati od prvog dana.",
        cta: "Zakažite kod Lavi",
      },
      bugi: {
        name: "Bugi",
        role: "Desna ruka salona",
        bio:
          "Sebastian je bio prvi Lavin učenik, a danas je njena desna ruka. " +
          "Svakom klijentu pristupa sa istom pažnjom, preciznošću i " +
          "filozofijom koja je postala zaštitni znak LAVI salona.",
        cta: "Zakažite kod Bugija",
      },
    },
    closingStatement: "Bez obzira koga odaberete, dobićete isti standard kvaliteta koji definiše LAVI.",
    imageAlt: "Lavi i Bugi na radu u LAVI berbernici",
    imageLabel: "Tim",
  },
  services: {
    eyebrow: "Usluge i cene",
    title: "Jasne cene. Bez iznenađenja u stolici.",
    emptyState: "Usluge se ažuriraju — proverite uskoro ponovo.",
  },
  gallery: {
    eyebrow: "Unutar LAVI-ja",
    title: "Gde se dešava preciznost.",
    frames: [
      { label: "Klasičan fejd", alt: "Muška frizura otpozadi — klasičan fejd sa doteranim vrhom" },
      { label: "Duga braon kosa", alt: "Duga prava braon kosa, pogled otpozadi" },
      { label: "Plava kosa", alt: "Ravna plava kosa do ramena, pogled otpozadi" },
      { label: "Bob frizura", alt: "Ravan bob do ramena, pogled otpozadi" },
      { label: "Balayage", alt: "Duga kosa sa balayage tehnikom farbanja, pogled otpozadi" },
      { label: "Fejd sa dizajnom", alt: "Muška frizura — fejd sa izbrijanim geometrijskim dizajnom pozadi" },
      { label: "Kratak fejd", alt: "Muška frizura — kratak fejd sa teksturisanim vrhom, bočni pogled" },
      { label: "Fejd na kovrdžavoj kosi", alt: "Muška frizura — fejd uz kovrdžavu kosu, bočni pogled" },
      { label: "Fejd otpozadi", alt: "Muška frizura — nizak fejd, krupni plan otpozadi" },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Pronađi stolicu.",
    description:
      "Dolasci bez zakazivanja su dobrodošli kada ima mesta u kalendaru, ali " +
      "zakazivanje garantuje vaše mesto.",
    days: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
    closed: "Zatvoreno",
    followAlong: "Prati nas",
    mapUnavailable: "Mapa nije dostupna — podesite NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL da biste je omogućili.",
  },
  cta: {
    eyebrow: "Rezerviši svoju stolicu",
    title: "Termini su ograničeni na jedan u isto vreme — rezervišite unapred.",
  },
  footer: {
    description:
      "LAVI je premium berbernica koja nudi precizno šišanje, negu i prefinjeno " +
      "iskustvo. Zakažite termin onlajn za manje od minuta.",
    rights: "Sva prava zadržana.",
  },
  booking: {
    header: {
      eyebrow: "Zakažite termin",
      title: "Rezervišite svoj termin",
    },
    steps: {
      service: "Usluga",
      datetime: "Datum i vreme",
      details: "Podaci",
      confirm: "Potvrda",
    },
    service: {
      emptyState: "Trenutno nema dostupnih usluga za zakazivanje. Proverite ponovo uskoro.",
    },
    datetime: {
      selectDate: "Izaberite datum",
      selectTime: "Izaberite vreme",
      changeService: "Promenite uslugu",
      checkingAvailability: "Proveravamo dostupnost…",
      noTimesAvailable: "Nema dostupnih termina za ovaj datum. Probajte drugi dan.",
      closed: "zatvoreno",
    },
    details: {
      title: "Vaši podaci",
      fullName: "Ime i prezime",
      fullNamePlaceholder: "Petar Petrović",
      phone: "Broj telefona",
      phonePlaceholder: "+351 91 234 5678",
      email: "Email (opciono)",
      emailPlaceholder: "petar@example.com",
      back: "Nazad",
      continue: "Nastavi",
    },
    summary: {
      title: "Pregled i potvrda",
      service: "Usluga",
      when: "Kada",
      duration: "Trajanje",
      price: "Cena",
      name: "Ime",
      phone: "Telefon",
      email: "Email",
      editDetails: "Izmeni podatke",
      confirmBooking: "Potvrdi termin",
      confirming: "Potvrđivanje…",
    },
    confirmation: {
      confirmedEyebrow: "Termin potvrđen",
      seeYou: "Vidimo se {when}",
      name: "Ime",
      service: "Usluga",
      when: "Kada",
      duration: "Trajanje",
      price: "Cena",
      cancelBooking: "Otkaži ovaj termin",
      cancelling: "Otkazivanje…",
      cancellationNotice: "Otkazivanje je moguće najkasnije {hours} sati pre termina.",
      cancelledTitle: "Termin otkazan",
      cancelledMessage:
        "Vaš termin za {service} je otkazan. Nadamo se da ćemo vas videti drugi put.",
      notFoundTitle: "Termin nije pronađen",
      notFoundMessage: "Ovaj link za potvrdu nedostaje ili nije važeći.",
      bookAppointment: "Zakažite termin",
    },
    errors: {
      LOAD_SERVICES_FAILED: "Nije moguće učitati usluge. Pokušajte ponovo.",
      INVALID_REQUEST: "Proverite formu i pokušajte ponovo.",
      SERVICE_UNAVAILABLE: "Ova usluga trenutno nije dostupna.",
      AVAILABILITY_CHECK_FAILED: "Nije moguće proveriti dostupnost. Pokušajte ponovo.",
      RATE_LIMIT_PHONE: "Previše pokušaja zakazivanja sa ovim brojem telefona. Pokušajte ponovo kasnije.",
      RATE_LIMIT_IP: "Previše pokušaja zakazivanja. Pokušajte ponovo kasnije.",
      RATE_LIMIT_GENERIC: "Previše pokušaja. Pokušajte ponovo kasnije.",
      TIME_ALREADY_PASSED: "Ovaj termin je već prošao.",
      MINIMUM_NOTICE_REQUIRED: "Termin morate zakazati najmanje {hours} sati unapred.",
      OUTSIDE_BOOKING_WINDOW: "Termini se mogu zakazati najviše {days} dana unapred.",
      OUTSIDE_WORKING_HOURS: "Ovo vreme je van radnog vremena.",
      SLOT_TAKEN: "Taj termin je upravo zauzeo neko drugi. Izaberite drugi.",
      SAVE_DETAILS_FAILED: "Nije moguće sačuvati vaše podatke. Pokušajte ponovo.",
      CREATE_BOOKING_FAILED: "Nije moguće kreirati vaš termin. Pokušajte ponovo.",
      BOOKING_NOT_FOUND: "Termin nije pronađen ili je link nevažeći.",
      ALREADY_CANCELLED: "Ovaj termin je već otkazan.",
      CANCELLATION_TOO_LATE: "Otkazivanje je moguće najkasnije {hours} sati pre termina.",
      CANCEL_BOOKING_FAILED: "Nije moguće otkazati vaš termin. Pokušajte ponovo.",
      GENERIC: "Nešto je pošlo po zlu. Pokušajte ponovo.",
    },
    validation: {
      nameRequired: "Unesite ime i prezime",
      phoneInvalid: "Unesite validan broj telefona",
      emailInvalid: "Unesite validnu email adresu",
    },
  },
};
