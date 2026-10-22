/**
 * Wedding preparation checklist template (T-050). Shared source for the public tool
 * `/cong-cu/checklist-dam-cuoi` and the dashboard checklist tab.
 *
 * - `id` is a stable key: localStorage / DB store ticks by id → never rename a released id
 *   (`checklist.test.ts` locks the list).
 * - `daysBefore`: suggested days before the wedding (0 = wedding day). A hint, not a rule.
 * - Customs differ by region and family → neutral wording, never "bắt buộc".
 * - No costs, ratios or statistics (AGENTS.md §4).
 */

export type ChecklistCategory =
  | "ke-hoach"
  | "phong-tuc"
  | "giay-to"
  | "trang-phuc"
  | "dia-diem-dich-vu"
  | "khach-moi"
  | "ca-nhan";

export const checklistCategoryLabels: Record<ChecklistCategory, string> = {
  "ke-hoach": "Kế hoạch & ngân sách",
  "phong-tuc": "Phong tục, nghi lễ",
  "giay-to": "Giấy tờ",
  "trang-phuc": "Trang phục & làm đẹp",
  "dia-diem-dich-vu": "Địa điểm & dịch vụ",
  "khach-moi": "Khách mời & thiệp",
  "ca-nhan": "Cá nhân & sức khoẻ",
};

export interface ChecklistPhase {
  id: string;
  label: string; // shown as the group heading
  daysBefore: number; // start of the phase, counted back from the wedding day
}

const farthestPhase: ChecklistPhase = { id: "12-thang", label: "12 tháng trước", daysBefore: 365 };

/** Phases from far to near. */
export const checklistPhases: readonly ChecklistPhase[] = [
  farthestPhase,
  { id: "9-thang", label: "9 tháng trước", daysBefore: 270 },
  { id: "6-thang", label: "6 tháng trước", daysBefore: 180 },
  { id: "4-thang", label: "4 tháng trước", daysBefore: 120 },
  { id: "3-thang", label: "3 tháng trước", daysBefore: 90 },
  { id: "2-thang", label: "2 tháng trước", daysBefore: 60 },
  { id: "1-thang", label: "1 tháng trước", daysBefore: 30 },
  { id: "2-tuan", label: "2 tuần trước", daysBefore: 14 },
  { id: "1-tuan", label: "1 tuần trước", daysBefore: 7 },
  { id: "ngay-cuoi", label: "Ngày cưới", daysBefore: 0 },
];

export interface ChecklistItem {
  id: string; // stable, kebab-case
  title: string;
  note?: string; // one short hint, no invented numbers
  category: ChecklistCategory;
  daysBefore: number;
}

