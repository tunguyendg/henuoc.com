import type { MiniStyle } from "@/components/home/mini-invitation";
import type { StyleSlug } from "@/themes/types";

/**
 * Danh mục mẫu thiệp + phong cách — MỘT nguồn dữ liệu cho trang chủ, gallery, trang phong cách,
 * trang chi tiết và sổ SEO. Sau này theme thật (M1) chỉ cần thay `preview` và `status`.
 *
 * status:
 *  - "concept"   : mới là thiệp minh hoạ → noindex, không vào sitemap (docs/08-SEO.md §4)
 *  - "published" : theme thật đã qua QA (docs/07-THEMES.md §8) → index
 */

export interface ThemeFaq {
  q: string;
  a: string;
}

export interface ThemeStyle {
  slug: StyleSlug;
  name: string; // "Truyền thống Việt" (chip, H2; title dựng từ keyword vì name có thể dài)
  keyword: string; // từ khoá SEO chính, viết đúng hoa/thường vì dùng thẳng trong title + H1
  intro: string; // đoạn giới thiệu trên trang phong cách (viết tay, 2–3 câu)
  secondaryKeywords?: string[]; // từ khoá phụ, đã đưa vào intro (không dùng làm title)
  title?: string; // ghi đè title mặc định `Mẫu ${keyword} đẹp · Hẹn Ước`
  h1?: string; // ghi đè H1 mặc định `Mẫu ${keyword}`
  faq: ThemeFaq[]; // cần ≥ MIN_STYLE_FAQ câu (viết tay) thì trang phong cách mới được index
}

export interface Theme {
  slug: string;
  name: string;
  preview: MiniStyle;
  styles: StyleSlug[]; // slug phong cách, cái đầu tiên là phong cách chính
  tier: "free" | "premium"; // đề xuất, Tony có thể đổi
  status: "concept" | "published";
  summary: string; // 1 câu, dùng trên thẻ
  description: string; // 80–150 chữ, dùng cho trang chi tiết + SEO
  features: string[];
  palette: string[];
}

