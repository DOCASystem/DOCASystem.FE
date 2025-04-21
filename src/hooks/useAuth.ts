import { useState, useEffect, useCallback } from "react";
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
  clearError: () => void;
}

/**
 * React hook for handling authentication
 * @returns Authentication methods and state
 */
export function useAuth(): UseAuthResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<Partial<LoginResponse> | null>(null);

  // Initialize auth state on component mount
  useEffect(() => {
    // Only run in client-side and not during build
    if (
      typeof window === "undefined" ||
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
    ) {
      return;
    }

    setIsAuthenticated(AuthService.isAuthenticated());
    setUserData(AuthService.getUserData());
  }, []);

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Login with username/phone number and password
   */
  const login = useCallback(
    async (
      usernameOrPhoneNumber: string,
      password: string
    ): Promise<LoginResponse> => {
      // Check environment
      if (
        typeof window === "undefined" ||
        process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
      ) {
        return {} as LoginResponse;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await AuthService.login(
          usernameOrPhoneNumber,
          password
        );
        setIsAuthenticated(true);
        setUserData(AuthService.getUserData());
        return response;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Kiểm tra lại tài khoản và mật khẩu");
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    if (
      typeof window === "undefined" ||
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
    ) {
      return;
    }

    AuthService.logout();
    setIsAuthenticated(false);
    setUserData(null);
  }, []);

  return {
    login,
    logout,
    isAuthenticated,
    userData,
    loading,
    error,
    clearError,
  };
}

export default useAuth;
