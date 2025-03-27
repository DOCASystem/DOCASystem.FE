import { useState, useEffect, useCallback } from "react";
import orderService, { Order } from "@/service/order-service";

interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const useOrders = (token: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    size: 30,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchOrders = useCallback(
    async (page = 1, size = 30) => {
      if (!token) {
        setError("Không có token xác thực. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      console.log("Fetching orders with token:", token);

      setLoading(true);
      setError(null);

      try {
        const data = await orderService.getAllOrders(token, page, size);
        setOrders(data);

        // Cập nhật thông tin phân trang nếu có
        if (data && data.length > 0) {
          // Lưu ý: Cần kiểm tra cấu trúc response thực tế để cập nhật phân trang
          setPagination((prev) => ({
            ...prev,
            page,
            size,
          }));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi khi tải dữ liệu đơn hàng";
        setError(errorMessage);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchOrders(pagination.page, pagination.size);
    }
  }, [fetchOrders, token, pagination.page, pagination.size]);

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      if (!token) {
        setError("Không có token xác thực. Vui lòng đăng nhập lại.");
        return null;
      }

      try {
        const updatedOrder = await orderService.updateOrderStatus(
          orderId,
          newStatus,
          token
        );

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? updatedOrder : order
          )
        );

        return updatedOrder;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Lỗi khi cập nhật trạng thái đơn hàng";
        setError(errorMessage);
        console.error("Error updating order status:", err);
        return null;
      }
    },
    [token]
  );

  // Thêm phương thức thay đổi trang
  const changePage = useCallback((newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    pagination,
    changePage,
  };
};

export default useOrders;
