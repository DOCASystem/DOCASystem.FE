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
  const router = useRouter();

  // Hàm kiểm tra và cập nhật trạng thái xác thực
  const refreshAuth = () => {
    // Chỉ thực hiện ở client-side
    if (typeof window === "undefined") return;

    console.log("Đang kiểm tra trạng thái xác thực...");

    try {
      const authenticated = AuthServiceFixed.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const user = AuthServiceFixed.getUserData();
        setUserData(user);
        console.log("Xác thực thành công, userData:", user);
      } else {
        setUserData(null);
        console.log("Không có token xác thực");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra xác thực:", error);
      setIsAuthenticated(false);
      setUserData(null);
    }

    setLoading(false);
  };

  // Khởi tạo trạng thái khi component mount
  useEffect(() => {
    refreshAuth();

    // Kiểm tra lại trạng thái xác thực khi focus lại tab
    const handleFocus = () => {
      console.log("Tab được focus, kiểm tra lại xác thực");
      refreshAuth();
    };

    // Đăng ký sự kiện focus
    window.addEventListener("focus", handleFocus);

    // Kiểm tra định kỳ trạng thái xác thực (mỗi 5 phút)
    const intervalId = setInterval(() => {
      console.log("Kiểm tra định kỳ trạng thái xác thực");
      refreshAuth();
    }, 5 * 60 * 1000);

    // Kiểm tra trạng thái xác thực khi có thay đổi trong localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "userData") {
        console.log("Phát hiện thay đổi trong localStorage:", e.key);
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

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
