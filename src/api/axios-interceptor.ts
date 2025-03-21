import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import AuthService from "../service/auth.service";

// Xác định baseURL dựa trên môi trường
let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Trong client side, kiểm tra hostname để xác định API URL phù hợp
if (typeof window !== "undefined") {
  if (window.location.hostname === "doca.love") {
    baseUrl = "https://doca.love";
    console.log(
      "[Axios Config] Phát hiện môi trường production Vercel, sử dụng baseURL:",
      baseUrl
    );
  }
}

const axiosInstance = axios.create({
  baseURL: `${baseUrl}/api`,
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
