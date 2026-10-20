import { PlaceholderPage } from "@/components/site/placeholder-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

export const metadata = pageMetadata("/lien-he");

export default function Page() {
  return (
    <PlaceholderPage
      title={getSeoPage("/lien-he").h1}
      description="Kênh liên hệ chính thức của Hẹn Ước sẽ được cập nhật khi ra mắt."
    />
  );
}
