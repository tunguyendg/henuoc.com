import type { MiniStyle } from "@/components/home/mini-invitation";

/**
 * Danh mục mẫu thiệp + phong cách — MỘT nguồn dữ liệu cho trang chủ, gallery, trang phong cách,
 * trang chi tiết và sổ SEO. Sau này theme thật (M1) chỉ cần thay `preview` và `status`.
 *
 * status:
 *  - "concept"   : mới là thiệp minh hoạ → noindex, không vào sitemap (docs/08-SEO.md §4)
 *  - "published" : theme thật đã qua QA (docs/07-THEMES.md §8) → index
 */

export interface ThemeStyle {
  slug: string;
  name: string; // "Truyền thống"
  keyword: string; // từ khoá SEO chính, viết đúng hoa/thường vì dùng thẳng trong title + H1
  intro: string; // đoạn giới thiệu trên trang phong cách (viết tay, 2–3 câu)
}

export interface Theme {
  slug: string;
  name: string;
  preview: MiniStyle;
  styles: string[]; // slug phong cách, cái đầu tiên là phong cách chính
  tier: "free" | "premium";
  status: "concept" | "published";
  summary: string; // 1 câu, dùng trên thẻ
  description: string; // 80–150 chữ, dùng cho trang chi tiết + SEO
  features: string[];
  palette: string[];
}

export const themeStyles: ThemeStyle[] = [
  {
    slug: "hien-dai",
    name: "Hiện đại",
    keyword: "thiệp cưới hiện đại",
    intro:
      "Bố cục gọn, chữ rõ, màu tươi. Hợp với cặp đôi trẻ muốn tấm thiệp trông như một ứng dụng đẹp trên điện thoại.",
  },
  {
    slug: "toi-gian",
    name: "Tối giản",
    keyword: "thiệp cưới tối giản",
    intro:
      "Ít chi tiết, nhiều khoảng trắng, để tên hai bạn và ngày cưới là nhân vật chính. Sang mà không cầu kỳ.",
  },
  {
    slug: "truyen-thong",
    name: "Truyền thống",
    keyword: "thiệp cưới truyền thống",
    intro:
      "Sắc đỏ – vàng, chữ Hỷ và lời mời trang trọng đúng phong tục. Ông bà, cô chú nhận là thấy ngay không khí đám cưới.",
  },
  {
    slug: "hoa-la",
    name: "Hoa lá",
    keyword: "thiệp cưới hoa lá",
    intro:
      "Hoa vẽ màu nước, nền phấn nhẹ, cảm giác lãng mạn như một buổi sáng tiệc cưới ngoài trời.",
  },
  {
    slug: "han-quoc",
    name: "Hàn Quốc",
    keyword: "thiệp cưới Hàn Quốc",
    intro:
      "Phong cách thiệp cưới Hàn: nền trắng tinh, chữ mảnh, ảnh cưới lớn — nhẹ nhàng và rất 'ảnh'.",
  },
  {
    slug: "vintage",
    name: "Vintage",
    keyword: "thiệp cưới vintage",
    intro:
      "Tông giấy cũ, nét chữ nghiêng hoài cổ. Dành cho cặp đôi mê ảnh film và những điều xưa cũ.",
  },
  {
    slug: "sang-trong",
    name: "Sang trọng",
    keyword: "thiệp cưới sang trọng",
    intro: "Màu đậm, viền ánh kim, bố cục cân đối — cho những tiệc cưới ở nhà hàng, khách sạn lớn.",
  },
];

