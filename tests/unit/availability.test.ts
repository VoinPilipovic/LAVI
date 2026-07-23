import { describe, it, expect } from "vitest";
import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import {
  rangesOverlap,
  isSlotFree,
  isCandidateAvailable,
  generateAvailableSlots,
} from "@/domain/booking/availability";
import { SALON_TIMEZONE, SLOT_INTERVAL_MINUTES } from "@/lib/constants";
import type { TimeRange } from "@/domain/booking/booking.types";

const NOW = new Date("2026-07-22T12:00:00Z");

function lisbonTime(year: number, month: number, day: number, hour: number, minute = 0): Date {
  return fromZonedTime(new Date(year, month - 1, day, hour, minute, 0, 0), SALON_TIMEZONE);
}

describe("rangesOverlap", () => {
  const base: TimeRange = {
    start: new Date("2026-07-20T10:00:00Z"),
    end: new Date("2026-07-20T10:45:00Z"),
  };

  it("detects a fully overlapping range", () => {
    const other: TimeRange = {
      start: new Date("2026-07-20T10:15:00Z"),
      end: new Date("2026-07-20T10:30:00Z"),
    };
    expect(rangesOverlap(base, other)).toBe(true);
  });

  it("detects a partially overlapping range", () => {
    const other: TimeRange = {
      start: new Date("2026-07-20T10:30:00Z"),
      end: new Date("2026-07-20T11:15:00Z"),
    };
    expect(rangesOverlap(base, other)).toBe(true);
  });

  it("does not flag adjacent (touching, non-overlapping) ranges", () => {
    const other: TimeRange = {
      start: new Date("2026-07-20T10:45:00Z"),
      end: new Date("2026-07-20T11:30:00Z"),
    };
    expect(rangesOverlap(base, other)).toBe(false);
  });

  it("does not flag ranges on different days", () => {
    const other: TimeRange = {
      start: new Date("2026-07-21T10:00:00Z"),
      end: new Date("2026-07-21T10:45:00Z"),
    };
    expect(rangesOverlap(base, other)).toBe(false);
  });
});

describe("isSlotFree / isCandidateAvailable", () => {
  const candidate: TimeRange = {
    start: new Date("2026-07-20T10:00:00Z"),
    end: new Date("2026-07-20T10:45:00Z"),
  };

  it("is free when no occupied ranges conflict", () => {
    expect(isSlotFree(candidate, [])).toBe(true);
  });

  it("is not free when an occupied range overlaps", () => {
    const occupied: TimeRange[] = [
      { start: new Date("2026-07-20T10:20:00Z"), end: new Date("2026-07-20T10:50:00Z") },
    ];
    expect(isSlotFree(candidate, occupied)).toBe(false);
  });

  it("isCandidateAvailable requires both appointments and blocked slots to be clear", () => {
    const clashingAppointment: TimeRange[] = [
      { start: new Date("2026-07-20T10:10:00Z"), end: new Date("2026-07-20T10:30:00Z") },
    ];
    expect(isCandidateAvailable(candidate, clashingAppointment, [])).toBe(false);

    const clashingBlockedSlot: TimeRange[] = [
      { start: new Date("2026-07-20T10:10:00Z"), end: new Date("2026-07-20T10:30:00Z") },
    ];
    expect(isCandidateAvailable(candidate, [], clashingBlockedSlot)).toBe(false);

    expect(isCandidateAvailable(candidate, [], [])).toBe(true);
  });
});

