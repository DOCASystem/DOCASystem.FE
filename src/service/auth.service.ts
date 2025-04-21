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
 * (Được viết lại để phù hợp với quy trình đăng nhập mới)
 */
const saveUserData = (userData: Partial<LoginResponse>): void => {
  if (!isBrowser()) return;
  const userDataJson = JSON.stringify(userData);
  localStorage.setItem("userData", userDataJson);
  sessionStorage.setItem("cached_user_data", userDataJson);
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

  // Ưu tiên sử dụng sessionStorage để tăng tốc độ
  try {
    const cachedUserData = sessionStorage.getItem("cached_user_data");
    if (cachedUserData) {
      return JSON.parse(cachedUserData);
    }
  } catch (error) {
    console.error("Lỗi khi đọc userData từ sessionStorage:", error);
  }

  // Nếu không có trong session storage, lấy từ cache
  if (!authCache.isAuthCacheInitialized) {
    initializeAuthCache();
  }

  return authCache.userData || null;
};

/**
 * Fetch thông tin hồ sơ người dùng từ cache mà không gọi lại API
 * Phương thức này giúp tối ưu hiệu suất hiển thị profile khi đăng nhập
 */
const fetchUserProfile = (): Partial<LoginResponse> | null => {
  if (!isBrowser()) return null;

  // Ưu tiên lấy từ session storage trước để cải thiện hiệu suất
  try {
    const cachedUserData = sessionStorage.getItem("cached_user_data");
    if (cachedUserData) {
      return JSON.parse(cachedUserData);
    }
  } catch {
    // Nếu có lỗi, tiếp tục thử các phương thức khác
  }

  // Thử lấy từ cache
  if (authCache.userData) {
    return authCache.userData;
  }

  // Nếu chưa có trong cache, khởi tạo lại từ localStorage
  try {
    const userDataJson = localStorage.getItem("userData");
    if (userDataJson) {
      const userData = JSON.parse(userDataJson);
      // Lưu vào cache
      authCache.userData = userData;
      // Lưu vào session storage
      try {
        sessionStorage.setItem("cached_user_data", userDataJson);
      } catch {
        // Bỏ qua lỗi khi lưu vào sessionStorage
      }
      return userData;
    }
  } catch {
    // Bỏ qua lỗi khi đọc từ localStorage
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

  console.log("[AuthService] Đăng xuất và xóa dữ liệu xác thực");

  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  localStorage.removeItem("doca-auth-storage");

  // Clear sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("cached_user_data");

  // Clear cache
  authCache.token = null;
  authCache.refreshToken = null;
  authCache.userData = null;
  authCache.isAuthCacheInitialized = false;

  // Clear cookies
  deleteCookie("token");
  deleteCookie("userData");
  deleteCookie("refreshToken");

  console.log(
    "[AuthService] Đã xóa toàn bộ dữ liệu xác thực, chuyển hướng đến trang chủ"
  );

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
    console.log("[AuthService] Bắt đầu đăng nhập với:", {
      usernameOrPhoneNumber,
    });

    const loginRequest: LoginRequest = {
      usernameOrPhoneNumber,
      password,
    };

    const response = await authApi.apiV1LoginPost(loginRequest);
    const data = response.data;

    console.log(
      "[AuthService] Nhận được dữ liệu đăng nhập:",
      JSON.stringify(data, null, 2)
    );

    if (!data) {
      throw new Error("Invalid server response");
    }

    if (data.token) {
      console.log(
        "[AuthService] Lưu token:",
        data.token.substring(0, 10) + "..."
      );
      saveToken(data.token);
    } else {
      console.error("[AuthService] Không có token trong phản hồi");
    }

    if (data.refreshToken) {
      saveRefreshToken(data.refreshToken);
    }

    // Đảm bảo dữ liệu người dùng đầy đủ
    const userData = {
      id: data.id || "",
      username: data.username || usernameOrPhoneNumber,
      phoneNumber: data.phoneNumber || "",
      fullName: data.fullName || "",
      roles: data.roles || ["USER"],
    };

    // Config cứng: Nếu username là "admin", luôn thêm quyền ADMIN
    if (userData.username === "admin" || usernameOrPhoneNumber === "admin") {
      console.log(
        "[AuthService] Phát hiện tài khoản admin - cấp quyền quản trị"
      );
      // Đảm bảo vai trò ADMIN có trong mảng roles
      if (!userData.roles.includes("ADMIN")) {
        userData.roles.push("ADMIN");
      }
    }

    console.log("[AuthService] Lưu thông tin người dùng:", userData);

    // Sử dụng hàm saveUserData để lưu thông tin
    saveUserData(userData);

    // Thông báo đăng nhập thành công và hiển thị thông tin
    console.log(
      "[AuthService] Đăng nhập thành công, thông tin người dùng:",
      authCache.userData
    );

    return data;
  } catch (error) {
    console.error("[AuthService] Lỗi đăng nhập:", error);
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      "Kiểm tra lại tài khoản và mật khẩu";
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
  fetchUserProfile,

  /**
   * Check user session and redirect if not authenticated
   * This is an optimized version that uses the cache
   */
  checkSession: (): boolean => {
    if (!isBrowser()) return false;

    // Kiểm tra xác thực
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return false;
    }

    // Đã đăng nhập, kiểm tra nếu là admin
    const userData = getUserData();
    const isAdmin =
      userData?.username === "admin" ||
      (userData?.roles && userData.roles.includes("ADMIN"));

    // Kiểm tra nếu đang ở trang admin mà không phải admin
    // QUAN TRỌNG: Trong Next.js, (admin) là route group và không xuất hiện trong URL
    // URL thực tế sẽ bắt đầu bằng /admin, không phải /(admin)
    if (window.location.pathname.startsWith("/admin") && !isAdmin) {
      console.log(
        "[AuthService] Phát hiện truy cập trang admin nhưng không có quyền, chuyển hướng về trang chủ"
      );
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
