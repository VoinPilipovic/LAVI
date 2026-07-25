"use client";

import { Scissors } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { localeIntlTag } from "@/config/i18n";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

interface ServiceSelectorProps {
  services: Tables<"services">[];
  selectedServiceId?: string;
  onSelect: (service: Tables<"services">) => void;
}

export function ServiceSelector({ services, selectedServiceId, onSelect }: ServiceSelectorProps) {
  const { locale, dict } = useLocale();

  if (services.length === 0) {
    return (
      <p className="border border-ink-border bg-ink-elevated p-6 text-center text-sm text-ivory-dim">
        {dict.booking.service.emptyState}
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((service) => {
        const isSelected = service.id === selectedServiceId;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service)}
            aria-pressed={isSelected}
            className={`flex flex-col gap-3 rounded-sm border p-5 text-left transition-colors ${
              isSelected
                ? "border-accent bg-accent/5"
                : "border-ink-border bg-ink-elevated hover:border-accent/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Scissors className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={1.25} />
                <div>
                  <h3 className="font-display text-lg text-ivory">{service.name}</h3>
                  {service.description ? (
                    <p className="mt-1 text-sm text-ivory-dim">{service.description}</p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-4 pl-7">
              <span className="text-sm text-ivory-dim">
                {formatDuration(service.duration_minutes)}
              </span>
              <span className="font-display text-lg text-accent">
                {formatPrice(service.price, "EUR", localeIntlTag[locale])}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
