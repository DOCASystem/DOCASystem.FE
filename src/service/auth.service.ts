import { LoginRequest, LoginResponse } from "../api/generated";
import { authApi } from "../api/services";
import { AxiosError } from "axios";

// Type definitions
export type AuthError = {
  message: string;
  code?: string;
};

/**
 * Check if code is running in browser environment
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Save authentication token to localStorage
 */
const saveToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem("token", token);
};

/**
 * Save refresh token to localStorage
 */
const saveRefreshToken = (refreshToken: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem("refreshToken", refreshToken);
};

/**
 * Save user data to localStorage
 */
const saveUserData = (userData: Partial<LoginResponse>): void => {
  if (!isBrowser()) return;
  localStorage.setItem("userData", JSON.stringify(userData));
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  if (!isBrowser()) return false;
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Get authentication token from localStorage
 */
const getToken = (): string => {
  if (!isBrowser()) return "";
  return localStorage.getItem("token") || "";
};

/**
 * Get refresh token from localStorage
 */
const getRefreshToken = (): string => {
  if (!isBrowser()) return "";
  return localStorage.getItem("refreshToken") || "";
};

/**
 * Get user data from localStorage
 */
const getUserData = (): Partial<LoginResponse> | null => {
  if (!isBrowser()) return null;

  try {
    const userData = localStorage.getItem("userData");
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

/**
 * Delete browser cookie
 */
const deleteCookie = (name: string): void => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Logout user and clear all authentication data
 */
const logout = (): void => {
  if (!isBrowser()) return;

  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");

  // Clear cookies
  deleteCookie("token");
  deleteCookie("userData");

  // Redirect to login page
  window.location.href = "/login";
};

/**
 * Login user with username/phone number and password
 */
const login = async (
  usernameOrPhoneNumber: string,
  password: string
): Promise<LoginResponse> => {
  if (!isBrowser() || process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true") {
    return {} as LoginResponse;
  }

  try {
    const loginRequest: LoginRequest = {
      usernameOrPhoneNumber,
      password,
    };

    const response = await authApi.apiV1LoginPost(loginRequest);
    const data = response.data;

    if (!data) {
      throw new Error("Invalid server response");
    }

    if (data.token) {
      saveToken(data.token);
    }

    if (data.refreshToken) {
      saveRefreshToken(data.refreshToken);
    }

    const userData = {
      id: data.id,
      username: data.username,
      phoneNumber: data.phoneNumber,
      fullName: data.fullName,
    };

    saveUserData(userData);

    return data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

/**
 * Refresh authentication token using refresh token
 */
const refreshToken = async (): Promise<boolean> => {
  if (!isBrowser()) return false;

  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) return false;

  try {
    // Implementation would need to be updated when refresh token API is available
    // const response = await authApi.apiV1RefreshTokenPost({ refreshToken: currentRefreshToken });
    // saveToken(response.data.token);
    // saveRefreshToken(response.data.refreshToken);

    return true;
  } catch {
    logout();
    return false;
  }
};

/**
 * Auth service implementation
 */
const AuthService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getUserData,
  refreshToken,
  getRefreshToken,

  /**
   * Check user session and redirect if not authenticated
   */
  checkSession: (): boolean => {
    if (!isBrowser()) return false;

    if (!isAuthenticated()) {
      window.location.href = "/login";
      return false;
    }
    return true;
  },
};

export default AuthService;
