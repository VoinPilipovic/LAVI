import { ServicesHeading } from "@/components/marketing/services-heading";
import { ServicesList } from "@/components/marketing/services-list";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Component: fetches active services from Supabase (replacing
 * the static array hardcoded in earlier phases). The heading and list
 * are both delegated to Client Components — the heading needs
 * useLocale() for translation, the list needs GSAP/ScrollTrigger —
 * neither of which a Server Component can use directly.
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
        <ServicesHeading />
        <ServicesList services={services ?? []} />
      </div>
    </section>
  );
}
