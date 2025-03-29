"use client";

import { useEffect, useState, useRef } from "react";
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
  const [mounted, setMounted] = useState<boolean>(false);
  const authCheckDone = useRef(false);

  const role = userData?.username === "admin" ? Role.ADMIN : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (authCheckDone.current) return;

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
      if (!isAuthenticated) {
        router.replace("/");
        return;
      }

      if (role !== Role.ADMIN) {
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
      authCheckDone.current = true;
    };

    checkAuth();
    setIsLoading(false);
  }, [isAuthenticated, role, router, mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_SKIP_ADMIN_PAGES === "true"
  ) {
    return <>{children}</>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return null;
}
