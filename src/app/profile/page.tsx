"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-provider";
import Image from "next/image";
import AuthGuard from "../components/auth-guard";

// Component con để sử dụng useSearchParams
function ProfileContent() {
  const { userData, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState("thong-tin");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Xử lý tham số tab từ URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Chuyển hướng nếu là admin
  useEffect(() => {
    if (userData?.username === "admin") {
      router.push("/admin");
    }
  }, [userData, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Thông tin tài khoản
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <Image
                src="/images/avatar-placeholder.png"
                alt="Avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback khi lỗi hình ảnh
                  e.currentTarget.src = "https://via.placeholder.com/128";
                }}
              />
            </div>
            <h2 className="text-xl font-semibold">
              {userData?.fullName || userData?.username}
            </h2>
            <p className="text-gray-500">{userData?.phoneNumber}</p>
          </div>

          <nav className="space-y-2">
            <button
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "thong-tin"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("thong-tin");
                router.push("/profile?tab=thong-tin");
              }}
            >
              Thông tin cá nhân
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "don-hang"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("don-hang");
                router.push("/profile?tab=don-hang");
              }}
            >
              Đơn hàng của tôi
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "dia-chi"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("dia-chi");
                router.push("/profile?tab=dia-chi");
              }}
            >
              Địa chỉ giao hàng
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "doi-mat-khau"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveTab("doi-mat-khau");
                router.push("/profile?tab=doi-mat-khau");
              }}
            >
              Đổi mật khẩu
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </nav>
        </div>

        {/* Nội dung tab */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
          {activeTab === "thong-tin" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {userData?.fullName || "Chưa cập nhật"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đăng nhập
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {userData?.username}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {userData?.phoneNumber || "Chưa cập nhật"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {userData?.username || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>
                <button className="mt-4 bg-pink-doca text-white px-6 py-2 rounded-md hover:bg-pink-600">
                  Cập nhật thông tin
                </button>
              </div>
            </div>
          )}

          {activeTab === "don-hang" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Đơn hàng của tôi</h3>
              <div className="text-gray-500 text-center py-10">
                Bạn chưa có đơn hàng nào.
              </div>
            </div>
          )}

          {activeTab === "dia-chi" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h3>
              <div className="text-gray-500 text-center py-10">
                Bạn chưa có địa chỉ giao hàng nào.
              </div>
              <button className="mt-4 bg-pink-doca text-white px-6 py-2 rounded-md hover:bg-pink-600">
                Thêm địa chỉ mới
              </button>
            </div>
          )}

          {activeTab === "doi-mat-khau" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Đổi mật khẩu</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-doca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-doca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-doca"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-pink-doca text-white px-6 py-2 rounded-md hover:bg-pink-600"
                >
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component chính với Suspense
export default function ProfilePage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="container mx-auto py-10 px-4 text-center">
            Đang tải...
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </AuthGuard>
  );
}
