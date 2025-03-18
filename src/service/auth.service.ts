import { LoginRequest, LoginResponse } from "../api/generated";
import { authApi } from "../api/services";
import { AxiosError } from "axios";

// Type definitions
export type AuthError = {
  message: string;
  code?: string;
};

// Cache for auth data to reduce localStorage calls
const authCache = {
  token: null as string | null,
  refreshToken: null as string | null,
  userData: null as Partial<LoginResponse> | null,
  isAuthCacheInitialized: false,
};

/**
 * Initialize auth cache from localStorage
 */
const initializeAuthCache = (): void => {
  if (typeof window === "undefined" || authCache.isAuthCacheInitialized) return;

  authCache.token = localStorage.getItem("token");
  authCache.refreshToken = localStorage.getItem("refreshToken");

  try {
    const userDataJson = localStorage.getItem("userData");
    authCache.userData = userDataJson ? JSON.parse(userDataJson) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    authCache.userData = null;
  }

  authCache.isAuthCacheInitialized = true;
};

/**
 * Check if code is running in browser environment
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Save authentication token to localStorage and cache
 */
const saveToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem("token", token);
  authCache.token = token;
};

/**
 * Save refresh token to localStorage and cache
 */
const saveRefreshToken = (refreshToken: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem("refreshToken", refreshToken);
  authCache.refreshToken = refreshToken;
};

/**
 * Save user data to localStorage and cache
 */
const saveUserData = (userData: Partial<LoginResponse>): void => {
  if (!isBrowser()) return;
  const userDataJson = JSON.stringify(userData);
  localStorage.setItem("userData", userDataJson);
  authCache.userData = userData;
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  if (!isBrowser()) return false;

  if (!authCache.isAuthCacheInitialized) {
    initializeAuthCache();
  }

  return !!authCache.token;
};

/**
 * Get authentication token from cache/localStorage
 */
const getToken = (): string => {
  if (!isBrowser()) return "";

  if (!authCache.isAuthCacheInitialized) {
    initializeAuthCache();
  }

  return authCache.token || "";
};

/**
 * Get refresh token from cache/localStorage
 */
const getRefreshToken = (): string => {
  if (!isBrowser()) return "";

  if (!authCache.isAuthCacheInitialized) {
    initializeAuthCache();
  }

  return authCache.refreshToken || "";
};

/**
 * Get user data from cache/localStorage
 */
const getUserData = (): Partial<LoginResponse> | null => {
  if (!isBrowser()) return null;

  if (!authCache.isAuthCacheInitialized) {
    initializeAuthCache();
  }

  return authCache.userData;
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

  // Clear cache
  authCache.token = null;
  authCache.refreshToken = null;
  authCache.userData = null;

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
   * This is an optimized version that uses the cache
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

// Initialize cache on import
if (isBrowser()) {
  initializeAuthCache();
}

export default AuthService;
