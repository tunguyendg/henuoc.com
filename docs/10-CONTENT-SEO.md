# 10 — Nội dung Cẩm nang: luật viết + lịch 12 bài

> Tóm tắt: viết cho **người sắp cưới đang cần làm một việc cụ thể**, không viết cho máy. Mỗi bài phải có ít nhất
> một thứ chỉ Hẹn Ước có (mẫu copy được, bảng so sánh, công cụ, ảnh thiệp demo của mình). Không có thì chưa viết.
> Kỹ thuật SEO (title, H1, canonical, sitemap) đã có ở `docs/08-SEO.md` + `src/data/articles.ts`; file này lo **nội dung**.
> Phiên bản 1.0 · 2026-10-23.

## 1. Luật nội dung (theo hướng dẫn Google hiện hành)

Google xếp hạng theo "nội dung hữu ích, đáng tin, viết cho người" (helpful content đã nằm trong hệ thống xếp hạng lõi)
và phạt theo chính sách spam. Dịch ra luật cho Hẹn Ước:

### 1.1 People-first

- Mỗi bài trả lời **một câu hỏi thật** của người tìm (cột "Ý định" ở §3). Đọc xong phải làm được việc, không phải đi tìm bài khác.
- Mở bài bằng câu trả lời ngắn (2–3 câu), rồi mới giải thích. Không mở bằng "Đám cưới là sự kiện trọng đại…".
- Độ dài theo nhu cầu, không theo số chữ. Khung 1.200–2.500 chữ ở `04-GROWTH.md` là mức thường gặp, **không phải chỉ tiêu**.
- Có tác giả + ngày đăng/ngày sửa thật (`publishedAt`, `updatedAt` chỉ đổi khi sửa nội dung đáng kể).
- Viết từ trải nghiệm thật khi có (đã dựng thiệp, đã thử gửi Zalo, đã đếm khách bằng RSVP) — đây là chữ "E" (Experience) mà bài chép lại không có.

### 1.2 Chống "scaled content abuse"

Chính sách spam của Google phạt việc **sản xuất hàng loạt trang để lấy thứ hạng mà không giúp người đọc**, bất kể
viết tay hay dùng AI. Luật:

- **Không** sinh bài hàng loạt từ một khung (vd. "Lời mời đám cưới cho [nghề X]" × 30 nghề).
- **Không** viết lại bài đối thủ bằng từ khác. Nếu bài không thêm được gì mới → không viết.
- AI được dùng để nháp/soát lỗi, nhưng **người duyệt từng câu**, kiểm từng sự kiện, thêm phần trải nghiệm.
- Mỗi bài một ý định. Hai bài tranh cùng một từ khoá chính = gộp làm một.
- Tối đa ~2 bài/tuần trong 3 tháng đầu: chất lượng hơn số lượng, và còn kịp đọc Search Console.

### 1.3 "Giá trị riêng" — bắt buộc mỗi bài có ≥ 1

| Loại | Ví dụ | Ghi chú |
| --- | --- | --- |
| Mẫu copy được | Câu chữ in thiệp, tin nhắn Zalo, kịch bản phát biểu | Có nút "Sao chép" như `/cong-cu/mau-loi-moi-dam-cuoi` |
| Bảng so sánh | Vu quy / thành hôn / tân hôn × Bắc / Trung / Nam | Bảng HTML thật, không phải ảnh chụp bảng |
| Công cụ | Checklist, tính số bàn, lịch trình ngày cưới | Ưu tiên link tool có sẵn; tool mới phải qua spec riêng |
| Ảnh thiệp demo của mình | Ảnh chụp màn hình theme Hẹn Ước có dữ liệu demo | Không chứa dữ liệu thật của khách, không STK thật |

### 1.4 Không bịa số liệu

- Mọi con số (chi phí, tỷ lệ khách đến, số tráp, khổ thiệp…) phải **có nguồn ghi ngay cạnh**, kèm năm và phạm vi (vd. "khảo sát Mỹ, The Knot").
- Không có nguồn → viết dạng **công thức / khoảng để người đọc tự điền**, không đưa số cụ thể.
- Số liệu từ diễn đàn (VOZ, Tinhte…) chỉ được trích là "một người dùng kể", không phải "trung bình".
- Không "theo các chuyên gia", "nghiên cứu cho thấy" mà không link.

