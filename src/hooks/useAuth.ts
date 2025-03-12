import { useState, useEffect } from "react";
import { LoginResponse } from "../api/generated";
import AuthService from "../service/auth.service";
import { AxiosError } from "axios";

export interface UseAuthResult {
  login: (
    usernameOrPhoneNumber: string,
    password: string
  ) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  userData: Partial<LoginResponse> | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthResult {
  // Khai báo state theo quy tắc hooks - phải gọi ở đầu và không có điều kiện
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<Partial<LoginResponse> | null>(null);

  // Dùng useEffect để khởi tạo giá trị sau khi component mount
  useEffect(() => {
    // Chỉ thực hiện khi ở client-side và không phải lúc build
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES !== "true"
    ) {
      setIsAuthenticated(AuthService.isAuthenticated());
      setUserData(AuthService.getUserData());
    }
  }, []);

  // Hàm login an toàn
  const login = async (
    usernameOrPhoneNumber: string,
    password: string
  ): Promise<LoginResponse> => {
    // Kiểm tra môi trường
    if (
      typeof window === "undefined" ||
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
    ) {
      return {} as LoginResponse;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(usernameOrPhoneNumber, password);
      setIsAuthenticated(true);
      setUserData(AuthService.getUserData());
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

  // Hàm logout an toàn
  const logout = () => {
    if (
      typeof window === "undefined" ||
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
    ) {
      return;
    }

    AuthService.logout();
    setIsAuthenticated(false);
    setUserData(null);
  };

  return {
    login,
    logout,
    isAuthenticated,
    userData,
    loading,
    error,
  };
}

export default useAuth;
