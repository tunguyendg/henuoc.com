import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Mẫu thiệp cưới" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Mẫu thiệp cưới"
      description="Bộ sưu tập mẫu thiệp đang được hoàn thiện — hiện đại, truyền thống, tối giản và nhiều phong cách khác."
    />
  );
}
