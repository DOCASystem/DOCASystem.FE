/**
 * Cấu hình API của ứng dụng
 */

// Danh sách các URL dự phòng theo thứ tự ưu tiên
const API_FALLBACK_URLS = [
  process.env.NEXT_PUBLIC_API_URL,
  "https://production.doca.love", // URL chính thức của API
  "https://api.doca.love", // URL dự phòng
  "https://doca-api.vercel.app", // URL dự phòng thứ 2
];

// URL cơ sở của API (mặc định)
export const API_BASE_URL =
  API_FALLBACK_URLS.find((url) => url) || "https://production.doca.love";

// URL đích thực của API (sẽ được cập nhật từ Swagger)
export let REAL_API_BASE_URL = API_BASE_URL;

// Hàm cập nhật URL API base thực tế
export const updateRealApiBaseUrl = (url: string) => {
  if (url && url !== REAL_API_BASE_URL) {
    console.log(`Cập nhật URL API base từ: ${REAL_API_BASE_URL} sang: ${url}`);
    REAL_API_BASE_URL = url;
  }
};

// Kiểm tra môi trường trước khi thực hiện các yêu cầu mạng
const isClientSide = typeof window !== "undefined";
const isProductionEnv = process.env.NODE_ENV === "production";

// Hàm thử kết nối đến API URL cụ thể
const testApiConnection = async (url: string): Promise<boolean> => {
  if (!url) return false;

  try {
    console.log(
      `[API Test] Thử kết nối tới: ${url}/api/v1/products?page=1&size=1`
    );

    const response = await fetch(`${url}/api/v1/products?page=1&size=1`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`[API Test] ✅ Kết nối thành công đến: ${url}`);
      return true;
    } else {
      console.warn(
        `[API Test] ❌ Kết nối đến ${url} không thành công: ${response.status} ${response.statusText}`
      );
      return false;
    }
  } catch (error: unknown) {
    console.warn(
      `[API Test] ❌ Không thể kết nối đến: ${url}`,
      error instanceof Error ? error.message : "Unknown error"
    );
    return false;
  }
};

// Hàm thử kết nối đến các API URL dự phòng
export const tryFallbackApiUrls = async () => {
  // Không thực hiện kiểm tra trên client-side để tránh lỗi
  if (isClientSide) {
    console.log(
      "[API Config] Đang chạy trên client-side, bỏ qua kiểm tra API URL"
    );
    return;
  }

  console.log("[API Config] Đang thử kết nối đến các API URL dự phòng...");

  for (const url of API_FALLBACK_URLS) {
    if (!url) continue;

    const isConnected = await testApiConnection(url);
    if (isConnected) {
      updateRealApiBaseUrl(url);
      return;
    }
  }

  console.log(
    "[API Config] ⚠️ Không thể kết nối đến bất kỳ API URL nào, sử dụng mặc định:",
    REAL_API_BASE_URL
  );
};

// Chỉ gọi hàm kiểm tra kết nối khi khởi động API routes trên server
if (!isClientSide) {
  tryFallbackApiUrls().catch((err) => {
    console.error("[API Config] Lỗi khi thử kết nối đến các API URL:", err);
  });
}

// Log URL API hiện tại khi ứng dụng khởi động
if (isClientSide) {
  console.log("[API Config] URL API hiện tại:", REAL_API_BASE_URL);
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

// Hàm tạo URL đầy đủ cho endpoint, với xử lý đặc biệt cho môi trường production
export const getApiUrl = (endpoint: string): string => {
  // Xử lý đặc biệt cho endpoint login
  if (endpoint === API_ENDPOINTS.AUTH.LOGIN && REAL_LOGIN_API_URL) {
    return REAL_LOGIN_API_URL;
  }

  // Trong môi trường production, cần đảm bảo sử dụng URL chính xác
  if (isProductionEnv) {
    const url = `${REAL_API_BASE_URL}${endpoint}`;

    // Log URL để dễ debug khi có vấn đề
    if (isClientSide) {
      console.log(`[API Request] ${url}`);
    }

    return url;
  }

  return `${REAL_API_BASE_URL}${endpoint}`;
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
    // @ts-ignore
    if (error.message) return error.message;

    // @ts-ignore
    if (error.response?.data?.message) return error.response.data.message;

    // @ts-ignore
    if (error.response?.statusText) return error.response.statusText;
  }

  return "Đã xảy ra lỗi không xác định";
};
