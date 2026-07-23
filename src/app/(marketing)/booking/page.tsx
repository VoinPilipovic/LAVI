import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getActiveServices } from "@/actions/booking.actions";
import { BookingStepper } from "@/components/booking/booking-stepper";
import { businessConfig } from "@/config/business";

export const metadata: Metadata = buildMetadata({
  title: "Book an Appointment",
  description: `Book your appointment at ${businessConfig.name} online in under a minute.`,
  path: "/booking",
  noIndex: true,
});

export default async function BookingPage() {
  const result = await getActiveServices();
  const services = result.success ? result.data : [];

  return (
    <section className="min-h-screen bg-ink pb-24 pt-32">
      <div className="container max-w-2xl">
        <div className="mb-12 space-y-3 text-center">
          <span className="text-eyebrow">Book an Appointment</span>
          <h1 className="font-display text-3xl text-ivory sm:text-4xl">Reserve your chair</h1>
        </div>

        {!result.success ? (
          <p className="text-center text-sm text-destructive">{result.error}</p>
        ) : (
          <BookingStepper services={services} />
        )}
      </div>
    </section>
  );
}
