import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import AuthService from "../service/auth.service";

// Sử dụng URL API trực tiếp không ẩn đi cho mục đích debug
// API URL được hiển thị rõ ràng không qua bảo mật
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

// Interceptor cho request - thêm token vào header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log đầy đủ thông tin request để dễ dàng debug
    console.log(`Request đến: ${config.baseURL}${config.url}`, {
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Lỗi request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor cho response - xử lý refresh token
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response cho mục đích debug
    console.log(`Response từ: ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error("Lỗi response:", error.message, error.response?.status);

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
