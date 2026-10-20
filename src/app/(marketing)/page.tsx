import { ChecklistSection } from "@/components/home/checklist-section";
import { Faq, faqs } from "@/components/home/faq";
import { FeaturedThemes } from "@/components/home/featured-themes";
import { FinalCta } from "@/components/home/final-cta";
import { GuestManagement } from "@/components/home/guest-management";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PersonalInvite } from "@/components/home/personal-invite";
import { RsvpSection } from "@/components/home/rsvp-section";
import { VietnamFeatures } from "@/components/home/vietnam-features";

// JSON-LD FAQPage: giúp Google hiểu phần hỏi–đáp (dùng khi trang được mở index lúc launch).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/** Trang chủ = ghép các section. Mỗi section là 1 component riêng trong components/home/. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedThemes />
      <PersonalInvite />
      <RsvpSection />
      <GuestManagement />
      <ChecklistSection />
      <VietnamFeatures />
      <Faq />
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
