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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Đang tải...</div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
