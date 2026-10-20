import { PlaceholderPage } from "@/components/site/placeholder-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

export const metadata = pageMetadata("/cam-nang");

export default function Page() {
  return (
    <PlaceholderPage
      title={getSeoPage("/cam-nang").h1}
      description="Hướng dẫn ghi thiệp, lời mời hay và checklist chuẩn bị đám cưới — sắp ra mắt."
    />
  );
}
