import { articlePath, articles, type Article } from "@/data/articles";
import {
  MIN_THEMES_FOR_STYLE_INDEX,
  publishedCount,
  themeStyles,
  themes,
  type Theme,
  type ThemeStyle,
} from "@/data/themes";

/**
 * SỔ SEO — nguồn sự thật cho mọi trang công khai (docs/08-SEO.md).
 * Sửa title / description / H1 / từ khoá / link nội bộ ở ĐÂY, không sửa trong component.
 *
 * Từ sổ này, hệ thống tự sinh: <title>, meta description, canonical, robots,
 * breadcrumb (giao diện + JSON-LD), khối "Xem thêm", sitemap.xml.
 * `tests/seo.test.ts` kiểm tra độ dài, trùng lặp, từ khoá trong H1 và link gãy.
 */

export type SchemaType =
  "WebPage" | "CollectionPage" | "ItemPage" | "AboutPage" | "ContactPage" | "FAQPage" | "Article";

export interface SeoPage {
  path: string; // URL, cũng là canonical
  title: string; // ≤ 60 ký tự, chứa từ khoá
  description: string; // 110–160 ký tự
  h1: string; // H1 duy nhất của trang, chứa từ khoá
  keyword: string; // từ khoá chính — phải xuất hiện trong H1 và title
  breadcrumb: string; // nhãn ngắn trên breadcrumb
  parent?: string; // path trang cha → dựng breadcrumb
  schema: SchemaType;
  related: string[]; // link nội bộ "Xem thêm" (path phải có trong sổ)
  index: boolean; // false → noindex + không vào sitemap
  priority?: number; // sitemap 0–1
}

