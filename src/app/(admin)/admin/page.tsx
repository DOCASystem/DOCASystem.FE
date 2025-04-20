"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/contexts/auth-provider";
import Link from "next/link";
import Image from "next/image";
import useOrderAnalytics from "@/hooks/use-order-analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mảng màu cho biểu đồ
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#2FDF84",
  "#FF5A5A",
];

// Format số
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Format tiền VND
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function AdminPage() {
  const { userData } = useAuthContext();
  const [viewMode, setViewMode] = useState<"week" | "month" | "year">("week");

  // Sử dụng hook để lấy dữ liệu phân tích
  const {
    weeklyData,
    monthlyData,
    yearlyData,
    totalOrders,
    totalRevenue,
    loading,
    error,
  } = useOrderAnalytics(userData?.token || undefined);

  // Chọn dữ liệu hiển thị theo chế độ xem
  const getChartData = () => {
    switch (viewMode) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  // Kiểm tra nếu không có dữ liệu
  const hasNoData = getChartData().length === 0;

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

  // Tạo mục tóm tắt thống kê
  const statCards = [
    {
      title: "Tổng đơn hàng",
      value: formatNumber(totalOrders),
      icon: (
        <svg
          className="h-8 w-8 text-pink-doca"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path
            fillRule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      link: "/orders-management",
    },
    {
      title: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      icon: (
        <svg
          className="h-8 w-8 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      link: "/orders-management",
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

      {/* Thống kê tóm tắt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link
            href={card.link}
            key={index}
            className={`${card.bgColor} rounded-lg border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                  {card.value}
                </p>
              </div>
              <div className="rounded-full p-3 bg-white shadow-sm">
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Biểu đồ thống kê đơn hàng */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Thống kê doanh thu theo thời gian
          </h2>

          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                viewMode === "week"
                  ? "bg-pink-doca text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              Theo tuần
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                viewMode === "month"
                  ? "bg-pink-doca text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => setViewMode("year")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                viewMode === "year"
                  ? "bg-pink-doca text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              Theo năm
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p className="font-medium">Lỗi khi tải dữ liệu:</p>
            <p>{error}</p>
          </div>
        ) : hasNoData ? (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              Không có dữ liệu thống kê nào
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Sau khi có đơn hàng mới, dữ liệu sẽ xuất hiện ở đây
            </p>
          </div>
        ) : (
          <>
            {/* Biểu đồ chính */}
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === "year" ? (
                  <BarChart
                    data={getChartData()}
                    margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={60}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("vi-VN").format(value)
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                        "Doanh thu",
                      ]}
                      labelStyle={{ color: "#111827" }}
                      contentStyle={{
                        borderRadius: "0.375rem",
                        boxShadow:
                          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        padding: "0.5rem 1rem",
                      }}
                    />
                    <Bar dataKey="value" fill="#F472B6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart
                    data={getChartData()}
                    margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FB7185"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FB7185"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={60}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("vi-VN").format(value)
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                        "Doanh thu",
                      ]}
                      labelStyle={{ color: "#111827" }}
                      contentStyle={{
                        borderRadius: "0.375rem",
                        boxShadow:
                          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        padding: "0.5rem 1rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#FB7185"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Biểu đồ hình tròn ở dưới */}
            {getChartData().length > 0 && (
              <div className="pt-8 mt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Tỷ lệ doanh thu theo{" "}
                  {viewMode === "week"
                    ? "tuần"
                    : viewMode === "month"
                    ? "tháng"
                    : "năm"}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {getChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Doanh thu",
                        ]}
                        contentStyle={{
                          borderRadius: "0.375rem",
                          boxShadow:
                            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                          padding: "0.5rem 1rem",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
