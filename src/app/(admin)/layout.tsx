"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AdminHeader from "./components/admin-header";
import Sidebar from "./components/sidebar";
import AdminAuthGuard from "./auth-guard";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Đảm bảo component đã mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kiểm tra nếu đang trong quá trình build và cần bỏ qua các trang admin
  if (process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true") {
    // Trả về một trang trống khi đang build
    return <div>Admin pages are skipped during build</div>;
  }

  // Sử dụng cấu trúc HTML giống nhau khi đang SSR và CSR
  if (!mounted) {
    return (
      <div>
        <div>
          <div>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <Toaster position="top-center" />
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex flex-1 h-[calc(100vh-64px)]">
          <div className="fixed left-0 h-[calc(100vh-64px)] z-10">
            <Sidebar />
          </div>
          <div className="ml-[250px] flex-1">
            <main className="p-6 h-full overflow-y-auto">{children}</main>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
