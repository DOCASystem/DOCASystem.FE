import { useState, useEffect, useCallback } from "react";
import orderService, { Order, OrderResponse } from "@/service/order-service";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Extend Member interface để thêm trường user
interface ExtendedMember {
  id: string;
  userId: string;
  username: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  commune: string | null;
  district: string | null;
  province: string | null;
  address: string | null;
  provinceCode: string | null;
  districtCode: string | null;
  communeCode: string | null;
  user?: {
    id: string;
    username: string | null;
    phoneNumber: string | null;
    fullName: string | null;
    role: number;
  } | null;
}

// Interface cho đơn hàng đã được format
export interface FormattedOrder extends Omit<Order, "member"> {
  member: ExtendedMember;
  formattedDate: string;
  formattedTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

// Interface cho kết quả group theo thời gian
export interface GroupedOrders {
  byWeek: Map<string, FormattedOrder[]>;
  byMonth: Map<string, FormattedOrder[]>;
  byYear: Map<string, FormattedOrder[]>;
}

export const useAdminOrders = (token?: string) => {
  const [orders, setOrders] = useState<FormattedOrder[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrders>({
    byWeek: new Map(),
    byMonth: new Map(),
    byYear: new Map(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    size: 30,
    totalElements: 0,
    totalPages: 0,
  });
  const [groupBy, setGroupBy] = useState<"week" | "month" | "year">("week");

  // Format đơn hàng từ API response
  const formatOrders = useCallback((data: OrderResponse): FormattedOrder[] => {
    console.log("API Response Data:", JSON.stringify(data, null, 2));

    if (!data) {
      console.error("No data returned from API");
      return [];
    }

    // Kiểm tra xem data có thuộc tính 'items' không
    const orderItems = data.items || [];

    // Nếu không có items nhưng data là một mảng, có thể API trả về mảng trực tiếp
    const ordersArray = Array.isArray(data) ? data : orderItems;

    console.log("Orders Array Length:", ordersArray.length);

    if (ordersArray.length === 0) {
      console.warn("No orders found in API response");
      return [];
    }

    return ordersArray.map((order) => {
      console.log("Processing order:", order.id);

      let dateObj;
      try {
        dateObj = parseISO(order.createdAt);
      } catch (err) {
        console.error("Invalid date format:", order.createdAt, err);
        dateObj = new Date();
      }

      // Lấy thông tin từ order.member (có thể có user hoặc không)
      const member = order.member as ExtendedMember;
      const user = member?.user;

      // Debug thông tin member
      console.log(`Order ${order.id} member:`, member);
      if (user) {
        console.log(`Order ${order.id} user:`, user);
      }

      const customerName =
        user?.fullName || member?.fullName || "Không có thông tin";
      const customerEmail =
        user?.username || member?.username || "Không có thông tin";
      const customerPhone =
        user?.phoneNumber || member?.phoneNumber || "Không có thông tin";

      const formattedOrder = {
        ...order,
        member,
        formattedDate: format(dateObj, "dd/MM/yyyy", { locale: vi }),
        formattedTime: format(dateObj, "HH:mm", { locale: vi }),
        customerName,
        customerEmail,
        customerPhone,
      };

      return formattedOrder;
    });
  }, []);

  // Group đơn hàng theo thời gian
  const groupOrdersByTime = useCallback(
    (orders: FormattedOrder[]): GroupedOrders => {
      const byWeek = new Map<string, FormattedOrder[]>();
      const byMonth = new Map<string, FormattedOrder[]>();
      const byYear = new Map<string, FormattedOrder[]>();

      // Sắp xếp đơn hàng theo ngày mới nhất trước (giảm dần)
      const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      // Biến để lưu thông tin về tháng/năm để sắp xếp
      const monthToDateMap = new Map<
        string,
        { year: number; month: number; firstDate: Date }
      >();
      const weekToFirstDate = new Map<string, Date>();
      const yearToFirstDate = new Map<string, number>();

      for (const order of sortedOrders) {
        const date = parseISO(order.createdAt);

        // Format cho tuần (Tuần W, MM/yyyy)
        const weekKey = `Tuần ${format(date, "w", {
          locale: vi,
        })}, ${format(date, "MM/yyyy", { locale: vi })}`;

        // Format cho tháng (MM/yyyy)
        const monthKey = format(date, "MM/yyyy", { locale: vi });
        const month = date.getMonth() + 1; // 1-12
        const year = date.getFullYear();

        // Format cho năm (yyyy)
        const yearKey = format(date, "yyyy", { locale: vi });

        // Lưu thông tin về ngày để sắp xếp sau này
        if (!weekToFirstDate.has(weekKey)) {
          weekToFirstDate.set(weekKey, date);
        }

        // Lưu thông tin về tháng để sắp xếp theo tháng mới nhất
        if (!monthToDateMap.has(monthKey)) {
          monthToDateMap.set(monthKey, {
            year,
            month,
            firstDate: date,
          });
        }

        if (!yearToFirstDate.has(yearKey)) {
          yearToFirstDate.set(yearKey, date.getFullYear());
        }

        // Thêm vào nhóm theo tuần
        if (!byWeek.has(weekKey)) {
          byWeek.set(weekKey, []);
        }
        byWeek.get(weekKey)?.push(order);

        // Thêm vào nhóm theo tháng
        if (!byMonth.has(monthKey)) {
          byMonth.set(monthKey, []);
        }
        byMonth.get(monthKey)?.push(order);

        // Thêm vào nhóm theo năm
        if (!byYear.has(yearKey)) {
          byYear.set(yearKey, []);
        }
        byYear.get(yearKey)?.push(order);
      }

      // Sắp xếp dữ liệu trong mỗi nhóm để hiển thị ngày mới nhất trước
      Array.from(byMonth.entries()).forEach(([key, orderList]) => {
        byMonth.set(
          key,
          orderList.sort((a: FormattedOrder, b: FormattedOrder) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })
        );
      });

      Array.from(byWeek.entries()).forEach(([key, orderList]) => {
        byWeek.set(
          key,
          orderList.sort((a: FormattedOrder, b: FormattedOrder) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })
        );
      });

      Array.from(byYear.entries()).forEach(([key, orderList]) => {
        byYear.set(
          key,
          orderList.sort((a: FormattedOrder, b: FormattedOrder) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          })
        );
      });

      // Sắp xếp các nhóm theo thời gian mới nhất
      return {
        byWeek: new Map(
          Array.from(byWeek.entries()).sort((a, b) => {
            const dateA = weekToFirstDate.get(a[0]) as Date;
            const dateB = weekToFirstDate.get(b[0]) as Date;
            return dateB.getTime() - dateA.getTime();
          })
        ),
        // Sắp xếp tháng mới nhất trước (sắp xếp theo năm trước, sau đó theo tháng)
        byMonth: new Map(
          Array.from(byMonth.entries()).sort((a, b) => {
            const infoA = monthToDateMap.get(a[0])!;
            const infoB = monthToDateMap.get(b[0])!;

            // Sắp xếp theo năm trước (giảm dần)
            if (infoA.year !== infoB.year) {
              return infoB.year - infoA.year;
            }

            // Sau đó sắp xếp theo tháng (giảm dần)
            return infoB.month - infoA.month;
          })
        ),
        byYear: new Map(
          Array.from(byYear.entries()).sort((a, b) => {
            return parseInt(b[0]) - parseInt(a[0]);
          })
        ),
      };
    },
    []
  );

