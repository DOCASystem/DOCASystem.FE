"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-provider";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, userRoles, refreshAuth, userData } =
    useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const authCheckDone = useRef(false);

  // Kiểm tra admin dựa trên nhiều tiêu chí
  const isAdmin =
    userRoles.includes("ADMIN") ||
    userData?.username?.toLowerCase() === "admin";

  // Đánh dấu component đã mount
  useEffect(() => {
    setMounted(true);
    console.log("AdminAuthGuard: Component đã được mount");
  }, []);

  // Thêm effect để duy trì phiên làm việc admin
  useEffect(() => {
    if (mounted && isAuthenticated) {
      console.log("AdminAuthGuard: Thiết lập cơ chế làm mới phiên");
      // Tự động làm mới token mỗi 5 phút
      const refreshInterval = setInterval(() => {
        console.log("AdminAuthGuard: Tự động làm mới phiên làm việc");
        refreshAuth();
      }, 5 * 60 * 1000);

      // Làm mới token ngay lập tức khi vừa vào trang
      refreshAuth();

      return () => clearInterval(refreshInterval);
    }
  }, [mounted, isAuthenticated, refreshAuth]);

  // Effect kiểm tra phân quyền
  useEffect(() => {
    if (!mounted) return;

    // Nếu đã kiểm tra quyền và được phép truy cập thì không làm lại
    if (authCheckDone.current && isAuthorized) return;

    if (
      typeof window === "undefined" ||
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
    ) {
      setIsLoading(false);
      setIsAuthorized(true);
      authCheckDone.current = true;
      return;
    }

    if (process.env.NEXT_PUBLIC_SKIP_AUTH_CHECK === "true") {
      setIsAuthorized(true);
      setIsLoading(false);
      authCheckDone.current = true;
      return;
    }

    const checkAuth = () => {
      // Đảm bảo có thông tin xác thực mới nhất
      refreshAuth();

      console.log(
        "AdminAuthGuard: Kiểm tra phân quyền, isAuthenticated=",
        isAuthenticated,
        "userRoles=",
        userRoles,
        "userData=",
        userData?.username,
        "isAdmin=",
        isAdmin
      );

      // Kiểm tra đặc biệt cho tài khoản admin
      if (userData?.username?.toLowerCase() === "admin") {
        console.log(
          "AdminAuthGuard: Phát hiện tài khoản admin đặc biệt - cấp quyền truy cập"
        );
        setIsAuthorized(true);
        authCheckDone.current = true;
        return;
      }

      if (!isAuthenticated) {
        console.log(
          "AdminAuthGuard: Chưa đăng nhập, chuyển hướng đến trang đăng nhập"
        );
        router.replace("/login");
        return;
      }

      if (!isAdmin) {
        console.log(
          "AdminAuthGuard: Không phải admin, chuyển hướng đến trang chủ"
        );
        router.replace("/");
        return;
      }

      console.log(
        "AdminAuthGuard: Xác thực thành công, cho phép truy cập trang admin"
      );
      setIsAuthorized(true);
      authCheckDone.current = true;
    };

    // Thêm một short delay để đảm bảo context đã được cập nhật
    setTimeout(checkAuth, 100);
    setIsLoading(false);
  }, [
    isAuthenticated,
    isAdmin,
    router,
    mounted,
    userRoles,
    refreshAuth,
    userData,
  ]);

  // Nếu đang ở server-side hoặc component chưa mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu đang ở server-side hoặc cần bỏ qua trang admin
  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
  ) {
    return <>{children}</>;
  }

  // Nếu đã được phép truy cập
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Nếu đang tải
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;
}
