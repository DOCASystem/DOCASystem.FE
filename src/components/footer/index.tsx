import LogoDoca from "../common/logo/logo-doca";
import FooterColumn from "./footer-column";
import FooterIcon from "./footer-icon";
import Link from "../common/link/link";

const color = "hover:text-[#F36]";

export default function Footer() {
  return (
    <footer className="flex flex-row justify-between gap-5 p-10 border-t border-gray-300 bg-gray-100">
      <div className="flex flex-col w-[349px] gap-7">
        <LogoDoca />
        <p>Hành trình mang yêu thương cho những mảnh đời “nhỏ bé”</p>
        <div className="flex flex-row gap-5">
          <FooterIcon
            href="https://www.facebook.com/alodoca"
            src="/icons/fb.png"
          />
          {/* <FooterIcon href="#!" src="/icons/ig.png" />
          <FooterIcon href="#!" src="/icons/youtube.png" /> */}
        </div>
      </div>

      <FooterColumn title="Sản phẩm">
        <Link href="#!" className={color}>
          Hàng mới
        </Link>
        <Link href="#!" className={color}>
          Top sản phẩm
        </Link>
        <Link href="#!" className={color}>
          Câu hỏi thường gặp
        </Link>
      </FooterColumn>

      <FooterColumn title="Chính sách">
        <Link href="#!" className={color}>
          Mua hàng
        </Link>
        <Link href="#!" className={color}>
          Đổi trả
        </Link>
        <Link href="#!" className={color}>
          Theo dõi đơn hàng
        </Link>
      </FooterColumn>

      <FooterColumn title="Công ty">
        <Link href="#!" className={color}>
          Về chúng tôi
        </Link>
        <p>083 722 0173</p>
        <p>alodocafpt@gmail.com</p>
      </FooterColumn>
    </footer>
  );
}
