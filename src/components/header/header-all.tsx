"use client"; // Quan trọng khi dùng hooks trong App Router

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoDoca from "../common/logo/logo-doca";
import CartIcon from "../assets/icon-svg/cart-svg";
import UserDropdown from "../assets/icon-svg/user-dropdown";
import LinkNav from "../common/link/link";
import { useAuthContext } from "@/contexts/auth-provider";

const info = [
  { id: 1, icon: "/icons/phone.png", text: "083 722 0173" },
  { id: 2, icon: "/icons/mail.png", text: "alodocafpt@gmail.com" },
  { id: 3, icon: "/icons/map-pin.png", text: "Quận 9, Việt Nam" },
];

const nav = [
  { id: 1, text: "Trang chủ", path: "/" },
  { id: 2, text: "Sản phẩm", path: "/shop" },
  { id: 3, text: "Blog", path: "/blog" },
  { id: 4, text: "Về chúng tôi", path: "/about-us" },
  { id: 5, text: "Liên hệ", path: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();

  // Kiểm tra nếu là trang admin thì không hiển thị header
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="w-[1300px] mx-auto flex flex-row justify-between items-center">
        <div className="flex gap-6">
          {info.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-black">
              <Image src={item.icon} alt={item.text} width={24} height={24} />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-black">
          <Image src={info[2].icon} alt={info[2].text} width={24} height={24} />
          <span className="text-sm">{info[2].text}</span>
        </div>
      </div>

      <div className="w-[1300px] py-6 px-10 flex flex-row justify-between items-center mx-auto bg-white shadow-[0px_16px_12px_0px_rgba(0,0,0,0.03)] rounded-[40px]">
        <LogoDoca />
        <div className="flex gap-6 text-[20px]/[160%] font-[550px]">
          {nav.map((item) => {
            const isActive = pathname === item.path;
            return (
              <LinkNav
                key={item.id}
                href={item.path}
                className={`${
                  isActive ? "text-pink-doca underline underline-offset-8" : ""
                } hover:underline hover:underline-offset-8 hover:text-pink-doca`}
              >
                {item.text}
              </LinkNav>
            );
          })}
        </div>

        <div className="flex gap-6">
          <UserDropdown />
          <Link
            href={isAuthenticated ? "/cart" : "/login"}
            className="hover:text-pink-doca"
          >
            <CartIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
