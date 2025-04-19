import axios from "axios";

// Khai báo kiểu cho user trong Member
type User = {
  id: string;
  username: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  role: number;
  password?: string; // Optional vì có thể không trả về từ API
};

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
  user?: User | null; // Thêm trường user để xử lý API trả về
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

// Dữ liệu mẫu khi không có token hoặc API lỗi (chỉ dùng cho testing)
const MOCK_ORDERS: Order[] = [
  {
    id: "sample-order-1",
    total: 120000,
    address: "Thành phố Hồ Chí Minh",
    status: "Pending",
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    member: {
      id: "sample-member-1",
      userId: "sample-user-1",
      username: "user@example.com",
      phoneNumber: "0909123456",
      fullName: "Khách hàng mẫu 1",
      commune: "Phường Bến Nghé",
      district: "Quận 1",
      province: "Thành phố Hồ Chí Minh",
      address: "123 Đường Lê Lợi",
      provinceCode: "79",
      districtCode: "760",
      communeCode: "26734",
      user: {
        id: "sample-user-1",
        username: "user@example.com",
        phoneNumber: "0909123456",
        fullName: "Khách hàng mẫu 1",
        role: 2,
      },
    },
  },
  {
    id: "sample-order-2",
    total: 250000,
    address: "Hà Nội",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    modifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    member: {
      id: "sample-member-2",
      userId: "sample-user-2",
      username: "user2@example.com",
      phoneNumber: "0909123457",
      fullName: "Khách hàng mẫu 2",
      commune: "Phường Cầu Diễn",
      district: "Quận Nam Từ Liêm",
      province: "Hà Nội",
      address: "456 Đường Trần Duy Hưng",
      provinceCode: "01",
      districtCode: "019",
      communeCode: "00577",
      user: {
        id: "sample-user-2",
        username: "user2@example.com",
        phoneNumber: "0909123457",
        fullName: "Khách hàng mẫu 2",
        role: 2,
      },
    },
  },
  {
    id: "sample-order-3",
    total: 350000,
    address: "Đà Nẵng",
    status: "Shipping",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
    modifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    member: {
      id: "sample-member-3",
      userId: "sample-user-3",
      username: "user3@example.com",
      phoneNumber: "0909123458",
      fullName: "Khách hàng mẫu 3",
      commune: "Phường Hòa Cường Bắc",
      district: "Quận Hải Châu",
      province: "Đà Nẵng",
      address: "789 Đường Nguyễn Văn Linh",
      provinceCode: "48",
      districtCode: "491",
      communeCode: "20194",
      user: {
        id: "sample-user-3",
        username: "user3@example.com",
        phoneNumber: "0909123458",
        fullName: "Khách hàng mẫu 3",
        role: 2,
      },
    },
  },
];

