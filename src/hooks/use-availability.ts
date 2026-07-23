"use client";

import { useCallback, useState } from "react";
import { getAvailableSlots, type SlotOption } from "@/actions/booking.actions";

interface UseAvailabilityResult {
  slots: SlotOption[];
  isLoading: boolean;
  error: string | null;
  /** Fetches slots for a service on a given "YYYY-MM-DD" calendar date. */
  fetchSlots: (serviceId: string, date: string) => Promise<void>;
}

export function useAvailability(): UseAvailabilityResult {
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async (serviceId: string, date: string) => {
    setIsLoading(true);
    setError(null);

    const result = await getAvailableSlots({ serviceId, date });

    if (result.success) {
      setSlots(result.data);
    } else {
      setSlots([]);
      setError(result.error);
    }

    setIsLoading(false);
  }, []);

  return { slots, isLoading, error, fetchSlots };
}
