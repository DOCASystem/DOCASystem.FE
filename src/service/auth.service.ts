import { LoginRequest, LoginResponse } from "../api/generated";
import { authApi } from "../api/services";

// Helper kiểm tra nếu đang ở môi trường browser
const isBrowser = () => typeof window !== "undefined";

// Lưu token vào localStorage
const saveToken = (token: string) => {
  if (isBrowser()) {
    localStorage.setItem("token", token);
  }
};

// Lưu refreshToken vào localStorage
const saveRefreshToken = (refreshToken: string) => {
  if (isBrowser()) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Lưu thông tin người dùng vào localStorage
const saveUserData = (userData: Partial<LoginResponse>) => {
  if (isBrowser()) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
};

// Kiểm tra xem người dùng đã đăng nhập chưa
const isAuthenticated = (): boolean => {
  if (!isBrowser()) return false;
  const token = localStorage.getItem("token");
  return !!token;
};

// Lấy token từ localStorage
const getToken = (): string => {
  if (!isBrowser()) return "";
  return localStorage.getItem("token") || "";
};

// Lấy refreshToken từ localStorage
const getRefreshToken = (): string => {
  if (!isBrowser()) return "";
  return localStorage.getItem("refreshToken") || "";
};

// Lấy thông tin người dùng từ localStorage
const getUserData = (): Partial<LoginResponse> | null => {
  if (!isBrowser()) return null;
  const userData = localStorage.getItem("userData");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

// Hàm xóa cookie
const deleteCookie = (name: string) => {
  if (isBrowser()) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

// Đăng xuất
const logout = () => {
  if (isBrowser()) {
    // Xóa dữ liệu từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");

    // Xóa cookie
    deleteCookie("token");
    deleteCookie("userData");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "/login";
  }
};

// Đăng nhập
const login = async (
  usernameOrPhoneNumber: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const loginRequest: LoginRequest = {
      usernameOrPhoneNumber,
      password,
    };

    const response = await authApi.apiV1LoginPost(loginRequest);
    const data = response.data;

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
    throw error;
  }
};

// Làm mới token khi token hiện tại hết hạn
const refreshToken = async (): Promise<boolean> => {
  try {
    const currentRefreshToken = getRefreshToken();

    if (!currentRefreshToken) {
      return false;
    }

    // Gọi API làm mới token (cần thêm khi có API sẵn)
    // const response = await authApi.apiV1RefreshTokenPost({ refreshToken: currentRefreshToken });

    // Nếu có API refresh token, thay thế đoạn code dưới đây
    // Giả sử response.data chứa token mới và refreshToken mới
    // saveToken(response.data.token);
    // saveRefreshToken(response.data.refreshToken);

    return true;
  } catch {
    // Nếu không làm mới được token, đăng xuất người dùng
    logout();
    return false;
  }
};

const AuthService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getUserData,
  refreshToken,
  getRefreshToken,

  // Phương thức kiểm tra phiên đăng nhập và xử lý tự động chuyển hướng
  checkSession: () => {
    if (!isBrowser()) return false;

    if (!isAuthenticated()) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      window.location.href = "/login";
      return false;
    }
    return true;
  },
};

export default AuthService;
