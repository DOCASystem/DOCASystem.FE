"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import AdminHeader from "./components/admin-header";
import Sidebar from "./components/sidebar";
import AdminAuthGuard from "./auth-guard";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kiểm tra nếu đang trong quá trình build và cần bỏ qua các trang admin
  if (process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true") {
    // Trả về một trang trống khi đang build
    return <div>Admin pages are skipped during build</div>;
  }

  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <AdminAuthGuard>
        <div className="min-h-screen flex flex-col">
          <AdminHeader />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </AdminAuthGuard>
    </AuthProvider>
  );
}
