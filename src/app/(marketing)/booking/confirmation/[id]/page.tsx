import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getBookingConfirmation } from "@/actions/booking.actions";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { Button } from "@/components/ui/button";

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
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="space-y-2">
              <h1 className="font-display text-2xl text-ivory">Booking not found</h1>
              <p className="text-sm text-ivory-dim">
                {result && !result.success
                  ? result.error
                  : "This confirmation link is missing or invalid."}
              </p>
            </div>
            <Button asChild>
              <Link href="/booking">Book an appointment</Link>
            </Button>
          </div>
        ) : (
          <BookingConfirmation appointment={result.data} token={token!} />
        )}
      </div>
    </section>
  );
}