describe("generateAvailableSlots", () => {
  it("returns no slots on a closed day (Sunday)", () => {
    const slots = generateAvailableSlots({
      date: lisbonTime(2026, 7, 26, 12, 0),
      serviceDurationMinutes: 45,
      existingAppointments: [],
      blockedSlots: [],
      now: NOW,
    });
    expect(slots).toHaveLength(0);
  });

  it("generates slots spanning the full open-to-close window on a working day", () => {
    // Monday, July 27 2026 — open 09:00–19:00 Lisbon, comfortably
    // beyond the minimum-notice/window checks relative to NOW.
    const slots = generateAvailableSlots({
      date: lisbonTime(2026, 7, 27, 12, 0),
      serviceDurationMinutes: 45,
      existingAppointments: [],
      blockedSlots: [],
      now: NOW,
    });

    expect(slots.length).toBeGreaterThan(0);

    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];

    expect(firstSlot.start.getTime()).toBe(lisbonTime(2026, 7, 27, 9, 0).getTime());
    // Last slot must still fit before 19:00 close.
    expect(lastSlot.end.getTime()).toBeLessThanOrEqual(lisbonTime(2026, 7, 27, 19, 0).getTime());

    // Every slot should be spaced by SLOT_INTERVAL_MINUTES and last
    // exactly the requested service duration.
    for (const slot of slots) {
      expect((slot.end.getTime() - slot.start.getTime()) / 60000).toBe(45);
    }
    if (slots.length > 1) {
      const gapMinutes = (slots[1].start.getTime() - slots[0].start.getTime()) / 60000;
      expect(gapMinutes).toBe(SLOT_INTERVAL_MINUTES);
    }
  });

  it("excludes slots that overlap an existing appointment", () => {
    const day = lisbonTime(2026, 7, 27, 12, 0);
    const blockedAppointment: TimeRange = {
      start: lisbonTime(2026, 7, 27, 10, 0),
      end: lisbonTime(2026, 7, 27, 10, 45),
    };

    const slots = generateAvailableSlots({
      date: day,
      serviceDurationMinutes: 45,
      existingAppointments: [blockedAppointment],
      blockedSlots: [],
      now: NOW,
    });

    const overlapsBlocked = slots.some(
      (slot) => slot.start < blockedAppointment.end && blockedAppointment.start < slot.end,
    );
    expect(overlapsBlocked).toBe(false);
  });

  it("excludes slots that overlap an admin-blocked slot", () => {
    const day = lisbonTime(2026, 7, 27, 12, 0);
    const blocked: TimeRange = {
      start: lisbonTime(2026, 7, 27, 15, 0),
      end: lisbonTime(2026, 7, 27, 16, 0),
    };

    const slots = generateAvailableSlots({
      date: day,
      serviceDurationMinutes: 45,
      existingAppointments: [],
      blockedSlots: [blocked],
      now: NOW,
    });

    const overlapsBlocked = slots.some(
      (slot) => slot.start < blocked.end && blocked.start < slot.end,
    );
    expect(overlapsBlocked).toBe(false);
  });

  it("excludes slots that don't meet minimum notice on the current day", () => {
    // Requesting slots for "today" relative to NOW (2026-07-22T12:00 UTC,
    // a Wednesday) — anything starting before NOW + 3h must be excluded.
    const slots = generateAvailableSlots({
      date: NOW,
      serviceDurationMinutes: 45,
      existingAppointments: [],
      blockedSlots: [],
      now: NOW,
    });

    const earliestAllowed = addMinutes(NOW, 3 * 60);
    for (const slot of slots) {
      expect(slot.start.getTime()).toBeGreaterThanOrEqual(earliestAllowed.getTime());
    }
  });

  it("produces the same number of slots across a DST transition (spring forward)", () => {
    // Lisbon springs forward on the last Sunday of March. 2026's is
    // March 29 — the following Monday (March 30) is a normal working
    // day but now in CEST (UTC+2) instead of CET (UTC+1). The wall-clock
    // working hours (09:00–19:00) and slot count should be identical to
    // any other Monday — only the underlying UTC instants shift by an
    // hour. This guards against naive fixed-UTC-offset arithmetic.
    const beforeDst = generateAvailableSlots({
      date: lisbonTime(2026, 3, 23, 12, 0), // Monday before the transition
      serviceDurationMinutes: 45,
      existingAppointments: [],
      blockedSlots: [],
      now: new Date("2026-01-01T00:00:00Z"),
    });

    const afterDst = generateAvailableSlots({
      date: lisbonTime(2026, 3, 30, 12, 0), // Monday after the transition
      serviceDurationMinutes: 45,
      existingAppointments: [],
      blockedSlots: [],
      now: new Date("2026-01-01T00:00:00Z"),
    });

    expect(afterDst.length).toBe(beforeDst.length);
    expect(afterDst[0].start.getTime()).toBe(lisbonTime(2026, 3, 30, 9, 0).getTime());
  });
});
