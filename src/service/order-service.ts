import axios from "axios";

export interface Member {
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
}

export interface Order {
  id: string;
  total: number;
  address: string;
  status: string;
  createdAt: string;
  modifiedAt: string;
  member: Member;
}

export interface OrderResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Order[];
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  volume: number;
  price: number;
  createdAt: string;
  modifiedAt: string;
  isHidden: boolean;
  productImages: ProductImage[];
}

export interface Blog {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: number;
  modifiedAt: string;
  isHindden: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  createdAt: string;
  modifiedAt: string;
  product?: Product;
  blog?: Blog;
}

const BASE_API_URL = "https://production.doca.love";

// Tạo axios instance với timeout
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000, // Tăng timeout lên 15 giây
});

// Hàm để lấy token đúng - kiểm tra nếu token được truyền vào đã bao gồm "Bearer"
const getAuthHeader = (token: string) => {
  if (!token) return "";

  // Nếu token đã có "Bearer" thì sử dụng trực tiếp
  if (token.startsWith("Bearer ")) {
    return token;
  }

  return `Bearer ${token}`;
};

export const orderService = {
  getAllOrders: async (
    token: string,
    page = 1,
    size = 10
  ): Promise<OrderResponse> => {
    try {
      // Đảm bảo token hợp lệ
      if (!token) {
        // Thử lấy token từ localStorage
        const storedToken = localStorage.getItem("token");
        const authData = localStorage.getItem("doca-auth-storage");

        if (storedToken) {
          token = storedToken;
        } else if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            token = parsedData?.state?.userData?.token || "";
          } catch (e) {
            console.error("Error parsing auth data:", e);
          }
        }
      }

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      // Đảm bảo page không nhỏ hơn 1
      if (page < 1) page = 1;

      // Đảm bảo size nằm trong khoảng hợp lý
      if (size < 1) size = 10;
      if (size > 50) size = 50;

      const response = await api.get<OrderResponse>(`/api/v1/orders`, {
        params: {
          page,
          size,
        },
        headers: {
          Authorization: getAuthHeader(token),
        },
      });

      // Đảm bảo kết quả trả về luôn có cấu trúc đúng, ngay cả khi API trả về null hoặc undefined
      const result: OrderResponse = {
        size: response.data?.size || size,
        page: response.data?.page || page,
        total: response.data?.total || 0,
        totalPages: response.data?.totalPages || 1,
        items: response.data?.items || [],
      };

      return result;
    } catch (error) {
      console.error("Error fetching orders:", error);

      // Xử lý lỗi cụ thể
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error(
          "Không thể tải dữ liệu do quá thời gian chờ. Vui lòng thử lại sau."
        );
      }

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          // Xóa token nếu đã hết hạn
          localStorage.removeItem("token");
          throw new Error(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          );
        } else if (status >= 500) {
          throw new Error("Lỗi máy chủ. Vui lòng thử lại sau.");
        }
      }

      throw new Error("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
    }
  },

  getOrderById: async (id: string, token: string): Promise<Order> => {
    try {
      const response = await api.get(`/api/v1/orders/${id}`, {
        headers: {
          Authorization: getAuthHeader(token),
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error(
          "Không thể tải dữ liệu do quá thời gian chờ. Vui lòng thử lại sau."
        );
      }

      throw error;
    }
  },

  getOrderItems: async (
    orderId: string,
    token: string
  ): Promise<OrderItem[]> => {
    try {
      // Đảm bảo token hợp lệ
      if (!token) {
        // Thử lấy token từ localStorage
        const storedToken = localStorage.getItem("token");
        const authData = localStorage.getItem("doca-auth-storage");

        if (storedToken) {
          token = storedToken;
        } else if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            token = parsedData?.state?.userData?.token || "";
          } catch (e) {
            console.error("Error parsing auth data:", e);
          }
        }
      }

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      const response = await api.get<OrderItem[]>(
        `/api/v1/orders/${orderId}/order-items`,
        {
          headers: {
            Authorization: getAuthHeader(token),
          },
        }
      );

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching order items for order ${orderId}:`, error);

      // Xử lý lỗi cụ thể
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error(
          "Không thể tải dữ liệu chi tiết đơn hàng do quá thời gian chờ. Vui lòng thử lại sau."
        );
      }

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          throw new Error(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          );
        } else if (status >= 500) {
          throw new Error("Lỗi máy chủ. Vui lòng thử lại sau.");
        }
      }

      throw new Error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.");
    }
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    token: string
  ): Promise<Order> => {
    try {
      const response = await api.put(
        `/api/v1/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: getAuthHeader(token),
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error updating order status for id ${id}:`, error);

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error(
          "Không thể cập nhật trạng thái do quá thời gian chờ. Vui lòng thử lại sau."
        );
      }

      throw error;
    }
  },
};

export default orderService;
