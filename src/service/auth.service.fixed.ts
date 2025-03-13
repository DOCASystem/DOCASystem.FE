import { LoginRequest, LoginResponse } from "../api/generated";
import { authApi } from "../api/services";

// Helper kiểm tra nếu đang ở môi trường browser
const isBrowser = () => typeof window !== "undefined";

// Lưu token vào localStorage và cookie
const saveToken = (token: string) => {
  if (isBrowser()) {
    try {
      localStorage.setItem("token", token);
      // Lưu vào cookie với path=/ để có thể truy cập từ mọi đường dẫn
      document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7 ngày
      console.log("Token đã được lưu vào localStorage và cookie");
    } catch (error) {
      console.error("Lỗi khi lưu token:", error);
    }
  }
};

// Lưu refreshToken vào localStorage
const saveRefreshToken = (refreshToken: string) => {
  if (isBrowser()) {
    try {
      localStorage.setItem("refreshToken", refreshToken);
      document.cookie = `refreshToken=${encodeURIComponent(
        refreshToken
      )}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 ngày
    } catch (error) {
      console.error("Lỗi khi lưu refreshToken:", error);
    }
  }
};

// Lưu thông tin người dùng vào localStorage và cookie
const saveUserData = (userData: Partial<LoginResponse>) => {
  if (isBrowser()) {
    try {
      const userDataString = JSON.stringify(userData);
      localStorage.setItem("userData", userDataString);
      document.cookie = `userData=${encodeURIComponent(
        userDataString
      )}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 ngày
      console.log("userData đã được lưu vào localStorage và cookie");
    } catch (error) {
      console.error("Lỗi khi lưu userData:", error);
    }
  }
};

// Kiểm tra xem người dùng đã đăng nhập chưa - đã tối ưu hiệu suất
const isAuthenticated = (): boolean => {
  if (!isBrowser()) return false;

  try {
    // Sử dụng cache để tránh kiểm tra lặp lại
    const cachedAuth = sessionStorage.getItem("auth_status");
    if (cachedAuth) {
      return cachedAuth === "true";
    }

    // Kiểm tra token trong localStorage
    const token = localStorage.getItem("token");
    const hasToken = !!token;

    // Lưu kết quả vào cache
    sessionStorage.setItem("auth_status", hasToken ? "true" : "false");

    return hasToken;
  } catch {
    return false;
  }
};

// Lấy token từ localStorage hoặc cookie
const getToken = (): string => {
  if (!isBrowser()) return "";

  // Thử lấy từ localStorage trước
  const token = localStorage.getItem("token");
  if (token) return token;

  // Nếu không có trong localStorage, thử tìm trong cookie
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
      const tokenFromCookie = decodeURIComponent(cookie.substring(6));
      // Lưu lại vào localStorage
      localStorage.setItem("token", tokenFromCookie);
      return tokenFromCookie;
    }
  }

  return "";
};

// Lấy refreshToken từ localStorage hoặc cookie
const getRefreshToken = (): string => {
  if (!isBrowser()) return "";

  // Thử lấy từ localStorage trước
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) return refreshToken;

  // Nếu không có trong localStorage, thử tìm trong cookie
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("refreshToken=")) {
      const refreshTokenFromCookie = decodeURIComponent(cookie.substring(13));
      // Lưu lại vào localStorage
      localStorage.setItem("refreshToken", refreshTokenFromCookie);
      return refreshTokenFromCookie;
    }
  }

  return "";
};

// Lấy thông tin người dùng từ localStorage hoặc cookie - đã tối ưu hiệu suất
const getUserData = (): Partial<LoginResponse> | null => {
  if (!isBrowser()) return null;

  try {
    // Sử dụng cache để tránh phân tích JSON lặp lại
    const cachedUserData = sessionStorage.getItem("cached_user_data");
    if (cachedUserData) {
      return JSON.parse(cachedUserData);
    }

    // Thử lấy từ localStorage trước
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      // Lưu vào cache
      sessionStorage.setItem("cached_user_data", userDataStr);
      return userData;
    }

    return null;
  } catch {
    return null;
  }
};

// Hàm xóa cookie
const deleteCookie = (name: string) => {
  if (isBrowser()) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`Cookie ${name} đã được xóa`);
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
    deleteCookie("refreshToken");
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

const AuthServiceFixed = {
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

export default AuthServiceFixed;
