"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultLocale, dictionaries, localeHtmlLang, type LocaleCode } from "@/config/i18n";
import type { Dictionary } from "@/locales/types";

const STORAGE_KEY = "lavi-locale";

interface LocaleContextValue {
  locale: LocaleCode;
  dict: Dictionary;
  setLocale: (locale: LocaleCode) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  dict: dictionaries[defaultLocale],
  setLocale: () => {},
});

/**
 * Drives real client-side localization: every public-facing string comes
 * from `dict` (the active locale's full Dictionary), switching instantly
 * with no page reload. Serbian is the default — a first-time visitor
 * with nothing in localStorage always sees RS; the choice then persists.
 *
 * SSR-safe: always renders `defaultLocale` on the server and on first
 * client render, then syncs from localStorage on mount — same pattern
 * as `usePrefersReducedMotion` in use-media-query.ts, so there's no
 * hydration mismatch (the server has no way to know a returning
 * visitor's stored preference).
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "rs" || stored === "en" || stored === "ro") {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale];
  }, [locale]);

  const setLocale = (next: LocaleCode) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LocaleContext.Provider value={{ locale, dict: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