const staticPages: SeoPage[] = [
  {
    path: "/",
    title: "Thiệp cưới online đẹp, gửi đúng tên từng khách · Hẹn Ước",
    description:
      "Tạo thiệp cưới online đẹp trong vài phút, gửi lời mời mang tên từng khách qua Zalo, khách xác nhận tham dự chỉ với một chạm. Miễn phí bắt đầu.",
    h1: "Thiệp cưới online, gửi đúng tên từng khách.",
    keyword: "thiệp cưới online",
    breadcrumb: "Trang chủ",
    schema: "WebPage",
    related: ["/mau-thiep-cuoi", "/tinh-nang", "/bang-gia", "/cau-hoi-thuong-gap", "/cam-nang"],
    index: true,
    priority: 1,
  },
  {
    path: "/tinh-nang",
    title: "Tính năng thiệp cưới online: RSVP, khách mời · Hẹn Ước",
    description:
      "Các tính năng thiệp cưới online của Hẹn Ước: lời mời mang tên từng khách, xác nhận tham dự một chạm, quản lý khách mời và checklist chuẩn bị cưới.",
    h1: "Tính năng thiệp cưới online",
    keyword: "tính năng thiệp cưới online",
    breadcrumb: "Tính năng",
    parent: "/",
    schema: "CollectionPage",
    related: [
      "/tinh-nang/rsvp",
      "/tinh-nang/quan-ly-khach-moi",
      "/tinh-nang/loi-moi-rieng",
      "/tinh-nang/checklist-dam-cuoi",
      "/mau-thiep-cuoi",
      "/cau-hoi-thuong-gap",
    ],
    index: true,
    priority: 0.8,
  },
  {
    path: "/tinh-nang/rsvp",
    title: "Thiệp cưới có RSVP, khách xác nhận tham dự online · Hẹn Ước",
    description:
      "Thiệp cưới có RSVP: khách bấm xác nhận tham dự ngay trên thiệp, không cần đăng nhập, sửa lại được trước hạn. Hai bạn xem tổng số khách theo từng tiệc.",
    h1: "Thiệp cưới có RSVP, khách xác nhận tham dự chỉ một chạm",
    keyword: "thiệp cưới có RSVP",
    breadcrumb: "RSVP",
    parent: "/tinh-nang",
    schema: "WebPage",
    related: ["/tinh-nang", "/tinh-nang/quan-ly-khach-moi", "/tao-thiep", "/mau-thiep-cuoi"],
    index: true,
    priority: 0.7,
  },
  {
    path: "/tinh-nang/quan-ly-khach-moi",
    title: "Quản lý khách mời đám cưới theo nhà trai, nhà gái · Hẹn Ước",
    description:
      "Quản lý khách mời đám cưới không cần Excel: chia nhà trai, nhà gái, nhóm bạn bè; đánh dấu đã gửi, lọc ai chưa phản hồi và xuất CSV cho nhà hàng.",
    h1: "Quản lý khách mời đám cưới gọn trong một chỗ",
    keyword: "quản lý khách mời đám cưới",
    breadcrumb: "Quản lý khách mời",
    parent: "/tinh-nang",
    schema: "WebPage",
    related: ["/tinh-nang", "/tinh-nang/rsvp", "/tinh-nang/loi-moi-rieng", "/tao-thiep"],
    index: true,
    priority: 0.7,
  },
  {
    path: "/tinh-nang/loi-moi-rieng",
    title: "Lời mời cưới riêng từng khách, link riêng qua Zalo · Hẹn Ước",
    description:
      "Mỗi khách nhận một link thiệp riêng với danh xưng đúng như “Kính mời Anh Minh & Gia đình”, chỉ hiện tiệc được mời. Copy tin nhắn mẫu, gửi qua Zalo.",
    h1: "Lời mời cưới riêng từng khách, đúng tên, đúng tiệc",
    keyword: "lời mời cưới riêng từng khách",
    breadcrumb: "Lời mời riêng",
    parent: "/tinh-nang",
    schema: "WebPage",
    related: ["/tinh-nang", "/tinh-nang/quan-ly-khach-moi", "/tao-thiep", "/mau-thiep-cuoi"],
    index: true,
    priority: 0.7,
  },
  {
    path: "/tinh-nang/checklist-dam-cuoi",
    title: "Lên kế hoạch đám cưới với checklist theo mốc · Hẹn Ước",
    description:
      "Lên kế hoạch đám cưới theo từng mốc trước ngày cưới: hạn mỗi việc tự tính từ ngày cưới, tick việc đã xong, thêm hoặc ẩn việc không cần, xem việc tuần này.",
    h1: "Lên kế hoạch đám cưới không sót việc",
    keyword: "lên kế hoạch đám cưới",
    breadcrumb: "Checklist cưới",
    parent: "/tinh-nang",
    schema: "WebPage",
    related: ["/tinh-nang", "/tinh-nang/quan-ly-khach-moi", "/tao-thiep", "/bang-gia"],
    index: true,
    priority: 0.7,
  },
  {
    path: "/mau-thiep-cuoi",
    title: "Mẫu thiệp cưới đẹp, hiện đại và truyền thống · Hẹn Ước",
    description:
      "Kho mẫu thiệp cưới online đẹp: hiện đại, tối giản, truyền thống, hoa lá, Hàn Quốc. Xem thử ngay với tên hai bạn, đổi mẫu bất cứ lúc nào.",
    h1: "Mẫu thiệp cưới đẹp cho mọi phong cách",
    keyword: "mẫu thiệp cưới đẹp",
    breadcrumb: "Mẫu thiệp",
    parent: "/",
    schema: "CollectionPage",
    related: ["/tao-thiep", "/bang-gia", "/cam-nang"],
    index: true,
    priority: 0.9,
  },
  {
    path: "/bang-gia",
    title: "Bảng giá thiệp cưới online: Miễn phí và Cao cấp · Hẹn Ước",
    description:
      "Bảng giá thiệp cưới online Hẹn Ước: gói Miễn phí để bắt đầu, gói Cao cấp trả một lần cho mỗi đám cưới, không thuê bao hằng tháng. Giá Cao cấp sắp công bố.",
    h1: "Bảng giá thiệp cưới online: Miễn phí hoặc trả một lần",
    keyword: "giá thiệp cưới online",
    breadcrumb: "Bảng giá",
    parent: "/",
    schema: "WebPage",
    related: ["/tinh-nang", "/cau-hoi-thuong-gap", "/mau-thiep-cuoi", "/tao-thiep"],
    index: true,
    priority: 0.7,
  },
  {
    path: "/cau-hoi-thuong-gap",
    title: "Câu hỏi thường gặp về thiệp cưới online · Hẹn Ước",
    description:
      "Giải đáp thắc mắc về thiệp cưới online Hẹn Ước: chi phí, gửi thiệp qua Zalo, khách có cần đăng nhập không, đổi mẫu sau khi gửi, bảo mật khách mời.",
    h1: "Câu hỏi thường gặp về thiệp cưới online",
    keyword: "câu hỏi thường gặp về thiệp cưới online",
    breadcrumb: "Câu hỏi thường gặp",
    parent: "/",
    schema: "FAQPage",
    related: ["/bang-gia", "/tinh-nang", "/mau-thiep-cuoi", "/gioi-thieu"],
    index: true,
    priority: 0.6,
  },
  {
    path: "/gioi-thieu",
    title: "Giới thiệu Hẹn Ước: thiệp cưới online cho người Việt",
    description:
      "Hẹn Ước là dịch vụ thiệp cưới online giúp hai bạn gửi lời mời đúng tên từng khách, nhận xác nhận tham dự và quản lý khách mời gọn trong một chỗ.",
    h1: "Giới thiệu Hẹn Ước",
    keyword: "giới thiệu Hẹn Ước",
    breadcrumb: "Giới thiệu",
    parent: "/",
    schema: "AboutPage",
    related: ["/tinh-nang", "/mau-thiep-cuoi", "/cau-hoi-thuong-gap", "/lien-he"],
    index: true,
    priority: 0.4,
  },
  {
    path: "/chinh-sach-bao-mat",
    title: "Chính sách bảo mật · Hẹn Ước",
    description:
      "Chính sách bảo mật của Hẹn Ước: thông tin nào được thu thập khi tạo thiệp cưới, cách lưu trữ, bảo vệ dữ liệu khách mời và quyền của bạn với dữ liệu đó.",
    h1: "Chính sách bảo mật",
    keyword: "chính sách bảo mật",
    breadcrumb: "Chính sách bảo mật",
    parent: "/",
    schema: "WebPage",
    related: ["/dieu-khoan", "/lien-he"],
    index: false, // legal text pending Tony's review
  },
  {
    path: "/dieu-khoan",
    title: "Điều khoản sử dụng · Hẹn Ước",
    description:
      "Điều khoản sử dụng dịch vụ thiệp cưới online Hẹn Ước: quyền và trách nhiệm của người dùng, nội dung đăng trên thiệp, thanh toán gói Cao cấp và cách liên hệ.",
    h1: "Điều khoản sử dụng",
    keyword: "điều khoản sử dụng",
    breadcrumb: "Điều khoản",
    parent: "/",
    schema: "WebPage",
    related: ["/chinh-sach-bao-mat", "/lien-he"],
    index: false, // legal text pending Tony's review
  },
  {
    path: "/cam-nang",
    title: "Cẩm nang cưới: cách ghi thiệp, lời mời hay · Hẹn Ước",
    description:
      "Cẩm nang cưới cho hai bạn: cách ghi thiệp cưới đúng danh xưng, viết lời mời đám cưới hay, trang trọng cho từng khách, kèm mẫu câu mời dùng ngay.",
    h1: "Cẩm nang cưới",
    keyword: "cẩm nang cưới",
    breadcrumb: "Cẩm nang",
    parent: "/",
    schema: "CollectionPage",
    related: [
      articlePath("cach-ghi-thiep-cuoi"),
      articlePath("loi-moi-dam-cuoi-hay"),
      "/mau-thiep-cuoi",
      "/tinh-nang",
    ],
    index: true,
    priority: 0.7,
  },
  {
    path: "/lien-he",
    title: "Liên hệ · Hẹn Ước",
    description:
      "Liên hệ đội ngũ Hẹn Ước để được hỗ trợ tạo thiệp cưới online, nâng cấp gói hoặc hợp tác. Chúng mình phản hồi trong giờ làm việc.",
    h1: "Liên hệ Hẹn Ước",
    keyword: "liên hệ",
    breadcrumb: "Liên hệ",
    parent: "/",
    schema: "ContactPage",
    related: ["/", "/gioi-thieu", "/cau-hoi-thuong-gap"],
    index: false,
  },
  {
    path: "/tao-thiep",
    title: "Tạo thiệp cưới miễn phí · Hẹn Ước",
    description:
      "Chọn mẫu, điền thông tin và xem trước thiệp cưới của hai bạn ngay trên điện thoại. Không cần đăng nhập để thử.",
    h1: "Tạo thiệp cưới",
    keyword: "tạo thiệp cưới",
    breadcrumb: "Tạo thiệp",
    parent: "/",
    schema: "WebPage",
    related: ["/mau-thiep-cuoi", "/cau-hoi-thuong-gap"],
    index: false, // app, không phải trang nội dung
  },
  {
    path: "/dang-nhap",
    title: "Đăng nhập · Hẹn Ước",
    description:
      "Đăng nhập Hẹn Ước bằng Google hoặc email để lưu thiệp cưới, quản lý khách mời và theo dõi RSVP trên mọi thiết bị.",
    h1: "Đăng nhập",
    keyword: "đăng nhập",
    breadcrumb: "Đăng nhập",
    parent: "/",
    schema: "WebPage",
    related: ["/tao-thiep"],
    index: false,
  },
];

