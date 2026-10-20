import { Container } from "@/components/ui/container";

const steps = [
  {
    title: "Chọn mẫu thiệp",
    text: "Hiện đại, truyền thống, tối giản — xem thử với tên của hai bạn.",
  },
  { title: "Điền thông tin", text: "Tên, ngày giờ, địa điểm lễ vu quy, thành hôn và ảnh cưới." },
  { title: "Gửi & theo dõi", text: "Mỗi khách một link riêng qua Zalo, RSVP cập nhật tức thì." },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="grid gap-8 py-12 md:grid-cols-3 md:py-14">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-600 font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold text-ink">{step.title}</h2>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
