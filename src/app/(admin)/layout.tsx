"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./components/admin-header";
import Sidebar from "./components/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/auth/types";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    // Kiểm tra xác thực và quyền admin
    if (!isAuthenticated || role !== Role.ADMIN) {
      // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập hoặc không phải admin
      router.push("/login");
    }
  }, [isAuthenticated, role, router]);

  // Không hiển thị nội dung cho đến khi xác thực hoàn tất
  if (!isAuthenticated || role !== Role.ADMIN) {
    return null; // Hoặc có thể hiển thị trang loading
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6  overflow-auto">{children}</main>
      </div>
    </div>
  );
}
