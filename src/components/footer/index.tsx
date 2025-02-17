import LogoDoca from "../common/logo/logo-doca";
import FooterColumn from "./footer-column";
import FooterIcon from "./footer-icon";
import FooterLink from "./footer-link";

export default function Footer() {
  return (
    <footer className="flex flex-row justify-between gap-5 p-10 border-t border-gray-300 bg-gray-100">
      <div className="flex flex-col w-[349px] gap-7">
        <LogoDoca />
        <p>Hành trình mang yêu thương cho những mảnh đời “nhỏ bé”</p>
        <div className="flex flex-row gap-5">
          <FooterIcon href="#!" src="/icons/fb.png" />
          <FooterIcon href="#!" src="/icons/ig.png" />
          <FooterIcon href="#!" src="/icons/youtube.png" />
        </div>
      </div>

      <FooterColumn title="Sản phẩm">
        <FooterLink href="#!">Hàng mới</FooterLink>
        <FooterLink href="#!">Top sản phẩm</FooterLink>
        <FooterLink href="#!">Câu hỏi thường gặp</FooterLink>
      </FooterColumn>

      <FooterColumn title="Chính sách">
        <FooterLink href="#!">Mua hàng</FooterLink>
        <FooterLink href="#!">Đổi trả</FooterLink>
        <FooterLink href="#!">Theo dõi đơn hàng</FooterLink>
      </FooterColumn>

      <FooterColumn title="Công ty">
        <FooterLink href="#!">Về chúng tôi</FooterLink>
        <p>+83 722 0173</p>
        <p>doca.love@gmail.com</p>
      </FooterColumn>
    </footer>
  );
}
