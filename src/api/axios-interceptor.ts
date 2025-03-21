import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import AuthService from "../service/auth.service";

// Đảm bảo sử dụng URL API trực tiếp production.doca.love
const API_URL = `https://production.doca.love/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Tắt credentials để tránh vấn đề CORS
});

// Hiển thị URL API cho mục đích debug
console.log("[Axios Interceptor] Sử dụng API URL:", API_URL);

// Kiểm tra URL hiện tại và đảm bảo redirect nếu cần
if (
  typeof window !== "undefined" &&
  window.location.href.includes("doca.love") &&
  !window.location.href.includes("production.doca.love")
) {
  console.log(
    "[Axios Interceptor] Phát hiện sai domain, chuyển hướng đến production.doca.love"
  );
  window.location.href = window.location.href.replace(
    "doca.love",
    "production.doca.love"
  );
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ghi lại URL gọi API
    console.log(
      `[Axios] Gọi API: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error: AxiosError) => {
    console.error("[Axios] Lỗi gửi request:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response thành công
    console.log(
      `[Axios] Response thành công: ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi response
    if (error.response) {
      console.error(
        `[Axios] Lỗi response: ${
          error.response.status
        } ${error.config?.method?.toUpperCase()} ${error.config?.url}`
      );

      // Xử lý lỗi 401 Unauthorized
      if (error.response.status === 401) {
        console.warn("[Axios] Token hết hạn hoặc không hợp lệ, đăng xuất");
        // Đăng xuất người dùng
        AuthService.logout();
        // Chuyển hướng đến trang đăng nhập
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("[Axios] Không nhận được response:", error.message);
    } else {
      console.error("[Axios] Lỗi cấu hình request:", error.message);
    }

    return Promise.reject(error);
  }
);

// Cấu hình toàn cầu cho axios
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

export default axiosInstance;
