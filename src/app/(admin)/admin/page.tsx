import { getDashboardAppointments } from "@/actions/appointment.actions";
import { AppointmentsList } from "@/components/dashboard/admin/appointments-list";

export default async function AdminDashboardPage() {
  const result = await getDashboardAppointments();

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-1">
        <span className="text-eyebrow">Dashboard</span>
        <h1 className="font-display text-2xl text-ivory">Appointments</h1>
      </div>

      {!result.success ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <AppointmentsList today={result.data.today} upcoming={result.data.upcoming} />
      )}
    </div>
  );
}
