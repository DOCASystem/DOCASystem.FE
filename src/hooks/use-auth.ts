import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  username: string;
  role: "ADMIN" | "USER" | "EDITOR";
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      // Gọi API login
      // Lưu token vào localStorage
      // Set user state
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return { user, login, logout };
};
