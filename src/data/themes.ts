import type { MiniStyle } from "@/components/home/mini-invitation";
import type { StyleSlug } from "@/themes/types";

/**
 * Danh mục mẫu thiệp + phong cách — MỘT nguồn dữ liệu cho trang chủ, gallery, trang phong cách,
 * trang chi tiết và sổ SEO. Sau này theme thật (M1) chỉ cần thay `preview` và `status`.
 *
 * status:
 *  - "live"    : có trong `themeRegistry` (code thật, đã qua QA — docs/07-THEMES.md §8) → index
 *  - "preview" : có preview riêng, chưa có code → hiện ở trang công khai, noindex, không vào sitemap
 *  - "planned" : mới trên lộ trình → KHÔNG hiện ở trang công khai nào, chỉ ở /admin/mau-thiep
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

export type ThemeStatus = "live" | "preview" | "planned";

export interface Theme {
  slug: string;
  name: string;
  preview: MiniStyle; // với mẫu "planned" chưa dùng (chưa có preview riêng)
  styles: StyleSlug[]; // slug phong cách, cái đầu tiên là phong cách chính
  tier: "free" | "premium"; // đề xuất, Tony có thể đổi
  status: ThemeStatus;
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
    faq: [
      {
        q: "Thiệp cưới truyền thống hợp lễ gia tiên hay tiệc nhà hàng?",
        a: "Sắc đỏ son, chữ Hỷ và bố cục trang trọng hợp lễ gia tiên, tiệc tại nhà lẫn nhà hàng có nhiều khách lớn tuổi. Song Hỷ Đỏ Son thiên về nghi lễ; Đông Dương gợi không gian nhà cổ với xanh ngọc và kem ấm.",
      },
      {
        q: "Không thích nền đỏ thì chọn mẫu truyền thống màu gì?",
        a: "Hai bạn có thể tham khảo bảng màu xanh ngọc, kem và nâu của Đông Dương để giữ nét Việt mà dịu hơn đỏ son. Đây là bảng màu định hướng của mẫu concept, chưa phải các màu có thể tự đổi trong trình tạo thiệp.",
      },
      {
        q: "Có thể lấy mẫu Song Hỷ Đỏ Son để in thiệp giấy không?",
        a: "Song Hỷ Đỏ Son hiện là concept thiệp online, chưa có file xuất dành cho nhà in. Nếu muốn làm thiệp giấy đồng bộ, hai bạn cần chuẩn bị thiết kế in riêng với kích thước, lề xén và màu in do nhà in xác nhận.",
      },
    ],
  },
  {
    slug: "toi-gian",
    name: "Tối giản & Thanh lịch",
    keyword: "thiệp cưới tối giản",
    intro:
      "Ít chi tiết, nhiều khoảng trắng, để tên hai bạn và ngày cưới là nhân vật chính. Sang mà không cầu kỳ.",
    faq: [
      {
        q: "Thiệp cưới tối giản có hợp tiệc nhỏ tại nhà không?",
        a: "Có, khoảng trắng và ít hoạ tiết giúp lời mời giữ vẻ chỉn chu trong một buổi tiệc thân mật. Ivory Editorial với nền ngà tạo cảm giác ấm; Black & White hợp không khí gọn gàng, trang nhã hơn.",
      },
      {
        q: "Nên chọn màu ngà hay đen trắng cho thiệp tối giản?",
        a: "Màu ngà dễ đi cùng ảnh cưới ánh sáng ấm và hoa màu kem. Đen trắng hợp ảnh có tương phản rõ hoặc ảnh phóng sự; nên tránh để cả chữ lẫn nền ảnh quá tối khiến ngày giờ khó đọc.",
      },
      {
        q: "Ít hoạ tiết có khiến thiệp cưới trông sơ sài không?",
        a: "Điểm nhấn của phong cách này nằm ở tỷ lệ chữ, khoảng cách và cách đặt ảnh, thay vì số lượng chi tiết trang trí. Khi xem mẫu minh hoạ, hãy kiểm tra tên hai bạn, ngày cưới và địa điểm có dễ nhận ra trước tiên hay không.",
      },
    ],
  },
  {
    slug: "sang-trong",
    name: "Sang trọng & Hoàng gia",
    keyword: "thiệp cưới sang trọng",
    intro: "Màu đậm, viền ánh kim, bố cục cân đối — cho những tiệc cưới ở nhà hàng, khách sạn lớn.",
    faq: [
      {
        q: "Thiệp cưới sang trọng phù hợp với tiệc ban ngày hay tiệc tối?",
        a: "Royal Gold gợi tiệc tối trang trọng nhờ nền đậm và sắc vàng. Champagne Elegance sáng và mềm hơn, phù hợp cả tiệc trưa trong sảnh có ánh sáng tự nhiên; nên chọn theo màu trang trí thực tế của buổi tiệc.",
      },
      {
        q: "Màu vàng trên thiệp online có giống ép kim trên giấy không?",
        a: "Vàng trên màn hình chỉ là cách thể hiện màu và ánh sáng, không có bề mặt phản chiếu như ép kim thật. Royal Gold và Champagne Elegance đang là bản concept, nên hình minh hoạ cũng chưa thể dùng để đánh giá chất liệu của thiệp giấy.",
      },
      {
        q: "Royal Gold và Champagne Elegance đã có nhạc nền chưa?",
        a: "Nhạc nền nằm trong định hướng của hai mẫu, nhưng cả hai chưa được phát hành để tạo thiệp thật. Vì vậy, chưa thể chọn bài hay xác nhận trải nghiệm nghe nhạc riêng cho các mẫu này từ hình minh hoạ.",
      },
    ],
  },
  {
    slug: "lang-man-hoa-la",
    name: "Lãng mạn & Hoa lá",
    keyword: "thiệp cưới hoa lá",
    intro:
      "Hoa vẽ màu nước, nền phấn nhẹ, cảm giác lãng mạn như một buổi sáng tiệc cưới ngoài trời.",
    faq: [
      {
        q: "Thiệp cưới hoa lá có chỉ hợp đám cưới sân vườn không?",
        a: "Hoa lá cũng hợp sảnh cưới trong nhà có hoa tươi hoặc trang trí nhẹ nhàng. Blush Rose gợi không khí mềm mại với hoa hồng, còn Botanical Garden thiên về lá xanh và cảm giác thoáng mát.",
      },
      {
        q: "Chọn hồng phấn hay xanh lá để hợp hoa cưới?",
        a: "Hồng phấn dễ đi cùng hoa hồng trắng, hồng nhạt và ảnh có ánh sáng dịu. Xanh lá hợp bó hoa nhiều cành lá hoặc không gian phủ cây; nên chọn một tông chính để hoa trong ảnh và hoạ tiết thiệp không tranh nhau.",
      },
      {
        q: "Ảnh cưới nhiều hoa có bị rối khi đặt vào mẫu hoa lá không?",
        a: "Có thể bị rối nếu ảnh và viền trang trí đều dày chi tiết. Hai bạn nên ưu tiên ảnh có nền thoáng, ít màu nổi, rồi đối chiếu với phần minh hoạ của mẫu; các concept hiện tại chưa cho xem thử ảnh riêng trong theme hoàn chỉnh.",
      },
    ],
  },
  {
    slug: "han-quoc-nhat-ban",
    name: "Hàn Quốc & Nhật Bản",
    keyword: "thiệp cưới Hàn Quốc",
    intro:
      "Nền sáng, chữ mảnh, ảnh cưới lớn và chuyển động khẽ như thiệp cưới Hàn, thêm chút tĩnh lặng và hoa anh đào của Nhật. Nhẹ nhàng và rất hợp bộ ảnh studio.",
    faq: [
      {
        q: "Thiệp cưới kiểu Hàn Quốc khác cảm hứng Nhật Bản ở điểm nào?",
        a: "Trong danh mục này, Seoul Romance định hướng nền trắng, ảnh studio lớn và chữ mảnh. Sakura Zen dùng kem, hồng anh đào và nhiều khoảng trống, phù hợp cảm giác tĩnh lặng hơn là nhấn mạnh ảnh chân dung.",
      },
      {
        q: "Ảnh cưới áo dài có hợp thiệp phong cách Hàn không?",
        a: "Ảnh áo dài vẫn hợp nếu ánh sáng mềm, hậu cảnh gọn và màu ảnh nhẹ. Không cần đổi sang trang phục kiểu Hàn; sự hài hoà của ảnh với nền trắng và cách trình bày quan trọng hơn kiểu trang phục.",
      },
      {
        q: "Chọn Sakura Zen có bắt buộc viết lời mời bằng tiếng Nhật không?",
        a: "Không, cảm hứng Nhật ở đây là định hướng thị giác của mẫu, không phải yêu cầu về ngôn ngữ. Hai bạn có thể chuẩn bị lời mời tiếng Việt; concept này chưa đồng nghĩa với tính năng dịch tự động hoặc bộ lời mời song ngữ.",
      },
    ],
  },
  {
    slug: "rustic",
    name: "Thiên nhiên & Mộc mạc",
    keyword: "thiệp cưới rustic",
    secondaryKeywords: ["mộc mạc", "boho"],
    intro:
      "Màu đất, lá xanh, chất liệu gỗ và giấy thô, đúng chất rustic mộc mạc. Có cả nét boho phóng khoáng cho đám cưới sân vườn, đồng quê hay những buổi tiệc ấm cúng giữa người thân.",
    faq: [
      {
        q: "Thiệp rustic hợp đám cưới ở quê hay ở homestay?",
        a: "Cả hai đều hợp nếu buổi tiệc thiên về sự gần gũi, bàn gỗ, cây xanh hoặc hoa khô. Rustic Garden nghiêng về sân vườn mộc mạc, còn Bohemian Love gợi tiệc ngoài trời phóng khoáng với cỏ lau và hoạ tiết dệt.",
      },
      {
        q: "Rustic và boho nên phối những màu nào?",
        a: "Rustic thường dễ phối với kem giấy, nâu đất và xanh rêu; boho có thể thêm đất nung, be và cam cháy. Các bảng màu trong danh mục là gợi ý thiết kế, hai bạn nên đối chiếu với hoa khô, khăn bàn và trang phục của mình.",
      },
      {
        q: "Tiệc ở nhà hàng hiện đại có dùng thiệp rustic được không?",
        a: "Vẫn có thể chọn nếu phần trang trí tiệc dùng chất liệu tự nhiên hoặc màu ấm. Nếu sảnh có nhiều kính và ánh sáng lạnh, hãy ưu tiên sắc kem, lá xanh nhẹ để lời mời giữ được sự liên kết với không gian.",
      },
    ],
  },
  {
    slug: "co-dien-hoai-niem",
    name: "Cổ điển & Hoài niệm",
    keyword: "thiệp cưới vintage",
    intro:
      "Tông giấy cũ, nét chữ nghiêng hoài cổ, gợi lại phố xưa và những tấm ảnh film. Dành cho cặp đôi mê những điều đã cũ mà vẫn đẹp.",
    faq: [
      {
        q: "Thiệp vintage hợp với bộ ảnh cưới nào?",
        a: "Ảnh áo dài ở phố cũ, biệt thự cổ hoặc ảnh có màu film thường đi cùng phong cách này. Sài Gòn Xưa gợi bưu ảnh hoài niệm; Vintage Newspaper hợp bộ ảnh có câu chuyện và nét dí dỏm như một bản tin cưới.",
      },
      {
        q: "Nền giấy cũ có làm lời mời khó đọc với người lớn tuổi không?",
        a: "Nền ngả vàng vẫn có thể dễ đọc nếu chữ đủ đậm, đủ lớn và không đặt trên hoạ tiết dày. Khi chọn phong cách hoài niệm, nên ưu tiên độ rõ của giờ lễ, địa chỉ hơn hiệu ứng giấy cũ hay chữ viết tay cầu kỳ.",
      },
      {
        q: "Vintage Newspaper có phải file báo cưới để mang đi in không?",
        a: "Mẫu này mới là concept thiệp online lấy cảm hứng từ trang báo, chưa có bản dàn trang in báo hay file PDF cho nhà in. Hình xem trước giúp hình dung phong cách, không bảo đảm kích thước cột chữ hoặc độ phân giải khi in.",
      },
    ],
  },
  {
    slug: "bien",
    name: "Biển & Du lịch",
    keyword: "thiệp cưới phong cách biển",
    secondaryKeywords: ["du lịch", "destination"],
    intro:
      "Xanh sóng, cát trắng và cảm giác của một chuyến du lịch chung. Hợp với destination wedding ở biển, đảo hoặc cặp đôi yêu xê dịch.",
    faq: [
      {
        q: "Thiệp phong cách biển chỉ dành cho tiệc ở resort ven biển sao?",
        a: "Không nhất thiết: xanh biển và cát trắng cũng hợp cặp đôi yêu biển dù tổ chức tiệc trong thành phố. Nếu tiệc diễn ra xa nơi khách sống, nên để thông tin địa điểm thật rõ thay vì chỉ nhấn mạnh cảnh biển.",
      },
      {
        q: "Nên chọn Ocean Promise hay Travel Postcard cho destination wedding?",
        a: "Ocean Promise gợi bờ biển bằng xanh ngọc, xanh sóng và cát trắng. Travel Postcard thiên về câu chuyện chuyến đi với bưu thiếp, tem vẽ và sắc kem; hai mẫu hiện là concept để tham khảo hướng thiết kế.",
      },
      {
        q: "Thiệp chủ đề du lịch có kèm đặt phòng hoặc đặt xe cho khách không?",
        a: "Chủ đề du lịch chỉ mô tả phong cách hình ảnh, không bao gồm dịch vụ đặt phòng, đặt vé hay xe đưa đón. Hai bạn cần thống nhất các việc này riêng với khách và đơn vị tổ chức tiệc.",
      },
    ],
  },
  {
    slug: "hien-dai-nghe-thuat",
    name: "Hiện đại & Nghệ thuật",
    keyword: "thiệp cưới hiện đại",
    intro:
      "Bố cục gọn, chữ rõ, màu bạo. Hợp với cặp đôi trẻ muốn tấm thiệp trông như một trang tạp chí hay một ứng dụng đẹp trên điện thoại.",
    faq: [
      {
        q: "Thiệp cưới hiện đại hợp tiệc trang trọng hay tiệc cùng bạn bè?",
        a: "Modern Editorial với chữ đậm, đen và kem hợp tiệc có phong cách thời trang, chỉn chu. Colorful Pop hướng đến không khí vui, nhiều màu và ít nghi thức hơn; hãy chọn theo cách hai bạn muốn khách cảm nhận buổi tiệc.",
      },
      {
        q: "Dùng nhiều màu trên thiệp có làm ảnh cưới bị chìm không?",
        a: "Các mảng màu mạnh dễ cạnh tranh với ảnh có nhiều chi tiết hoặc trang phục rực rỡ. Với hướng Colorful Pop, nên chọn ảnh có nền gọn; nếu muốn ảnh là điểm nhấn chính, bảng màu tiết chế của Modern Editorial dễ phối hơn.",
      },
      {
        q: "Mẫu Colorful Pop có tự phát nhạc khi khách mở thiệp không?",
        a: "Hiện Colorful Pop mới là concept, dù danh mục có nêu định hướng nhạc nền. Không nên hiểu đó là cam kết tự phát nhạc: trình duyệt có thể yêu cầu khách thao tác trước khi cho phát âm thanh.",
      },
    ],
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
    faq: [
      {
        q: "Thiệp cưới chibi có hợp gửi cho họ hàng lớn tuổi không?",
        a: "Có thể hợp nếu hình vẽ vui vừa phải, lời mời lịch sự và thông tin buổi lễ rõ ràng. Nếu gia đình thích sự trang trọng, nên cân nhắc mức độ hoạt hình trước khi chọn Chibi Couple thay vì chỉ dựa vào sở thích của nhóm bạn.",
      },
      {
        q: "Hẹn Ước có vẽ chibi giống mặt cô dâu chú rể từ ảnh không?",
        a: "Hiện chưa có tính năng tạo chibi từ ảnh hay dịch vụ vẽ chân dung riêng được xác nhận cho mẫu này. Chibi Couple và Illustrated Love đều đang là concept; tên phong cách cá nhân hóa không có nghĩa là đã hỗ trợ đặt vẽ theo yêu cầu.",
      },
      {
        q: "Không thích hồng tươi thì còn hướng thiệp dễ thương nào?",
        a: "Illustrated Love gợi bảng màu đào, xanh bạc hà và xám xanh nhẹ như trang sổ tay, dịu hơn hướng màu tươi của Chibi Couple. Đây là hai hướng minh hoạ khác nhau để cân nhắc, chưa phải bộ tuỳ chọn đổi màu và nhân vật trong editor.",
      },
    ],
  },
];

export const themes: Theme[] = [
  {
    slug: "song-hy-do-son",
    name: "Song Hỷ Đỏ Son",
    preview: "songhy",
    styles: ["truyen-thong-viet"],
    tier: "free",
    status: "preview",
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
    status: "planned",
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
    status: "planned",
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
    status: "planned",
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
    status: "planned",
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
    status: "planned",
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
    status: "live",
    summary: "Đỏ đô, giấy ngà và hoa hồng vẽ tay cổ điển.",
    description:
      "Blush Rose mở ra bằng một phong thư giấy ngà gắn con dấu sáp, chạm vào là nắp thư lật mở và nhạc nền bắt đầu. Bên trong là tranh hoa hồng vẽ tay thế kỷ 19, tên cô dâu chú rể viết tay trên nền đỏ đô trầm ấm, điểm ánh vàng cũ. Thẻ lễ cưới ghi kèm ngày âm lịch, lịch tháng khoanh ngày cưới bằng nét trái tim, album ảnh lướt ngang, gợi ý màu trang phục cho khách và bao lì xì mở ra QR mừng cưới hai bên. Ngoài bảng màu đỏ đô còn có biến thể hồng nhạt cho cặp đôi thích dịu hơn.",
    features: [
      "Mở phong bì",
      "Nhạc nền",
      "Lịch âm dương",
      "Album ảnh",
      "Lịch trình",
      "Bản đồ",
      "Dress code",
      "QR mừng cưới",
      "RSVP",
    ],
    palette: ["#F3EDE3", "#E8B9C3", "#C4A257", "#4A161A"],
  },
  {
    slug: "botanical-garden",
    name: "Botanical Garden",
    preview: "sage",
    styles: ["lang-man-hoa-la"],
    tier: "free",
    status: "preview",
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
    status: "preview",
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
    status: "planned",
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
    status: "planned",
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
    status: "planned",
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
    status: "preview",
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
    status: "planned",
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
    status: "planned",
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
    status: "planned",
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
    status: "preview",
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
    status: "planned",
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
    status: "planned",
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
    status: "planned",
    summary: "Tranh minh hoạ nét mảnh, màu nhẹ như sổ tay.",
    description:
      "Illustrated Love hướng tới thiệp có tranh minh hoạ nét mảnh, màu nhẹ như trang sách thiếu nhi dành cho người lớn. Bảng màu đào, xanh bạc hà và xám xanh tạo cảm giác ấm và yên. Các mảng tranh xen giữa những dòng chữ ngắn, nhường chỗ cho tên hai bạn và ngày cưới. Mẫu dành cho cặp đôi muốn tấm thiệp mang chất thủ công, gần với một cuốn sổ tay hơn là một khuôn mẫu in sẵn. Hình minh hoạ sẽ là tranh tự vẽ, không mô phỏng hoạ sĩ có thật.",
    features: ["Nhạc nền", "Lịch âm dương", "Album ảnh", "RSVP"],
    palette: ["#FFF6EC", "#F4B6A6", "#8FB8A8", "#4A5A6A"],
  },
];

/** Mẫu hiện ở trang công khai (live + preview), giữ thứ tự catalog. */
export const visibleThemes: Theme[] = themes.filter(isVisibleTheme);

