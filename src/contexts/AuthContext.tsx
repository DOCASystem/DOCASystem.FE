"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth, UseAuthResult } from "../hooks/useAuth";

// Tạo context với giá trị mặc định
const AuthContext = createContext<UseAuthResult | undefined>(undefined);

// Custom hook để sử dụng AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext phải được sử dụng trong AuthProvider");
  }
  return context;
};

// Props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    // Có thể thêm logic để kiểm tra token hiện tại có hợp lệ không
    // Ví dụ: gọi API để xác thực token
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
