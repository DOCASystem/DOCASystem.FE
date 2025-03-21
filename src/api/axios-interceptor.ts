import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import AuthService from "../service/auth.service";
import apiMonitor from "./api-monitor";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Tắt credentials để tránh vấn đề CORS
});

// Interceptor cho request - thêm token vào header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ghi log request
    apiMonitor.onRequest(config);

    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("Lỗi request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor cho response - xử lý refresh token nếu token hết hạn
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Ghi log response thành công
    apiMonitor.onResponse(response);
    return response;
  },
  async (error: AxiosError) => {
    console.error("Lỗi response:", error.message, error.response?.status);

    // Ghi log response lỗi
    apiMonitor.onError(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu lỗi 401 (Unauthorized) và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử làm mới token
        const refreshed = await AuthService.refreshToken();

        if (refreshed) {
          // Cập nhật token mới vào header
          const token = AuthService.getToken();
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          // Thử lại request ban đầu với token mới
          return axiosInstance(originalRequest);
        }
      } catch {
        // Nếu không làm mới được token, đăng xuất và chuyển hướng đến trang đăng nhập
        AuthService.logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Cấu hình toàn cầu cho axios
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

export default axiosInstance;
