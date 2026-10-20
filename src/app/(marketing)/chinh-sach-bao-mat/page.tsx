import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/chinh-sach-bao-mat";

export const metadata = pageMetadata(PATH);

// DRAFT. Describes only data the product actually handles (docs/03-ARCHITECTURE.md, docs/01-PRD.md).
// Do not cite specific laws, claim compliance, or promise absolutes ("never", "immediately").
export default function Page() {
  return (
    <LegalPage
      path={PATH}
      intro={
        <p>
          Chính sách này giải thích Hẹn Ước thu thập thông tin gì khi hai bạn tạo thiệp cưới online
          trên henuoc.com, dùng thông tin đó để làm gì, lưu ở đâu và hai bạn có quyền gì với dữ liệu
          của mình.
        </p>
      }
    >
      <LegalSection title="1. Thông tin chúng mình thu thập">
        <p>Chúng mình chỉ thu thập những gì cần để thiệp và trang quản lý hoạt động:</p>
        <LegalList
          items={[
            <>
              <strong>Tài khoản:</strong> khi bạn đăng nhập bằng Google hoặc email, chúng mình lưu
              địa chỉ email, tên hiển thị và ảnh đại diện (nếu tài khoản Google có). Với đăng nhập
              Google, mã truy cập do Google cấp được lưu để duy trì đăng nhập. Đăng nhập bằng email
              dùng mã một lần, Hẹn Ước không lưu mật khẩu.
            </>,
            <>
              <strong>Phiên đăng nhập:</strong> mỗi phiên đăng nhập lưu kèm địa chỉ IP và loại trình
              duyệt, để bạn và chúng mình nhận ra phiên lạ. Trình duyệt của bạn giữ một cookie đăng
              nhập cho phiên đó.
            </>,
            <>
              <strong>Thông tin đám cưới:</strong> tên cô dâu, chú rể, tên bố mẹ hai bên (nếu bạn
              điền), địa chỉ nhà trai, nhà gái, ngày giờ và địa điểm các buổi lễ, lời mời, thông tin
              tài khoản nhận mừng cưới nếu bạn bật QR mừng cưới.
            </>,
            <>
              <strong>Khách mời:</strong> danh xưng, tên, bên (nhà trai/nhà gái), nhóm, số người
              được mời và số điện thoại (không bắt buộc) do bạn nhập tay hoặc tải lên từ file CSV.
            </>,
            <>
              <strong>Phản hồi RSVP:</strong> khách sẽ đến hay không, số người, buổi lễ tham dự và
              lời nhắn. Với trang cưới chung, khách tự nhập tên và số điện thoại khi xác nhận.
            </>,
            <>
              <strong>Ảnh:</strong> ảnh bìa và ảnh album bạn tải lên.
            </>,
            <>
              <strong>Chống spam:</strong> địa chỉ IP được dùng ở dạng băm để giới hạn số lần gửi
              phản hồi và chặn truy cập bất thường.
            </>,
            <>
              <strong>Lượt bấm liên kết mua sắm:</strong> được ghi nhận gắn với đám cưới để thống
              kê, không kèm tên khách.
            </>,
          ]}
        />
        <p>
          Khi bạn thử tạo thiệp mà chưa đăng nhập, bản nháp chỉ nằm trong trình duyệt trên máy bạn.
          Bản nháp chỉ được gửi lên máy chủ khi bạn đăng nhập và bấm lưu.
        </p>
      </LegalSection>

      <LegalSection title="2. Chúng mình dùng thông tin để làm gì">
        <LegalList
          items={[
            "Hiển thị thiệp cưới và lời mời riêng cho đúng khách.",
            "Ghi nhận và tổng hợp phản hồi tham dự để hai bạn xem trong trang quản lý.",
            "Gửi email đăng nhập và email thông báo phản hồi (nếu bạn bật).",
            "Giữ dịch vụ an toàn: chống spam, chống dò link, xử lý sự cố.",
          ]}
        />
        <p>
          Chúng mình không đưa tên khách, số điện thoại hay mã lời mời vào công cụ thống kê truy
          cập, vào ảnh xem trước khi chia sẻ link hay vào tiêu đề trang. Nhật ký kỹ thuật của máy
          chủ có thể ghi địa chỉ truy cập và được lưu có thời hạn để xử lý sự cố.
        </p>
      </LegalSection>

      <LegalSection title="3. Nơi lưu trữ và bên thứ ba">
        <p>
          Hẹn Ước dùng một số nhà cung cấp bên ngoài để vận hành dịch vụ. Một số máy chủ có thể đặt
          ngoài Việt Nam. Các nhóm nhà cung cấp gồm:
        </p>
        <LegalList
          items={[
            "Dịch vụ đăng nhập Google (khi bạn chọn đăng nhập bằng Google).",
            "Hạ tầng máy chủ và cơ sở dữ liệu.",
            "Kho lưu trữ ảnh và mạng phân phối nội dung (CDN) để ảnh tải nhanh.",
            "Dịch vụ gửi email.",
            "Công cụ thống kê truy cập.",
            "Mạng tiếp thị liên kết ACCESSTRADE và sàn Shopee (cho gợi ý mua sắm).",
          ]}
        />
        <p>
          Khi bạn bấm vào một sản phẩm gợi ý, bạn rời Hẹn Ước sang trang của bên bán; từ lúc đó
          chính sách bảo mật của bên đó được áp dụng.
        </p>
      </LegalSection>

      <LegalSection title="4. Chúng mình không bán dữ liệu">
        <p>
          Hẹn Ước không bán, không cho thuê thông tin của bạn hay của khách mời. Dữ liệu chỉ được
          chia sẻ với các nhà cung cấp nêu trên trong phạm vi cần để vận hành dịch vụ, hoặc khi có
          yêu cầu hợp lệ từ cơ quan có thẩm quyền.
        </p>
      </LegalSection>

      <LegalSection title="5. Ai xem được thiệp của bạn">
        <LegalList
          items={[
            "Trang cưới chung: ai có link đều xem được. Trang này không hiện tên khách.",
            "Thiệp riêng của từng khách dùng một mã ngẫu nhiên, khó đoán. Khách chỉ thấy lời mời của mình.",
            "Link thiệp riêng được đánh dấu để Google không đưa vào kết quả tìm kiếm, và không nằm trong sơ đồ trang (sitemap).",
            "Bạn có thể thu hồi một link bất kỳ; sau đó thiệp không mở được bằng link đó nữa. Tuy vậy, nội dung và ảnh người nhận đã từng xem có thể vẫn còn trong bộ nhớ đệm của trình duyệt hoặc ứng dụng của họ.",
          ]}
        />
        <p>
          Lưu ý: ai cầm được link thì mở được thiệp đó, vì vậy hai bạn chỉ nên gửi link cho đúng
          người được mời.
        </p>
      </LegalSection>

      <LegalSection title="6. Bảo vệ dữ liệu">
        <p>
          Kết nối tới henuoc.com được mã hoá. Mã lời mời được băm và mã hoá trước khi lưu. Chỉ chủ
          đám cưới và người được mời cùng quản lý mới xem được danh sách khách và phản hồi. Không có
          hệ thống nào an toàn tuyệt đối, nhưng chúng mình cố gắng chỉ giữ dữ liệu ở mức cần thiết.
        </p>
      </LegalSection>

      <LegalSection title="7. Thời gian lưu trữ">
        <p>
          Dữ liệu tài khoản và đám cưới được giữ cho đến khi bạn xoá. Thời gian thiệp còn hiển thị
          sau ngày cưới sẽ được công bố trong bản chính thức của chính sách này.
        </p>
      </LegalSection>

      <LegalSection title="8. Quyền của bạn">
        <LegalList
          items={[
            "Xem và sửa thông tin đám cưới, danh sách khách trong trang quản lý.",
            "Xoá từng khách, từng ảnh, hoặc xoá cả tài khoản.",
            "Khi bạn xoá tài khoản, dữ liệu đám cưới, khách mời và phản hồi được xoá khỏi hệ thống chính; ảnh đã tải lên sẽ được xoá khỏi kho lưu trữ. Bản sao lưu được xoay vòng và tự hết hạn sau một thời gian.",
            "Nếu bạn là khách mời và muốn gỡ thông tin của mình, hãy báo cho cặp đôi đã mời bạn, vì họ là người quản lý danh sách khách.",
          ]}
        />
      </LegalSection>

      <LegalSection title="9. Thay đổi chính sách">
        <p>
          Khi chính sách thay đổi, chúng mình cập nhật ngày ở đầu trang. Với thay đổi quan trọng,
          chúng mình sẽ báo trong trang quản lý hoặc qua email.
        </p>
      </LegalSection>

      <LegalSection title="10. Liên hệ">
        <p>
          Kênh hỗ trợ chính thức sẽ được công bố tại trang{" "}
          <LegalLink href="/lien-he">Liên hệ</LegalLink> khi ra mắt. Xem thêm{" "}
          <LegalLink href="/dieu-khoan">Điều khoản sử dụng</LegalLink>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
