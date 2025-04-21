/**
 * Tối ưu hóa API calls để ưu tiên tải profile và giỏ hàng
 */

import axios from "axios";
import { CartItemResponse } from "../service/cart-service";
import AuthService from "../service/auth.service";
import { LoginResponse } from "./generated";
import { API_BASE_URL } from "../utils/api-config";

// Loại request ưu tiên
export enum ApiPriority {
  HIGH = "high",
  NORMAL = "normal",
  LOW = "low",
}

// Interface cho kết quả API tổng hợp
export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tạo axios instance tối ưu
const optimizedAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ưu tiên lấy thông tin profile user
export const fetchUserProfileOptimized = async (): Promise<
  ApiResult<Partial<LoginResponse>>
> => {
  try {
    // Kiểm tra cache trước
    const cachedProfile = AuthService.fetchUserProfile();
    if (cachedProfile) {
      return {
        success: true,
        data: cachedProfile,
      };
    }

    // Nếu không có trong cache, gọi API
    const token = AuthService.getToken();
    if (!token) {
      return {
        success: false,
        error: "Chưa đăng nhập",
      };
    }

    // TODO: Thêm API để lấy profile nếu cần
    return {
      success: true,
      data: cachedProfile || {},
    };
  } catch (error) {
    console.error("[API Optimization] Lỗi khi lấy profile:", error);
    return {
      success: false,
      error: "Không thể lấy thông tin profile",
    };
  }
};

// Ưu tiên lấy thông tin giỏ hàng
export const fetchCartOptimized = async (): Promise<
  ApiResult<CartItemResponse[]>
> => {
  try {
    const token = AuthService.getToken();
    if (!token) {
      return {
        success: false,
        error: "Chưa đăng nhập",
      };
    }

    // Sử dụng axios instance được tối ưu
    const response = await optimizedAxios.get<CartItemResponse[]>(
      "/api/v1/carts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Priority": ApiPriority.HIGH,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("[API Optimization] Lỗi khi lấy giỏ hàng:", error);
    return {
      success: false,
      error: "Không thể lấy thông tin giỏ hàng",
    };
  }
};

// Lấy cả thông tin profile và giỏ hàng cùng lúc - tối ưu cho hiệu suất
export const fetchUserDataAndCart = async (): Promise<{
  profile: ApiResult<Partial<LoginResponse>>;
  cart: ApiResult<CartItemResponse[]>;
}> => {
  // Fetch cả hai thông tin song song để tối ưu thời gian
  const [profileResult, cartResult] = await Promise.all([
    fetchUserProfileOptimized(),
    fetchCartOptimized(),
  ]);

  return {
    profile: profileResult,
    cart: cartResult,
  };
};

// Cấu hình interceptor cho optimized axios instance
optimizedAxios.interceptors.request.use((config) => {
  // Kiểm tra URL để cấu hình độ ưu tiên
  const url = config.url;
  if (!url) {
    return config;
  }

  // Thiết lập header ưu tiên dựa trên endpoint
  if (
    url.includes("/api/v1/carts") ||
    url.includes("/api/v1/profile") ||
    url.includes("/api/v1/user")
  ) {
    // Gán giá trị trực tiếp cho header thay vì thay thế toàn bộ headers object
    config.headers.set("X-Priority", ApiPriority.HIGH);
  } else if (
    url.includes("/api/v1/admin") ||
    url.includes("/api/v1/statistics") ||
    url.includes("/api/v1/dashboard")
  ) {
    // Gán giá trị trực tiếp cho header thay vì thay thế toàn bộ headers object
    config.headers.set("X-Priority", ApiPriority.LOW);
  }

  return config;
});

// Export optimized axios để các service khác có thể sử dụng
export { optimizedAxios };
