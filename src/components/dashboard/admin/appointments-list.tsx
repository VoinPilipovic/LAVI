import Link from "next/link";
import { formatSlotTime, formatSlotDate } from "@/components/booking/booking-format";
import { formatDuration } from "@/lib/utils";
import type { AppointmentWithService } from "@/actions/appointment.actions";
import type { AppointmentStatus } from "@/types/supabase";

const statusStyles: Record<AppointmentStatus, string> = {
  confirmed: "border-accent/40 text-accent",
  completed: "border-ivory-dim/40 text-ivory-dim",
  cancelled: "border-destructive/40 text-destructive",
  no_show: "border-destructive/40 text-destructive",
};

const statusLabels: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wide ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function AppointmentRow({ appointment }: { appointment: AppointmentWithService }) {
  return (
    <Link
      href={`/admin/appointments/${appointment.id}`}
      className="flex flex-col gap-2 border-b border-ink-border py-4 transition-colors hover:bg-ink-elevated sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-16 shrink-0 text-sm text-accent">
          {formatSlotTime(new Date(appointment.start_time))}
        </div>
        <div>
          <p className="text-sm text-ivory">{appointment.guest_name}</p>
          <p className="text-xs text-ivory-dim">
            {appointment.service?.name ?? "Unknown service"}
            {appointment.service ? ` · ${formatDuration(appointment.service.duration_minutes)}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-[76px] sm:pl-0">
        <span className="text-xs text-ivory-dim">{appointment.guest_phone}</span>
        <StatusBadge status={appointment.status} />
      </div>
    </Link>
  );
}

function AppointmentGroup({
  title,
  appointments,
  emptyMessage,
  showDate = false,
}: {
  title: string;
  appointments: AppointmentWithService[];
  emptyMessage: string;
  showDate?: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-eyebrow text-[10px]">{title}</h2>
      {appointments.length === 0 ? (
        <p className="border border-ink-border bg-ink-elevated p-6 text-center text-sm text-ivory-dim">
          {emptyMessage}
        </p>
      ) : (
        <div className="border-t border-ink-border">
          {showDate
            ? appointments.map((appointment) => (
                <div key={appointment.id}>
                  <p className="pt-4 text-xs text-ivory-dim">
                    {formatSlotDate(new Date(appointment.start_time))}
                  </p>
                  <AppointmentRow appointment={appointment} />
                </div>
              ))
            : appointments.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} />
              ))}
        </div>
      )}
    </section>
  );
}

interface AppointmentsListProps {
  today: AppointmentWithService[];
  upcoming: AppointmentWithService[];
}

export function AppointmentsList({ today, upcoming }: AppointmentsListProps) {
  return (
    <div className="space-y-12">
      <AppointmentGroup
        title="Today"
        appointments={today}
        emptyMessage="No appointments today."
      />
      <AppointmentGroup
        title="Upcoming"
        appointments={upcoming}
        emptyMessage="No upcoming appointments."
        showDate
      />
    </div>
  );
}