export const orderService = {
  getAllOrders: async (
    token: string,
    page = 1,
    size = 10
  ): Promise<OrderResponse> => {
    try {
      // Nếu không có token và chúng ta đang ở môi trường dev, trả về dữ liệu mẫu
      if (!token) {
        console.log("No token - returning mock data for development");

        return {
          items: MOCK_ORDERS,
          page: page,
          size: size,
          total: MOCK_ORDERS.length,
          totalPages: 1,
        };
      }

      // Đảm bảo token hợp lệ
      if (token) {
        // Đảm bảo page không nhỏ hơn 1
        if (page < 1) page = 1;

        // Đảm bảo size nằm trong khoảng hợp lý
        if (size < 1) size = 10;
        if (size > 50) size = 50;

        console.log(
          `Calling API: GET /api/v1/orders?page=${page}&size=${size}`
        );
        console.log(
          `Authorization: ${getAuthHeader(token).substring(0, 20)}...`
        );

        const response = await api.get(`/api/v1/orders`, {
          params: {
            page,
            size,
          },
          headers: {
            Authorization: getAuthHeader(token),
          },
        });

        console.log("API Response Status:", response.status);
        console.log(
          "API Response Data Structure:",
          Object.keys(response.data || {})
        );

        // Kiểm tra xem response.data có phải là một mảng không
        if (Array.isArray(response.data)) {
          console.log(
            "Response is an array with length:",
            response.data.length
          );
          // Nếu là mảng đơn giản, chuyển đổi thành cấu trúc OrderResponse
          return {
            items: response.data,
            page: page,
            size: size,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / size),
          };
        }

        // Nếu có thuộc tính 'items'
        if (response.data && response.data.items) {
          console.log(
            "Response has 'items' with length:",
            response.data.items.length
          );
          return response.data;
        }

        // Trường hợp khác, có thể API trả về một cấu trúc khác
        if (response.data) {
          // Log mẫu dữ liệu đầu tiên để kiểm tra
          if (Array.isArray(response.data)) {
            console.log(
              "Sample first item:",
              JSON.stringify(response.data[0], null, 2)
            );
          } else {
            console.log(
              "Response data:",
              JSON.stringify(response.data, null, 2)
            );
          }

          // Nếu response.data là object và có thuộc tính như id, total, v.v.
          // có thể đây là một đơn hàng đơn lẻ thay vì danh sách
          if (!Array.isArray(response.data) && response.data.id) {
            console.log(
              "Response appears to be a single order, converting to array"
            );
            return {
              items: [response.data],
              page: page,
              size: size,
              total: 1,
              totalPages: 1,
            };
          }
        }

        // Đảm bảo kết quả trả về luôn có cấu trúc đúng, ngay cả khi API trả về null hoặc undefined
        return {
          size: response.data?.size || size,
          page: response.data?.page || page,
          total: response.data?.total || 0,
          totalPages: response.data?.totalPages || 1,
          items: response.data?.items || [],
        };
      }

      // Trường hợp có token nhưng không match với điều kiện nào
      return {
        items: [],
        page: page,
        size: size,
        total: 0,
        totalPages: 0,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);

      // Nếu đang ở môi trường dev, trả về dữ liệu mẫu để thuận tiện cho việc phát triển
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode - returning mock data after API error");
        return {
          items: MOCK_ORDERS,
          page: page,
          size: size,
          total: MOCK_ORDERS.length,
          totalPages: 1,
        };
      }

      // Xử lý lỗi cụ thể
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error(
          "Không thể tải dữ liệu do quá thời gian chờ. Vui lòng thử lại sau."
        );
      }

      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "API Error Response:",
          error.response.status,
          error.response.data
        );
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
      // Nếu không có token và đang ở môi trường phát triển, trả về dữ liệu mẫu
      if (!token && process.env.NODE_ENV === "development") {
        const mockOrder = MOCK_ORDERS.find((order) => order.id === id);
        if (mockOrder) {
          return mockOrder;
        }
        // Nếu không tìm thấy ID phù hợp, trả về đơn hàng đầu tiên
        return MOCK_ORDERS[0];
      }

      const response = await api.get(`/api/v1/orders/${id}`, {
        headers: {
          Authorization: getAuthHeader(token),
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);

      // Nếu đang ở môi trường dev, trả về dữ liệu mẫu
      if (process.env.NODE_ENV === "development") {
        const mockOrder = MOCK_ORDERS.find((order) => order.id === id);
        if (mockOrder) {
          return mockOrder;
        }
        return MOCK_ORDERS[0];
      }

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
        const authData = localStorage.getItem("userData");

        if (storedToken) {
          token = storedToken;
        } else if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            token = parsedData?.token || "";
          } catch (e) {
            console.error("[getOrderItems] Error parsing auth data:", e);
          }
        }
      }

      if (!token) {
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      console.log(`[getOrderItems] Fetching items for order ID: ${orderId}`);
      console.log(`[getOrderItems] Using token: ${token.substring(0, 15)}...`);

      // Thêm header Accept để chỉ định version API
      const response = await api.get<OrderItem[] | { items: OrderItem[] }>(
        `/api/v1/orders/${orderId}/order-items`,
        {
          headers: {
            Authorization: getAuthHeader(token),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "[getOrderItems] Raw API Response:",
        JSON.stringify(response.data, null, 2)
      );

      // Kiểm tra và xử lý response
      if (!response.data) {
        console.error("[getOrderItems] No data received from API");
        return [];
      }

      // Nếu response.data là mảng, trả về trực tiếp
      if (Array.isArray(response.data)) {
        console.log("[getOrderItems] Response is an array, returning directly");
        return response.data;
      }

      // Nếu response.data là object có thuộc tính items
      if (
        response.data &&
        "items" in response.data &&
        Array.isArray(response.data.items)
      ) {
        console.log(
          "[getOrderItems] Response has items property, returning items array"
        );
        return response.data.items;
      }

      // Nếu response.data là một object đơn lẻ, kiểm tra cấu trúc trước khi chuyển đổi
      if (typeof response.data === "object" && !Array.isArray(response.data)) {
        // Type guard để kiểm tra xem object có phải là OrderItem không
        const isOrderItem = (obj: unknown): obj is OrderItem => {
          const item = obj as Partial<OrderItem>;
          return (
            typeof item === "object" &&
            item !== null &&
            typeof item.id === "string" &&
            typeof item.quantity === "number"
          );
        };

        if (isOrderItem(response.data)) {
          console.log(
            "[getOrderItems] Response is a valid single order item, converting to array"
          );
          return [response.data];
        }
      }

      console.error(
        "[getOrderItems] Unexpected response format:",
        response.data
      );
      return [];
    } catch (error) {
      console.error("[getOrderItems] Error:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          throw new Error(
            "Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại."
          );
        }
      }

      throw error instanceof Error
        ? error
        : new Error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.");
    }
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    token: string
  ): Promise<Order> => {
    try {
      // Nếu không có token và đang ở môi trường phát triển, giả lập cập nhật trạng thái
      if (!token && process.env.NODE_ENV === "development") {
        console.log(
          `Development mode - mock update order ${id} status to ${status}`
        );
        const mockOrder = {
          ...(MOCK_ORDERS.find((order) => order.id === id) || MOCK_ORDERS[0]),
        };
        mockOrder.status = status;
        mockOrder.modifiedAt = new Date().toISOString();
        return mockOrder;
      }

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

      // Nếu đang ở môi trường phát triển, giả lập cập nhật trạng thái
      if (process.env.NODE_ENV === "development") {
        console.log(
          `Development mode - mock update order ${id} status to ${status} after error`
        );
        const mockOrder = {
          ...(MOCK_ORDERS.find((order) => order.id === id) || MOCK_ORDERS[0]),
        };
        mockOrder.status = status;
        mockOrder.modifiedAt = new Date().toISOString();
        return mockOrder;
      }

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
