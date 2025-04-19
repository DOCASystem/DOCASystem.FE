"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";
import useAuth from "@/hooks/useAuth";
import useAdminOrders from "@/hooks/use-admin-orders";
import orderService, { OrderItem } from "@/service/order-service";

// Mapping trạng thái từ API sang trạng thái tiếng Việt hiển thị
const statusMapping: Record<string, string> = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipping: "Đang vận chuyển",
  Delivered: "Đã giao hàng",
  Canceled: "Đã hủy",
};

// Số đơn hàng tối đa trên mỗi trang
const ORDERS_PER_PAGE = 5;

export default function AdminOrderPage() {
  const { userData } = useAuth();
  const token = userData?.token || "";
  const {
    orders,
    groupedOrders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    pagination,
    changePage,
    groupBy,
    setGroupBy,
  } = useAdminOrders(token);

  // State cho các dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // State cho modal chi tiết đơn hàng
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);
  const [orderItemsError, setOrderItemsError] = useState<string | null>(null);

  // Đặt lại trang về 1 khi token thay đổi
  useEffect(() => {
    if (token) {
      changePage(1);
    }
  }, [token, changePage]);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const openConfirmDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsConfirmDialogOpen(true);
  };

  // Xác nhận đơn hàng
  const confirmOrder = async () => {
    if (selectedOrderId && token) {
      setIsUpdating(true);

      try {
        const orderToUpdate = orders.find(
          (order) => order.id === selectedOrderId
        );
        if (!orderToUpdate) return;

        const currentStatus = orderToUpdate.status;
        let nextStatus = "";

        // Xác định trạng thái tiếp theo dựa trên trạng thái hiện tại
        switch (currentStatus) {
          case "Pending":
            nextStatus = "Confirmed";
            break;
          case "Confirmed":
            nextStatus = "Shipping";
            break;
          case "Shipping":
            nextStatus = "Delivered";
            break;
          default:
            nextStatus = currentStatus;
        }

        await updateOrderStatus(selectedOrderId, nextStatus);
        await fetchOrders(pagination.page, ORDERS_PER_PAGE);
      } catch (err) {
        console.error("Error updating order status:", err);
      } finally {
        setIsUpdating(false);
        setIsConfirmDialogOpen(false);
        setSelectedOrderId(null);
      }
    }
  };

  const cancelConfirm = () => {
    setIsConfirmDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Mở dialog hủy đơn hàng
  const openCancelDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsCancelDialogOpen(true);
  };

  // Hủy đơn hàng
  const confirmCancel = async () => {
    if (selectedOrderId && token) {
      setIsUpdating(true);

      try {
        await updateOrderStatus(selectedOrderId, "Canceled");
        await fetchOrders(pagination.page, ORDERS_PER_PAGE);
      } catch (err) {
        console.error("Error canceling order:", err);
      } finally {
        setIsUpdating(false);
        setIsCancelDialogOpen(false);
        setSelectedOrderId(null);
      }
    }
  };

  const cancelCancelOrder = () => {
    setIsCancelDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Hàm xử lý xem chi tiết đơn hàng
  const handleViewOrderDetail = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);

    // Lấy chi tiết đơn hàng khi mở modal
    setLoadingOrderItems(true);
    setOrderItemsError(null);

    try {
      const items = await orderService.getOrderItems(orderId, token);
      setOrderItems(items);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      setOrderItemsError(
        err instanceof Error
          ? err.message
          : "Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau."
      );
    } finally {
      setLoadingOrderItems(false);
    }
  };

  // Đóng modal chi tiết đơn hàng
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(null);
    setOrderItems([]);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý khi click outside modal để đóng
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeDetailModal();
    }
  };

  // Lấy màu theo trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-600";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-600";
      case "Shipping":
        return "bg-purple-100 text-purple-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Canceled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getNextStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Xác nhận";
      case "Confirmed":
        return "Vận chuyển";
      case "Shipping":
        return "Đã giao";
      default:
        return "";
    }
  };

  // Hiển thị giá trị nếu có, hoặc "Chưa cập nhật" nếu giá trị là null
  const displayValue = (value: string | null | undefined) => {
    return value || "Chưa cập nhật";
  };

  // Hàm chọn dữ liệu theo nhóm thời gian
  const getGroupedData = useCallback(() => {
    switch (groupBy) {
      case "week":
        return Array.from(groupedOrders.byWeek.entries());
      case "month":
        return Array.from(groupedOrders.byMonth.entries());
      case "year":
        return Array.from(groupedOrders.byYear.entries());
      default:
        return Array.from(groupedOrders.byWeek.entries());
    }
  }, [groupBy, groupedOrders]);

  // Fetch lại dữ liệu với số đơn hàng giới hạn
  useEffect(() => {
    if (token) {
      fetchOrders(pagination.page, ORDERS_PER_PAGE);
    }
  }, [token, fetchOrders]);

  // Đã có auth-guard ở layout admin nên không cần kiểm tra lại ở đây
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-doca"></div>
      </div>
    );
  }

  if (error && error.length > 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchOrders(pagination.page, ORDERS_PER_PAGE)}
          className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const groupedData = getGroupedData();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-pink-doca">
          Quản Lý Đơn Hàng
        </h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Nhóm theo:</span>
          <select
            value={groupBy}
            onChange={(e) =>
              setGroupBy(e.target.value as "week" | "month" | "year")
            }
            className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-doca transition-all"
          >
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-gray-500 text-lg">Không có đơn hàng nào.</p>
        </div>
      ) : (
        <>
          {groupedData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">
                Không có dữ liệu để hiển thị theo nhóm thời gian này.
              </p>
            </div>
          ) : (
            groupedData.map(([timeGroup, groupOrders]) => (
              <div key={timeGroup} className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 p-3 bg-gray-50 rounded-t-lg border-b border-gray-200">
                  {timeGroup}{" "}
                  <span className="text-pink-doca">
                    ({groupOrders.length} đơn hàng)
                  </span>
                </h2>

                {groupOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Mã đơn:{" "}
                            <span className="text-pink-doca">{order.id}</span>
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {statusMapping[order.status] || order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.formattedDate} • {order.formattedTime}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-pink-doca">
                        {order.total.toLocaleString()}đ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Thông tin khách hàng
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Tên</p>
                            <p className="text-sm font-medium">
                              {order.customerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Số điện thoại
                            </p>
                            <p className="text-sm font-medium">
                              {order.customerPhone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Địa chỉ</p>
                          <p className="text-sm">
                            {displayValue(order.address)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewOrderDetail(order.id)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-all"
                      >
                        Xem chi tiết
                      </button>

                      {order.status !== "Delivered" &&
                        order.status !== "Canceled" && (
                          <button
                            onClick={() => openConfirmDialog(order.id)}
                            className="px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-all"
                            disabled={isUpdating}
                          >
                            {getNextStatusText(order.status)}
                          </button>
                        )}

                      {order.status !== "Delivered" &&
                        order.status !== "Canceled" && (
                          <button
                            onClick={() => openCancelDialog(order.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-all"
                            disabled={isUpdating}
                          >
                            Hủy đơn
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}

      {/* Thêm phân trang */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Dialog xác nhận đơn hàng */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Xác nhận cập nhật trạng thái"
        message="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?"
        onConfirm={confirmOrder}
        onCancel={cancelConfirm}
        type="info"
      />

      {/* Dialog hủy đơn hàng */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
        onConfirm={confirmCancel}
        onCancel={cancelCancelOrder}
        type="danger"
      />

      {/* Modal Chi tiết đơn hàng */}
      {isDetailModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết đơn hàng #{selectedOrderId}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5"
                onClick={closeDetailModal}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(90vh - 130px)" }}
            >
              {loadingOrderItems ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-doca"></div>
                </div>
              ) : orderItemsError ? (
                <div className="text-red-500 text-center py-8">
                  {orderItemsError}
                </div>
              ) : orderItems.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Không có chi tiết đơn hàng để hiển thị.
                </div>
              ) : (
                <div className="space-y-6">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex flex-col space-y-4">
                        {/* Thông tin chung về mục đơn hàng */}
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <div className="text-sm text-gray-500">
                            Mã mục:{" "}
                            <span className="font-medium text-gray-700">
                              {item.id}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Số lượng:{" "}
                            <span className="font-medium text-gray-700">
                              {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Phần hiển thị thông tin sản phẩm */}
                        {item.product && (
                          <div className="pt-2">
                            <h4 className="text-lg font-semibold mb-3 text-pink-doca">
                              Thông tin sản phẩm
                            </h4>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="w-full md:w-1/3">
                                <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                                  {item.product.productImages?.length > 0 ? (
                                    <Image
                                      src={
                                        item.product.productImages[0]
                                          ?.imageUrl || ""
                                      }
                                      alt={item.product.name}
                                      width={300}
                                      height={300}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      Không có hình ảnh
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h5 className="text-lg font-semibold mb-2">
                                  {item.product.name}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-xs text-gray-500">
                                      Đơn giá
                                    </p>
                                    <p className="font-medium text-gray-700">
                                      {formatCurrency(item.product.price)}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-xs text-gray-500">
                                      Thành tiền
                                    </p>
                                    <p className="font-medium text-pink-doca">
                                      {formatCurrency(
                                        item.product.price * item.quantity
                                      )}
                                    </p>
                                  </div>
                                  {item.product.volume > 0 && (
                                    <div className="bg-gray-50 p-2 rounded">
                                      <p className="text-xs text-gray-500">
                                        Khối lượng
                                      </p>
                                      <p className="font-medium text-gray-700">
                                        {item.product.volume} kg
                                      </p>
                                    </div>
                                  )}
                                  <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-xs text-gray-500">
                                      Kho còn
                                    </p>
                                    <p className="font-medium text-gray-700">
                                      {item.product.quantity} sản phẩm
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-700 mb-1">
                                    Mô tả:
                                  </h6>
                                  <p className="text-gray-600 text-sm">
                                    {item.product.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Phần hiển thị blog liên quan (nếu có) */}
                        {item.blog && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-lg font-semibold mb-3 text-purple-600">
                              Blog liên quan
                            </h4>
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h5 className="font-medium text-purple-800 mb-2">
                                {item.blog.name}
                              </h5>
                              <p className="text-gray-700 text-sm mb-3">
                                {item.blog.description}
                              </p>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                  Ngày tạo:{" "}
                                  {new Date(
                                    item.blog.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                                <span>
                                  Trạng thái:{" "}
                                  {item.blog.isHindden ? "Đã ẩn" : "Hiển thị"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                type="button"
                className="w-full inline-flex justify-center px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 focus:outline-none"
                onClick={closeDetailModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
