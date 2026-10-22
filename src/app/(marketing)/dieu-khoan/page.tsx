import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { SupportEmailLink } from "@/components/site/support-email-link";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

const PATH = "/dieu-khoan";

export const metadata = pageMetadata(PATH);

// DRAFT. Based on docs/01-PRD.md + docs/04-GROWTH.md. No specific laws cited; refund policy not decided yet.
export default function Page() {
  return (
    <LegalPage
      path={PATH}
      intro={
        <p>
          Đây là các điều khoản khi hai bạn dùng Hẹn Ước để tạo thiệp cưới online, gửi lời mời và
          quản lý khách mời. Dùng dịch vụ nghĩa là bạn đồng ý với các điều khoản dưới đây.
        </p>
      }
    >
      <LegalSection title="1. Tài khoản">
        <LegalList
          items={[
            "Bạn có thể thử tạo thiệp mà không cần tài khoản. Để lưu thiệp và gửi lời mời, bạn cần đăng nhập bằng Google hoặc email.",
            "Bạn chịu trách nhiệm giữ an toàn tài khoản email hoặc Google dùng để đăng nhập, và các hoạt động diễn ra trong tài khoản của mình.",
            "Bạn có thể mời thêm một người (thường là vợ hoặc chồng) cùng quản lý đám cưới. Người này xem và sửa được thiệp, danh sách khách và phản hồi.",
            "Khách mời không cần tài khoản để xem thiệp và xác nhận tham dự.",
          ]}
        />
      </LegalSection>

      <LegalSection title="2. Nội dung bạn đưa lên">
        <p>
          Bạn chịu trách nhiệm về nội dung mình nhập vào thiệp: tên, lời mời, địa điểm, ảnh, danh
          sách khách và thông tin tài khoản nhận mừng cưới. Hãy kiểm tra kỹ ngày giờ, địa điểm trước
          khi gửi.
        </p>
        <p>Bạn đồng ý không dùng Hẹn Ước để:</p>
        <LegalList
          items={[
            "Đăng nội dung xúc phạm, lừa đảo, giả mạo người khác hoặc vi phạm quyền của người khác.",
            "Gửi tin rác, hoặc nhập thông tin của những người bạn không thực sự mời.",
            "Dò đoán link thiệp của người khác, làm quá tải hoặc can thiệp vào hệ thống.",
          ]}
        />
        <p>
          Hẹn Ước có thể gỡ nội dung hoặc tạm khoá tài khoản vi phạm các điều trên, và sẽ cố gắng
          báo cho bạn trước khi làm.
        </p>
      </LegalSection>

      <LegalSection title="3. Quyền sở hữu ảnh và nội dung">
        <LegalList
          items={[
            "Ảnh và nội dung bạn tải lên vẫn thuộc về bạn (hoặc người đã chụp ảnh). Bạn cần có quyền sử dụng những ảnh đó.",
            "Bạn cho phép Hẹn Ước lưu trữ, thu nhỏ, cắt khung và hiển thị ảnh, nội dung đó chỉ để thiệp của bạn hoạt động.",
            "Hẹn Ước không dùng ảnh hay thông tin đám cưới của bạn để quảng cáo khi chưa có sự đồng ý của bạn.",
            "Mẫu thiệp, logo, giao diện và mã nguồn của Hẹn Ước thuộc về Hẹn Ước. Bạn được dùng chúng cho thiệp cưới của mình trên henuoc.com.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Gói Miễn phí và gói Cao cấp">
        <LegalList
          items={[
            "Gói Miễn phí có một số giới hạn, ví dụ số lời mời riêng, số ảnh album và dòng chữ nhỏ “Tạo bởi Hẹn Ước” ở cuối thiệp.",
            "Gói Cao cấp chưa mở. Khi mở, gói này trả một lần cho mỗi đám cưới, không có thuê bao và không tự gia hạn.",
            <>
              Giá và quyền lợi của từng gói được công bố tại trang{" "}
              <LegalLink href="/bang-gia">Bảng giá</LegalLink>. Quyền lợi có thể điều chỉnh trước
              khi ra mắt.
            </>,
            `Hiện Hẹn Ước chưa nhận thanh toán online. Muốn nâng cấp, bạn gửi email tới ${site.supportEmail} để được báo giá và hướng dẫn. Điều khoản chính thức và chính sách hoàn tiền sẽ được công bố trước khi Hẹn Ước nhận thanh toán.`,
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Liên kết tiếp thị">
        <p>
          Trong trang quản lý, Hẹn Ước có thể gợi ý sản phẩm trên Shopee theo từng việc trong
          checklist cưới, thông qua nền tảng tiếp thị liên kết ACCESSTRADE. Các gợi ý này luôn có
          nhãn “Liên kết tiếp thị”.
        </p>
        <LegalList
          items={[
            "Hẹn Ước có thể nhận hoa hồng khi bạn mua qua liên kết, giá bạn trả không thay đổi.",
            "Việc mua bán, giao hàng, đổi trả là giữa bạn và người bán trên Shopee. Giá hiển thị trên Hẹn Ước chỉ để tham khảo và có thể khác giá thực tế.",
            "Liên kết tiếp thị không bao giờ xuất hiện trên thiệp gửi khách.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Dữ liệu cá nhân">
        <p>
          Cách Hẹn Ước thu thập và bảo vệ dữ liệu của bạn và khách mời được mô tả trong{" "}
          <LegalLink href="/chinh-sach-bao-mat">Chính sách bảo mật</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="7. Giới hạn trách nhiệm">
        <p>
          Chúng mình luôn cố gắng để thiệp và trang quản lý chạy ổn định, nhưng dịch vụ được cung
          cấp theo hiện trạng và có thể có lúc gián đoạn để bảo trì hoặc do sự cố ngoài ý muốn.
        </p>
        <LegalList
          items={[
            "Hẹn Ước không chịu trách nhiệm về thông tin sai do người dùng nhập, ví dụ sai giờ, sai địa điểm hoặc sai số tài khoản mừng cưới.",
            "Hẹn Ước không kiểm soát việc gửi và nhận tin nhắn qua Zalo, Messenger hay nhà mạng.",
            "Số người sẽ đến được tổng hợp từ phản hồi của khách; số thực tế trong ngày cưới có thể khác.",
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Ngừng sử dụng">
        <p>
          Bạn có thể ngừng dùng và xoá tài khoản bất cứ lúc nào. Khi tài khoản bị xoá, thiệp và các
          link đã gửi sẽ ngừng hoạt động. Cách dữ liệu được xoá, kể cả bản sao lưu, được mô tả trong{" "}
          <LegalLink href="/chinh-sach-bao-mat">Chính sách bảo mật</LegalLink>. Yêu cầu xoá tài
          khoản gửi qua email chỉ được xử lý sau khi xác minh đúng chủ tài khoản, như mô tả trong
          chính sách đó.
        </p>
      </LegalSection>

      <LegalSection title="9. Thay đổi điều khoản">
        <p>
          Khi điều khoản thay đổi, chúng mình cập nhật ngày ở đầu trang. Với thay đổi quan trọng,
          chúng mình sẽ báo trong trang quản lý hoặc qua email.
        </p>
      </LegalSection>

      <LegalSection title="10. Liên hệ">
        <p>
          Cần hỗ trợ, có câu hỏi về điều khoản hoặc muốn yêu cầu xoá dữ liệu, hãy gửi email tới{" "}
          <SupportEmailLink />. Xem thêm trang <LegalLink href="/lien-he">Liên hệ</LegalLink>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
