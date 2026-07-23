"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * LAVI ships a single fixed dark-luxury theme in the beta — there is no
 * user-facing light/dark toggle. This wraps next-themes anyway (rather
 * than hardcoding a class on <html>) so the CSS-variable-driven token
 * system in globals.css stays the single source of truth, and a toggle
 * could be added later without restructuring styles.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
