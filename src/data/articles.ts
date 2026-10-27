import type { ArticleTopicSlug } from "@/data/article-topics";

/**
 * Danh mục bài Cẩm nang (docs/04-GROWTH.md §2.2). Nguồn sự thật cho metadata SEO của từng bài.
 * Thân bài nằm ở file .mdx riêng (chỉ nội dung); title / description / H1 / link nội bộ nằm ở đây
 * để `tests/seo.test.ts` đọc được mà không cần biên dịch MDX.
 *
 * Thêm bài = thêm 1 object vào `articles` → sổ SEO (`src/lib/seo/pages.ts`) tự sinh trang
 * `/cam-nang/<slug>`, breadcrumb, "Xem thêm" và sitemap.
 */

export interface Article {
  category: ArticleTopicSlug;
  slug: string; // URL segment under /cam-nang
  title: string; // ≤ 60 chars, including the " · Hẹn Ước" suffix
  description: string; // 110–160 chars, no invented numbers
  h1: string; // must contain `keyword`
  keyword: string; // main keyword — must appear in title and H1
  breadcrumb: string; // short breadcrumb label
  publishedAt: string; // "YYYY-MM-DD"
  updatedAt?: string; // "YYYY-MM-DD", only when the body was meaningfully revised
  related: string[]; // internal links, every path must exist in the SEO registry
}

export function articlePath(slug: string) {
  return `/cam-nang/${slug}`;
}

