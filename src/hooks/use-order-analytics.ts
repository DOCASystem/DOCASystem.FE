import { useState, useEffect, useCallback } from "react";
import orderService, { Order } from "@/service/order-service";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface ChartData {
  name: string;
  value: number;
}

interface OrderAnalytics {
  weeklyData: ChartData[];
  monthlyData: ChartData[];
  yearlyData: ChartData[];
  totalOrders: number;
  totalRevenue: number;
  loading: boolean;
  error: string | null;
}

export const useOrderAnalytics = (token?: string): OrderAnalytics => {
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<ChartData[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const processOrderData = useCallback((orders: Order[]) => {
    // Map để lưu tổng tiền theo tuần
    const weekMap = new Map<string, number>();
    // Map để lưu tổng tiền theo tháng
    const monthMap = new Map<string, number>();
    // Map để lưu tổng tiền theo năm
    const yearMap = new Map<string, number>();

    let sumTotal = 0;

    orders.forEach((order) => {
      const date = parseISO(order.createdAt);

      // Format cho tuần (Tuần W, MM/yyyy)
      const weekKey = `Tuần ${format(date, "w", { locale: vi })}, ${format(
        date,
        "MM/yyyy",
        { locale: vi }
      )}`;

      // Format cho tháng (MM/yyyy)
      const monthKey = format(date, "MM/yyyy", { locale: vi });

      // Format cho năm (yyyy)
      const yearKey = format(date, "yyyy", { locale: vi });

      // Cộng tổng tiền vào từng khoảng thời gian
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + order.total);
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + order.total);
      yearMap.set(yearKey, (yearMap.get(yearKey) || 0) + order.total);

      // Cộng vào tổng doanh thu
      sumTotal += order.total;
    });

    // Chuyển đổi Map thành mảng dữ liệu cho biểu đồ
    // Và sắp xếp theo thời gian
    const weeklyResult = Array.from(weekMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        // Trích xuất thông tin tuần và tháng/năm
        const [weekA, monthYearA] = a.name.split(", ");
        const [weekB, monthYearB] = b.name.split(", ");

        const [monthA, yearA] = monthYearA.split("/");
        const [monthB, yearB] = monthYearB.split("/");

        // So sánh năm trước
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }

        // Nếu cùng năm, so sánh tháng
        if (monthA !== monthB) {
          return parseInt(monthA) - parseInt(monthB);
        }

        // Nếu cùng tháng và năm, so sánh tuần
        const weekNumA = parseInt(weekA.replace("Tuần ", ""));
        const weekNumB = parseInt(weekB.replace("Tuần ", ""));
        return weekNumA - weekNumB;
      });

    const monthlyResult = Array.from(monthMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split("/");
        const [monthB, yearB] = b.name.split("/");

        // So sánh năm trước
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }

        // Nếu cùng năm, so sánh tháng
        return parseInt(monthA) - parseInt(monthB);
      });

    const yearlyResult = Array.from(yearMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    // Lấy các giá trị gần đây nhất để hiển thị (tối đa 12 giá trị)
    setWeeklyData(weeklyResult.slice(-12));
    setMonthlyData(monthlyResult.slice(-12));
    setYearlyData(yearlyResult.slice(-12));

    setTotalOrders(orders.length);
    setTotalRevenue(sumTotal);
  }, []);

  useEffect(() => {
    const fetchOrdersForAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Sử dụng token truyền vào, hoặc thử lấy từ localStorage
        const authToken = token || getTokenFromStorage();

        if (!authToken) {
          setError("Vui lòng đăng nhập để xem dữ liệu phân tích");
          setLoading(false);
          return;
        }

        // Gọi API với size lớn để lấy nhiều đơn hàng hơn cho phân tích
        const data = await orderService.getAllOrders(authToken, 1, 100);

        if (data && data.items) {
          processOrderData(data.items);
        } else {
          setError("Không thể lấy dữ liệu đơn hàng");
        }
      } catch (err) {
        console.error("Error fetching orders for analytics:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersForAnalytics();
  }, [token, getTokenFromStorage, processOrderData]);

  return {
    weeklyData,
    monthlyData,
    yearlyData,
    totalOrders,
    totalRevenue,
    loading,
    error,
  };
};

export default useOrderAnalytics;
