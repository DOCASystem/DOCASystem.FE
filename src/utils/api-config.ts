/**
 * Cấu hình API của ứng dụng
 * API URL được hiển thị rõ ràng không qua bảo mật
 */

// URL cơ sở duy nhất của API (không ẩn đi)
export const API_BASE_URL = "https://production.doca.love";

// URL đích thực của API (luôn sử dụng URL cố định)
export const REAL_API_BASE_URL = "https://production.doca.love";

// Kiểm tra môi trường trước khi thực hiện các yêu cầu mạng
const isClientSide = typeof window !== "undefined";

// Log URL API hiện tại khi ứng dụng khởi động
if (isClientSide) {
  console.log("[API Config] URL API cố định:", REAL_API_BASE_URL);
  console.log("[API Config] API URL không được ẩn đi vì mục đích debug");
}

// URL của swagger spec
export const SWAGGER_URL =
  "https://production.doca.love/swagger/v1/swagger.json";

// Timeout mặc định cho các request (ms)
export const DEFAULT_TIMEOUT = 30000;

// Cấu hình các endpoint
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/login",
    SIGNUP: "/api/v1/signup",
    FORGET_PASSWORD: "/api/v1/forget-password",
    OTP: "/api/v1/otp",
  },
  CATEGORIES: {
    BASE: "/api/v1/categories",
    GET_ALL: "/api/v1/categories",
    GET_BY_ID: (id: string) => `/api/v1/categories/${id}`,
  },
  PRODUCTS: {
    BASE: "/api/v1/products",
    GET_ALL: "/api/v1/products",
    GET_BY_ID: (id: string) => `/api/v1/products/${id}`,
  },
  BLOGS: {
    BASE: "/api/v1/blogs",
    GET_ALL: "/api/v1/blogs",
    GET_BY_ID: (id: string) => `/api/v1/blogs/${id}`,
  },
};

// Cấu hình CORS cho API
export const API_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Hàm tạo URL đầy đủ cho endpoint
export const getApiUrl = (endpoint: string): string => {
  // URL trực tiếp không ẩn đi
  const url = `${REAL_API_BASE_URL}${endpoint}`;

  // Log URL để dễ debug khi có vấn đề
  if (isClientSide) {
    console.log(`[API Request] Gọi trực tiếp đến: ${url}`);
  }

  return url;
};

// Hàm kiểm tra xem mã HTTP có phải là thành công hay không
export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

// Hàm trích xuất thông báo lỗi từ response
export const extractErrorMessage = (error: unknown): string => {
  if (!error) return "Đã xảy ra lỗi không xác định";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    // @ts-expect-error - Truy cập vào thuộc tính message của đối tượng không xác định
    if (error.message) return error.message;

    // @ts-expect-error - Truy cập vào thuộc tính response.data.message của đối tượng không xác định
    if (error.response?.data?.message) return error.response.data.message;

    // @ts-expect-error - Truy cập vào thuộc tính response.statusText của đối tượng không xác định
    if (error.response?.statusText) return error.response.statusText;
  }

  return "Đã xảy ra lỗi không xác định";
};
