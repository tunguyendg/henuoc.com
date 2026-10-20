import { PlaceholderPage } from "@/components/site/placeholder-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

export const metadata = pageMetadata("/tao-thiep");

export default function Page() {
  return (
    <PlaceholderPage
      title={getSeoPage("/tao-thiep").h1}
      description="Trình tạo thiệp với xem trước trực tiếp đang được xây dựng."
    />
  );
}
