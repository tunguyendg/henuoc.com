import "server-only";
import { deepFreeze } from "../mock-freeze";
import { findMockWedding } from "../wedding/mock-repo";
import type { ShoppingRepo } from "./repo";
import type { ProductView } from "./types";

// SAMPLE DATA ONLY — generic product types, no real shops, no prices, no images, no links.
const PRICE_LABEL = "Xem giá tại Shopee";

const mockProducts: readonly ProductView[] = deepFreeze([
  {
    id: "demo-prd-01",
    name: "Bộ lư đồng thờ gia tiên cỡ nhỏ",
    category: "gia-tien",
    priceLabel: PRICE_LABEL,
    note: "Đo kích thước bàn thờ trước khi chọn cỡ.",
  },
  {
    id: "demo-prd-02",
    name: "Hộp nhang trầm cho lễ gia tiên",
    category: "gia-tien",
    priceLabel: PRICE_LABEL,
    note: "Chọn loại ít khói nếu làm lễ trong phòng kín.",
  },
  {
    id: "demo-prd-03",
    name: "Bộ tráp ăn hỏi phủ nhung đỏ",
    category: "an-hoi",
    priceLabel: PRICE_LABEL,
    note: "Số tráp thường là số lẻ (5, 7, 9) — hỏi ý hai bên gia đình trước.",
  },
  {
    id: "demo-prd-04",
    name: "Khay tráp mica in chữ Song Hỷ",
    category: "an-hoi",
    priceLabel: PRICE_LABEL,
    note: "Dùng lại được, hợp nếu tự chuẩn bị lễ vật.",
  },
  {
    id: "demo-prd-05",
    name: "Kẹp tóc ngọc trai cho cô dâu",
    category: "co-dau",
    priceLabel: PRICE_LABEL,
    note: "Hỏi thợ trang điểm kiểu tóc trước khi mua phụ kiện.",
  },
  {
    id: "demo-prd-06",
    name: "Giày cưới cao gót đính đá",
    category: "co-dau",
    priceLabel: PRICE_LABEL,
    note: "Mua sớm để đi cho quen chân trước ngày cưới.",
  },
  {
    id: "demo-prd-07",
    name: "Hộp quà cảm ơn khách mời",
    category: "qua-cam-on",
    priceLabel: PRICE_LABEL,
    note: "Số lượng gợi ý = số người xác nhận + 5% dự phòng.",
  },
  {
    id: "demo-prd-08",
    name: "Thiệp cảm ơn in sẵn kèm phong bì",
    category: "qua-cam-on",
    priceLabel: PRICE_LABEL,
    note: "Kèm vào hộp quà hoặc gửi sau tiệc.",
  },
  {
    id: "demo-prd-09",
    name: "Bóng bay chữ Song Hỷ trang trí phòng cưới",
    category: "trang-tri",
    priceLabel: PRICE_LABEL,
    note: "Đặt trước 1–2 tuần, kiểm tra kèm bơm và băng dính.",
  },
  {
    id: "demo-prd-10",
    name: "Dây đèn LED trang trí bàn gallery",
    category: "trang-tri",
    priceLabel: PRICE_LABEL,
    note: "Chọn loại dùng pin nếu bàn gallery xa ổ điện.",
  },
  {
    id: "demo-prd-11",
    name: "Bộ đạo cụ chụp ảnh cưới (biển chữ, vương miện hoa)",
    category: "chup-anh",
    priceLabel: PRICE_LABEL,
    note: "Hỏi studio xem đã có sẵn đạo cụ nào để khỏi mua trùng.",
  },
]);

export const mockShoppingRepo: ShoppingRepo = {
  async listSuggestions(weddingId, category) {
    if (!findMockWedding(weddingId)) return [];
    return structuredClone(
      mockProducts.filter((p) => category === undefined || p.category === category),
    );
  },
};