export const themeStyles: ThemeStyle[] = [
  {
    slug: "truyen-thong-viet",
    name: "Truyền thống Việt",
    keyword: "thiệp cưới truyền thống",
    intro:
      "Sắc đỏ – vàng, chữ Hỷ và lời mời trang trọng đúng phong tục. Ông bà, cô chú nhận là thấy ngay không khí đám cưới.",
    faq: [],
  },
  {
    slug: "toi-gian",
    name: "Tối giản & Thanh lịch",
    keyword: "thiệp cưới tối giản",
    intro:
      "Ít chi tiết, nhiều khoảng trắng, để tên hai bạn và ngày cưới là nhân vật chính. Sang mà không cầu kỳ.",
    faq: [],
  },
  {
    slug: "sang-trong",
    name: "Sang trọng & Hoàng gia",
    keyword: "thiệp cưới sang trọng",
    intro: "Màu đậm, viền ánh kim, bố cục cân đối — cho những tiệc cưới ở nhà hàng, khách sạn lớn.",
    faq: [],
  },
  {
    slug: "lang-man-hoa-la",
    name: "Lãng mạn & Hoa lá",
    keyword: "thiệp cưới hoa lá",
    intro:
      "Hoa vẽ màu nước, nền phấn nhẹ, cảm giác lãng mạn như một buổi sáng tiệc cưới ngoài trời.",
    faq: [],
  },
  {
    slug: "han-quoc-nhat-ban",
    name: "Hàn Quốc & Nhật Bản",
    keyword: "thiệp cưới Hàn Quốc",
    intro:
      "Nền sáng, chữ mảnh, ảnh cưới lớn và chuyển động khẽ như thiệp cưới Hàn, thêm chút tĩnh lặng và hoa anh đào của Nhật. Nhẹ nhàng và rất hợp bộ ảnh studio.",
    faq: [],
  },
  {
    slug: "rustic",
    name: "Thiên nhiên & Mộc mạc",
    keyword: "thiệp cưới rustic",
    secondaryKeywords: ["mộc mạc", "boho"],
    intro:
      "Màu đất, lá xanh, chất liệu gỗ và giấy thô, đúng chất rustic mộc mạc. Có cả nét boho phóng khoáng cho đám cưới sân vườn, đồng quê hay những buổi tiệc ấm cúng giữa người thân.",
    faq: [],
  },
  {
    slug: "co-dien-hoai-niem",
    name: "Cổ điển & Hoài niệm",
    keyword: "thiệp cưới vintage",
    intro:
      "Tông giấy cũ, nét chữ nghiêng hoài cổ, gợi lại phố xưa và những tấm ảnh film. Dành cho cặp đôi mê những điều đã cũ mà vẫn đẹp.",
    faq: [],
  },
  {
    slug: "bien",
    name: "Biển & Du lịch",
    keyword: "thiệp cưới phong cách biển",
    secondaryKeywords: ["du lịch", "destination"],
    intro:
      "Xanh sóng, cát trắng và cảm giác của một chuyến du lịch chung. Hợp với destination wedding ở biển, đảo hoặc cặp đôi yêu xê dịch.",
    faq: [],
  },
  {
    slug: "hien-dai-nghe-thuat",
    name: "Hiện đại & Nghệ thuật",
    keyword: "thiệp cưới hiện đại",
    intro:
      "Bố cục gọn, chữ rõ, màu bạo. Hợp với cặp đôi trẻ muốn tấm thiệp trông như một trang tạp chí hay một ứng dụng đẹp trên điện thoại.",
    faq: [],
  },
  {
    slug: "de-thuong",
    name: "Dễ thương & Cá nhân hóa",
    keyword: "thiệp cưới dễ thương",
    title: "Thiệp cưới dễ thương, chibi đẹp · Hẹn Ước",
    h1: "Mẫu thiệp cưới dễ thương, chibi",
    secondaryKeywords: ["chibi"],
    intro:
      "Nhân vật chibi hoạt hình, màu tươi, nét tròn vui mắt. Tấm thiệp mang cá tính trẻ trung của cặp đôi và làm bạn bè bật cười khi mở ra.",
    faq: [],
  },
];

