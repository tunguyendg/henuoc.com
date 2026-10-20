import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Liên hệ" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Liên hệ"
      description="Kênh liên hệ chính thức của Hẹn Ước sẽ được cập nhật khi ra mắt."
    />
  );
}
