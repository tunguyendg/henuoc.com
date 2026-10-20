import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Đăng nhập"
      description="Đăng nhập bằng Google hoặc email sẽ có trong phiên bản tiếp theo."
    />
  );
}
