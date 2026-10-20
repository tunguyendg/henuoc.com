import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Tạo thiệp cưới" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Tạo thiệp cưới"
      description="Trình tạo thiệp với xem trước trực tiếp đang được xây dựng."
    />
  );
}
