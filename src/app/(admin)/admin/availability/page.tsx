import { getBlockedSlots } from "@/actions/availability.actions";
import { AvailabilityManager } from "@/components/dashboard/admin/availability-manager";

export default async function AvailabilityPage() {
  const result = await getBlockedSlots();
  const blockedSlots = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="text-eyebrow">Availability</span>
        <h1 className="font-display text-2xl text-ivory">Block dates & times</h1>
      </div>

      {!result.success ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <AvailabilityManager blockedSlots={blockedSlots} />
      )}
    </div>
  );
}
