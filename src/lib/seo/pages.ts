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

export type SchemaType = "WebPage" | "CollectionPage" | "ItemPage" | "AboutPage" | "ContactPage";

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
    related: ["/mau-thiep-cuoi", "/bang-gia", "/cam-nang"],
    index: true,
    priority: 1,
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
    title: "Bảng giá thiệp cưới online · Hẹn Ước",
    description:
      "Bắt đầu miễn phí, trả một lần cho mỗi đám cưới khi cần thêm mẫu cao cấp và không giới hạn lời mời. Không thuê bao hằng tháng.",
    h1: "Bảng giá thiệp cưới online",
    keyword: "thiệp cưới online",
    breadcrumb: "Bảng giá",
    parent: "/",
    schema: "WebPage",
    related: ["/mau-thiep-cuoi", "/tao-thiep"],
    index: false, // trang tạm — bật khi có nội dung thật
  },
  {
    path: "/cam-nang",
    title: "Cẩm nang cưới: ghi thiệp, lời mời, checklist · Hẹn Ước",
    description:
      "Hướng dẫn cách ghi thiệp cưới, lời mời đám cưới hay, phân biệt lễ vu quy và thành hôn, checklist chuẩn bị đám cưới từ A đến Z.",
    h1: "Cẩm nang cưới",
    keyword: "cẩm nang cưới",
    breadcrumb: "Cẩm nang",
    parent: "/",
    schema: "CollectionPage",
    related: ["/mau-thiep-cuoi"],
    index: false,
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
    related: ["/"],
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
    related: ["/mau-thiep-cuoi"],
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

export const seoPages: SeoPage[] = [
  ...staticPages,
  ...themeStyles.map(stylePage),
  ...themes.map(themePage),
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
