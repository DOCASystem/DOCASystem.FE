"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-provider";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  adminLayoutCheck?: boolean;
}

export default function AuthGuard({
  children,
  requireAdmin = false,
  adminLayoutCheck = false,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, userData, loading, refreshAuth } = useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Chỉ thực hiện ở client-side
    if (typeof window === "undefined") return;

    const checkAuth = async () => {
      console.log("AuthGuard - Đang kiểm tra xác thực...");

      // Làm mới trạng thái xác thực
      refreshAuth();

      // Đợi cho quá trình kiểm tra xác thực hoàn tất
      if (loading) {
        console.log("AuthGuard - Đang tải...");
        return;
      }

      console.log("AuthGuard - Trạng thái xác thực:", isAuthenticated);

      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      if (!isAuthenticated) {
        console.log(
          "AuthGuard - Chưa đăng nhập, chuyển hướng đến trang đăng nhập"
        );
        router.replace("/login");
        return;
      }

      // Chỉ kiểm tra quyền admin nếu đây là kiểm tra ở layout admin
      if (requireAdmin && adminLayoutCheck && userData?.username !== "admin") {
        console.log(
          "AuthGuard - Không có quyền admin, chuyển hướng đến trang chủ"
        );
        router.replace("/");
        return;
      }

      // Nếu đã xác thực và có quyền truy cập
      console.log("AuthGuard - Xác thực thành công!");
      setIsAuthorized(true);
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [
    isAuthenticated,
    loading,
    userData,
    router,
    requireAdmin,
    refreshAuth,
    adminLayoutCheck,
  ]);

  // Nếu đang kiểm tra xác thực, hiển thị màn hình loading
  if (isCheckingAuth || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Đang kiểm tra xác thực...</div>
      </div>
    );
  }

  // Nếu đã xác thực và có quyền, hiển thị nội dung
  return isAuthorized ? <>{children}</> : null;
}
