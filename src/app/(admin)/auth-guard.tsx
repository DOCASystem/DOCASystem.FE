"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/auth/types";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Bỏ qua kiểm tra xác thực trong quá trình build
    if (process.env.NEXT_PUBLIC_SKIP_AUTH_CHECK === "true") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Kiểm tra trạng thái xác thực phía client
    const checkAuth = () => {
      // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      // Nếu không phải admin, chuyển hướng về trang chủ
      if (role !== Role.ADMIN) {
        router.replace("/");
        return;
      }

      // Nếu đã xác thực và có quyền admin
      setIsAuthorized(true);
    };

    checkAuth();
    setIsLoading(false);
  }, [isAuthenticated, role, router]);

  // Hiển thị loading state khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Đang tải...</div>
      </div>
    );
  }

  // Chỉ hiển thị nội dung nếu đã được phân quyền
  return isAuthorized ? <>{children}</> : null;
}