export const checklistItems: readonly ChecklistItem[] = [
  // 12 tháng trước
  {
    id: "thong-nhat-hai-gia-dinh",
    title: "Thưa chuyện với hai bên gia đình",
    note: "Thống nhất thời gian tổ chức, quy mô và những lễ sẽ làm.",
    category: "phong-tuc",
    daysBefore: 365,
  },
  {
    id: "du-tru-ngan-sach",
    title: "Dự trù ngân sách cưới",
    note: "Thống nhất ai lo khoản nào giữa hai bên và cô dâu chú rể.",
    category: "ke-hoach",
    daysBefore: 365,
  },
  {
    id: "chon-mua-cuoi",
    title: "Chọn khoảng thời gian tổ chức",
    note: "Tính đến mùa mưa, lịch nghỉ lễ Tết và lịch làm việc của người thân ở xa.",
    category: "ke-hoach",
    daysBefore: 365,
  },
  {
    id: "phac-thao-danh-sach-khach",
    title: "Phác thảo danh sách khách mời",
    note: "Ước lượng số khách từng bên để chọn địa điểm cho vừa.",
    category: "khach-moi",
    daysBefore: 330,
  },
  {
    id: "le-dam-ngo",
    title: "Lễ dạm ngõ (chạm ngõ)",
    note: "Nhà trai sang thưa chuyện chính thức với nhà gái. Thời điểm tuỳ mỗi gia đình.",
    category: "phong-tuc",
    daysBefore: 300,
  },

  // 9 tháng trước
  {
    id: "xem-ngay-cuoi",
    title: "Xem ngày cưới",
    note: "Nhiều gia đình xem ngày theo tuổi cô dâu chú rể cho lễ ăn hỏi, rước dâu.",
    category: "phong-tuc",
    daysBefore: 270,
  },
  {
    id: "dat-nha-hang",
    title: "Chọn và đặt cọc nhà hàng / địa điểm tiệc",
    note: "Ngày đẹp hay kín lịch sớm. Hỏi rõ điều khoản đổi ngày và hoàn cọc.",
    category: "dia-diem-dich-vu",
    daysBefore: 270,
  },
  {
    id: "chon-phong-cach-cuoi",
    title: "Chọn phong cách, tông màu đám cưới",
    note: "Dùng chung cho trang trí, thiệp, trang phục và ảnh.",
    category: "ke-hoach",
    daysBefore: 240,
  },
  {
    id: "dat-chup-anh-cuoi",
    title: "Chọn studio chụp ảnh cưới",
    note: "Xem kỹ album thật, hỏi số ảnh chỉnh sửa và thời gian trả ảnh.",
    category: "dia-diem-dich-vu",
    daysBefore: 240,
  },

  // 6 tháng trước
  {
    id: "dat-trang-phuc-cuoi",
    title: "Chọn váy cưới, vest và áo dài",
    note: "Áo dài may đo cần thời gian thử và sửa nhiều lần.",
    category: "trang-phuc",
    daysBefore: 180,
  },
  {
    id: "dat-quay-phim-mc",
    title: "Đặt quay phim, MC, ban nhạc",
    category: "dia-diem-dich-vu",
    daysBefore: 180,
  },
  {
    id: "chon-phu-dau-phu-re",
    title: "Nhờ phù dâu, phù rể",
    category: "khach-moi",
    daysBefore: 150,
  },

  // 4 tháng trước
  {
    id: "chup-anh-cuoi",
    title: "Chụp ảnh cưới",
    note: "Chụp sớm để kịp chọn ảnh cho thiệp, phông sân khấu và album.",
    category: "dia-diem-dich-vu",
    daysBefore: 120,
  },
  {
    id: "dat-trang-diem",
    title: "Đặt lịch trang điểm, làm tóc ngày cưới",
    note: "Hỏi lịch trang điểm thử trước ngày cưới.",
    category: "trang-phuc",
    daysBefore: 120,
  },
  {
    id: "dat-trang-tri",
    title: "Chọn đơn vị trang trí cổng hoa, rạp, bàn gia tiên",
    category: "dia-diem-dich-vu",
    daysBefore: 120,
  },
  {
    id: "kham-tien-hon-nhan",
    title: "Khám sức khoẻ tiền hôn nhân",
    note: "Nên làm sớm để có thời gian tư vấn nếu cần.",
    category: "ca-nhan",
    daysBefore: 120,
  },

  // 3 tháng trước
  {
    id: "mua-nhan-cuoi",
    title: "Chọn nhẫn cưới",
    note: "Khắc chữ hoặc nới size cần thêm thời gian.",
    category: "trang-phuc",
    daysBefore: 90,
  },
  {
    id: "chot-danh-sach-khach",
    title: "Chốt danh sách khách mời",
    note: "Ghi rõ nhà trai / nhà gái, danh xưng và khách mời dự lễ nào.",
    category: "khach-moi",
    daysBefore: 90,
  },
  {
    id: "dat-tra-le-an-hoi",
    title: "Đặt tráp / mâm quả ăn hỏi",
    note: "Hai nhà thống nhất số tráp và lễ vật theo phong tục mỗi bên.",
    category: "phong-tuc",
    daysBefore: 90,
  },
  {
    id: "chon-mau-thiep",
    title: "Chọn mẫu thiệp cưới (giấy và online)",
    category: "khach-moi",
    daysBefore: 90,
  },

  // 2 tháng trước
  {
    id: "in-thiep-giay",
    title: "In thiệp giấy",
    note: "Kiểm tra kỹ tên, ngày dương / âm lịch, giờ và địa chỉ trước khi in.",
    category: "khach-moi",
    daysBefore: 60,
  },
  {
    id: "tao-thiep-online",
    title: "Tạo thiệp online và link mời riêng",
    note: "Mỗi khách một link đúng danh xưng, có xác nhận tham dự.",
    category: "khach-moi",
    daysBefore: 60,
  },
  {
    id: "dat-xe-hoa",
    title: "Đặt xe hoa, xe đưa đón họ hàng",
    category: "dia-diem-dich-vu",
    daysBefore: 60,
  },
  {
    id: "chon-qua-cam-on",
    title: "Chọn quà cảm ơn khách",
    category: "khach-moi",
    daysBefore: 60,
  },
  {
    id: "len-kich-ban-le",
    title: "Lên kịch bản lễ và tiệc cùng MC",
    note: "Thứ tự nghi lễ, phát biểu của đại diện hai họ, tiết mục văn nghệ.",
    category: "ke-hoach",
    daysBefore: 60,
  },

  // 1 tháng trước
  {
    id: "dang-ky-ket-hon",
    title: "Đăng ký kết hôn",
    note: "Hỏi UBND xã / phường nơi cư trú về giấy tờ cần mang theo. Có yếu tố nước ngoài thì hỏi riêng thủ tục.",
    category: "giay-to",
    daysBefore: 30,
  },
  {
    id: "gui-thiep",
    title: "Gửi thiệp mời",
    note: "Nhiều nhà mời người lớn tuổi, họ hàng tận nhà; bạn bè ở xa có thể gửi link.",
    category: "khach-moi",
    daysBefore: 30,
  },
  {
    id: "chuan-bi-phong-bi-an-hoi",
    title: "Chuẩn bị phong bì lì xì cho đội bê tráp ăn hỏi",
    category: "phong-tuc",
    daysBefore: 30,
  },
  {
    id: "le-an-hoi",
    title: "Lễ ăn hỏi",
    note: "Nhiều nơi tổ chức trước lễ cưới, cũng có gia đình làm cùng ngày.",
    category: "phong-tuc",
    daysBefore: 30,
  },
  {
    id: "thu-trang-phuc",
    title: "Thử trang phục lần cuối",
    category: "trang-phuc",
    daysBefore: 30,
  },
  {
    id: "chuan-bi-phong-cuoi",
    title: "Chuẩn bị phòng tân hôn",
    category: "ca-nhan",
    daysBefore: 30,
  },

  // 2 tuần trước
  {
    id: "nhac-khach-xac-nhan",
    title: "Nhắc khách chưa xác nhận tham dự",
    category: "khach-moi",
    daysBefore: 14,
  },
  {
    id: "bao-so-ban",
    title: "Báo số bàn dự kiến cho nhà hàng",
    note: "Hỏi hạn chót chốt số bàn và cách tính bàn dự phòng.",
    category: "dia-diem-dich-vu",
    daysBefore: 14,
  },
  {
    id: "phan-cong-nguoi-nha",
    title: "Phân công người nhà: đón khách, nhận phong bì, đưa đón",
    category: "ke-hoach",
    daysBefore: 14,
  },
  {
    id: "trang-diem-thu",
    title: "Trang điểm, làm tóc thử",
    category: "trang-phuc",
    daysBefore: 14,
  },

  // 1 tuần trước
  {
    id: "so-do-ban",
    title: "Xếp sơ đồ bàn tiệc",
    category: "khach-moi",
    daysBefore: 7,
  },
  {
    id: "xac-nhan-dich-vu",
    title: "Gọi xác nhận lại mọi dịch vụ",
    note: "Nhà hàng, trang điểm, chụp ảnh, xe hoa, trang trí: giờ có mặt và đầu mối liên lạc.",
    category: "dia-diem-dich-vu",
    daysBefore: 7,
  },
  {
    id: "chuan-bi-phong-bi-ruoc-dau",
    title: "Chuẩn bị tiền lẻ, phong bì lì xì cho ngày rước dâu",
    category: "phong-tuc",
    daysBefore: 5,
  },
  {
    id: "chuan-bi-ban-tho-gia-tien",
    title: "Chuẩn bị bàn thờ gia tiên, lễ vật",
    category: "phong-tuc",
    daysBefore: 3,
  },
  {
    id: "nghi-ngoi",
    title: "Ngủ đủ, giữ sức khoẻ",
    category: "ca-nhan",
    daysBefore: 2,
  },

  // Ngày cưới
  {
    id: "le-vu-quy-thanh-hon",
    title: "Lễ rước dâu, lễ vu quy và thành hôn",
    note: "Theo giờ đã xem; nhờ một người nắm lịch trình nhắc giờ cho cả nhà.",
    category: "phong-tuc",
    daysBefore: 0,
  },
  {
    id: "tiec-cuoi",
    title: "Tiệc cưới",
    category: "dia-diem-dich-vu",
    daysBefore: 0,
  },
];

/** Phase an item falls into: the nearest phase that starts on or before the item's due day. */
export function phaseOf(item: Pick<ChecklistItem, "daysBefore">): ChecklistPhase {
  let match = farthestPhase;
  for (const phase of checklistPhases) {
    if (phase.daysBefore < item.daysBefore) break;
    match = phase;
  }
  return match;
}
