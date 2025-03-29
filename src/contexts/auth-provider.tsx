"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { LoginResponse } from "@/api/generated";
import { useRouter } from "next/navigation";
import useAuthStore, { initializeAuthStore } from "@/store/auth-store";
import { Toaster } from "react-hot-toast";

// Define interface for context
interface AuthContextType {
  isAuthenticated: boolean;
  userData: Partial<LoginResponse> | null;
  isLoading: boolean;
  error: string | null;
  userRoles?: string[];
  login: (
    usernameOrPhoneNumber: string,
    password: string
  ) => Promise<LoginResponse>;
  logout: () => void;
  refreshAuth: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: null,
  isLoading: false,
  error: null,
  userRoles: [],
  login: async () => {
    console.warn("AuthContext not properly initialized");
    return {} as LoginResponse;
  },
  logout: () => {
    console.warn("AuthContext not properly initialized");
  },
  refreshAuth: () => {
    console.warn("AuthContext not properly initialized");
  },
});

// Custom hook to use context
export const useAuthContext = () => useContext(AuthContext);

// Props for Provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider component
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  // Get auth state from Zustand store
  const {
    isAuthenticated,
    userData,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
  } = useAuthStore();

  // Initialize auth state on client-side once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeAuthStore();
    }
  }, []);

  /**
   * Refresh authentication state
   * This will only refresh if more than 5 minutes have passed since last check
   */
  const refreshAuth = () => {
    if (typeof window === "undefined") return;
    initializeAuthStore();
  };

  /**
   * Login with username/phone number and password
   */
  const login = async (
    usernameOrPhoneNumber: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await storeLogin(usernameOrPhoneNumber, password);
      return response;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Logout user and redirect to login page
   */
  const logout = () => {
    storeLogout();
    router.push("/");
  };

  // Check for token expiration or changes (optimized to reduce frequency)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Refresh auth state when focused, but not on every focus event
    let lastFocusTime = Date.now();
    const FOCUS_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusTime > FOCUS_THRESHOLD) {
        refreshAuth();
        lastFocusTime = now;
      }
    };

    window.addEventListener("focus", handleFocus);

    // Check auth state periodically (every 30 minutes instead of 15)
    const intervalId = setInterval(refreshAuth, 30 * 60 * 1000);

    // Listen for storage changes (this can't be optimized as we need to respond to all storage changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "token" ||
        e.key === "userData" ||
        e.key === "doca-auth-storage"
      ) {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      userData,
      isLoading,
      error,
      userRoles: userData?.roles || [],
      login,
      logout,
      refreshAuth,
    }),
    [isAuthenticated, userData, isLoading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