### 1.5 Phong tục vùng miền

- Luôn ghi rõ **Bắc / Trung / Nam khác nhau ở đâu**, và "tuỳ gia đình, tuỳ địa phương" khi nguồn không thống nhất.
- Không trình bày một phong tục vùng như chuẩn chung của cả nước.
- Nguồn ưu tiên: tư liệu văn hoá chính thống (vd. Từ điển văn hoá trên `scov.gov.vn`), sách phong tục, tạp chí khoa học (vjol.info.vn).
  Blog thương mại (Shopee, Mytour…) chỉ để tham khảo, không dùng làm nguồn duy nhất.
- Chỗ nào các nguồn mâu thuẫn (vd. thứ tự, địa điểm lễ thành hôn) → nói thẳng là có nhiều cách, khuyên hỏi người lớn hai bên.

### 1.6 Schema

- Mỗi bài: **`Article`** (có sẵn ở `/cam-nang/[slug]`) + **`BreadcrumbList`** (tự sinh từ sổ SEO).
- **Không** dùng `FAQPage` cho bài viết. `FAQPage` chỉ ở `/cau-hoi-thuong-gap` (docs/08 §1). Muốn có phần hỏi–đáp trong bài thì cứ viết H2/H3 bình thường.
- Không `HowTo`, không `AggregateRating`/`Review` tự chấm.
- `Article.image` dùng ảnh bìa của bài (§2).

### 1.7 Checklist trước khi đăng một bài

- [ ] Từ khoá chính không trùng trang nào khác (xem §4)
- [ ] Có ≥ 1 "giá trị riêng" (§1.3)
- [ ] Mọi con số có nguồn
- [ ] Có khác biệt vùng miền nếu bài nói phong tục
- [ ] 3 link nội bộ đúng §3 (thêm vào `related` trong `src/data/articles.ts`), link trong thân bài dùng anchor tự nhiên
- [ ] Ảnh đạt §2, có credit
- [ ] `npm test` xanh (cảnh sát SEO kiểm title/H1/description/link gãy)

## 2. Ảnh

- Định dạng **WebP**, cạnh dài **≤ 1600px**, bìa tỉ lệ 16:9 hoặc 3:2. Mục tiêu ≤ 200KB/ảnh.
- `alt` **mô tả đúng cái có trong ảnh** (người, trang phục, vật, bối cảnh), tiếng Việt, ≤ 125 ký tự. Không nhồi từ khoá, không "ảnh đẹp đám cưới".
- Ghi **credit** dưới ảnh: "Ảnh: Tên tác giả / Unsplash" (link về trang tác giả). Unsplash License không bắt buộc nhưng Hẹn Ước luôn ghi.
- Unsplash: **chỉ ảnh free** (trang ảnh ghi "Free to use under the Unsplash License"). **Không** dùng Unsplash+ (`plus.unsplash.com`, `premium_photo-…`).
- Ưu tiên ảnh cưới Việt / châu Á. Ảnh đồ vật (điện thoại, thiệp, bàn tiệc) không cần.
- Không dùng lại ảnh đã ở trang chủ (`public/images/wedding/`) để bài có hình riêng.
- Danh sách ảnh đã chọn: `src/content/cam-nang/images.json`. `cdnPath` = phần `photo-…` của ảnh gốc trên `images.unsplash.com`
  (trùng với `og:image` của trang ảnh). Alt trong file là bản nháp dựa trên mô tả của Unsplash → **người viết bài xem ảnh rồi sửa alt cho đúng**.
- File WebP đặt ở `public/images/cam-nang/<slug>/` — thư mục ảnh của Tony: **Tony tải và đặt file**, agent không tự ghi.

## 3. Lịch 12 bài (4 cụm)

Đã có (không viết lại): `cach-ghi-thiep-cuoi` ("cách ghi thiệp cưới"), `loi-moi-dam-cuoi-hay` ("lời mời đám cưới hay").

**Cách chọn từ khoá:** tra kết quả Google tiếng Việt (SERP) và cách người Việt đặt câu hỏi trên báo/diễn đàn ngày 2026-10-23.
Chưa có dữ liệu lượng tìm kiếm → từ khoá là **giả thuyết**, chỉnh theo Search Console sau launch (`04-GROWTH.md` §2.2).

