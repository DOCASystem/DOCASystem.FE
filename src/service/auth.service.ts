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

  // Thử lấy từ session storage trước để cải thiện tốc độ
  try {
    const cachedUserData = sessionStorage.getItem("cached_user_data");
    if (cachedUserData) {
      return JSON.parse(cachedUserData);
    }
  } catch (error) {
    console.error("Lỗi khi đọc userData từ sessionStorage:", error);
  }

  // Nếu không có trong session storage, kiểm tra cache
  if (!authCache.isAuthCacheInitialized) {
    initializeAuthCache();
  }

  // Nếu có trong cache thì trả về
  if (authCache.userData) {
    // Lưu vào session storage để truy cập nhanh hơn lần sau
    try {
      sessionStorage.setItem(
        "cached_user_data",
        JSON.stringify(authCache.userData)
      );
    } catch (error) {
      console.error("Lỗi khi lưu userData vào sessionStorage:", error);
    }
    return authCache.userData;
  }

  // Nếu không có trong cache, thử lấy từ localStorage
  try {
    const userDataJson = localStorage.getItem("userData");
    if (userDataJson) {
      const userData = JSON.parse(userDataJson);
      // Cập nhật cache
      authCache.userData = userData;
      // Lưu vào session storage
      sessionStorage.setItem("cached_user_data", userDataJson);
      return userData;
    }
  } catch (error) {
    console.error("Lỗi khi đọc userData từ localStorage:", error);
  }

  return null;
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

  // Redirect to home page instead of login page
  window.location.href = "/";
};

/**
 * Reset cache và tải lại dữ liệu từ localStorage
 * Dùng sau khi đăng nhập hoặc khi cần làm mới dữ liệu
 */
const resetCache = (): void => {
  if (!isBrowser()) return;

  // Xóa cache trong bộ nhớ
  authCache.isAuthCacheInitialized = false;

  // Làm mới cache từ localStorage
  initializeAuthCache();

  // Làm mới session storage
  try {
    // Xóa cache cũ
    sessionStorage.removeItem("cached_user_data");

    // Lấy dữ liệu mới từ localStorage và lưu vào sessionStorage
    const userDataJson = localStorage.getItem("userData");
    if (userDataJson) {
      sessionStorage.setItem("cached_user_data", userDataJson);
    }
  } catch (error) {
    console.error("Lỗi khi làm mới sessionStorage:", error);
  }
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
      roles: data.roles || ["USER"], // Đảm bảo có thông tin roles
    };

    saveUserData(userData);

    // Làm mới toàn bộ cache sau khi đăng nhập
    resetCache();

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
  resetCache,

  /**
   * Check user session and redirect if not authenticated
   * This is an optimized version that uses the cache
   */
  checkSession: (): boolean => {
    if (!isBrowser()) return false;

    if (!isAuthenticated()) {
      window.location.href = "/";
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
