"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus, type AppointmentDetail } from "@/actions/appointment.actions";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import { formatSlotDateTime } from "@/components/booking/booking-format";
import type { AppointmentStatus } from "@/types/supabase";

const statusOptions: { status: AppointmentStatus; label: string }[] = [
  { status: "confirmed", label: "Confirmed" },
  { status: "completed", label: "Completed" },
  { status: "no_show", label: "No-show" },
  { status: "cancelled", label: "Cancelled" },
];

interface AppointmentDetailCardProps {
  appointment: AppointmentDetail;
}

export function AppointmentDetailCard({ appointment: initial }: AppointmentDetailCardProps) {
  const router = useRouter();
  const [appointment, setAppointment] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setAppointment(initial);
  }, [initial]);

  const handleStatusChange = (status: AppointmentStatus) => {
    if (status === appointment.status) return;
    setError(null);

    startTransition(async () => {
      const result = await updateAppointmentStatus(appointment.id, status);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setAppointment((prev) => ({ ...prev, status }));
      router.refresh();
    });
  };

  return (
    <div className="max-w-xl space-y-8">
      <div className="space-y-1">
        <span className="text-eyebrow">Appointment</span>
        <h1 className="font-display text-2xl text-ivory">
          {formatSlotDateTime(new Date(appointment.start_time))}
        </h1>
      </div>

      <dl className="divide-y divide-ink-border border-y border-ink-border text-sm">
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Guest</dt>
          <dd className="text-ivory">{appointment.guest_name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Phone</dt>
          <dd className="text-ivory">{appointment.guest_phone}</dd>
        </div>
        {appointment.guest_email ? (
          <div className="flex items-center justify-between py-3">
            <dt className="text-ivory-dim">Email</dt>
            <dd className="text-ivory">{appointment.guest_email}</dd>
          </div>
        ) : null}
        {appointment.customer ? (
          <div className="flex items-center justify-between py-3">
            <dt className="text-ivory-dim">Customer record</dt>
            <dd className="text-ivory">
              Known guest since{" "}
              {new Date(appointment.customer.created_at).toLocaleDateString("en-US")}
            </dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Service</dt>
          <dd className="text-ivory">{appointment.service?.name ?? "Unknown"}</dd>
        </div>
        {appointment.service ? (
          <>
            <div className="flex items-center justify-between py-3">
              <dt className="text-ivory-dim">Duration</dt>
              <dd className="text-ivory">
                {formatDuration(appointment.service.duration_minutes)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-ivory-dim">Price</dt>
              <dd className="font-display text-accent">{formatPrice(appointment.service.price)}</dd>
            </div>
          </>
        ) : null}
        {appointment.notes ? (
          <div className="flex items-center justify-between py-3">
            <dt className="text-ivory-dim">Notes</dt>
            <dd className="text-ivory">{appointment.notes}</dd>
          </div>
        ) : null}
      </dl>

      <div className="space-y-3">
        <p className="text-eyebrow text-[10px]">Status</p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.status}
              type="button"
              size="sm"
              variant={option.status === appointment.status ? "default" : "outline"}
              disabled={isPending}
              onClick={() => handleStatusChange(option.status)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
