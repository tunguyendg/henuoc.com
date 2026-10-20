import { PlaceholderPage } from "@/components/site/placeholder-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

export const metadata = pageMetadata("/bang-gia");

export default function Page() {
  return (
    <PlaceholderPage
      title={getSeoPage("/bang-gia").h1}
      description="Miễn phí để bắt đầu. Gói trả phí một lần cho mỗi đám cưới sẽ được công bố khi ra mắt."
    />
  );
}
