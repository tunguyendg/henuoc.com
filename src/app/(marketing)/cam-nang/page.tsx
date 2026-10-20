import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Cẩm nang cưới" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Cẩm nang cưới"
      description="Hướng dẫn ghi thiệp, lời mời hay và checklist chuẩn bị đám cưới — sắp ra mắt."
    />
  );
}