export function stylePath(slug: string) {
  return `/mau-thiep-cuoi/phong-cach/${slug}`;
}

export function themePath(slug: string) {
  return `/mau-thiep-cuoi/${slug}`;
}

/** Cắt mô tả ở ranh giới từ, thêm "…" nếu bị cắt. */
export function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/[\s,.;:–-]+\S*$/, "") + "…";
}

function stylePage(s: ThemeStyle): SeoPage {
  return {
    path: stylePath(s.slug),
    title: `Mẫu ${s.keyword} đẹp · Hẹn Ước`,
    description: clip(
      `Mẫu ${s.keyword} online, xem thử với tên hai bạn và gửi qua Zalo. ${s.intro}`,
    ),
    h1: `Mẫu ${s.keyword}`,
    keyword: s.keyword,
    breadcrumb: s.name,
    parent: "/mau-thiep-cuoi",
    schema: "CollectionPage",
    related: ["/mau-thiep-cuoi", "/tao-thiep"],
    index: publishedCount(s.slug) >= MIN_THEMES_FOR_STYLE_INDEX,
    priority: 0.7,
  };
}

function themePage(t: Theme): SeoPage {
  return {
    path: themePath(t.slug),
    title: `Mẫu thiệp cưới ${t.name} · Hẹn Ước`,
    description: clip(t.description),
    h1: `Mẫu thiệp cưới ${t.name}`,
    keyword: "mẫu thiệp cưới",
    breadcrumb: t.name,
    parent: "/mau-thiep-cuoi",
    schema: "ItemPage",
    related: [...t.styles.map(stylePath), "/tao-thiep"],
    index: t.status === "published",
    priority: 0.6,
  };
}

