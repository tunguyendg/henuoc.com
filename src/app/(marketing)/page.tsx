import { AlbumSection } from "@/components/home/album-section";
import { ChecklistSection } from "@/components/home/checklist-section";
import { Faq } from "@/components/home/faq";
import { FeaturedThemes } from "@/components/home/featured-themes";
import { FinalCta } from "@/components/home/final-cta";
import { GuestManagement } from "@/components/home/guest-management";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PhotoBand } from "@/components/home/photo-band";
import { PersonalInvite } from "@/components/home/personal-invite";
import { RsvpSection } from "@/components/home/rsvp-section";
import { VietnamFeatures } from "@/components/home/vietnam-features";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("/");

// Cho Google biết đây là website của thương hiệu Hẹn Ước.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "vi-VN",
  publisher: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/icon-512.png`,
  },
};

/** Trang chủ = ghép các section. Mỗi section là 1 component riêng trong components/home/. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PhotoBand />
      <FeaturedThemes />
      <PersonalInvite />
      <RsvpSection />
      <GuestManagement />
      <ChecklistSection />
      <VietnamFeatures />
      <AlbumSection />
      <Faq />
      <FinalCta />
      <JsonLd data={siteJsonLd} />
    </>
  );
}
