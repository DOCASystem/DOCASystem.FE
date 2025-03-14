// Hàm lấy token an toàn từ localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "AuthService - Token đọc từ localStorage:",
        token ? "Có token" : "Không có token"
      );
      return token || "";
    } catch (error) {
      console.error("AuthService - Lỗi khi đọc token từ localStorage:", error);
      return "";
    }
  }
  return "";
};

// Hàm lưu token vào localStorage
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
      console.log("AuthService - Token đã được lưu vào localStorage");
    } catch (error) {
      console.error("AuthService - Lỗi khi lưu token vào localStorage:", error);
    }
  }
};

// Hàm xóa token khỏi localStorage
export const removeToken = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("token");
      console.log("AuthService - Token đã được xóa khỏi localStorage");
    } catch (error) {
      console.error(
        "AuthService - Lỗi khi xóa token khỏi localStorage:",
        error
      );
    }
  }
};

// Kiểm tra xem token có tồn tại không
export const hasToken = (): boolean => {
  return !!getToken();
};
