/**
 * Single source of truth for FAQ content.
 * - /cau-hoi-thuong-gap renders every group + the only FAQPage JSON-LD on the site.
 * - Home page shows `homeFaqs` (items flagged `featured`).
 * - /bang-gia shows the "thanh-toan" group.
 * Answers are plain text (they go into JSON-LD as-is). Content must match docs/01-PRD.md;
 * never add numbers or promises the product does not have yet.
 */

import { site } from "@/lib/site";

export interface FaqItem {
  q: string;
  a: string;
  /** Shown in the home page FAQ section. */
  featured?: boolean;
}

export interface FaqGroup {
  id: string; // anchor on /cau-hoi-thuong-gap
  title: string;
  items: FaqItem[];
  link?: { href: string; label: string };
}

export const faqGroups: FaqGroup[] = [
  {
    id: "bat-dau",
    title: "Bắt đầu",
    items: [
      {
        q: "Tạo thiệp trên Hẹn Ước có mất phí không?",
        a: "Bạn có thể chọn mẫu, điền thông tin và xem trước thiệp hoàn toàn miễn phí. Gói trả phí một lần cho mỗi đám cưới mở thêm mẫu cao cấp, không giới hạn lời mời và bỏ dòng chữ thương hiệu.",
        featured: true,
      },
      {
        q: "Có cần đăng nhập mới tạo được thiệp không?",
        a: "Không cần. Bạn cứ chọn mẫu và điền thử, bản nháp được lưu ngay trên trình duyệt của bạn. Chỉ khi bấm “Lưu & chia sẻ” thì mới cần đăng nhập bằng Google hoặc email để lưu thiệp và lấy link gửi khách.",
      },
      {
        q: "Tôi có thể đổi mẫu thiệp sau khi đã gửi không?",
        a: "Có. Thông tin cưới và danh sách khách được lưu riêng với mẫu thiệp, nên đổi mẫu không làm mất dữ liệu hay làm hỏng link đã gửi.",
        featured: true,
      },
      {
        q: "Thiệp có hiển thị ngày âm lịch không?",
        a: "Có. Ngày âm lịch được tự động hiển thị bên cạnh ngày dương cho từng buổi lễ.",
        featured: true,
      },
      {
        q: "Thiệp có ghi được lễ vu quy, thành hôn và tiệc của nhà trai, nhà gái không?",
        a: "Được. Mỗi thiệp có từ 1 đến 4 sự kiện. Với từng sự kiện, bạn chọn loại lễ (vu quy, thành hôn, tân hôn, ăn hỏi hoặc tiệc), thuộc nhà trai, nhà gái hay chung, rồi điền giờ, địa điểm và link chỉ đường.",
      },
    ],
  },
  {
    id: "gui-thiep",
    title: "Gửi thiệp & khách mời",
    items: [
      {
        q: "Khách mời có cần cài ứng dụng hay đăng nhập không?",
        a: "Không. Khách chỉ cần bấm vào link bạn gửi qua Zalo, Messenger hoặc tin nhắn là xem được thiệp và xác nhận tham dự.",
        featured: true,
      },
      {
        q: "Gửi thiệp qua Zalo như thế nào?",
        a: "Mỗi khách có một link riêng. Bạn bấm sao chép tin nhắn mời có sẵn link, rồi dán vào cuộc trò chuyện Zalo với khách đó.",
        featured: true,
      },
      {
        q: "Trang cưới chung và thiệp riêng từng khách khác nhau thế nào?",
        a: "Trang cưới chung dùng lời mời chung, hợp để gửi vào nhóm hoặc đăng mạng xã hội. Thiệp riêng có danh xưng của từng khách như “Kính mời Anh Minh & Gia đình”, chỉ hiện những buổi lễ khách được mời và có form xác nhận tham dự gắn với lời mời đó.",
      },
      {
        q: "Hẹn Ước có tự gửi thiệp và báo khách đã đọc không?",
        a: "Không. Hẹn Ước không tự nhắn tin thay bạn. Bạn tự gửi link qua Zalo hoặc tin nhắn, rồi tự đánh dấu “Đã gửi” cho từng khách để biết còn ai chưa gửi.",
      },
    ],
  },
  {
    id: "rsvp",
    title: "Xác nhận tham dự (RSVP)",
    items: [
      {
        q: "Khách xác nhận tham dự bằng cách nào?",
        a: "Ngay trên thiệp, khách bấm “Sẽ đến” hoặc “Không đến được”, chọn số người đi cùng trong giới hạn bạn đặt cho lời mời và có thể gửi kèm lời nhắn. Hai bạn xem tổng số người sẽ đến theo từng buổi lễ trong trang quản lý.",
      },
      {
        q: "Khách đổi ý thì sửa lại được không?",
        a: "Được. Khách mở lại đúng link của mình và sửa trước hạn xác nhận. Mỗi lần sửa được ghi lại nhưng chỉ tính câu trả lời mới nhất, nên tổng số khách không bị đếm trùng.",
      },
    ],
  },
  {
    id: "thanh-toan",
    title: "Thanh toán",
    link: { href: "/bang-gia", label: "Xem bảng giá" },
    items: [
      {
        q: "Gói Cao cấp giá bao nhiêu?",
        a: "Giá gói Cao cấp sẽ được công bố khi Hẹn Ước ra mắt chính thức. Gói này trả một lần cho mỗi đám cưới, không phải thuê bao hằng tháng.",
      },
      {
        q: "Hiện tại đã nâng cấp lên Cao cấp được chưa?",
        a: `Hẹn Ước chưa có thanh toán online. Hiện tại bạn dùng gói Miễn phí đầy đủ để thử. Nếu muốn nâng cấp, hãy gửi email tới ${site.supportEmail} để được báo giá và hướng dẫn khi gói Cao cấp mở.`,
      },
      {
        q: "Gói Miễn phí bị giới hạn những gì?",
        a: "Gói Miễn phí có tối đa 30 lời mời riêng, album 12 ảnh và một dòng chữ nhỏ “Tạo bởi Hẹn Ước” ở cuối thiệp. Các quyền lợi này có thể được điều chỉnh trước khi ra mắt.",
      },
    ],
  },
  {
    id: "bao-mat",
    title: "Bảo mật & dữ liệu",
    link: { href: "/chinh-sach-bao-mat", label: "Đọc chính sách bảo mật" },
    items: [
      {
        q: "Thông tin khách mời có được bảo mật không?",
        a: "Mỗi lời mời dùng một mã ngẫu nhiên khó đoán, khách chỉ thấy lời mời của mình. Thiệp riêng không xuất hiện trên Google.",
        featured: true,
      },
      {
        q: "Tôi có xoá được tài khoản và dữ liệu của mình không?",
        a: "Có. Khi bạn xoá tài khoản, dữ liệu đám cưới, danh sách khách và phản hồi được xoá khỏi hệ thống chính, ảnh đã tải lên sẽ được xoá khỏi kho lưu trữ. Bản sao lưu được xoay vòng và tự hết hạn sau một thời gian.",
      },
      {
        q: "Thiệp gửi khách có quảng cáo không?",
        a: "Không. Thiệp gửi khách không có quảng cáo hay link mua sắm. Gợi ý mua sắm chỉ nằm trong trang quản lý của hai bạn và luôn ghi rõ là liên kết tiếp thị.",
      },
    ],
  },
];

export const allFaqs: FaqItem[] = faqGroups.flatMap((g) => g.items);

export const homeFaqs: FaqItem[] = allFaqs.filter((f) => f.featured);

export function getFaqGroup(id: string): FaqGroup {
  const group = faqGroups.find((g) => g.id === id);
  if (!group) throw new Error(`[faq] Nhóm "${id}" không có trong src/data/faq.ts`);
  return group;
}
