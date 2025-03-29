"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthService from "@/service/auth.service";
import { LoginResponse } from "@/api/generated";

interface UserData extends Partial<LoginResponse> {
  avatar?: string;
}

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Lấy thông tin người dùng khi component mount
    const userInfo = AuthService.getUserData();
    setUserData(userInfo);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Nếu chưa đăng nhập, hiển thị nút đăng nhập
  if (!userData) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-pink-doca font-medium hover:text-pink-700"
        >
          Đăng nhập
        </Link>
        <Link
          href="/signup"
          className="bg-pink-doca text-white px-4 py-2 rounded-md hover:bg-pink-700"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-300">
          {userData.avatar ? (
            <Image
              src={userData.avatar}
              alt="Avatar"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-pink-100 flex items-center justify-center text-pink-doca">
              {userData.fullName?.charAt(0) ||
                userData.username?.charAt(0) ||
                "U"}
            </div>
          )}
        </div>
        <span className="text-sm font-medium">
          {userData.fullName || userData.username}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Thông tin tài khoản
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Quản lý
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
