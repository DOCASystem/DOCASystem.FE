"use client";

import { useEffect, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/service/auth.service";
import { useAuthContext } from "@/contexts/auth-provider";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [isChecking, setIsChecking] = useState(!isAuthenticated);

  useEffect(() => {
    // If already authenticated via context, skip check
    if (isAuthenticated) {
      setIsChecking(false);
      return;
    }

    // Quick initial check from cache first
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, router]);

  // If still checking and not authenticated via context, show loading spinner
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-doca"></div>
      </div>
    );
  }

  // Otherwise show content
  return <>{children}</>;
}
