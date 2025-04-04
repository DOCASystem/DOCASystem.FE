"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "./heart-svg";
import { useAuthContext } from "@/contexts/auth-provider";
import Link from "next/link";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, userData, logout } = useAuthContext();

  const toggleDropdown = () => {
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

  const isAdmin = userData?.username === "admin";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    if (isAdmin) {
      router.push("/admin");
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
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 text-sm text-gray-700 border-b">
                  <p className="font-medium text-base">
                    {userData?.fullName || userData?.username}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {userData?.phoneNumber}
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
                {/* <Link
                  href={
                    isAdmin ? "/orders-management" : "/profile?tab=don-hang"
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Đơn hàng
                </Link> */}
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
