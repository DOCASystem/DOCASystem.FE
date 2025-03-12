"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth-provider";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const { userData } = useAuthContext();

  const adminCards = [
    {
      id: 1,
      title: "Quản lý Sản phẩm",
      description: "Thêm, sửa, xóa sản phẩm",
      link: "/products-management",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      icon: "/icons/product.png",
    },
    {
      id: 2,
      title: "Quản lý Blog",
      description: "Quản lý các bài viết blog",
      link: "/blog-management",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      icon: "/icons/blog.png",
    },
    {
      id: 3,
      title: "Quản lý Đơn hàng",
      description: "Xem và cập nhật đơn hàng",
      link: "/orders-management",
      color: "bg-gradient-to-r from-yellow-500 to-amber-500",
      hoverColor: "from-yellow-600 to-amber-600",
      icon: "/icons/order.png",
    },
    {
      id: 4,
      title: "Quản lý Người dùng",
      description: "Quản lý tài khoản người dùng",
      link: "/users-management",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      icon: "/icons/group-user.png",
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Quản lý toàn bộ hệ thống Doca</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-doca font-bold">
              {userData?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-gray-800 font-medium">
                Xin chào,{" "}
                <span className="font-semibold text-pink-doca">
                  {userData?.username}
                </span>
                !
              </p>
              <p className="text-gray-500 text-sm">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card) => (
          <Link href={card.link} key={card.id} className="block group">
            <div
              className={`${card.color} group-hover:bg-gradient-to-r group-hover:${card.hoverColor} rounded-xl p-6 text-white shadow-lg h-full transform transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <Image
                    src={card.icon}
                    width={28}
                    height={28}
                    alt={card.title}
                  />
                </div>
                <h2 className="text-xl font-bold">{card.title}</h2>
              </div>
              <p className="text-white/90">{card.description}</p>
              <div className="mt-4 flex justify-end">
                <div className="text-white/80 group-hover:text-white flex items-center transition-all">
                  <span>Xem chi tiết</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Hoạt động gần đây</h2>
          <button className="text-pink-doca hover:text-pink-700 text-sm font-medium transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <div className="p-8 text-center text-gray-500">
            <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              Không có hoạt động nào gần đây
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Các hoạt động mới sẽ xuất hiện ở đây
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
