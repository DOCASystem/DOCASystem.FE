"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "./heart-svg";
import { useAuthContext } from "@/contexts/auth-provider";
import Link from "next/link";
import AuthService from "@/service/auth.service";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, userData, logout, refreshAuth } = useAuthContext();
  const [localUserData, setLocalUserData] = useState(userData);

  // Cập nhật thông tin người dùng khi mở dropdown hoặc khi component được render
  useEffect(() => {
    if (isAuthenticated) {
      // Tìm nạp thông tin người dùng mới từ localStorage và sessionStorage
      const freshUserData = AuthService.getUserData();
      if (freshUserData) {
        setLocalUserData(freshUserData);
      }
    }
  }, [isOpen, isAuthenticated]);

  // Cập nhật liên tục thông tin người dùng khi isAuthenticated thay đổi
  useEffect(() => {
    if (isAuthenticated) {
      // Gọi refreshAuth để cập nhật context
      refreshAuth();

      // Đồng thời cập nhật state local
      const freshUserData = AuthService.getUserData();
      if (freshUserData) {
        setLocalUserData(freshUserData);
      }

      // Kiểm tra mỗi 2 giây trong 10 giây đầu tiên sau khi đăng nhập
      const checkInterval = setInterval(() => {
        const freshUserData = AuthService.getUserData();
        if (freshUserData) {
          setLocalUserData(freshUserData);
        }
      }, 2000);

      // Dừng kiểm tra sau 10 giây
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 10000);
    } else {
      setLocalUserData(null);
    }
  }, [isAuthenticated, refreshAuth]);

  // Cập nhật localUserData khi userData từ context thay đổi
  useEffect(() => {
    if (userData) {
      setLocalUserData(userData);
    }
  }, [userData]);

  // Lắng nghe sự kiện auth-state-changed từ form đăng nhập
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      console.log("Received auth-state-changed event", event.detail);
      if (event.detail.isAuthenticated) {
        // Làm mới cache trước
        AuthService.resetCache();

        // Làm mới thông tin người dùng trong context
        refreshAuth();

        // Cập nhật trạng thái local
        const freshUserData = AuthService.getUserData();
        if (freshUserData) {
          setLocalUserData(freshUserData);
        } else {
          // Nếu không lấy được từ service, dùng dữ liệu từ event
          setLocalUserData(event.detail.userData);
        }
      }
    };

    // Đăng ký lắng nghe sự kiện
    window.addEventListener(
      "auth-state-changed",
      handleAuthChange as EventListener
    );

    // Lắng nghe thay đổi localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === "auth_last_updated" ||
        event.key === "userData" ||
        event.key === "token"
      ) {
        console.log("Storage changed:", event.key);
        refreshAuth();

        const freshUserData = AuthService.getUserData();
        if (freshUserData) {
          setLocalUserData(freshUserData);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "auth-state-changed",
        handleAuthChange as EventListener
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshAuth]);

  const toggleDropdown = () => {
    // Làm mới thông tin người dùng khi mở dropdown
    if (!isOpen && isAuthenticated) {
      refreshAuth();
      const freshUserData = AuthService.getUserData();
      if (freshUserData) {
        setLocalUserData(freshUserData);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAdmin =
    localUserData?.username === "admin" ||
    (localUserData?.roles && localUserData.roles.includes("ADMIN"));

  // Cấu hình cứng: Luôn xác định người dùng có username "admin" là admin
  if (localUserData?.username?.toLowerCase() === "admin" && !isAdmin) {
    console.log(
      "[UserDropdown] Phát hiện tài khoản admin đặc biệt - hiển thị quyền quản trị"
    );
    // Đây là tài khoản admin đặc biệt
    // Không thay đổi dữ liệu gốc, chỉ đánh dấu là admin để hiển thị UI phù hợp
  }

  const handleLogout = () => {
    // Gọi hàm logout từ context, việc chuyển hướng đã được xử lý bên trong
    logout();
    setIsOpen(false);
    setLocalUserData(null);
  };

  const handleProfileClick = () => {
    if (isAdmin) {
      console.log("Điều hướng admin đến trang quản lý");
      // Thêm timeout để đảm bảo token được cập nhật đầy đủ trước khi điều hướng
      setTimeout(() => {
        router.push("/admin");
      }, 10);
    } else {
      router.push("/profile");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none relative"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserIcon />
        {isAuthenticated && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {isAuthenticated && localUserData ? (
              <>
                <div className="px-4 py-3 text-sm text-gray-700 border-b">
                  <p className="font-medium text-base">
                    {localUserData?.fullName || localUserData?.username}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {localUserData?.phoneNumber}
                  </p>
                  {isAdmin && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                        Quản trị viên
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {isAdmin ? "Bảng điều khiển" : "Thông tin cá nhân"}
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