**Thứ tự đăng:** bài 1–4 mỗi cụm một bài (ảnh đã chọn sẵn), sau đó luân phiên cụm. Mỗi tuần 1–2 bài.

| # | Tuần | Cụm | Slug |
| --- | --- | --- | --- |
| 1 | T1 | Phong tục | `le-vu-quy-thanh-hon-tan-hon` |
| 2 | T1 | Thiệp & lời mời | `gui-thiep-cuoi-qua-zalo` |
| 3 | T2 | Kế hoạch & chi phí | `du-tru-chi-phi-dam-cuoi` |
| 4 | T2 | Khách mời & RSVP | `cach-tinh-so-luong-khach-moi` |
| 5 | T3 | Phong tục | `le-dam-ngo-can-chuan-bi-gi` |
| 6 | T4 | Thiệp & lời mời | `gui-thiep-cuoi-truoc-bao-lau` |
| 7 | T5 | Khách mời & RSVP | `nhan-tin-xac-nhan-tham-du-dam-cuoi` |
| 8 | T6 | Kế hoạch & chi phí | `lich-trinh-ngay-cuoi` |
| 9 | T7 | Phong tục | `le-an-hoi-gom-nhung-gi` |
| 10 | T8 | Thiệp & lời mời | `thiep-cuoi-co-nen-ghi-so-tai-khoan` |
| 11 | T9 | Khách mời & RSVP | `sap-xep-cho-ngoi-tiec-cuoi` |
| 12 | T10 | Kế hoạch & chi phí | `dat-tiec-cuoi-nha-hang-can-luu-y` |

### Cụm A — Thiệp & lời mời

**2. `gui-thiep-cuoi-qua-zalo`**
- Từ khoá chính: **gửi thiệp cưới qua zalo** · phụ: gửi thiệp cưới qua zalo có lịch sự không, mời cưới qua tin nhắn, cách gửi thiệp cưới online
- Ý định: đã có thiệp (giấy hoặc online), băn khoăn gửi qua Zalo có bị coi là thiếu tôn trọng không, và gửi sao cho khéo.
- Giá trị riêng: bảng "ai nên gặp mặt / ai gửi Zalo được" theo vai vế; 6–8 tin nhắn kèm thiệp copy được (sếp, họ hàng xa, bạn cũ lâu không liên lạc…); ảnh chụp thiệp Hẹn Ước mở trong Zalo (có tên khách riêng).
- Link nội bộ: `/tinh-nang/loi-moi-rieng` · `/cam-nang/loi-moi-dam-cuoi-hay` · `/mau-thiep-cuoi`
- Ảnh: bìa điện thoại + hoa cưới; 1 ảnh thiệp giấy (so sánh); 1 ảnh chụp màn hình thiệp demo của mình trên Zalo (Tony chụp).
- Lưu ý: ý kiến "Zalo là thiếu lịch sự" có thật (Tuổi Trẻ, VOZ) → trình bày cả hai phía, không phán.

**6. `gui-thiep-cuoi-truoc-bao-lau`**
- Từ khoá chính: **gửi thiệp cưới trước bao lâu** · phụ: nên gửi thiệp cưới trước bao nhiêu ngày, thời gian phát thiệp cưới, mời cưới trước mấy ngày
- Ý định: muốn biết mốc phát thiệp để không quá sớm (khách quên) hay quá muộn (khách kẹt lịch).
- Giá trị riêng: bảng mốc theo loại khách (ở xa/nước ngoài, họ hàng, đồng nghiệp, bạn bè) + mốc nhắc lại; chèn mốc vào checklist tool. Ghi rõ: nguồn quốc tế (6–12 tuần) là thị trường Mỹ, **không** áp thẳng cho Việt Nam.
- Link nội bộ: `/cong-cu/checklist-dam-cuoi` · `/cam-nang/gui-thiep-cuoi-qua-zalo` · `/tinh-nang/rsvp`
- Ảnh: bìa lịch / thiệp; 1 ảnh chụp checklist tool có mốc "phát thiệp".

