"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Configuration } from "../api/generated";
import { Role, Permission, ROLE_PERMISSIONS, User } from "@/auth/types";

interface AuthContextType {
  token: string | null;
  user: User | null;
  role: Role;
  setToken: (token: string) => void;
  clearToken: () => void;
  updateApiConfig: () => Configuration;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isAuthenticated: boolean;
}

// Dữ liệu người dùng mẫu cho 3 vai trò
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: Role.ADMIN,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Người dùng",
    email: "user@example.com",
    password: "user123",
    role: Role.USER,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Thời gian hết hạn token (7 ngày tính bằng ms)
const TOKEN_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

// Hàm lưu cookie
const setCookie = (name: string, value: string, days: number) => {
  if (typeof window !== "undefined") {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // Thêm các flag bảo mật
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; SameSite=Strict; Secure`;
  }
};

// Hàm xóa cookie
const deleteCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
  }
};

// Hàm tạo một token ngẫu nhiên an toàn hơn
const generateSecureToken = () => {
  // Tạo một token ngẫu nhiên 32 bytes và mã hóa base64
  const randomValues = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    // Sử dụng Web Crypto API nếu có
    window.crypto.getRandomValues(randomValues);
  } else {
    // Fallback cho môi trường không hỗ trợ Crypto API
    for (let i = 0; i < randomValues.length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  // Chuyển mảng bytes thành chuỗi Base64
  const base64 = btoa(
    String.fromCharCode.apply(null, Array.from(randomValues))
  );
  // Làm sạch chuỗi để an toàn cho URL
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(Role.GUEST);

  useEffect(() => {
    // Lấy token và user từ localStorage khi component được mount (chỉ ở client-side)
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setTokenState(storedToken);
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setRole(parsedUser.role);
        } catch (error) {
          console.error("Lỗi phân tích dữ liệu người dùng:", error);
        }
      }
    }
  }, []);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    if (typeof window !== "undefined") {
      // Lưu token với các biện pháp bảo mật
      localStorage.setItem("token", newToken);

      // Tính thời gian hết hạn
      const expiryTime = Date.now() + TOKEN_EXPIRY_TIME;

      // Lưu token và thời gian hết hạn vào cookie
      setCookie("token", newToken, 7); // Lưu cookie trong 7 ngày
      setCookie("token_expiry", expiryTime.toString(), 7);
    }
  };

  const clearToken = () => {
    setTokenState(null);
    setUser(null);
    setRole(Role.GUEST);
    if (typeof window !== "undefined") {
      // Xóa dữ liệu từ localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Xóa cookies
      deleteCookie("token");
      deleteCookie("token_expiry");
      deleteCookie("userData");
    }
  };

  const updateApiConfig = () => {
    return new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      baseOptions: {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    });
  };

  // Mock login function - sau này sẽ thay bằng API thật
  const login = async (email: string, password: string): Promise<boolean> => {
    // Giả lập gọi API để đăng nhập
    const mockUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (mockUser) {
      // Tạo bản sao đối tượng người dùng và loại bỏ mật khẩu để bảo mật
      const userWithoutPassword = Object.fromEntries(
        Object.entries(mockUser).filter(([key]) => key !== "password")
      ) as Omit<typeof mockUser, "password">;

      setUser(userWithoutPassword);
      setRole(mockUser.role);

      // Tạo mock token an toàn hơn
      const mockToken = generateSecureToken();
      setToken(mockToken);

      // Lưu thông tin user
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        setCookie("userData", JSON.stringify(userWithoutPassword), 7); // Lưu cookie trong 7 ngày
      }

      return true;
    }

    return false;
  };

  const logout = () => {
    clearToken();

    // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Hàm kiểm tra quyền hạn
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return ROLE_PERMISSIONS[Role.GUEST].includes(permission);
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  const isAuthenticated = !!token && !!user;

  // Thêm hàm kiểm tra token hết hạn
  const checkTokenExpiry = () => {
    if (typeof window !== "undefined") {
      const expiryStr = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token_expiry="))
        ?.split("=")[1];

      if (expiryStr) {
        const expiry = parseInt(expiryStr);
        if (expiry < Date.now()) {
          // Token đã hết hạn, đăng xuất
          clearToken();
          return false;
        }
      }
    }

    return true;
  };

  // Kiểm tra token hết hạn khi component được mount
  useEffect(() => {
    if (token) {
      const isValid = checkTokenExpiry();
      if (!isValid) {
        clearToken();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        setToken,
        clearToken,
        updateApiConfig,
        login,
        logout,
        hasPermission,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
