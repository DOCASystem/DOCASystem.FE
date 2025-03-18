import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "../api/generated";
import AuthService from "../service/auth.service";
import { AxiosError } from "axios";

/**
 * Auth store state interface
 */
interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  userData: Partial<LoginResponse> | null;
  token: string | null;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (
    usernameOrPhoneNumber: string,
    password: string
  ) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Zustand store for authentication state
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      userData: null,
      token: null,
      isLoading: false,
      error: null,

      /**
       * Login user with username/phone number and password
       */
      login: async (usernameOrPhoneNumber: string, password: string) => {
        // Server-side guard
        if (typeof window === "undefined") {
          return {} as LoginResponse;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await AuthService.login(
            usernameOrPhoneNumber,
            password
          );

          set({
            isAuthenticated: true,
            userData: AuthService.getUserData(),
            token: AuthService.getToken(),
          });

          return response;
        } catch (err) {
          const axiosError = err as AxiosError<{ message?: string }>;
          const errorMessage =
            axiosError.response?.data?.message ||
            (err instanceof Error ? err.message : "Login failed");

          set({ error: errorMessage });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Logout user and clear authentication state
       */
      logout: () => {
        // Server-side guard
        if (typeof window === "undefined") {
          return;
        }

        AuthService.logout();
        set({
          isAuthenticated: false,
          userData: null,
          token: null,
        });
      },

      /**
       * Clear any authentication errors
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "doca-auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        token: state.token,
      }),
    }
  )
);

/**
 * Initialize auth store with data from AuthService
 * Should be called on app init
 */
export const initializeAuthStore = () => {
  if (typeof window === "undefined") {
    return;
  }

  const isAuthenticated = AuthService.isAuthenticated();
  const userData = AuthService.getUserData();
  const token = AuthService.getToken();

  useAuthStore.setState({
    isAuthenticated,
    userData,
    token,
  });
};

export default useAuthStore;