**10. `thiep-cuoi-co-nen-ghi-so-tai-khoan`**
- Từ khoá chính: **thiệp cưới ghi số tài khoản** · phụ: có nên in số tài khoản lên thiệp cưới, mừng cưới chuyển khoản, mã QR mừng cưới
- Ý định: muốn nhận mừng cưới chuyển khoản (khách ở xa) nhưng sợ bị chê "đòi tiền".
- Giá trị riêng: bảng ưu/nhược 3 cách (in STK trên thiệp, gửi riêng khi khách hỏi, nút "Mừng cưới" ẩn mở khi bấm); câu chữ tế nhị copy được; ảnh demo nút quà + QR của theme (STK giả). Dẫn VnExpress "Thiệp cưới in số tài khoản" cho phần tranh luận.
- Link nội bộ: `/mau-thiep-cuoi` · `/tinh-nang/loi-moi-rieng` · `/cam-nang/cach-ghi-thiep-cuoi`
- Ảnh: bìa phong bì mừng cưới / điện thoại; 1 ảnh chụp sheet "Mừng cưới" demo (STK giả, che bớt số).
- Lưu ý bảo mật: không đưa STK thật vào ảnh, alt, OG.

### Cụm B — Phong tục cưới hỏi 3 miền

**1. `le-vu-quy-thanh-hon-tan-hon`**
- Từ khoá chính: **lễ vu quy là gì** · phụ: lễ thành hôn là gì, tân hôn là gì, lễ vu quy và lễ thành hôn khác nhau thế nào, thiệp cưới nhà gái ghi lễ gì
- Ý định: đang in/soạn thiệp, không biết nhà mình ghi "Lễ Vu Quy" hay "Lễ Thành Hôn"; muốn hiểu thứ tự các lễ.
- Giá trị riêng: bảng so sánh 3 lễ (ai tổ chức · ở đâu · thời điểm · chữ ghi trên thiệp) kèm cột khác biệt Bắc/Trung/Nam; ảnh chụp 2 thiệp demo Hẹn Ước (nhà trai / nhà gái) cho thấy dòng chữ đúng.
- Link nội bộ: `/cam-nang/cach-ghi-thiep-cuoi` · `/mau-thiep-cuoi` · `/tao-thiep`
- Ảnh: bìa cặp đôi áo dài cưới; 2 ảnh đội bưng quả / bê tráp. Đã chọn (images.json).
- Lưu ý: nghĩa "tân hôn" và vị trí lễ thành hôn **các nguồn không thống nhất** → phải kiểm bằng nguồn văn hoá chính thống trước khi viết.

**5. `le-dam-ngo-can-chuan-bi-gi`**
- Từ khoá chính: **lễ dạm ngõ cần chuẩn bị gì** · phụ: lễ dạm ngõ là gì, lễ vật dạm ngõ miền Bắc, dạm ngõ nói gì, dạm ngõ mặc gì
- Ý định: sắp đưa bố mẹ sang nhà người yêu lần đầu, cần danh sách việc và lễ vật cho đúng vùng.
- Giá trị riêng: checklist 2 cột nhà trai / nhà gái; bảng lễ vật Bắc / Trung / Nam (có ghi "tuỳ nhà"); kịch bản lời phát biểu đại diện nhà trai + lời đáp nhà gái copy được.
- Link nội bộ: `/cam-nang/le-an-hoi-gom-nhung-gi` · `/cong-cu/checklist-dam-cuoi` · `/cam-nang/le-vu-quy-thanh-hon-tan-hon`
- Ảnh: bìa gia đình hai bên / mâm trà rượu; 1 ảnh lễ vật.

**9. `le-an-hoi-gom-nhung-gi`**
- Từ khoá chính: **lễ ăn hỏi gồm những gì** · phụ: đám hỏi cần chuẩn bị gì, sính lễ ăn hỏi, số tráp ăn hỏi, mâm quả cưới 3 miền
- Ý định: chuẩn bị lễ hỏi, cần biết lễ vật, số tráp, trình tự, ai đi.
- Giá trị riêng: bảng mâm quả / số tráp Bắc (thường lẻ) – Nam (thường chẵn) – Trung, ghi nguồn và "tuỳ gia đình"; trình tự lễ theo phút (khung, không số cứng); kịch bản MC/đại diện ngắn copy được; ghi chú khi gộp hỏi + cưới một ngày.
- Link nội bộ: `/cam-nang/le-dam-ngo-can-chuan-bi-gi` · `/cam-nang/lich-trinh-ngay-cuoi` · `/cong-cu/checklist-dam-cuoi`
- Ảnh: bìa đội bê tráp; 2 ảnh mâm quả trầu cau / bánh.
- Lưu ý: không đưa con số tiền sính lễ.

