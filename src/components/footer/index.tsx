import LogoDoca from "../common/logo/logo-doca";
import FooterColumn from "./footer-column";
import FooterIcon from "./footer-icon";
import Link from "../common/link/link";

const color = "hover:text-[#F36]";

export default function Footer() {
  return (
    <footer className="px-4 py-8 md:p-10 border-t border-gray-300 bg-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col gap-8 md:gap-5 lg:flex-row lg:justify-between">
          {/* Logo và thông tin */}
          <div className="flex flex-col w-full lg:w-[349px] gap-4 md:gap-7">
            <LogoDoca />
            <p className="text-sm md:text-base">
              Chúng mình cung cấp đa dạng các sản phẩm thức ăn thú cưng với chất
              lượng cao. Qua đó giúp đỡ các bé có hoàn cảnh khó khăn cần được
              giúp đỡ tại Trạm cứu hộ chó mèo Sài Gòn Time.
            </p>
            <div className="flex flex-row gap-5">
              <FooterIcon
                href="https://www.facebook.com/alodoca"
                src="/icons/fb.png"
              />
              {/* <FooterIcon href="#!" src="/icons/ig.png" />
              <FooterIcon href="#!" src="/icons/youtube.png" /> */}
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 mt-6 lg:mt-0">
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
              <p className="text-sm md:text-base">083 722 0173</p>
              <p className="text-sm md:text-base">alodocafpt@gmail.com</p>
            </FooterColumn>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-xs md:text-sm text-gray-600">
            © 2024 DOCA Pet Shop. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
