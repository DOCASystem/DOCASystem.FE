"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthService from "@/service/auth.service";
import { LoginResponse } from "@/api/generated";

interface UserData extends Partial<LoginResponse> {
  avatar?: string;
}

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        // Lấy thông tin người dùng từ cache
        console.log("[ProfileMenu] Đang tải thông tin người dùng từ cache");
        const userInfo = AuthService.fetchUserProfile();

        console.log("[ProfileMenu] Thông tin người dùng từ cache:", userInfo);

        if (userInfo && Object.keys(userInfo).length > 0) {
          setUserData(userInfo);
        } else {
          // Nếu không có dữ liệu trong cache, thử lấy trực tiếp từ localStorage
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            try {
              const parsedData = JSON.parse(storedUserData);
              console.log("[ProfileMenu] Dữ liệu từ localStorage:", parsedData);
              setUserData(parsedData);
            } catch (e) {
              console.error(
                "[ProfileMenu] Lỗi khi parse userData từ localStorage:",
                e
              );
            }
          }
        }
      } catch (error) {
        console.error("[ProfileMenu] Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    // Thêm sự kiện lắng nghe thay đổi localStorage để cập nhật UI khi đăng nhập/đăng xuất
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userData" || e.key === "token") {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Chỉ gọi hàm logout của AuthService, việc chuyển hướng đã được tích hợp
    AuthService.logout();
  };

  // Kiểm tra xem người dùng có phải admin không
  const isAdmin = userData?.roles?.includes("ADMIN");

  // Xác định đường dẫn trang quản lý dựa trên vai trò
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";
  const dashboardText = isAdmin ? "Quản trị Admin" : "Quản lý";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  // Hiển thị UI đơn giản khi chưa đăng nhập hoặc dữ liệu không hợp lệ
  if (!userData || Object.keys(userData).length === 0) {
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

  // Lấy chữ cái đầu tiên của tên để hiển thị avatar mặc định
  const firstLetter =
    userData.fullName?.charAt(0) || userData.username?.charAt(0) || "U";

  // Lấy tên hiển thị, đảm bảo luôn có giá trị
  const displayName = userData.fullName || userData.username || "Người dùng";

  console.log("[ProfileMenu] Hiển thị thông tin người dùng:", {
    displayName,
    firstLetter,
    userData,
  });

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
              priority
            />
          ) : (
            <div className="h-full w-full bg-pink-100 flex items-center justify-center text-pink-doca">
              {firstLetter}
            </div>
          )}
        </div>
        <span className="text-sm font-medium">{displayName}</span>
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
            href={dashboardLink}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {dashboardText}
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
