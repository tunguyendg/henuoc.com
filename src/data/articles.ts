/**
 * Danh mục bài Cẩm nang (docs/04-GROWTH.md §2.2). Nguồn sự thật cho metadata SEO của từng bài.
 * Thân bài nằm ở file .mdx riêng (chỉ nội dung); title / description / H1 / link nội bộ nằm ở đây
 * để `tests/seo.test.ts` đọc được mà không cần biên dịch MDX.
 *
 * Thêm bài = thêm 1 object vào `articles` → sổ SEO (`src/lib/seo/pages.ts`) tự sinh trang
 * `/cam-nang/<slug>`, breadcrumb, "Xem thêm" và sitemap.
 */

export interface Article {
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
    title: "Lời mời đám cưới hay, trang trọng cho từng khách · Hẹn Ước",
    description:
      "Gợi ý lời mời đám cưới hay cho ông bà, họ hàng, đồng nghiệp và bạn bè: câu chữ trang trọng để in thiệp và tin nhắn ngắn, lịch sự khi gửi qua Zalo.",
    h1: "Lời mời đám cưới hay, trang trọng cho từng người nhận",
    keyword: "lời mời đám cưới hay",
    breadcrumb: "Lời mời đám cưới hay",
    publishedAt: "2026-10-20",
    related: [
      "/tinh-nang/loi-moi-rieng",
      "/cong-cu/mau-loi-moi-dam-cuoi",
      "/mau-thiep-cuoi",
      articlePath("cach-ghi-thiep-cuoi"),
      "/tao-thiep",
    ],
  },
  {
    slug: "le-vu-quy-thanh-hon-tan-hon",
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
    title: "Gửi thiệp cưới qua Zalo: cách mời khéo · Hẹn Ước",
    description:
      "Gửi thiệp cưới qua Zalo sao cho lịch sự: bảng chọn cách mời theo người nhận, tám tin nhắn tự chỉnh và cách theo dõi phản hồi sau khi gửi.",
    h1: "Gửi thiệp cưới qua Zalo sao cho lịch sự, rõ lời mời",
    keyword: "gửi thiệp cưới qua zalo",
    breadcrumb: "Gửi thiệp cưới qua Zalo",
    publishedAt: "2026-10-23",
    related: ["/tinh-nang/loi-moi-rieng", "/cam-nang/loi-moi-dam-cuoi-hay", "/mau-thiep-cuoi"],
  },
  {
    slug: "du-tru-chi-phi-dam-cuoi",
    title: "Dự trù chi phí đám cưới: bảng tự điền · Hẹn Ước",
    description:
      "Dự trù chi phí đám cưới bằng bảng hạng mục tự điền, công thức tiền tiệc và mẫu hỏi báo giá; tách tiền cọc, khoản còn trả và phần chưa chốt.",
    h1: "Dự trù chi phí đám cưới bằng bảng tự điền và báo giá thật",
    keyword: "dự trù chi phí đám cưới",
    breadcrumb: "Dự trù chi phí đám cưới",
    publishedAt: "2026-10-23",
    related: [
      "/cam-nang/cach-tinh-so-luong-khach-moi",
      "/cong-cu/checklist-dam-cuoi",
      "/tinh-nang/checklist-dam-cuoi",
    ],
  },
  {
    slug: "cach-tinh-so-luong-khach-moi",
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
];
