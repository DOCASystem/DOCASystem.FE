"use client"; // Quan trọng khi dùng hooks trong App Router

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoDoca from "../common/logo/logo-doca";
import CartIcon from "../assets/icon-svg/cart-svg";
import HeartIcon from "../assets/icon-svg/heart-svg";
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

const cart = [
  { id: 1, icon: <HeartIcon />, text: "Yêu thích", path: "/#!" },
  { id: 2, icon: <CartIcon />, text: "Giỏ hàng", path: "/#!" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="py-4 md:py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-4 md:gap-6 mb-4 md:mb-0">
          {info.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-black">
              <Image src={item.icon} alt={item.text} width={24} height={24} />
              <span className="text-xs md:text-sm">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-black">
          <Image src={info[2].icon} alt={info[2].text} width={24} height={24} />
          <span className="text-xs md:text-sm">{info[2].text}</span>
        </div>
      </div>

      <div className="container mx-auto mt-4 px-4">
        <div className="py-4 md:py-6 px-4 md:px-10 flex flex-row justify-between items-center bg-white shadow-[0px_16px_12px_0px_rgba(0,0,0,0.03)] rounded-2xl md:rounded-[40px]">
          <LogoDoca />

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex gap-4 lg:gap-6 text-base lg:text-[20px]/[160%] font-medium">
            {nav.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`${
                    isActive
                      ? "text-pink-doca underline underline-offset-8"
                      : ""
                  } hover:underline hover:underline-offset-8 hover:text-pink-doca`}
                >
                  {item.text}
                </Link>
              );
            })}
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="absolute top-36 left-0 right-0 bg-white shadow-md z-50 md:hidden py-4 px-6">
              {nav.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`block py-2 ${
                      isActive ? "text-pink-doca" : ""
                    } hover:text-pink-doca`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.text}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex gap-4 md:gap-6">
            {cart.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="hover:text-pink-doca"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
