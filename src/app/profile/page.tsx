"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-provider";
import Image from "next/image";
import AuthGuard from "../components/auth-guard";
import Link from "next/link";
import { showToast } from "@/components/common/toast/toast";
import orderService, { Order } from "@/service/order-service";
import OrderDetailModal from "./order-detail-modal";

// Component con để sử dụng useSearchParams
function ProfileContent() {
  const { userData, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState("thong-tin");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // State cho modal xem chi tiết đơn hàng
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  // Memoize hàm fetchOrders để có thể gọi lại khi cần thiết
  const fetchOrders = useCallback(async () => {
    // Kiểm tra token từ userData hoặc từ localStorage
    const token = userData?.token || localStorage.getItem("token");
    const authData = localStorage.getItem("doca-auth-storage");
    let parsedToken = token;

    if (!token && authData) {
      try {
        const parsedData = JSON.parse(authData);
        parsedToken = parsedData.state?.userData?.token;
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }

    if (!parsedToken) {
      setOrderError("Vui lòng đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setOrderError(null);
      const response = await orderService.getAllOrders(
        parsedToken,
        currentPage
      );

      setOrders(response.items || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setRetryCount(0); // Reset retry count khi thành công
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể tải đơn hàng. Vui lòng thử lại sau.";

      setOrderError(errorMessage);

      // Nếu lỗi timeout hoặc lỗi mạng và số lần thử lại chưa vượt quá 2
      if (retryCount < 2) {
        setRetryCount((prev) => prev + 1);
        setTimeout(fetchOrders, 2000); // Thử lại sau 2 giây
        setOrderError("Đang kết nối lại...");
      }
    } finally {
      setLoading(false);
    }
  }, [userData, currentPage, retryCount]);

  // Lấy danh sách đơn hàng khi tab đơn hàng được chọn hoặc trang thay đổi
  useEffect(() => {
    if (activeTab === "don-hang") {
      fetchOrders();
    }
  }, [activeTab, currentPage, fetchOrders]);

  // Hàm chuyển tab và đảm bảo reload dữ liệu khi chọn tab đơn hàng
  const handleTabChange = (tab: string) => {
    if (tab === activeTab) {
      // Nếu tab hiện tại đã được chọn và là tab đơn hàng, reload dữ liệu
      if (tab === "don-hang") {
        setOrders([]);
        setCurrentPage(1);
        setLoading(true);
        setRetryCount(0);
        setTimeout(fetchOrders, 100);
      }
    } else {
      setActiveTab(tab);
      router.push(`/profile?tab=${tab}`);

      // Nếu chọn tab đơn hàng, reset dữ liệu và trang hiện tại
      if (tab === "don-hang") {
        setOrders([]);
        setCurrentPage(1);
        setLoading(true);
        setRetryCount(0);
      }
    }
  };

  const handleLogout = () => {
    // Gọi hàm logout từ context, việc chuyển hướng đã được xử lý trong AuthService
    logout();
  };

  const handleUpdateInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    showToast("Liên hệ Admin để thay đổi thông tin");
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  // Xử lý thử lại khi không tải được đơn hàng
  const handleRetryFetchOrders = () => {
    setRetryCount(0);
    setLoading(true);
    fetchOrders();
  };

  // Định dạng ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Định dạng số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Chuyển đổi trạng thái đơn hàng sang tiếng Việt
  const getOrderStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Lấy màu cho trạng thái đơn hàng
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Xử lý xem chi tiết đơn hàng
  const handleViewOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  // Lấy token để gọi API chi tiết đơn hàng
  const getToken = () => {
    const token = userData?.token || localStorage.getItem("token");
    const authData = localStorage.getItem("doca-auth-storage");

    if (token) return token;

    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        return parsedData.state?.userData?.token || "";
      } catch (e) {
        console.error("Error parsing auth data:", e);
        return "";
      }
    }

    return "";
  };

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Thông tin tài khoản
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-0 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gray-200 lg:mb-4 overflow-hidden shrink-0">
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
            <div className="lg:text-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                {userData?.fullName || userData?.username}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                {userData?.phoneNumber}
              </p>
            </div>
          </div>

          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            <button
              className={`text-left px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
                activeTab === "thong-tin"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("thong-tin")}
            >
              Thông tin cá nhân
            </button>
            <button
              className={`text-left px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
                activeTab === "don-hang"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("don-hang")}
            >
              Đơn hàng của tôi
            </button>
            <button
              className={`text-left px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
                activeTab === "dia-chi"
                  ? "bg-pink-doca text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("dia-chi")}
            >
              Địa chỉ giao hàng
            </button>
            <button
              className="text-left px-3 sm:px-4 py-2 rounded-md text-red-500 hover:bg-red-50 text-sm sm:text-base"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </nav>
          <Link
            href="/"
            className="w-full block text-center mt-4 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            Quay về trang chủ
          </Link>
        </div>

        {/* Nội dung tab */}
        <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-md p-4 sm:p-6">
          {activeTab === "thong-tin" && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Thông tin cá nhân
              </h3>
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
                <button
                  className="mt-4 bg-pink-doca text-white px-4 sm:px-6 py-2 rounded-md hover:bg-pink-600 text-sm sm:text-base"
                  onClick={handleUpdateInfo}
                >
                  Cập nhật thông tin
                </button>
              </div>
            </div>
          )}

          {activeTab === "don-hang" && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Đơn hàng của tôi
              </h3>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-doca mb-4"></div>
                  <p className="text-gray-500">Đang tải đơn hàng...</p>
                </div>
              ) : orderError ? (
                <div className="text-red-500 text-center py-10">
                  <p className="mb-4">{orderError}</p>
                  {retryCount >= 2 && (
                    <button
                      onClick={handleRetryFetchOrders}
                      className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 text-sm"
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-gray-500 text-center py-10">
                  <p className="mb-4">Bạn chưa có đơn hàng nào.</p>
                  <Link
                    href="/"
                    className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 text-sm"
                  >
                    Mua hàng ngay
                  </Link>
                </div>
              ) : (
                <>
                  {/* Hiển thị bảng cho desktop và tablet */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Mã đơn hàng
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ngày đặt
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tổng tiền
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Địa chỉ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Trạng thái
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Chi tiết
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {formatCurrency(order.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {getOrderStatusText(order.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleViewOrderDetail(order.id)}
                                className="text-pink-doca hover:text-pink-700 font-medium"
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Hiển thị cards cho mobile */}
                  <div className="md:hidden space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.substring(0, 8)}...
                          </div>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày đặt:</span>
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Địa chỉ:</span>
                            <span className="text-right flex-1 ml-2">
                              {order.address}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tổng tiền:</span>
                            <span className="font-medium">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewOrderDetail(order.id)}
                          className="mt-3 w-full text-center px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 text-sm"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Phân trang */}
                  {totalPages > 1 && (
                    <div className="flex flex-col items-center mt-6">
                      <div className="text-sm text-gray-500 mb-3">
                        Hiển thị{" "}
                        <span className="font-medium">{orders.length}</span> /{" "}
                        <span className="font-medium">{totalItems}</span> đơn
                        hàng
                        {orders.length > 0 && (
                          <>
                            {" "}
                            - Trang{" "}
                            <span className="font-medium">
                              {currentPage}
                            </span> /{" "}
                            <span className="font-medium">{totalPages}</span>
                          </>
                        )}
                      </div>

                      <nav className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="hidden sm:inline">Đầu</span>
                          <span className="sm:hidden">&laquo;</span>
                        </button>

                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="hidden sm:inline">Trước</span>
                          <span className="sm:hidden">&lt;</span>
                        </button>

                        {totalPages <= 5 ? (
                          // Hiển thị tất cả các trang nếu ít hơn hoặc bằng 5 trang
                          [...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => handlePageChange(index + 1)}
                              className={`px-3 py-1 rounded-md text-sm ${
                                currentPage === index + 1
                                  ? "bg-pink-doca text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))
                        ) : (
                          // Hiển thị một phạm vi trang khi có nhiều trang
                          <>
                            {currentPage > 2 && (
                              <button
                                onClick={() => handlePageChange(1)}
                                className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                              >
                                1
                              </button>
                            )}

                            {currentPage > 3 && (
                              <span className="px-2 py-1 text-gray-500">
                                ...
                              </span>
                            )}

                            {/* Trang trước trang hiện tại */}
                            {currentPage > 1 && (
                              <button
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {currentPage - 1}
                              </button>
                            )}

                            {/* Trang hiện tại */}
                            <button className="px-3 py-1 rounded-md text-sm bg-pink-doca text-white">
                              {currentPage}
                            </button>

                            {/* Trang sau trang hiện tại */}
                            {currentPage < totalPages && (
                              <button
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {currentPage + 1}
                              </button>
                            )}

                            {currentPage < totalPages - 2 && (
                              <span className="px-2 py-1 text-gray-500">
                                ...
                              </span>
                            )}

                            {currentPage < totalPages - 1 && (
                              <button
                                onClick={() => handlePageChange(totalPages)}
                                className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {totalPages}
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="hidden sm:inline">Sau</span>
                          <span className="sm:hidden">&gt;</span>
                        </button>

                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="hidden sm:inline">Cuối</span>
                          <span className="sm:hidden">&raquo;</span>
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "dia-chi" && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Địa chỉ giao hàng
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-48 lg:h-48 flex-shrink-0 mb-3 sm:mb-0">
                    <Image
                      src="/icons/saigon-time-icon.png"
                      alt="Saigon Time"
                      width={650}
                      height={650}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="text-center sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 mb-1">
                      <h4 className="font-medium text-base sm:text-lg">
                        Trạm Cứu Hộ Chó Mèo Saigontime
                      </h4>
                      <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                        Mặc định
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Đây là địa chỉ giao hàng mặc định. Không thể thay đổi hoặc
                      thêm địa chỉ khác.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Chi tiết đơn hàng */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        token={getToken()}
      />
    </div>
  );
}

// Component chính với Suspense
export default function ProfilePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </AuthGuard>
  );
}
