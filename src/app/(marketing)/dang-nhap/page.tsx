import { PlaceholderPage } from "@/components/site/placeholder-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

export const metadata = pageMetadata("/dang-nhap");

export default function Page() {
  return (
    <PlaceholderPage
      title={getSeoPage("/dang-nhap").h1}
      description="Đăng nhập bằng Google hoặc email sẽ có trong phiên bản tiếp theo."
    />
  );
}
