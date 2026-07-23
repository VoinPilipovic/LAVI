"use client";

import { useCallback, useState } from "react";
import type { SlotOption } from "@/actions/booking.actions";
import type { GuestDetailsInput } from "@/schemas/booking.schema";
import type { Tables } from "@/types/supabase";

export type BookingStep = "service" | "datetime" | "details" | "summary";

interface BookingFlowState {
  step: BookingStep;
  service: Tables<"services"> | null;
  /** Selected calendar date, as a "YYYY-MM-DD" string in salon-local time. */
  date: string | null;
  slot: SlotOption | null;
  guest: GuestDetailsInput | null;
}

const initialState: BookingFlowState = {
  step: "service",
  service: null,
  date: null,
  slot: null,
  guest: null,
};

/**
 * Owns the guest booking stepper's state. Deliberately holds only
 * client-side UI state (what the guest has chosen so far) — the actual
 * availability lookups and booking creation go through Server Actions
 * (src/actions/booking.actions.ts) called from the step components,
 * not from here.
 */
export function useBookingFlow() {
  const [state, setState] = useState<BookingFlowState>(initialState);

  const selectService = useCallback((service: Tables<"services">) => {
    setState((prev) => ({ ...prev, service, step: "datetime" }));
  }, []);

  /** Selecting a new date clears any previously chosen slot for the old date. */
  const selectDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, date, slot: null }));
  }, []);

  const selectSlot = useCallback((slot: SlotOption) => {
    setState((prev) => ({ ...prev, slot, step: "details" }));
  }, []);

  const submitDetails = useCallback((guest: GuestDetailsInput) => {
    setState((prev) => ({ ...prev, guest, step: "summary" }));
  }, []);

  const goToStep = useCallback((step: BookingStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    selectService,
    selectDate,
    selectSlot,
    submitDetails,
    goToStep,
    reset,
  };
}

export type UseBookingFlowReturn = ReturnType<typeof useBookingFlow>;
