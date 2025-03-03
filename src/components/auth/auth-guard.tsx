import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Permission } from "@/auth/types";

interface AuthGuardProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requiredPermissions = [],
  requireAuth = false,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasPermission } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Kiểm tra xác thực nếu cần
    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Kiểm tra quyền nếu có yêu cầu
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every((permission) =>
        hasPermission(permission)
      );

      if (!hasAllPermissions) {
        router.push("/unauthorized");
        return;
      }
    }

    setAuthorized(true);
  }, [
    requireAuth,
    isAuthenticated,
    requiredPermissions,
    hasPermission,
    router,
    pathname,
    redirectTo,
  ]);

  // Hiển thị trang loading trong khi kiểm tra quyền
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return <>{children}</>;
}
