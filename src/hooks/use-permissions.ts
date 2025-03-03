import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/auth/types";

export function usePermissions() {
  const { role, hasPermission, isAuthenticated, user } = useAuth();

  const isAdmin = role === Role.ADMIN;
  const isUser = role === Role.USER;
  const isGuest = role === Role.GUEST || !isAuthenticated;

  return {
    role,
    hasPermission,
    isAdmin,
    isUser,
    isGuest,
    isAuthenticated,
    user,
  };
}