### Cụm C — Kế hoạch & chi phí

**3. `du-tru-chi-phi-dam-cuoi`**
- Từ khoá chính: **dự trù chi phí đám cưới** · phụ: chi phí đám cưới gồm những gì, đám cưới hết bao nhiêu tiền, lập ngân sách đám cưới
- Ý định: muốn biết phải chi những khoản nào và cách ước lượng cho chính mình trước khi hỏi giá.
- Giá trị riêng: bảng hạng mục (tiệc, trang phục – trang điểm, chụp ảnh, lễ hỏi, nhẫn, trang trí, thiệp, phát sinh) với cột **trống để tự điền** + công thức "tiền tiệc = số bàn × giá bàn"; hướng dẫn hỏi báo giá. Con số thực tế chỉ trích có nguồn (Znews, Tinhte 2021…) và ghi rõ năm, bối cảnh.
- Link nội bộ: `/cam-nang/cach-tinh-so-luong-khach-moi` · `/cong-cu/checklist-dam-cuoi` · `/tinh-nang/checklist-dam-cuoi`
- Ảnh: bìa sảnh tiệc; 1 ảnh ghi chép / lập kế hoạch. Đã chọn (images.json).
- Ranh giới từ khoá: "tính chi phí đám cưới" để dành cho tool v2 `/tinh-chi-phi-dam-cuoi`; khi có tool, bài này link sang tool.

**8. `lich-trinh-ngay-cuoi`**
- Từ khoá chính: **lịch trình ngày cưới** · phụ: kịch bản ngày cưới, timeline đám cưới, đám hỏi và đám cưới cùng ngày
- Ý định: cần một timeline từ sáng đến tối để gửi cho người nhà, thợ ảnh, MC.
- Giá trị riêng: 3 timeline mẫu copy được (cưới riêng ngày · gộp hỏi + cưới · chỉ tiệc nhà hàng), ghi khác biệt rước dâu Bắc/Nam; mốc ghi theo "giờ hoàng đạo do nhà chọn" thay vì giờ bịa.
- Link nội bộ: `/cam-nang/le-vu-quy-thanh-hon-tan-hon` · `/cam-nang/le-an-hoi-gom-nhung-gi` · `/cong-cu/checklist-dam-cuoi`
- Ảnh: bìa đoàn rước dâu; 1 ảnh lễ gia tiên.

**12. `dat-tiec-cuoi-nha-hang-can-luu-y`**
- Từ khoá chính: **đặt tiệc cưới nhà hàng cần lưu ý gì** · phụ: hợp đồng tiệc cưới, kinh nghiệm đặt tiệc cưới, đặt cọc tiệc cưới
- Ý định: sắp ký hợp đồng nhà hàng, sợ phát sinh và điều khoản bất lợi.
- Giá trị riêng: danh sách câu hỏi copy được để hỏi nhà hàng (số bàn tối thiểu, bàn dự phòng, phí phát sinh, hoàn cọc, đồ uống…); bảng so sánh 2–3 báo giá để tự điền.
- Link nội bộ: `/cam-nang/du-tru-chi-phi-dam-cuoi` · `/cam-nang/cach-tinh-so-luong-khach-moi` · `/tinh-nang/quan-ly-khach-moi`
- Ảnh: bìa sảnh tiệc; 1 ảnh bàn tiệc đã set.
- Lưu ý: không tư vấn pháp lý; khuyên đọc kỹ hợp đồng, không nêu tên nhà hàng.

### Cụm D — Khách mời & RSVP

