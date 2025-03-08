"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/service/auth.service";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!AuthService.isAuthenticated()) {
      // Chuyển hướng về trang đăng nhập
      router.push("/login");
    }
  }, [router]);

  // Nếu người dùng đã đăng nhập, hiển thị nội dung
  if (AuthService.isAuthenticated()) {
    return <>{children}</>;
  }

  // Có thể thêm loading spinner nếu đang kiểm tra
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-doca"></div>
    </div>
  );
}
