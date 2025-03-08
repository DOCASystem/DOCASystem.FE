import { useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    AuthService.isAuthenticated()
  );
  const [userData, setUserData] = useState<Partial<LoginResponse> | null>(
    AuthService.getUserData()
  );

  const login = async (
    usernameOrPhoneNumber: string,
    password: string
  ): Promise<LoginResponse> => {
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

  const logout = () => {
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
