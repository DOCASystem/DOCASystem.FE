"use client";

import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-provider";
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
  const { isAuthenticated, userData } = useAuthContext();
  const [authorized, setAuthorized] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const authCheckDone = useRef(false);

  // Hàm kiểm tra quyền đơn giản dựa vào role của user
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      // Nếu không có userData thì không có quyền
      if (!userData || !userData.username) return false;

      // Admin có tất cả các quyền
      if (userData.username === "admin") return true;

      // Người dùng bình thường chỉ có quyền VIEW
      if (permission.startsWith("VIEW_")) return true;

      return false;
    },
    [userData]
  );

  useEffect(() => {
    // Nếu đã kiểm tra xong và được phép truy cập, không cần kiểm tra lại
    if (authCheckDone.current) return;

    // Kiểm tra xác thực nếu cần
    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`);
      authCheckDone.current = true;
      setCheckComplete(true);
      return;
    }

    // Kiểm tra quyền nếu có yêu cầu
    if (requiredPermissions.length > 0) {
      // Sử dụng memo để tối ưu việc kiểm tra nhiều quyền
      const cacheKey = requiredPermissions.join(",");
      const cachedResult = sessionStorage.getItem(`perm_${cacheKey}`);

      if (cachedResult) {
        const hasPermissions = cachedResult === "true";
        setAuthorized(hasPermissions);

        if (!hasPermissions) {
          router.push("/unauthorized");
        }

        authCheckDone.current = true;
        setCheckComplete(true);
        return;
      }

      const hasAllPermissions = requiredPermissions.every((permission) =>
        hasPermission(permission)
      );

      // Lưu kết quả để tái sử dụng
      sessionStorage.setItem(
        `perm_${cacheKey}`,
        hasAllPermissions ? "true" : "false"
      );

      if (!hasAllPermissions) {
        router.push("/unauthorized");
        authCheckDone.current = true;
        setCheckComplete(true);
        return;
      }
    }

    setAuthorized(true);
    authCheckDone.current = true;
    setCheckComplete(true);
  }, [
    requireAuth,
    isAuthenticated,
    requiredPermissions,
    router,
    pathname,
    redirectTo,
    userData,
    hasPermission,
  ]);

  // Hiển thị trang loading trong khi kiểm tra quyền
  if (!checkComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Hiển thị nội dung nếu đã kiểm tra xong và được phép truy cập
  return authorized ? <>{children}</> : null;
}
