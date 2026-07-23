import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/marketing/hero-section";
import { AboutSection } from "@/components/marketing/about-section";
import { ServicesPreview } from "@/components/marketing/services-preview";
import { GalleryGrid } from "@/components/marketing/gallery-grid";
import { ContactSection } from "@/components/marketing/contact-section";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = buildMetadata({
  description:
    "A single-chair barbering atelier in Lisbon. Precision cuts, straight-razor " +
    "shaves, and grooming — book your appointment online in under a minute.",
});

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
      <GalleryGrid />
      <ContactSection />
      <CtaSection />
    </>
  );
}
