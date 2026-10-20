import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";

export const faqs = [
  {
    q: "Tạo thiệp trên Hẹn Ước có mất phí không?",
    a: "Bạn có thể chọn mẫu, điền thông tin và xem trước thiệp hoàn toàn miễn phí. Gói trả phí một lần cho mỗi đám cưới mở thêm mẫu cao cấp, không giới hạn lời mời và bỏ dòng chữ thương hiệu.",
  },
  {
    q: "Khách mời có cần cài ứng dụng hay đăng nhập không?",
    a: "Không. Khách chỉ cần bấm vào link bạn gửi qua Zalo, Messenger hoặc tin nhắn là xem được thiệp và xác nhận tham dự.",
  },
  {
    q: "Gửi thiệp qua Zalo như thế nào?",
    a: "Mỗi khách có một link riêng. Bạn bấm sao chép tin nhắn mời có sẵn link, rồi dán vào cuộc trò chuyện Zalo với khách đó.",
  },
  {
    q: "Tôi có thể đổi mẫu thiệp sau khi đã gửi không?",
    a: "Có. Thông tin cưới và danh sách khách được lưu riêng với mẫu thiệp, nên đổi mẫu không làm mất dữ liệu hay làm hỏng link đã gửi.",
  },
  {
    q: "Thông tin khách mời có được bảo mật không?",
    a: "Mỗi lời mời dùng một mã ngẫu nhiên khó đoán, khách chỉ thấy lời mời của mình. Thiệp riêng không xuất hiện trên Google.",
  },
  {
    q: "Thiệp có hiển thị ngày âm lịch không?",
    a: "Có. Ngày âm lịch được tự động hiển thị bên cạnh ngày dương cho từng buổi lễ.",
  },
];

export function Faq() {
  return (
    <section id="cau-hoi" className="scroll-mt-20 py-20 md:py-28">
      <Container width="prose">
        <SectionHeading
          align="center"
          eyebrow="Câu hỏi thường gặp"
          title="Hai bạn có thể đang thắc mắc"
        />
        <div className="mt-12 divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
          {faqs.map((f) => (
            // <details> có sẵn trong HTML: bấm để mở/đóng mà KHÔNG cần JavaScript.
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {f.q}
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
