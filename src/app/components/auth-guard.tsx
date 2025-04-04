"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { isAuthenticated, userData, isLoading, refreshAuth } =
    useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authCheckCount, setAuthCheckCount] = useState(0);

  // Kiểm tra token trong localStorage
  const checkTokenInStorage = () => {
    // Kiểm tra token trực tiếp
    const storedToken = localStorage.getItem("token");
    if (storedToken) return true;

    // Kiểm tra trong doca-auth-storage
    const authData = localStorage.getItem("doca-auth-storage");
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        if (parsedData?.state?.userData?.token) {
          return true;
        }
      } catch (e) {
        console.error("Error parsing auth data:", e);
      }
    }

    return false;
  };

  useEffect(() => {
    // Chỉ thực hiện ở client-side
    if (typeof window === "undefined") return;

    // Kiểm tra token trong localStorage trước để tránh redirect sớm
    const hasLocalToken = checkTokenInStorage();

    const checkAuth = async () => {
      console.log("AuthGuard - Đang kiểm tra xác thực...");

      // Làm mới trạng thái xác thực
      refreshAuth();

      // Đợi cho quá trình kiểm tra xác thực hoàn tất
      if (isLoading) {
        console.log("AuthGuard - Đang tải...");
        return;
      }

      console.log("AuthGuard - Trạng thái xác thực:", isAuthenticated);
      setAuthCheckCount((prev) => prev + 1);

      // Nếu chưa đăng nhập và đã kiểm tra nhiều lần, chuyển hướng đến trang đăng nhập
      if (!isAuthenticated && !hasLocalToken && authCheckCount >= 2) {
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

      // Nếu đã xác thực hoặc có token trong localStorage, cho phép truy cập
      if (isAuthenticated || (hasLocalToken && pathname.includes("/profile"))) {
        console.log(
          "AuthGuard - Xác thực thành công hoặc đang ở trang profile với token trong localStorage!"
        );
        setIsAuthorized(true);
        setIsCheckingAuth(false);
      }
    };

    const timer = setTimeout(checkAuth, 800); // Tăng timeout để đảm bảo thông tin auth được load đầy đủ

    return () => clearTimeout(timer);
  }, [
    isAuthenticated,
    isLoading,
    userData,
    router,
    requireAdmin,
    refreshAuth,
    adminLayoutCheck,
    authCheckCount,
    pathname,
  ]);

  // Nếu đang kiểm tra xác thực, hiển thị màn hình loading
  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Đang kiểm tra xác thực...</div>
      </div>
    );
  }

  // Nếu đã xác thực và có quyền, hiển thị nội dung
  return isAuthorized ? <>{children}</> : null;
}
