import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getBookingConfirmation } from "@/actions/booking.actions";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { BookingNotFound } from "@/components/booking/booking-not-found";

export const metadata: Metadata = buildMetadata({
  title: "Booking Confirmation",
  path: "/booking/confirmation",
  noIndex: true,
});

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  const result = token ? await getBookingConfirmation(id, token) : null;

  return (
    <section className="flex min-h-screen items-center justify-center bg-ink px-6 py-32">
      <div className="w-full max-w-md">
        {!result || !result.success ? (
          <BookingNotFound code={result && !result.success ? result.error : undefined} />
        ) : (
          <BookingConfirmation appointment={result.data} token={token!} />
        )}
      </div>
    </section>
  );
}
