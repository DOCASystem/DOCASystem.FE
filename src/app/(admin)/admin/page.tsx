"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth-provider";
import Link from "next/link";

export default function AdminPage() {
  const { userData } = useAuthContext();

  const adminCards = [
    {
      id: 1,
      title: "Quản lý Sản phẩm",
      description: "Thêm, sửa, xóa sản phẩm",
      link: "/products-management",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Quản lý Blog",
      description: "Quản lý các bài viết blog",
      link: "/blog-management",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Quản lý Đơn hàng",
      description: "Xem và cập nhật đơn hàng",
      link: "/orders-management",
      color: "bg-yellow-500",
    },
    {
      id: 4,
      title: "Quản lý Người dùng",
      description: "Quản lý tài khoản người dùng",
      link: "/users-management",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-gray-600">
            Xin chào,{" "}
            <span className="font-semibold">{userData?.username}</span>!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card) => (
          <Link
            href={card.link}
            key={card.id}
            className="block transition-transform hover:scale-105"
          >
            <div
              className={`${card.color} rounded-lg p-6 text-white shadow-lg h-full`}
            >
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-white/80">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="p-8 text-center text-gray-500">
            Không có hoạt động nào gần đây.
          </div>
        </div>
      </div>
    </div>
  );
}
