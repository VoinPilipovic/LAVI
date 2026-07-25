import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getActiveServices } from "@/actions/booking.actions";
import { BookingHeader } from "@/components/booking/booking-header";
import { BookingLoadError } from "@/components/booking/booking-load-error";
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
        <BookingHeader />

        {!result.success ? (
          <BookingLoadError code={result.error} />
        ) : (
          <BookingStepper services={services} />
        )}
      </div>
    </section>
  );
}
