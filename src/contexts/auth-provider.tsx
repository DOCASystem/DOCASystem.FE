"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AuthServiceFixed from "@/service/auth.service.fixed";
import { LoginResponse } from "@/api/generated";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// Tạo interface cho context
interface AuthContextType {
  isAuthenticated: boolean;
  userData: Partial<LoginResponse> | null;
  loading: boolean;
  error: string | null;
  login: (
    usernameOrPhoneNumber: string,
    password: string
  ) => Promise<LoginResponse>;
  logout: () => void;
  refreshAuth: () => void;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: null,
  loading: false,
  error: null,
  login: async () => {
    console.warn("AuthContext chưa được khởi tạo đúng cách");
    return {} as LoginResponse;
  },
  logout: () => {
    console.warn("AuthContext chưa được khởi tạo đúng cách");
  },
  refreshAuth: () => {
    console.warn("AuthContext chưa được khởi tạo đúng cách");
  },
});

// Custom hook để sử dụng context
export const useAuthContext = () => useContext(AuthContext);

// Props cho Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider chính
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<Partial<LoginResponse> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();

  // Đánh dấu chúng ta đang ở client-side
  useEffect(() => {
    setIsClient(true);
    // Khi component đã mount, kiểm tra xác thực
    refreshAuth();
  }, []);

  // Hàm kiểm tra và cập nhật trạng thái xác thực - đã được tối ưu
  const refreshAuth = () => {
    // Chỉ thực hiện ở client-side
    if (typeof window === "undefined" || !isClient) return;

    // Kiểm tra cache thời gian
    const now = Date.now();
    const lastRefreshed = sessionStorage.getItem("lastAuthRefresh");

    // Nếu đã kiểm tra trong vòng 30 giây, không cần kiểm tra lại
    if (lastRefreshed && now - parseInt(lastRefreshed) < 30000) {
      return;
    }

    try {
      const authenticated = AuthServiceFixed.isAuthenticated();

      // Chỉ cập nhật state khi trạng thái thay đổi để tránh re-render không cần thiết
      if (authenticated !== isAuthenticated) {
        setIsAuthenticated(authenticated);
      }

      if (authenticated) {
        const user = AuthServiceFixed.getUserData();

        // Chỉ cập nhật userData nếu dữ liệu thực sự thay đổi
        if (JSON.stringify(user) !== JSON.stringify(userData)) {
          setUserData(user);
        }
      } else if (userData !== null) {
        // Chỉ cập nhật khi cần thiết
        setUserData(null);
      }

      // Lưu thời điểm kiểm tra cuối cùng
      sessionStorage.setItem("lastAuthRefresh", now.toString());
    } catch (error: unknown) {
      // Giảm log chi tiết, chỉ log loại lỗi
      const errorName = error instanceof Error ? error.name : "Unknown";
      console.warn("Lỗi xác thực:", errorName);

      // Chỉ cập nhật khi cần thiết
      if (isAuthenticated) {
        setIsAuthenticated(false);
      }
      if (userData !== null) {
        setUserData(null);
      }
    }

    setLoading(false);
  };

  // Kiểm tra lại trạng thái xác thực khi focus lại tab và định kỳ
  useEffect(() => {
    if (!isClient) return;

    // Kiểm tra lại trạng thái xác thực khi focus lại tab
    const handleFocus = () => {
      refreshAuth();
    };

    // Đăng ký sự kiện focus
    window.addEventListener("focus", handleFocus);

    // Kiểm tra định kỳ trạng thái xác thực (kéo dài thành 15 phút)
    const intervalId = setInterval(() => {
      refreshAuth();
    }, 15 * 60 * 1000); // 15 phút thay vì 5 phút

    // Kiểm tra trạng thái xác thực khi có thay đổi trong localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "userData") {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [isClient]);

  // Hàm đăng nhập
  const login = async (
    usernameOrPhoneNumber: string,
    password: string
  ): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthServiceFixed.login(
        usernameOrPhoneNumber,
        password
      );

      // Cập nhật trạng thái
      setIsAuthenticated(true);
      setUserData(AuthServiceFixed.getUserData());
      console.log("Đăng nhập thành công, đã lưu token và userData");

      return response;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Đăng nhập thất bại";
      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    if (!isClient) return;

    AuthServiceFixed.logout();
    setIsAuthenticated(false);
    setUserData(null);
    router.push("/login");
  };

  // Giá trị cho context
  const contextValue: AuthContextType = {
    isAuthenticated,
    userData,
    loading,
    error,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
