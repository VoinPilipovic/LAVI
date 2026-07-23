import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAppointmentById } from "@/actions/appointment.actions";
import { AppointmentDetailCard } from "@/components/dashboard/admin/appointment-detail-card";

interface AppointmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const { id } = await params;
  const result = await getAppointmentById(id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to dashboard
      </Link>

      {!result.success ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <AppointmentDetailCard appointment={result.data} />
      )}
    </div>
  );
}
