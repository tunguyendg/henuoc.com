import { Container } from "@/components/ui/container";
import { PhoneFrame } from "./phone-frame";
import { FeatureList, SectionHeading } from "./section-heading";

/** Mockup form RSVP (tĩnh, chỉ minh hoạ — form thật làm ở M4). */
function RsvpMock() {
  return (
    <div className="flex h-full flex-col bg-[#fbeef0] px-5 pt-12 pb-6 text-center">
      <p className="text-[10px] font-medium tracking-[0.3em] text-[#b07686] uppercase">
        Xác nhận tham dự
      </p>
      <p className="mt-3 font-display text-xl text-[#8a3d52] italic">Minh Anh & Hoàng Nam</p>
      <p className="mt-1 text-xs text-[#b07686]">Rất mong được đón tiếp Anh Minh & Gia đình</p>

      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
        <span className="rounded-xl bg-[#8a3d52] py-2.5 font-semibold text-white">Sẽ đến</span>
        <span className="rounded-xl border border-[#e8b9c3] bg-white py-2.5 text-[#8a3d52]">
          Không đến được
        </span>
      </div>

      <p className="mt-5 text-left text-xs text-[#b07686]">Số người tham dự</p>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-[#e8b9c3] bg-white px-4 py-2.5 text-[#8a3d52]">
        <span>−</span>
        <span className="font-semibold">3 người</span>
        <span>+</span>
      </div>

      <p className="mt-4 text-left text-xs text-[#b07686]">Lời nhắn</p>
      <div className="mt-2 rounded-xl border border-[#e8b9c3] bg-white px-4 py-3 text-left text-xs text-[#8a3d52]">
        Chúc hai em trăm năm hạnh phúc!
      </div>

      <span className="mt-auto rounded-xl bg-[#8a3d52] py-3 text-sm font-semibold text-white">
        Gửi xác nhận
      </span>
    </div>
  );
}

export function RsvpSection() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-14 md:grid-cols-2">
        <div className="order-2 flex justify-center md:order-1">
          <PhoneFrame>
            <RsvpMock />
          </PhoneFrame>
        </div>
        <div className="order-1 md:order-2">
          <SectionHeading eyebrow="RSVP" title="Khách xác nhận chỉ với một chạm">
            Khách mở link là thấy nút xác nhận — không cần đăng nhập, không cần cài ứng dụng. Ông bà
            lớn tuổi cũng dùng được.
          </SectionHeading>
          <FeatureList
            items={[
              "Chọn sẽ đến hay không, đi bao nhiêu người",
              "Giới hạn số người theo từng lời mời",
              "Khách sửa lại được — số liệu không bị đếm trùng",
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
