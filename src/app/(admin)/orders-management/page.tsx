"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";
import useOrders from "@/hooks/use-orders";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mapping trạng thái từ API sang trạng thái tiếng Việt hiển thị
const statusMapping: Record<string, string> = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipping: "Đang vận chuyển",
  Delivered: "Đã giao hàng",
  Canceled: "Đã hủy",
};

export default function AdminOrderPage() {
  const { userData } = useAuth();
  const token = userData?.token || "";
  const {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    pagination,
    changePage,
  } = useOrders(token);

  // State cho các dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
        await fetchOrders(pagination.page, pagination.size);
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
        await fetchOrders(pagination.page, pagination.size);
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

  // Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return "Chưa cập nhật";
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
          onClick={() => fetchOrders(pagination.page, pagination.size)}
          className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-pink-doca">Đơn Hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2">
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Không có đơn hàng nào.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col p-4 border-b last:border-b-0 rounded-md my-2 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    Mã đơn hàng: {order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ngày đặt: {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {statusMapping[order.status] || order.status}
                  </span>
                  <span className="text-sm font-semibold">
                    {order.total.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Thông tin khách hàng
                  </h4>
                  <p className="text-sm">
                    Tên: {displayValue(order.member.fullName)}
                  </p>
                  <p className="text-sm">
                    SĐT: {displayValue(order.member.phoneNumber)}
                  </p>
                  <p className="text-sm">
                    Tài khoản: {displayValue(order.member.username)}
                  </p>
                  <p className="text-sm">
                    Địa chỉ: {displayValue(order.address)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Địa chỉ chi tiết
                  </h4>
                  <p className="text-sm">
                    Tỉnh/Thành: {displayValue(order.member.province)}
                  </p>
                  <p className="text-sm">
                    Quận/Huyện: {displayValue(order.member.district)}
                  </p>
                  <p className="text-sm">
                    Phường/Xã: {displayValue(order.member.commune)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-3 space-x-2">
                <Link
                  href={`/orders-management/view?id=${order.id}`}
                  className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
                >
                  Chi tiết
                </Link>

                <Link
                  href={`/orders-management/edit?id=${order.id}`}
                  className="px-4 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
                >
                  Chỉnh sửa
                </Link>

                {order.status !== "Delivered" &&
                  order.status !== "Canceled" && (
                    <button
                      onClick={() => openConfirmDialog(order.id)}
                      className="px-4 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-all"
                      disabled={isUpdating}
                    >
                      {getNextStatusText(order.status)}
                    </button>
                  )}

                {order.status !== "Delivered" &&
                  order.status !== "Canceled" && (
                    <button
                      onClick={() => openCancelDialog(order.id)}
                      className="px-4 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-all"
                      disabled={isUpdating}
                    >
                      Hủy đơn
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Thêm phân trang */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
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
    </div>
  );
}
