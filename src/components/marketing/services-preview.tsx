import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { ServicesList } from "@/components/marketing/services-list";
import { bookingCta } from "@/config/navigation";
import { businessConfig } from "@/config/business";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Component: fetches active services from Supabase (replacing
 * the static array hardcoded in earlier phases) and renders the
 * section heading directly. The animated list itself is delegated to
 * <ServicesList>, a Client Component, since GSAP/ScrollTrigger needs a
 * browser environment — Server Components can't hold refs or run
 * effects.
 */
export async function ServicesPreview() {
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to load services:", error.message);
  }

  return (
    <section id="services" className="bg-ink py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={businessConfig.services.eyebrow}
            title={businessConfig.services.title}
          />
          <Button asChild variant="outline" className="w-fit">
            <Link href={bookingCta.href}>{bookingCta.label}</Link>
          </Button>
        </div>

        <ServicesList services={services ?? []} />
      </div>
    </section>
  );
}
