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
  lastChecked: number | null;

  // Auth actions
  login: (
    usernameOrPhoneNumber: string,
    password: string
  ) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
  updateLastChecked: () => void;
}

// Time threshold for auth checks (5 minutes)
const AUTH_CHECK_THRESHOLD = 5 * 60 * 1000;

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
      lastChecked: null,

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
            lastChecked: Date.now(),
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
          lastChecked: Date.now(),
        });
      },

      /**
       * Clear any authentication errors
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Update the last checked timestamp
       */
      updateLastChecked: () => {
        set({ lastChecked: Date.now() });
      },
    }),
    {
      name: "doca-auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        token: state.token,
        lastChecked: state.lastChecked,
      }),
    }
  )
);

/**
 * Initialize auth store with data from AuthService
 * Should be called on app init with throttling
 */
export const initializeAuthStore = () => {
  if (typeof window === "undefined") {
    return;
  }

  const state = useAuthStore.getState();
  const now = Date.now();

  // Skip revalidation if checked recently (within 5 minutes)
  if (state.lastChecked && now - state.lastChecked < AUTH_CHECK_THRESHOLD) {
    return;
  }

  // If token exists in localStorage but not in state, update state
  const isAuthenticated = AuthService.isAuthenticated();

  if (isAuthenticated) {
    const userData = AuthService.getUserData();
    const token = AuthService.getToken();

    useAuthStore.setState({
      isAuthenticated,
      userData,
      token,
      lastChecked: now,
    });
  } else if (state.isAuthenticated) {
    // If state says authenticated but localStorage doesn't, update state
    useAuthStore.setState({
      isAuthenticated: false,
      userData: null,
      token: null,
      lastChecked: now,
    });
  } else {
    // Just update the lastChecked timestamp
    useAuthStore.getState().updateLastChecked();
  }
};

export default useAuthStore;
