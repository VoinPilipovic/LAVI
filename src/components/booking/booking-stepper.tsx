"use client";

import { useBookingFlow, type BookingStep } from "@/hooks/use-booking-flow";
import { ServiceSelector } from "@/components/booking/service-selector";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { GuestDetailsForm } from "@/components/booking/guest-details-form";
import { BookingSummary } from "@/components/booking/booking-summary";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/locales/types";
import type { Tables } from "@/types/supabase";

interface BookingStepperProps {
  services: Tables<"services">[];
}

function StepIndicator({
  current,
  steps,
}: {
  current: BookingStep;
  steps: { key: BookingStep; label: string }[];
}) {
  const currentIndex = steps.findIndex((step) => step.key === current);

  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step.key} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px]",
                  isCurrent || isComplete
                    ? "border-accent text-accent"
                    : "border-ink-border text-ivory-muted",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs uppercase tracking-wide sm:inline",
                  isCurrent ? "text-ivory" : "text-ivory-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div className={cn("h-px flex-1", isComplete ? "bg-accent/50" : "bg-ink-border")} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function buildSteps(dict: Dictionary): { key: BookingStep; label: string }[] {
  return [
    { key: "service", label: dict.booking.steps.service },
    { key: "datetime", label: dict.booking.steps.datetime },
    { key: "details", label: dict.booking.steps.details },
    { key: "summary", label: dict.booking.steps.confirm },
  ];
}

export function BookingStepper({ services }: BookingStepperProps) {
  const flow = useBookingFlow();
  const { dict } = useLocale();
  const steps = buildSteps(dict);

  return (
    <div className="space-y-10">
      <StepIndicator current={flow.step} steps={steps} />

      {flow.step === "service" ? (
        <ServiceSelector
          services={services}
          selectedServiceId={flow.service?.id}
          onSelect={flow.selectService}
        />
      ) : null}

      {flow.step === "datetime" && flow.service ? (
        <div className="space-y-8">
          <BookingCalendar selectedDate={flow.date} onSelectDate={flow.selectDate} />
          {flow.date ? (
            <TimeSlotPicker
              serviceId={flow.service.id}
              date={flow.date}
              selectedSlot={flow.slot}
              onSelectSlot={flow.selectSlot}
            />
          ) : null}
          <button
            type="button"
            onClick={() => flow.goToStep("service")}
            className="text-sm text-ivory-dim transition-colors hover:text-accent"
          >
            ← {dict.booking.datetime.changeService}
          </button>
        </div>
      ) : null}

      {flow.step === "details" ? (
        <GuestDetailsForm
          defaultValues={flow.guest ?? undefined}
          onSubmit={flow.submitDetails}
          onBack={() => flow.goToStep("datetime")}
        />
      ) : null}

      {flow.step === "summary" && flow.service && flow.slot && flow.guest ? (
        <BookingSummary
          service={flow.service}
          slot={flow.slot}
          guest={flow.guest}
          onEditDetails={() => flow.goToStep("details")}
        />
      ) : null}
    </div>
  );
}