export const themes: Theme[] = [
  {
    slug: "hong-pastel",
    name: "Hồng Pastel",
    preview: "pastel",
    styles: ["hoa-la", "hien-dai"],
    tier: "free",
    status: "concept",
    summary: "Nền hồng phấn, tên viết nghiêng mềm mại.",
    description:
      "Hồng Pastel mở ra bằng một phong bì hồng phấn, tên cô dâu chú rể viết nghiêng mềm mại, các buổi lễ xếp thành thẻ bo tròn dễ đọc trên điện thoại. Phù hợp cặp đôi thích nhẹ nhàng, nữ tính nhưng không sến. Mẫu có đủ lịch âm dương, bản đồ chỉ đường, album ảnh và QR mừng cưới cho hai bên.",
    features: ["Mở phong bì", "Nhạc nền", "Lịch âm dương", "Album ảnh", "QR mừng cưới", "RSVP"],
    palette: ["#FBEEF0", "#E8B9C3", "#B07686", "#8A3D52"],
  },
  {
    slug: "song-hy",
    name: "Song Hỷ",
    preview: "songhy",
    styles: ["truyen-thong", "sang-trong"],
    tier: "free",
    status: "concept",
    summary: "Đỏ son, viền vàng, trang trọng đúng phong tục.",
    description:
      "Song Hỷ là mẫu thiệp truyền thống với nền đỏ son và viền vàng kim, bố cục đối xứng như thiệp giấy in. Lời mời trang trọng, có chỗ cho tên ông bà, bố mẹ hai bên và tách riêng lễ vu quy, lễ thành hôn. Lựa chọn an toàn khi khách mời có nhiều người lớn tuổi.",
    features: [
      "Lễ vu quy & thành hôn",
      "Tên bố mẹ hai bên",
      "Lịch âm dương",
      "QR mừng cưới",
      "RSVP",
    ],
    palette: ["#8E1B24", "#D4A24C", "#E9B96E", "#F3D28B"],
  },
  {
    slug: "ban-tin",
    name: "Bản Tin",
    preview: "bantin",
    styles: ["toi-gian", "hien-dai"],
    tier: "premium",
    status: "concept",
    summary: "Chữ in đậm kiểu tạp chí, tối giản đen – kem.",
    description:
      "Bản Tin lấy cảm hứng từ trang tạp chí: chữ in hoa đậm, lưới bố cục rõ ràng, tông đen – kem tối giản. Ảnh cưới được đặt lớn, tràn màn hình, các buổi lễ trình bày như mục lục. Dành cho cặp đôi thích phong cách hiện đại, cá tính.",
    features: ["Ảnh tràn màn hình", "Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#F4EFE6", "#6D6A63", "#1D1D1F"],
  },
  {
    slug: "xanh-sage",
    name: "Xanh Sage",
    preview: "sage",
    styles: ["hien-dai", "hoa-la", "toi-gian"],
    tier: "free",
    status: "concept",
    summary: "Xanh lá dịu, tươi mát cho tiệc ngoài trời.",
    description:
      "Xanh Sage dùng tông xanh lá dịu và kem, gợi cảm giác tươi mát của một tiệc cưới ngoài trời hay trong vườn. Chữ rõ, khoảng trắng rộng, các thông tin quan trọng như giờ, địa điểm luôn nổi bật. Hợp với đám cưới nhẹ nhàng, gần gũi.",
    features: ["Đếm ngược", "Lịch âm dương", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#E7EDE4", "#A9BBA8", "#728A74", "#3E5641"],
  },
  {
    slug: "seoul",
    name: "Seoul",
    preview: "hanquoc",
    styles: ["han-quoc", "toi-gian"],
    tier: "premium",
    status: "concept",
    summary: "Trắng tinh, chữ mảnh kiểu thiệp Hàn.",
    description:
      "Seoul theo phong cách thiệp cưới Hàn Quốc: nền trắng tinh, chữ mảnh giãn rộng, ảnh cưới lớn làm điểm nhấn. Chuyển động nhẹ khi cuộn, không màu mè. Phù hợp với bộ ảnh cưới chụp studio hoặc phong cách Hàn.",
    features: ["Ảnh cưới lớn", "Hiệu ứng cuộn nhẹ", "Đếm ngược", "Album ảnh", "RSVP"],
    palette: ["#FFFFFF", "#E6E6E6", "#9B9B9B", "#4A4A4A"],
  },
  {
    slug: "hoai-niem",
    name: "Hoài Niệm",
    preview: "vintage",
    styles: ["vintage", "hoa-la"],
    tier: "free",
    status: "concept",
    summary: "Tông giấy cũ, chữ nghiêng hoài cổ.",
    description:
      "Hoài Niệm mang tông giấy kraft và nâu ấm, chữ nghiêng như viết tay, gợi không khí những tấm thiệp ngày xưa. Hợp với bộ ảnh cưới film, ảnh phố cổ hay áo dài truyền thống. Có đủ lịch âm dương và QR mừng cưới.",
    features: ["Chữ viết tay", "Lịch âm dương", "Album ảnh", "QR mừng cưới", "RSVP"],
    palette: ["#EFE3CF", "#B89474", "#8C6C52", "#5A3E2B"],
  },
];

export function getTheme(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug);
}

export function getStyle(slug: string): ThemeStyle | undefined {
  return themeStyles.find((s) => s.slug === slug);
}

export function themesByStyle(styleSlug: string): Theme[] {
  return themes.filter((t) => t.styles.includes(styleSlug));
}

/** Mẫu tương tự: cùng phong cách chính trước, sau đó các mẫu còn lại. */
export function similarThemes(theme: Theme, limit = 3): Theme[] {
  const others = themes.filter((t) => t.slug !== theme.slug);
  const score = (t: Theme) => t.styles.filter((s) => theme.styles.includes(s)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Trang phong cách chỉ được index khi có ≥ 3 mẫu ĐÃ PUBLISH (tránh trang mỏng). */
export const MIN_THEMES_FOR_STYLE_INDEX = 3;

export function publishedCount(styleSlug: string): number {
  return themesByStyle(styleSlug).filter((t) => t.status === "published").length;
}
