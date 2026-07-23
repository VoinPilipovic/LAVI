import { getAllServices } from "@/actions/service.actions";
import { ServicesManager } from "@/components/dashboard/admin/services-manager";

export default async function AdminServicesPage() {
  const result = await getAllServices();
  const services = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="text-eyebrow">Services</span>
        <h1 className="font-display text-2xl text-ivory">Manage services & prices</h1>
      </div>

      {!result.success ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <ServicesManager services={services} />
      )}
    </div>
  );
}