  // Thử lấy token từ localStorage nếu không truyền vào
  const getTokenFromStorage = useCallback((): string | null => {
    try {
      if (typeof window === "undefined") return null;

      // Thử lấy token từ localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken) return storedToken;

      // Thử lấy từ auth storage
      const authData = localStorage.getItem("doca-auth-storage");
      if (authData) {
        const parsedData = JSON.parse(authData);
        return parsedData?.state?.userData?.token || null;
      }

      return null;
    } catch (e) {
      console.error("Error getting token from storage:", e);
      return null;
    }
  }, []);

  const fetchOrders = useCallback(
    async (page = 1, size = 30) => {
      // Sử dụng token truyền vào, hoặc thử lấy từ localStorage
      const authToken = token || getTokenFromStorage();

      if (!authToken) {
        setError("Vui lòng đăng nhập để xem danh sách đơn hàng.");
        setLoading(false);
        return;
      }

      console.log(
        "Fetching orders with token:",
        authToken.substring(0, 15) + "..."
      );
      console.log("Page:", page, "Size:", size);

      setLoading(true);
      setError(null);

      try {
        const data = await orderService.getAllOrders(authToken, page, size);
        console.log("API response received:", data);

        if (!data) {
          console.error("API response is null or undefined");
          throw new Error("Không nhận được dữ liệu từ API");
        }

        // Kiểm tra cấu trúc dữ liệu phản hồi
        if (data.items && Array.isArray(data.items)) {
          console.log(
            "API response format: using 'items' array with length:",
            data.items.length
          );
        } else if (Array.isArray(data)) {
          console.log(
            "API response format: direct array with length:",
            data.length
          );
        } else {
          console.log("API response structure:", Object.keys(data));
        }

        // Format và lưu trữ đơn hàng
        const formattedOrders = formatOrders(data);
        console.log("Formatted orders count:", formattedOrders.length);
        setOrders(formattedOrders);

        // Group đơn hàng theo thời gian
        const grouped = groupOrdersByTime(formattedOrders);
        setGroupedOrders(grouped);

        // Cập nhật thông tin phân trang
        setPagination({
          page: data.page || page,
          size: data.size || size,
          totalElements: data.total || 0,
          totalPages: data.totalPages || 1,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi khi tải dữ liệu đơn hàng";
        console.error("Error details:", JSON.stringify(err, null, 2));
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token, formatOrders, groupOrdersByTime, getTokenFromStorage]
  );

  useEffect(() => {
    // Sử dụng token truyền vào, hoặc thử lấy từ localStorage
    const authToken = token || getTokenFromStorage();

    if (authToken) {
      console.log("Token available, fetching orders...");
      fetchOrders(pagination.page, pagination.size);
    } else {
      console.warn("No token available, setting error state");
      setLoading(false);
      setError("Vui lòng đăng nhập để xem danh sách đơn hàng.");
    }
  }, [
    fetchOrders,
    token,
    pagination.page,
    pagination.size,
    getTokenFromStorage,
  ]);

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      // Sử dụng token truyền vào, hoặc thử lấy từ localStorage
      const authToken = token || getTokenFromStorage();

      if (!authToken) {
        setError("Vui lòng đăng nhập để cập nhật trạng thái đơn hàng.");
        return null;
      }

      try {
        const updatedOrder = await orderService.updateOrderStatus(
          orderId,
          newStatus,
          authToken
        );

        // Cập nhật đơn hàng trong state
        setOrders((prevOrders) => {
          const updated = prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...updatedOrder,
                  member: order.member, // giữ lại thông tin member đã được format
                  formattedDate: order.formattedDate,
                  formattedTime: order.formattedTime,
                  customerName: order.customerName,
                  customerEmail: order.customerEmail,
                  customerPhone: order.customerPhone,
                }
              : order
          );

          // Cập nhật nhóm đơn hàng
          setGroupedOrders(groupOrdersByTime(updated));

          return updated;
        });

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
    [token, groupOrdersByTime, getTokenFromStorage]
  );

  // Thay đổi trang
  const changePage = useCallback((newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  return {
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
  };
};

export default useAdminOrders;