export const articles: Article[] = [
  {
    slug: "cach-ghi-thiep-cuoi",
    category: "thiep-loi-moi",
    title: "Cách ghi thiệp cưới đúng chuẩn: xưng hô, tên khách · Hẹn Ước",
    description:
      "Cách ghi thiệp cưới đúng chuẩn: chọn danh xưng theo vai vế, ghi tên khách, ngày âm dương và địa điểm tiệc, kèm ví dụ cho thiệp nhà trai và nhà gái.",
    h1: "Cách ghi thiệp cưới đúng chuẩn, từ danh xưng đến tên khách",
    keyword: "cách ghi thiệp cưới",
    breadcrumb: "Cách ghi thiệp cưới",
    publishedAt: "2026-10-20",
    related: [
      "/mau-thiep-cuoi",
      "/tinh-nang/loi-moi-rieng",
      articlePath("loi-moi-dam-cuoi-hay"),
      "/cong-cu/mau-loi-moi-dam-cuoi",
      "/cong-cu/checklist-dam-cuoi",
      "/tao-thiep",
    ],
  },
  {
    slug: "loi-moi-dam-cuoi-hay",
    category: "thiep-loi-moi",
    title: "Lời mời đám cưới hay, trang trọng cho từng khách · Hẹn Ước",
    description:
      "Gợi ý lời mời đám cưới hay cho ông bà, họ hàng, đồng nghiệp và bạn bè: câu chữ trang trọng để in thiệp và tin nhắn ngắn, lịch sự khi gửi qua Zalo.",
    h1: "Lời mời đám cưới hay, trang trọng cho từng người nhận",
    keyword: "lời mời đám cưới hay",
    breadcrumb: "Lời mời đám cưới hay",
    publishedAt: "2026-10-20",
    related: [
      "/cam-nang/loi-cam-on-sau-dam-cuoi",
      "/tinh-nang/loi-moi-rieng",
      "/cong-cu/mau-loi-moi-dam-cuoi",
      "/mau-thiep-cuoi",
      articlePath("cach-ghi-thiep-cuoi"),
      "/tao-thiep",
    ],
  },
  {
    slug: "le-vu-quy-thanh-hon-tan-hon",
    category: "phong-tuc",
    title: "Lễ vu quy là gì? Tân hôn và thành hôn khác gì · Hẹn Ước",
    description:
      "Lễ vu quy là gì, khác tân hôn và thành hôn thế nào? Bảng phân biệt, lưu ý cách gọi theo gia đình và mẫu câu để chốt nội dung thiệp cưới.",
    h1: "Lễ vu quy là gì? Phân biệt với tân hôn và thành hôn",
    keyword: "lễ vu quy là gì",
    breadcrumb: "Vu quy, tân hôn, thành hôn",
    publishedAt: "2026-10-23",
    related: ["/cam-nang/cach-ghi-thiep-cuoi", "/mau-thiep-cuoi", "/tao-thiep"],
  },
  {
    slug: "gui-thiep-cuoi-qua-zalo",
    category: "thiep-loi-moi",
    title: "Gửi thiệp cưới qua Zalo: cách mời khéo · Hẹn Ước",
    description:
      "Gửi thiệp cưới qua Zalo sao cho lịch sự: bảng chọn cách mời theo người nhận, tám tin nhắn tự chỉnh và cách theo dõi phản hồi sau khi gửi.",
    h1: "Gửi thiệp cưới qua Zalo sao cho lịch sự, rõ lời mời",
    keyword: "gửi thiệp cưới qua zalo",
    breadcrumb: "Gửi thiệp cưới qua Zalo",
    publishedAt: "2026-10-23",
    related: [
      "/cam-nang/co-nen-dung-thiep-cuoi-online",
      "/tinh-nang/loi-moi-rieng",
      "/cam-nang/loi-moi-dam-cuoi-hay",
      "/mau-thiep-cuoi",
    ],
  },
  {
    slug: "du-tru-chi-phi-dam-cuoi",
    category: "chi-phi",
    title: "Dự trù chi phí đám cưới: bảng tự điền · Hẹn Ước",
    description:
      "Dự trù chi phí đám cưới bằng bảng hạng mục tự điền, công thức tiền tiệc và mẫu hỏi báo giá; tách tiền cọc, khoản còn trả và phần chưa chốt.",
    h1: "Dự trù chi phí đám cưới bằng bảng tự điền và báo giá thật",
    keyword: "dự trù chi phí đám cưới",
    breadcrumb: "Dự trù chi phí đám cưới",
    publishedAt: "2026-10-23",
    related: [
      "/cam-nang/di-dam-cuoi-bao-nhieu-tien",
      "/cam-nang/cach-tinh-so-luong-khach-moi",
      "/cong-cu/checklist-dam-cuoi",
      "/tinh-nang/checklist-dam-cuoi",
    ],
  },
  {
    slug: "cach-tinh-so-luong-khach-moi",
    category: "khach-moi",
    title: "Tính số lượng khách mời đám cưới và số bàn · Hẹn Ước",
    description:
      "Tính số lượng khách mời đám cưới từ phản hồi của từng người, xử lý khách trùng, chia số bàn và trao đổi bàn dự phòng bằng bảng tự điền.",
    h1: "Tính số lượng khách mời đám cưới để chốt số bàn",
    keyword: "tính số lượng khách mời đám cưới",
    breadcrumb: "Tính số lượng khách mời",
    publishedAt: "2026-10-23",
    related: [
      "/tinh-nang/rsvp",
      "/tinh-nang/quan-ly-khach-moi",
      "/cam-nang/du-tru-chi-phi-dam-cuoi",
    ],
  },
  {
    slug: "le-dam-ngo-can-chuan-bi-gi",
    category: "phong-tuc",
    title: "Lễ dạm ngõ cần chuẩn bị gì? Checklist hai nhà · Hẹn Ước",
    description:
      "Lễ dạm ngõ cần chuẩn bị gì? Checklist hai gia đình, câu hỏi về lễ vật theo vùng và mẫu lời thưa chuyện; phân biệt buổi ra mắt với lễ ăn hỏi.",
    h1: "Lễ dạm ngõ cần chuẩn bị gì? Checklist và lời thưa chuyện",
    keyword: "lễ dạm ngõ cần chuẩn bị gì",
    breadcrumb: "Chuẩn bị lễ dạm ngõ",
    publishedAt: "2026-10-24",
    related: [
      "/cam-nang/le-an-hoi-can-chuan-bi-gi",
      "/cong-cu/checklist-dam-cuoi",
      "/cam-nang/le-vu-quy-thanh-hon-tan-hon",
      "/cam-nang/cach-ghi-thiep-cuoi",
    ],
  },
  {
    slug: "gui-thiep-cuoi-truoc-bao-lau",
    category: "thiep-loi-moi",
    title: "Gửi thiệp cưới trước bao lâu? Lịch tự điền · Hẹn Ước",
    description:
      "Gửi thiệp cưới trước bao lâu tuỳ khoảng cách và gia đình: bảng thời điểm theo nhóm khách, cách tính lùi từ hạn chốt khách và mẫu nhắc phản hồi.",
    h1: "Gửi thiệp cưới trước bao lâu để khách tiện sắp xếp?",
    keyword: "gửi thiệp cưới trước bao lâu",
    breadcrumb: "Thời điểm gửi thiệp",
    publishedAt: "2026-10-24",
    related: [
      "/cong-cu/checklist-dam-cuoi",
      "/cam-nang/gui-thiep-cuoi-qua-zalo",
      "/tinh-nang/rsvp",
    ],
  },
  {
    slug: "nhan-tin-xac-nhan-tham-du-dam-cuoi",
    category: "khach-moi",
    title: "Xác nhận tham dự đám cưới: mẫu tin nhắn · Hẹn Ước",
    description:
      "Mẫu tin nhắn xác nhận tham dự đám cưới cho họ hàng, đồng nghiệp và bạn bè theo từng thời điểm; cách hỏi lịch sự, ghi nhận phản hồi và dùng RSVP.",
    h1: "Nhắn tin xác nhận tham dự đám cưới: mẫu theo thời điểm",
    keyword: "xác nhận tham dự đám cưới",
    breadcrumb: "Nhắn tin xác nhận tham dự",
    publishedAt: "2026-10-24",
    related: [
      "/tinh-nang/rsvp",
      "/cam-nang/loi-moi-dam-cuoi-hay",
      "/cam-nang/cach-tinh-so-luong-khach-moi",
    ],
  },
  {
    slug: "lich-trinh-ngay-cuoi",
    category: "phong-tuc",
    title: "Lịch trình ngày cưới: mẫu tự điền theo buổi · Hẹn Ước",
    description:
      "Lịch trình ngày cưới tự điền cho lễ hỏi khác ngày, gộp hỏi–cưới và riêng phần tiệc nhà hàng; cách chốt mốc, giao việc, dự phòng di chuyển và trễ lịch.",
    h1: "Lịch trình ngày cưới: mẫu tự điền cho từng cách tổ chức",
    keyword: "lịch trình ngày cưới",
    breadcrumb: "Lịch trình ngày cưới",
    publishedAt: "2026-10-24",
    related: [
      "/cam-nang/le-vu-quy-thanh-hon-tan-hon",
      "/cam-nang/le-dam-ngo-can-chuan-bi-gi",
      "/cong-cu/checklist-dam-cuoi",
    ],
  },
  {
    slug: "di-dam-cuoi-bao-nhieu-tien",
    category: "chi-phi",
    title: "Đi đám cưới bao nhiêu tiền? Khoảng tham khảo · Hẹn Ước",
    description:
      "Đi đám cưới bao nhiêu tiền tuỳ quan hệ và địa phương: bảng khoảng tham khảo, phiếu tự cân nhắc ngân sách và cách gửi lời chúc tế nhị.",
    h1: "Đi đám cưới bao nhiêu tiền? Cân nhắc theo quan hệ và địa phương",
    keyword: "đi đám cưới bao nhiêu tiền",
    breadcrumb: "Tiền mừng cưới",
    related: [
      "/cam-nang/du-tru-chi-phi-dam-cuoi",
      "/mau-thiep-cuoi",
      "/tinh-nang/loi-moi-rieng",
      "/cam-nang/nhan-tin-xac-nhan-tham-du-dam-cuoi",
    ],
    publishedAt: "2026-10-25",
  },
  {
    slug: "le-an-hoi-can-chuan-bi-gi",
    category: "phong-tuc",
    title: "Lễ ăn hỏi cần chuẩn bị gì? Mâm quả và số tráp · Hẹn Ước",
    description:
      "Lễ ăn hỏi cần chuẩn bị gì? Checklist hai nhà, cách bàn mâm quả và số tráp theo Bắc, Trung, Nam, cùng khung trình tự để người lớn xác nhận.",
    h1: "Lễ ăn hỏi cần chuẩn bị gì? Checklist, mâm quả và trình tự lễ",
    keyword: "lễ ăn hỏi cần chuẩn bị gì",
    breadcrumb: "Chuẩn bị lễ ăn hỏi",
    related: [
      "/cam-nang/le-dam-ngo-can-chuan-bi-gi",
      "/cam-nang/lich-trinh-ngay-cuoi",
      "/mau-thiep-cuoi",
      "/tinh-nang/checklist-dam-cuoi",
      "/cong-cu/checklist-dam-cuoi",
    ],
    publishedAt: "2026-10-25",
  },
  {
    slug: "co-nen-dung-thiep-cuoi-online",
    category: "thiep-loi-moi",
    title: "Có nên dùng thiệp cưới online? Cách chọn · Hẹn Ước",
    description:
      "Có nên dùng thiệp cưới online? So sánh với thiệp giấy, bảng chọn cách mời theo người nhận và mẫu thưa gửi người lớn tuổi để gia đình cùng bàn.",
    h1: "Có nên dùng thiệp cưới online? Chọn cách mời hợp với gia đình",
    keyword: "có nên dùng thiệp cưới online",
    breadcrumb: "Có nên dùng thiệp online",
    related: [
      "/mau-thiep-cuoi",
      "/tinh-nang/loi-moi-rieng",
      "/cam-nang/gui-thiep-cuoi-qua-zalo",
      "/cam-nang/gui-thiep-cuoi-truoc-bao-lau",
    ],
    publishedAt: "2026-10-25",
  },
  {
    slug: "loi-cam-on-sau-dam-cuoi",
    category: "khach-moi",
    title: "Lời cảm ơn sau đám cưới: mẫu tin nhắn · Hẹn Ước",
    description:
      "Lời cảm ơn sau đám cưới cho khách dự tiệc, gia đình và người phụ giúp: mẫu tin nhắn tự chỉnh, lời cảm ơn công khai và checklist trước khi gửi.",
    h1: "Lời cảm ơn sau đám cưới cho khách, gia đình và người phụ giúp",
    keyword: "lời cảm ơn sau đám cưới",
    breadcrumb: "Lời cảm ơn sau đám cưới",
    related: [
      "/cam-nang/loi-moi-dam-cuoi-hay",
      "/cam-nang/lich-trinh-ngay-cuoi",
      "/mau-thiep-cuoi",
      "/tinh-nang/loi-moi-rieng",
    ],
    publishedAt: "2026-10-25",
  },
  {
    slug: "cau-chuc-dam-cuoi-hay",
    category: "thiep-loi-moi",
    title: "Câu chúc đám cưới hay theo từng mối quan hệ · Hẹn Ước",
    description:
      "Câu chúc đám cưới hay cho bạn thân, đồng nghiệp và họ hàng, kèm mẫu tự biên soạn, cách viết thiệp mừng và lưu ý chọn lời chúc đúng người nhận.",
    h1: "Câu chúc đám cưới hay cho bạn thân, đồng nghiệp và họ hàng",
    keyword: "câu chúc đám cưới hay",
    breadcrumb: "Câu chúc đám cưới",
    publishedAt: "2026-10-26",
    related: [
      "/mau-thiep-cuoi",
      "/tinh-nang/loi-moi-rieng",
      "/cam-nang/loi-moi-dam-cuoi-hay",
      "/tao-thiep",
    ],
  },
  {
    slug: "cach-xep-cho-ngoi-tiec-cuoi",
    category: "khach-moi",
    title: "Cách xếp chỗ ngồi tiệc cưới cho từng nhóm khách · Hẹn Ước",
    description:
      "Cách xếp chỗ ngồi tiệc cưới cho hai họ, khách VIP, trẻ em và người lớn tuổi; hướng dẫn đọc sơ đồ sảnh, ghép bàn và xử lý thay đổi sát giờ.",
    h1: "Cách xếp chỗ ngồi tiệc cưới cho hai họ, khách VIP và trẻ em",
    keyword: "cách xếp chỗ ngồi tiệc cưới",
    breadcrumb: "Xếp chỗ ngồi tiệc cưới",
    publishedAt: "2026-10-26",
    related: [
      "/mau-thiep-cuoi",
      "/tinh-nang/quan-ly-khach-moi",
      "/cam-nang/cach-tinh-so-luong-khach-moi",
      "/tao-thiep",
    ],
  },
  {
    slug: "bai-phat-bieu-dai-dien-hai-ho",
    category: "phong-tuc",
    title: "Bài phát biểu đại diện hai họ: khung và mẫu · Hẹn Ước",
    description:
      "Bài phát biểu đại diện hai họ với khung nhà trai, nhà gái và hai mẫu ngắn tự chỉnh; cách chọn danh xưng, chốt lời thưa và tập đọc trước buổi lễ.",
    h1: "Bài phát biểu đại diện hai họ: khung nhà trai, nhà gái và hai mẫu ngắn",
    keyword: "bài phát biểu đại diện hai họ",
    breadcrumb: "Phát biểu đại diện hai họ",
    publishedAt: "2026-10-26",
    related: [
      "/mau-thiep-cuoi",
      "/tinh-nang/checklist-dam-cuoi",
      "/cam-nang/lich-trinh-ngay-cuoi",
      "/tao-thiep",
    ],
  },
  {
    slug: "cach-chon-ngay-cuoi",
    category: "phong-tuc",
    title: "Cách chọn ngày cưới: lịch thực tế và tập quán · Hẹn Ước",
    description:
      "Cách chọn ngày cưới theo lịch hai bạn, thời tiết, địa điểm và lịch khách; gợi ý trao đổi tập quán xem ngày trung tính, không phán ngày tốt hay xấu.",
    h1: "Cách chọn ngày cưới theo lịch thực tế và tập quán gia đình",
    keyword: "cách chọn ngày cưới",
    breadcrumb: "Chọn ngày cưới",
    publishedAt: "2026-10-26",
    related: [
      "/mau-thiep-cuoi",
      "/tinh-nang/checklist-dam-cuoi",
      "/cam-nang/gui-thiep-cuoi-truoc-bao-lau",
      "/tao-thiep",
    ],
  },
];
