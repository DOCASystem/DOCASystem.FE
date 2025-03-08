"use client";

import ProtectedRoute from "@/components/common/auth/ProtectedRoute";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Có thể thêm header, sidebar hoặc các thành phần khác cho dashboard ở đây */}
        <main className="p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
