import { articles } from "@/data/articles";

export const ARTICLES_PER_PAGE = 6;
export type ArticleTopicSlug = "phong-tuc" | "thiep-loi-moi" | "khach-moi" | "chi-phi";

export interface ArticleTopic {
  slug: ArticleTopicSlug;
  name: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  breadcrumb: string;
  intro: string;
}

export const articleTopics: ArticleTopic[] = [
  {
    slug: "phong-tuc",
    name: "Phong tục cưới hỏi",
    breadcrumb: "Phong tục cưới hỏi",
    keyword: "phong tục cưới hỏi",
    title: "Phong tục cưới hỏi: dạm ngõ, ăn hỏi, vu quy · Hẹn Ước",
    h1: "Phong tục cưới hỏi của người Việt",
    description:
      "Phong tục cưới hỏi cho hai bạn: lễ dạm ngõ, lễ ăn hỏi cần chuẩn bị gì, vu quy khác thành hôn ra sao và lịch trình ngày cưới theo từng buổi.",
    intro:
      "Đám cưới Việt không chỉ có một ngày tiệc. Trước đó là lễ dạm ngõ để hai nhà chính thức gặp nhau, rồi lễ ăn hỏi với mâm quả, số tráp và người bưng lễ. Đến ngày cưới, nhà gái làm lễ vu quy, nhà trai làm lễ thành hôn, mỗi nơi lại có cách gọi và thứ tự nghi thức riêng. Các bài trong chủ đề này giải thích từng lễ cần chuẩn bị gì, ai lo phần nào và nên hỏi ý ông bà, bố mẹ ở đâu. Phong tục mỗi vùng mỗi khác, nên hãy xem đây là khung để hai bên gia đình cùng bàn, rồi điều chỉnh theo nếp nhà mình.",
  },
  {
    slug: "thiep-loi-moi",
    name: "Thiệp cưới & lời mời",
    breadcrumb: "Thiệp cưới & lời mời",
    keyword: "thiệp cưới và lời mời",
    title: "Thiệp cưới và lời mời: cách ghi, cách gửi · Hẹn Ước",
    h1: "Thiệp cưới và lời mời: ghi đúng, gửi khéo",
    description:
      "Thiệp cưới và lời mời: cách ghi thiệp đúng danh xưng, mẫu lời mời hay, gửi thiệp qua Zalo, gửi trước bao lâu và có nên dùng thiệp cưới online.",
    intro:
      "Tấm thiệp là lời mời đầu tiên khách nhận được, nên ghi đúng danh xưng và tên người nhận quan trọng không kém chọn mẫu đẹp. Chủ đề này gom các bài về cách ghi thiệp theo vai vế, câu chữ mời cho ông bà, họ hàng, đồng nghiệp và bạn bè, thời điểm gửi thiệp sao cho khách kịp sắp xếp, và cách gửi thiệp qua Zalo mà vẫn lịch sự. Nếu hai bạn đang phân vân giữa thiệp giấy và thiệp cưới online, cũng có bài so sánh để chọn cách phù hợp với từng nhóm khách. Đọc xong, hai bạn có thể chốt nội dung thiệp và bắt đầu mời.",
  },
  {
    slug: "khach-moi",
    name: "Khách mời",
    breadcrumb: "Khách mời",
    keyword: "khách mời đám cưới",
    title: "Khách mời đám cưới: tính số lượng, xác nhận · Hẹn Ước",
    h1: "Khách mời đám cưới: mời, chốt số, cảm ơn",
    description:
      "Khách mời đám cưới: cách tính số lượng khách và số bàn, nhắn tin xác nhận tham dự lịch sự, gửi lời cảm ơn sau tiệc, kèm mẫu câu chỉnh sửa được.",
    intro:
      "Danh sách khách mời quyết định gần như mọi thứ còn lại: số bàn, ngân sách tiệc, số thiệp cần in hay gửi. Chủ đề này giúp hai bạn ước lượng số khách thực tế sẽ đến, chia nhóm khách theo nhà trai, nhà gái và bạn bè, rồi nhắn tin xác nhận tham dự sao cho khách trả lời dễ mà không thấy bị hối. Sau ngày cưới, một lời cảm ơn đúng lúc giúp giữ tình cảm với những người đã đến chung vui hoặc gửi quà từ xa. Mỗi bài đều có mẫu câu để hai bạn chỉnh tên, chỉnh giọng rồi gửi ngay.",
  },
  {
    slug: "chi-phi",
    name: "Chi phí cưới",
    breadcrumb: "Chi phí cưới",
    keyword: "chi phí đám cưới",
    title: "Chi phí đám cưới: dự trù và tiền mừng · Hẹn Ước",
    h1: "Chi phí đám cưới: dự trù và tiền mừng cưới",
    description:
      "Chi phí đám cưới cho hai bạn: bảng dự trù tự điền theo hạng mục, cách cân ngân sách và khoảng tham khảo khi đi đám cưới, không đưa số liệu chung chung.",
    intro:
      "Chi phí đám cưới dễ vượt dự tính khi mỗi khoản được quyết riêng lẻ. Chủ đề này giúp hai bạn nhìn toàn cảnh trước: liệt kê hạng mục từ lễ hỏi, tiệc cưới, trang phục, chụp ảnh đến những khoản nhỏ hay bị quên, rồi tự điền con số theo báo giá thực tế ở nơi mình tổ chức. Bên cạnh đó là góc nhìn của người đi dự: nên mừng cưới bao nhiêu cho hợp tình, hợp hoàn cảnh. Bài viết không đưa ra con số chung cho mọi nhà, vì giá mỗi vùng và mỗi thời điểm một khác; thay vào đó là cách tính để hai bạn tự cân đối.",
  },
];

export function topicPath(slug: ArticleTopicSlug) {
  return `/cam-nang/chu-de/${slug}`;
}

export function articlesPagePath(n: number) {
  return n === 1 ? "/cam-nang" : `/cam-nang/trang/${n}`;
}

export function sortedArticles() {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function pageCount() {
  return Math.ceil(articles.length / ARTICLES_PER_PAGE);
}

export function articlesOnPage(n: number) {
  return sortedArticles().slice((n - 1) * ARTICLES_PER_PAGE, n * ARTICLES_PER_PAGE);
}

export function articlesInTopic(slug: ArticleTopicSlug) {
  return sortedArticles().filter((article) => article.category === slug);
}

export function getTopic(slug: string) {
  return articleTopics.find((topic) => topic.slug === slug);
}

/** Mọi path danh sách bài có thật (trừ trang 1 = /cam-nang). proxy.ts dùng để trả 404 thật cho path lạ. */
export function articleListPaths(): Set<string> {
  return new Set([
    ...Array.from({ length: pageCount() - 1 }, (_, i) => articlesPagePath(i + 2)),
    ...articleTopics.map((topic) => topicPath(topic.slug)),
  ]);
}
