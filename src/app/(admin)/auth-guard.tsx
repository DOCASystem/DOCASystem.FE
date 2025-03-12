"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-provider";
import { Role } from "@/auth/types";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, userData } = useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = userData?.username === "admin" ? Role.ADMIN : null;

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
    ) {
      return;
    }

    if (process.env.NEXT_PUBLIC_SKIP_AUTH_CHECK === "true") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      if (role !== Role.ADMIN) {
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
    setIsLoading(false);
  }, [isAuthenticated, role, router]);

  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
  ) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 border-4 border-pink-doca border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-semibold text-gray-800">
            Đang tải...
          </div>
          <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