**4. `cach-tinh-so-luong-khach-moi`**
- Từ khoá chính: **tính số lượng khách mời đám cưới** · phụ: tính số mâm cỗ cưới, mời bao nhiêu khách đặt bao nhiêu bàn, bàn dự phòng tiệc cưới
- Ý định: đã có danh sách khách, cần chốt số bàn với nhà hàng mà không thừa/thiếu.
- Giá trị riêng: công thức từng bước (khách mời → ước tính người đến → chia số ghế/bàn → bàn dự phòng) với ví dụ tự tính; bảng tính in được. Tỷ lệ khách đến: khuyên **lấy từ RSVP của chính mình**; số tham khảo quốc tế (The Knot) ghi rõ là Mỹ. Ảnh demo trang RSVP Hẹn Ước đếm "sẽ đến".
- Link nội bộ: `/tinh-nang/rsvp` · `/tinh-nang/quan-ly-khach-moi` · `/cam-nang/du-tru-chi-phi-dam-cuoi`
- Ảnh: bìa sảnh tiệc có khách; 1 ảnh sảnh nhiều bàn. Đã chọn (images.json).

**7. `nhan-tin-xac-nhan-tham-du-dam-cuoi`**
- Từ khoá chính: **xác nhận tham dự đám cưới** · phụ: nhắn tin hỏi khách có đi đám cưới không, nhắc khách dự đám cưới, tin nhắn nhắc lịch cưới
- Ý định: đã phát thiệp, cần biết ai đến để chốt bàn, ngại hỏi thẳng.
- Giá trị riêng: tin nhắn copy được theo 3 thời điểm (kèm thiệp · nhắc trước hạn · nhắc trước ngày cưới) × 3 nhóm khách; giải thích RSVP bằng ví dụ thật của Hẹn Ước. Khác bài "lời mời đám cưới hay": bài này là **sau khi đã mời**.
- Link nội bộ: `/tinh-nang/rsvp` · `/cam-nang/loi-moi-dam-cuoi-hay` · `/cam-nang/cach-tinh-so-luong-khach-moi`
- Ảnh: bìa điện thoại nhắn tin; 1 ảnh chụp form RSVP demo.

**11. `sap-xep-cho-ngoi-tiec-cuoi`**
- Từ khoá chính: **sắp xếp chỗ ngồi đám cưới** · phụ: sơ đồ bàn tiệc cưới, xếp bàn khách mời đám cưới, bàn họ nhà trai nhà gái
- Ý định: chốt xong khách, cần chia bàn cho khỏi lộn xộn (họ hai nhà, đồng nghiệp, bạn bè).
- Giá trị riêng: nguyên tắc xếp bàn theo nhóm (họ nhà trai / nhà gái / bàn chính) có khác biệt vùng miền; mẫu sơ đồ in được; cách dùng nhóm khách trong Hẹn Ước để chia bàn.
- Link nội bộ: `/tinh-nang/quan-ly-khach-moi` · `/cam-nang/cach-tinh-so-luong-khach-moi` · `/cam-nang/nhan-tin-xac-nhan-tham-du-dam-cuoi`
- Ảnh: bìa bàn tiệc có bảng tên; 1 ảnh sơ đồ (tự vẽ, không lấy Unsplash).

## 4. Bản đồ từ khoá (chống trùng)

| Từ khoá | Trang sở hữu |
| --- | --- |
| cách ghi thiệp cưới | `/cam-nang/cach-ghi-thiep-cuoi` |
| lời mời đám cưới hay | `/cam-nang/loi-moi-dam-cuoi-hay` |
| mẫu lời mời đám cưới | `/cong-cu/mau-loi-moi-dam-cuoi` |
| checklist đám cưới, chuẩn bị đám cưới cần những gì | `/cong-cu/checklist-dam-cuoi` |
| lên kế hoạch đám cưới | `/tinh-nang/checklist-dam-cuoi` |
| mẫu thiệp cưới (đẹp, online) | `/mau-thiep-cuoi` |
| thiệp cưới online miễn phí, thiệp cưới điện tử | `/thiep-cuoi-online` (dự kiến, `04-GROWTH.md`) |
| xem ngày cưới · tính chi phí đám cưới | tool v2 `/xem-ngay-cuoi` · `/tinh-chi-phi-dam-cuoi` |
| 12 từ khoá chính ở §3 | bài tương ứng |

Bài mới đụng từ khoá trong bảng → đổi góc hoặc gộp, không viết bài tranh hạng với trang nhà.