function articlePage(a: Article): SeoPage {
  return {
    path: articlePath(a.slug),
    title: a.title,
    description: a.description,
    h1: a.h1,
    keyword: a.keyword,
    breadcrumb: a.breadcrumb,
    parent: "/cam-nang",
    schema: "Article",
    related: a.related,
    index: true,
    priority: 0.6,
  };
}

export const seoPages: SeoPage[] = [
  ...staticPages,
  ...themeStyles.map(stylePage),
  ...themes.map(themePage),
  ...articles.map(articlePage),
];

const byPath = new Map(seoPages.map((p) => [p.path, p]));

export function getSeoPage(path: string): SeoPage {
  const page = byPath.get(path);
  if (!page) throw new Error(`[seo] Trang "${path}" chưa có trong src/lib/seo/pages.ts`);
  return page;
}

export function findSeoPage(path: string): SeoPage | undefined {
  return byPath.get(path);
}

/** Chuỗi breadcrumb từ trang chủ tới trang hiện tại. */
export function breadcrumbTrail(path: string): SeoPage[] {
  const trail: SeoPage[] = [];
  let current: SeoPage | undefined = getSeoPage(path);
  while (current) {
    trail.unshift(current);
    current = current.parent ? byPath.get(current.parent) : undefined;
  }
  return trail;
}