export const themes: Theme[] = [
  {
    slug: "song-hy-do-son",
    name: "Song Hỷ Đỏ Son",
    preview: "songhy",
    styles: ["truyen-thong-viet"],
    tier: "free",
    status: "concept",
    summary: "Đỏ son, viền vàng, trang trọng đúng phong tục.",
    description:
      "Song Hỷ Đỏ Son là mẫu thiệp truyền thống với nền đỏ son và viền vàng kim, bố cục đối xứng như thiệp giấy in. Lời mời trang trọng, có chỗ cho tên ông bà, bố mẹ hai bên và tách riêng lễ vu quy, lễ thành hôn. Lựa chọn an toàn khi khách mời có nhiều người lớn tuổi.",
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
    slug: "dong-duong",
    name: "Đông Dương",
    preview: "vintage",
    styles: ["truyen-thong-viet", "co-dien-hoai-niem"],
    tier: "free",
    status: "concept",
    summary: "Gạch bông, xanh ngọc và nâu trầm kiểu nhà Đông Dương.",
    description:
      "Đông Dương lấy cảm hứng từ những ngôi nhà thời Pháp thuộc ở Việt Nam: gạch bông hoa văn, cửa chớp xanh ngọc, nâu trầm và kem ấm. Bố cục giữ nét trang trọng của thiệp truyền thống nhưng thoáng hơn, nhiều khoảng thở quanh tên cô dâu chú rể. Hoạ tiết gạch bông được vẽ lại bằng nét đơn giản, lặp thành đường viền mảnh. Đây là lựa chọn cho cặp đôi thích sự giao thoa giữa Á và Âu, chụp ảnh cưới ở biệt thự cổ hoặc tổ chức tiệc trong không gian xưa.",
    features: ["Tên bố mẹ hai bên", "Lịch âm dương", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#F2E8D5", "#2F6B64", "#A67C52", "#4A3224"],
  },
  {
    slug: "ivory-editorial",
    name: "Ivory Editorial",
    preview: "hanquoc",
    styles: ["toi-gian"],
    tier: "free",
    status: "concept",
    summary: "Màu ngà sáng, chữ serif thanh mảnh, nhiều khoảng trắng.",
    description:
      "Ivory Editorial dùng nền màu ngà dịu, chữ serif thanh mảnh và khoảng trắng rộng như một trang sách ảnh. Tên cô dâu chú rể đặt giữa trang, giờ giấc và địa điểm xếp thành từng khối ngắn, dễ lướt trên điện thoại. Mẫu cố tình tiết chế màu sắc và chi tiết để ảnh cưới luôn là điểm nhìn đầu tiên. Vì trung tính nên nó đứng vững với hầu hết kiểu tiệc, từ nhà hàng nhỏ đến sân vườn, và không lỗi mốt sau vài năm nhìn lại.",
    features: ["Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#FAF6EE", "#E6DCCB", "#8C8576", "#2B2B2B"],
  },
  {
    slug: "black-white",
    name: "Black & White",
    preview: "bantin",
    styles: ["toi-gian", "hien-dai-nghe-thuat"],
    tier: "free",
    status: "concept",
    summary: "Đen trắng tương phản mạnh, gọn và dứt khoát.",
    description:
      "Black & White chỉ dùng hai màu đen và trắng, tạo độ tương phản mạnh và cảm giác dứt khoát. Chữ đậm, đường kẻ mảnh, ảnh cưới đen trắng đặt lớn là điểm nhấn duy nhất. Không hoa văn, không màu mè, để khách tập trung vào tên hai bạn, ngày cưới và địa điểm. Mẫu có hơi hướng điện ảnh, rất hợp với bộ ảnh chụp ngược sáng hay ảnh phóng sự, và cho cảm giác một buổi tiệc tối sang trọng, tiết chế.",
    features: ["Ảnh tràn màn hình", "Đếm ngược", "Bản đồ", "RSVP"],
    palette: ["#FFFFFF", "#C9C9C9", "#6B6B6B", "#111111"],
  },
  {
    slug: "royal-gold",
    name: "Royal Gold",
    preview: "songhy",
    styles: ["sang-trong"],
    tier: "premium",
    status: "concept",
    summary: "Nền đậm, viền ánh kim vàng, bố cục cân đối.",
    description:
      "Royal Gold phối nền xanh đen hoặc đỏ rượu với viền và hoạ tiết ánh kim vàng, bố cục đối xứng cân đối như thiệp in nổi. Chữ có chân, khoảng cách rộng, phong bì mở ra chậm rãi để tạo cảm giác trang trọng ngay từ giây đầu tiên. Hoạ tiết là đường diềm và khung cổ điển tự vẽ, không dùng huy hiệu hay quốc huy có thật. Mẫu dành cho những tiệc cưới lớn ở khách sạn, trung tâm tiệc cưới hoặc đám cưới theo nghi thức, nơi khách mặc vest và áo dài.",
    features: ["Mở phong bì", "Nhạc nền", "Lịch âm dương", "Bản đồ", "QR mừng cưới", "RSVP"],
    palette: ["#14213D", "#7A1F2B", "#C9A24D", "#F1DFA8"],
  },
  {
    slug: "champagne",
    name: "Champagne Elegance",
    preview: "pastel",
    styles: ["sang-trong"],
    tier: "premium",
    status: "concept",
    summary: "Vàng champagne ấm, mềm và thanh lịch.",
    description:
      "Champagne Elegance chọn tông vàng champagne ấm, kem và nâu nhạt, sang nhưng không nặng nề như các mẫu viền vàng đậm. Chữ thanh, ảnh cưới đặt trong khung bo mềm, ánh kim chạy nhẹ khi cuộn trang như ly rượu dưới đèn. Cảm giác chung là sự tinh tế của buổi tiệc tối hơn là phô trương. Nếu hai bạn thích vàng nhưng ngại vẻ hoàng gia quá cầu kỳ, đây là mức vừa phải: đủ ấm, đủ sáng và dễ phối với váy cưới màu ngà.",
    features: ["Nhạc nền", "Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#FBF4E6", "#E8D5A8", "#B8955A", "#6B5636"],
  },
  {
    slug: "blush-rose",
    name: "Blush Rose",
    preview: "pastel",
    styles: ["lang-man-hoa-la"],
    tier: "free",
    status: "concept",
    summary: "Hồng phấn và hoa hồng vẽ màu nước.",
    description:
      "Blush Rose mở ra bằng một phong bì hồng phấn, bên trong là hoa hồng vẽ màu nước viền quanh tên cô dâu chú rể viết nghiêng mềm mại. Các buổi lễ xếp thành thẻ bo tròn dễ đọc trên điện thoại. Phù hợp cặp đôi thích nhẹ nhàng, nữ tính nhưng không sến. Mẫu có đủ lịch âm dương, bản đồ chỉ đường, album ảnh và QR mừng cưới cho hai bên.",
    features: ["Mở phong bì", "Nhạc nền", "Lịch âm dương", "Album ảnh", "QR mừng cưới", "RSVP"],
    palette: ["#FBEEF0", "#E8B9C3", "#B07686", "#8A3D52"],
  },
  {
    slug: "botanical-garden",
    name: "Botanical Garden",
    preview: "sage",
    styles: ["lang-man-hoa-la"],
    tier: "free",
    status: "concept",
    summary: "Xanh lá dịu, tươi mát cho tiệc ngoài trời.",
    description:
      "Botanical Garden dùng tông xanh lá dịu và kem, gợi cảm giác tươi mát của một tiệc cưới ngoài trời hay trong vườn. Lá và cành vẽ tay viền quanh khung ảnh, chữ rõ, khoảng trắng rộng, các thông tin quan trọng như giờ, địa điểm luôn nổi bật. Hợp với đám cưới nhẹ nhàng, gần gũi. Có đếm ngược, lịch âm dương, bản đồ, album ảnh và RSVP.",
    features: ["Đếm ngược", "Lịch âm dương", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#E7EDE4", "#A9BBA8", "#728A74", "#3E5641"],
  },
  {
    slug: "seoul-romance",
    name: "Seoul Romance",
    preview: "hanquoc",
    styles: ["han-quoc-nhat-ban", "toi-gian"],
    tier: "premium",
    status: "concept",
    summary: "Trắng tinh, chữ mảnh kiểu thiệp Hàn.",
    description:
      "Seoul Romance theo phong cách thiệp cưới Hàn Quốc: nền trắng tinh, chữ mảnh giãn rộng, ảnh cưới lớn làm điểm nhấn. Chuyển động nhẹ khi cuộn, không màu mè. Phù hợp với bộ ảnh cưới chụp studio hoặc phong cách Hàn, khi ảnh là nhân vật chính và chữ chỉ đóng vai phụ. Có đếm ngược, album ảnh và RSVP.",
    features: ["Ảnh cưới lớn", "Hiệu ứng cuộn nhẹ", "Đếm ngược", "Album ảnh", "RSVP"],
    palette: ["#FFFFFF", "#E6E6E6", "#9B9B9B", "#4A4A4A"],
  },
  {
    slug: "sakura-zen",
    name: "Sakura Zen",
    preview: "pastel",
    styles: ["han-quoc-nhat-ban"],
    tier: "premium",
    status: "concept",
    summary: "Hoa anh đào rơi nhẹ trên nền kem tĩnh lặng.",
    description:
      "Sakura Zen lấy cảm hứng từ Nhật Bản: nền kem tĩnh lặng, cánh hoa anh đào rơi chậm khi cuộn trang, đường nét thanh và nhiều khoảng trống. Màu chủ đạo là hồng nhạt, xám than và trắng ngà, tạo cảm giác bình yên chứ không rực rỡ. Chữ nhỏ, giãn rộng, mỗi phần chỉ có vài dòng để người đọc dừng lại thở. Mẫu dành cho cặp đôi yêu văn hoá Nhật, cưới vào mùa xuân hoặc có bộ ảnh chụp dưới tán hoa.",
    features: ["Hiệu ứng cuộn nhẹ", "Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#FDF3F4", "#F2C6CF", "#8F8A86", "#3C3A3A"],
  },
  {
    slug: "rustic-garden",
    name: "Rustic Garden",
    preview: "sage",
    styles: ["rustic"],
    tier: "free",
    status: "concept",
    summary: "Màu đất, giấy thô và cỏ xanh cho tiệc sân vườn.",
    description:
      "Rustic Garden dùng nền giấy thô, màu đất nung, xanh rêu và chi tiết gỗ mộc, gợi một buổi tiệc ngoài sân vườn có đèn dây và bàn dài. Chữ viết tay xen với chữ đứng để lời mời thân mật, không quá nghi thức. Cảm giác chung là ấm áp và gần gũi, như thư mời của người nhà gửi cho người nhà. Đây là mẫu cho đám cưới ở quê, homestay, nông trại hay những buổi tiệc nhỏ chỉ có người thân và bạn bè thân thiết.",
    features: ["Chữ viết tay", "Lịch âm dương", "Bản đồ", "Album ảnh", "QR mừng cưới", "RSVP"],
    palette: ["#F1E9DA", "#B5763F", "#7C8B5A", "#4A3B2A"],
  },
  {
    slug: "bohemian",
    name: "Bohemian Love",
    preview: "vintage",
    styles: ["rustic"],
    tier: "free",
    status: "concept",
    summary: "Boho ấm áp, cỏ lau, hoạ tiết dệt và màu đất.",
    description:
      "Bohemian Love mang không khí boho: cỏ lau khô, hoạ tiết dệt, vòng hoa và các mảng màu đất như terracotta, be, cam cháy. Bố cục phóng khoáng, hơi bất đối xứng, chữ viết tay mềm tạo cảm giác tự do, không gò bó. Thiệp gợi hình ảnh lễ cưới ngoài trời lúc hoàng hôn, khách ngồi trên thảm và hoa khô treo trên khung gỗ. Mẫu dành cho cặp đôi muốn một đám cưới thoải mái, nơi khách ăn mặc nhẹ nhàng và không khí quan trọng hơn nghi thức.",
    features: ["Chữ viết tay", "Nhạc nền", "Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#F5ECE0", "#D9A27E", "#B5603C", "#6E4B35"],
  },
  {
    slug: "sai-gon-xua",
    name: "Sài Gòn Xưa",
    preview: "vintage",
    styles: ["co-dien-hoai-niem"],
    tier: "free",
    status: "concept",
    summary: "Giấy ố vàng, chữ nghiêng, áo dài và phố cũ.",
    description:
      "Sài Gòn Xưa mang tông giấy ố vàng và nâu ấm, chữ nghiêng như viết tay, gợi những tấm thiệp và tấm bưu ảnh của Sài Gòn thế kỷ trước. Hợp với bộ ảnh áo dài, xe Vespa, phố cổ hay quán cà phê xưa. Có lịch âm dương, album ảnh và QR mừng cưới, đủ để dùng thật cho một đám cưới mang hơi thở hoài niệm.",
    features: ["Chữ viết tay", "Lịch âm dương", "Album ảnh", "QR mừng cưới", "RSVP"],
    palette: ["#EFE3CF", "#B89474", "#8C6C52", "#5A3E2B"],
  },
  {
    slug: "vintage-newspaper",
    name: "Vintage Newspaper",
    preview: "bantin",
    styles: ["co-dien-hoai-niem"],
    tier: "free",
    status: "concept",
    summary: "Trang báo cũ, chữ in và tiêu đề số đặc biệt.",
    description:
      "Vintage Newspaper trình bày lời mời như trang nhất một tờ báo cũ: tiêu đề chữ in đậm, các cột chữ nhỏ, nền giấy báo ngả vàng. Tin cưới của hai bạn là bài chính, các buổi lễ xếp thành mục tin ngắn bên cạnh. Tên báo là tên giả, không giống tờ báo thật nào. Mẫu có chút dí dỏm, dành cho cặp đôi mê sách báo cũ, chữ in và những dòng tít hài hước. Dòng tít chính có thể được viết lại thành câu đùa riêng của hai bạn.",
    features: ["Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#EFE6D2", "#C8B994", "#6B5F48", "#2A2620"],
  },
  {
    slug: "ocean-promise",
    name: "Ocean Promise",
    preview: "sage",
    styles: ["bien"],
    tier: "free",
    status: "concept",
    summary: "Xanh biển, cát trắng và nhịp sóng nhẹ.",
    description:
      "Ocean Promise phối xanh biển, xanh ngọc và cát trắng, có đường sóng nhẹ chạy giữa các phần của thiệp. Ảnh cưới đặt lớn, chữ thoáng, giờ giấc và địa điểm nổi bật để khách dễ tìm đường đến tiệc ở biển hoặc đảo. Màu sắc tươi sáng nhưng không chói, gợi gió mặn, nắng cuối chiều và tiếng sóng. Mẫu dành cho đám cưới bên bờ biển, resort hoặc cặp đôi muốn cảm giác mát lành của mùa hè ngay từ lúc khách mở thiệp.",
    features: ["Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#EAF4F6", "#9ACBD3", "#2F7E95", "#16405A"],
  },
  {
    slug: "travel-postcard",
    name: "Travel Postcard",
    preview: "vintage",
    styles: ["bien"],
    tier: "free",
    status: "concept",
    summary: "Bưu thiếp, tem và dấu bưu điện tự vẽ.",
    description:
      "Travel Postcard biến lời mời thành một tấm bưu thiếp gửi từ chuyến đi chung của hai bạn, có tem và dấu bưu điện tự vẽ, đường bay nét đứt nối hai nơi. Ảnh du lịch đặt trong khung ảnh lấy liền, chữ viết tay ở mặt sau như dòng ghi nhanh trên đường đi. Tem và dấu đều là hình vẽ riêng, không dùng logo hãng bay hay bưu chính có thật. Mẫu dành cho cặp đôi yêu xê dịch, quen nhau trong một chuyến đi hoặc cưới ở nơi xa quê.",
    features: ["Chữ viết tay", "Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#F6EEDF", "#D9534F", "#3B6E8F", "#2E3A46"],
  },
  {
    slug: "modern-editorial",
    name: "Modern Editorial",
    preview: "bantin",
    styles: ["hien-dai-nghe-thuat", "toi-gian"],
    tier: "premium",
    status: "concept",
    summary: "Chữ in đậm kiểu tạp chí, tối giản đen – kem.",
    description:
      "Modern Editorial lấy cảm hứng từ trang tạp chí: chữ in hoa đậm, lưới bố cục rõ ràng, tông đen – kem tối giản. Ảnh cưới được đặt lớn, tràn màn hình, các buổi lễ trình bày như mục lục. Dành cho cặp đôi thích phong cách hiện đại, cá tính. Có đếm ngược, bản đồ, album ảnh và RSVP.",
    features: ["Ảnh tràn màn hình", "Đếm ngược", "Bản đồ", "Album ảnh", "RSVP"],
    palette: ["#F4EFE6", "#6D6A63", "#1D1D1F"],
  },
  {
    slug: "colorful-pop",
    name: "Colorful Pop",
    preview: "pastel",
    styles: ["hien-dai-nghe-thuat"],
    tier: "free",
    status: "concept",
    summary: "Màu tươi, hình khối lớn, vui mắt như tranh pop.",
    description:
      "Colorful Pop dùng các mảng màu tươi như hồng, vàng chanh, xanh cobalt, hình khối lớn và chữ đậm, lấy cảm hứng chung từ nghệ thuật pop và không sao chép tranh cụ thể nào. Mỗi phần của thiệp một màu nền, cuộn đến đâu đổi màu đến đó, tạo nhịp vui mắt. Chữ vẫn giữ độ tương phản cao để đọc rõ dù nền rực. Mẫu dành cho tiệc cưới trẻ trung, ít nghi thức, nhiều âm nhạc, nơi cặp đôi muốn thiệp cũng vui như bữa tiệc.",
    features: ["Nhạc nền", "Đếm ngược", "Bản đồ", "RSVP"],
    palette: ["#FF5C8A", "#FFD23F", "#2E5BFF", "#1B1B1B"],
  },
  {
    slug: "chibi-couple",
    name: "Chibi Couple",
    preview: "pastel",
    styles: ["de-thuong"],
    tier: "free",
    status: "concept",
    summary: "Cặp đôi hoạt hình chibi, màu tươi và nét tròn.",
    description:
      "Chibi Couple hướng tới một tấm thiệp vui mắt với cặp đôi hoạt hình chibi đầu to, nét tròn, đặt ngay đầu thiệp trên nền màu tươi. Lời mời có thể trình bày trong bong bóng thoại, các buổi lễ xếp như những màn chơi nhỏ. Hình vẽ theo phong cách riêng của mẫu, không bắt chước nhân vật có bản quyền. Đây là mẫu dành cho cặp đôi trẻ thích sự vui nhộn, muốn bạn bè bật cười ngay khi mở thiệp, và vẫn giữ chữ to rõ để người lớn tuổi đọc được.",
    features: ["Nhạc nền", "Đếm ngược", "Album ảnh", "RSVP"],
    palette: ["#FFE9EF", "#FFB6C8", "#7EC8E3", "#5A4A6A"],
  },
  {
    slug: "illustrated-love",
    name: "Illustrated Love",
    preview: "pastel",
    styles: ["de-thuong"],
    tier: "premium",
    status: "concept",
    summary: "Tranh minh hoạ nét mảnh, màu nhẹ như sổ tay.",
    description:
      "Illustrated Love hướng tới thiệp có tranh minh hoạ nét mảnh, màu nhẹ như trang sách thiếu nhi dành cho người lớn. Bảng màu đào, xanh bạc hà và xám xanh tạo cảm giác ấm và yên. Các mảng tranh xen giữa những dòng chữ ngắn, nhường chỗ cho tên hai bạn và ngày cưới. Mẫu dành cho cặp đôi muốn tấm thiệp mang chất thủ công, gần với một cuốn sổ tay hơn là một khuôn mẫu in sẵn. Hình minh hoạ sẽ là tranh tự vẽ, không mô phỏng hoạ sĩ có thật.",
    features: ["Nhạc nền", "Lịch âm dương", "Album ảnh", "RSVP"],
    palette: ["#FFF6EC", "#F4B6A6", "#8FB8A8", "#4A5A6A"],
  },
];

export function getTheme(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug);
}

export function getStyle(slug: string): ThemeStyle | undefined {
  return themeStyles.find((s) => s.slug === slug);
}

export function themesByStyle(styleSlug: string): Theme[] {
  return themes.filter((t) => t.styles.some((s) => s === styleSlug));
}

/** Mẫu tương tự: cùng phong cách chính trước, sau đó các mẫu còn lại. */
export function similarThemes(theme: Theme, limit = 3): Theme[] {
  const others = themes.filter((t) => t.slug !== theme.slug);
  const score = (t: Theme) => t.styles.filter((s) => theme.styles.includes(s)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Số mẫu ĐÃ PUBLISH tối thiểu để trang phong cách có thể index (docs/12 §6). */
export const MIN_THEMES_FOR_STYLE_INDEX = 2;

/** Số câu FAQ viết tay tối thiểu để trang phong cách có thể index. */
export const MIN_STYLE_FAQ = 3;

export function publishedCount(styleSlug: string, pool: Theme[] = themes): number {
  return pool.filter((t) => t.styles.some((s) => s === styleSlug) && t.status === "published")
    .length;
}

/** Trang phong cách chỉ index khi đủ mẫu published + intro + FAQ (tránh trang mỏng). */
export function isStyleIndexable(style: ThemeStyle, pool: Theme[] = themes): boolean {
  return (
    publishedCount(style.slug, pool) >= MIN_THEMES_FOR_STYLE_INDEX &&
    style.intro.trim().length > 0 &&
    style.faq.length >= MIN_STYLE_FAQ
  );
}
