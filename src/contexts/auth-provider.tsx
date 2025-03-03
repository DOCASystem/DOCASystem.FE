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
      localStorage.setItem("token", newToken);
    }
  };

  const clearToken = () => {
    setTokenState(null);
    setUser(null);
    setRole(Role.GUEST);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
      const { ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      setRole(mockUser.role);

      // Tạo mock token
      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);

      // Lưu thông tin user
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      }

      return true;
    }

    return false;
  };

  const logout = () => {
    clearToken();
  };

  // Hàm kiểm tra quyền hạn
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return ROLE_PERMISSIONS[Role.GUEST].includes(permission);
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  const isAuthenticated = !!token && !!user;

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
