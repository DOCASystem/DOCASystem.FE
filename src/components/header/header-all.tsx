"use client"; // Quan trọng khi dùng hooks trong App Router

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoDoca from "../common/logo/logo-doca";
import CartIcon from "../assets/icon-svg/cart-svg";
import UserDropdown from "../assets/icon-svg/user-dropdown";
import LinkNav from "../common/link/link";
import { useAuthContext } from "@/contexts/auth-provider";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Kiểm tra nếu là trang admin thì không hiển thị header
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="py-2 md:py-4 lg:py-6 w-full">
      {/* Top header - contact info - chỉ hiển thị trên màn hình MD và lớn hơn */}
      <div className="hidden md:block container mx-auto px-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            {info.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-black text-sm"
              >
                <Image
                  src={item.icon}
                  alt={item.text}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-black text-sm">
            <Image
              src={info[2].icon}
              alt={info[2].text}
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>{info[2].text}</span>
          </div>
        </div>
      </div>

      {/* Main header - logo, navigation, cart */}
      <div className="container mx-auto px-4">
        <div className="py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-10 flex flex-row justify-between items-center mx-auto bg-white shadow-[0px_16px_12px_0px_rgba(0,0,0,0.03)] rounded-2xl md:rounded-[40px]">
          {/* Logo */}
          <LogoDoca />

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-4 xl:gap-6 text-base xl:text-[20px]/[160%] font-medium">
            {nav.map((item) => {
              const isActive = pathname === item.path;
              return (
                <LinkNav
                  key={item.id}
                  href={item.path}
                  className={`${
                    isActive
                      ? "text-pink-doca underline underline-offset-8"
                      : ""
                  } hover:underline hover:underline-offset-8 hover:text-pink-doca`}
                >
                  {item.text}
                </LinkNav>
              );
            })}
          </div>

          {/* User and Cart Icons */}
          <div className="flex gap-3 md:gap-6">
            <UserDropdown />
            <Link
              href={isAuthenticated ? "/cart" : "/login"}
              className="hover:text-pink-doca"
            >
              <CartIcon />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 px-4 bg-white shadow-md rounded-b-2xl animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              {nav.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`${
                      isActive
                        ? "text-pink-doca font-semibold"
                        : "text-gray-800"
                    } px-4 py-2 rounded-lg hover:bg-gray-50 text-base`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.text}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