export function isVisibleTheme(t: Theme): boolean {
  return t.status !== "planned";
}

/** Trả cả mẫu planned (admin cần). Trang công khai dùng `getVisibleTheme`. */
export function getTheme(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug);
}

export function getVisibleTheme(slug: string): Theme | undefined {
  return visibleThemes.find((t) => t.slug === slug);
}

export function getStyle(slug: string): ThemeStyle | undefined {
  return themeStyles.find((s) => s.slug === slug);
}

export function themesByStyle(styleSlug: string): Theme[] {
  return visibleThemes.filter((t) => t.styles.some((s) => s === styleSlug));
}

export function hasVisibleThemes(styleSlug: string): boolean {
  return themesByStyle(styleSlug).length > 0;
}

/** Mẫu tương tự: cùng phong cách chính trước, sau đó các mẫu còn lại (chỉ mẫu visible). */
export function similarThemes(theme: Theme, limit = 3): Theme[] {
  const others = visibleThemes.filter((t) => t.slug !== theme.slug);
  const score = (t: Theme) => t.styles.filter((s) => theme.styles.includes(s)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Số mẫu LIVE tối thiểu để trang phong cách có thể index (docs/12 §6). */
export const MIN_THEMES_FOR_STYLE_INDEX = 2;

/** Số câu FAQ viết tay tối thiểu để trang phong cách có thể index. */
export const MIN_STYLE_FAQ = 3;

export function liveCount(styleSlug: string, pool: Theme[] = themes): number {
  return pool.filter((t) => t.styles.some((s) => s === styleSlug) && t.status === "live").length;
}

/** Trang phong cách chỉ index khi đủ mẫu live + intro + FAQ (tránh trang mỏng). */
export function isStyleIndexable(style: ThemeStyle, pool: Theme[] = themes): boolean {
  return (
    liveCount(style.slug, pool) >= MIN_THEMES_FOR_STYLE_INDEX &&
    style.intro.trim().length > 0 &&
    style.faq.length >= MIN_STYLE_FAQ
  );
}
