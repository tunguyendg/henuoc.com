import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Bảng giá" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Bảng giá"
      description="Miễn phí để bắt đầu. Gói trả phí một lần cho mỗi đám cưới sẽ được công bố khi ra mắt."
    />
  );
}
