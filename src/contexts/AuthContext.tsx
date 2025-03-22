"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth, UseAuthResult } from "../hooks/useAuth";
import { LoginResponse } from "../api/generated";

// Tạo một giá trị mặc định an toàn cho AuthContext
const defaultAuthContext: UseAuthResult = {
  login: async () => {
    console.warn("AuthContext chưa được khởi tạo đúng cách");
    return {} as LoginResponse;
  },
  logout: () => {
    console.warn("AuthContext chưa được khởi tạo đúng cách");
  },
  isAuthenticated: false,
  userData: null,
  loading: false,
  error: null,
  clearError: function (): void {
    throw new Error("Function not implemented.");
  },
};

// Tạo context với giá trị mặc định an toàn
const AuthContext = createContext<UseAuthResult>(defaultAuthContext);

// Custom hook để sử dụng AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  // Không ném lỗi nữa mà trả về giá trị mặc định nếu không có context
  return context;
};

// Props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  // useEffect phải được gọi ở đầu component, không có điều kiện
  useEffect(() => {
    // Chỉ thực hiện logic xác thực khi không phải build time
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES !== "true"
    ) {
      // Có thể thêm logic để kiểm tra token hiện tại có hợp lệ không
      // Ví dụ: gọi API để xác thực token
    }
  }, []);

  // Kiểm tra trong quá trình build
  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
  ) {
    // Trả về children mà không có AuthContext.Provider trong quá trình build
    return <>{children}</>;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
