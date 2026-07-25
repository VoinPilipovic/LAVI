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
    eyebrow: "O LAVI-ju",
    title: "Bez recepcije. Bez rotacije berberina. Samo rad.",
    description:
      "LAVI je nastao iz jednostavne ideje: šišanje je zanat, a ne transakcija. " +
      "Postoji jedna stolica, jedan berberin i jedan termin u isto vreme — tako " +
      "da osoba u stolici dobija punu pažnju od prvog peškira do poslednjeg detalja.",
    philosophy: ["Preciznost pre brzine.", "Zanat pre udobnosti.", "Jedan klijent, potpuna pažnja."],
    imageAlt: "Stolica u LAVI salonu",
    imageLabel: "Stolica",
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
      { label: "Salon", alt: "Enterijer LAVI salona — beli ormarići, crni nameštaj, hromirani alati" },
      { label: "Stolica", alt: "Berberska stolica okrenuta ka ogledalu" },
      { label: "Sertifikati i nagrade", alt: "Uramljeni sertifikati i trofeji na izložbi" },
      { label: "Berberski stub", alt: "Berberski stub, čije je svetlo jedini plavi akcenat u prostoriji" },
      { label: "Atelje u radu", alt: "Unutrašnjost LAVI ateljea tokom rada" },
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
