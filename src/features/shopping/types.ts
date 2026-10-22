// Mirrors AffiliateProduct.category values in docs/reference/schema.prisma. That column is a plain
// String in the DB, so the Prisma repo must parse it with a Zod enum of these values and SKIP rows
// with an unknown category (never cast).
export type ProductCategory =
  "gia-tien" | "an-hoi" | "co-dau" | "qua-cam-on" | "trang-tri" | "chup-anh";

// What the dashboard may show about a suggested product. No affiliate/origin URL here yet: clicks
// will go through /go/[productId] later (counts clicks, sends no PII).
export interface ProductView {
  id: string;
  name: string;
  category: ProductCategory;
  imageUrl?: string;
  priceLabel?: string; // never a made-up price; real price only lives on Shopee
  shopName?: string;
  note?: string; // why it was picked (written by Tony)
}
