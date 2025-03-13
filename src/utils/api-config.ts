/**
 * Cấu hình API của ứng dụng
 */

// URL cơ sở của API (mặc định)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://production.doca.love";

// URL đích thực của API (sẽ được cập nhật từ Swagger)
export let REAL_API_BASE_URL = API_BASE_URL;

// Hàm cập nhật URL API base thực tế
export const updateRealApiBaseUrl = (url: string) => {
  if (url && url !== REAL_API_BASE_URL) {
    console.log(`Cập nhật URL API base từ: ${REAL_API_BASE_URL} sang: ${url}`);
    REAL_API_BASE_URL = url;
  }
};

// Log URL API hiện tại khi ứng dụng khởi động
if (typeof window !== "undefined") {
  console.log("API URL hiện tại:", REAL_API_BASE_URL);
}

// URL của swagger spec
export const SWAGGER_URL =
  process.env.NEXT_PUBLIC_SWAGGER_URL ||
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
  // Thêm các endpoint khác khi cần
};

// URL API thực tế cho login
export let REAL_LOGIN_API_URL: string | null = null;

// Hàm cập nhật URL API login thực tế
export const updateRealLoginApiUrl = (url: string) => {
  if (url && url !== REAL_LOGIN_API_URL) {
    console.log(
      `Cập nhật URL API login từ: ${
        REAL_LOGIN_API_URL || "chưa đặt"
      } sang: ${url}`
    );
    REAL_LOGIN_API_URL = url;
  }
};

// Hàm tạo URL đầy đủ cho endpoint
export const getApiUrl = (endpoint: string): string => {
  // Sử dụng URL login thực tế nếu là endpoint login
  if (endpoint === API_ENDPOINTS.AUTH.LOGIN && REAL_LOGIN_API_URL) {
    return REAL_LOGIN_API_URL;
  }

  return `${REAL_API_BASE_URL}${endpoint}`;
};

// Hàm kiểm tra xem mã HTTP có phải là thành công hay không
export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};
