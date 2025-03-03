import { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { Permission } from "@/auth/types";

interface RoleBasedWrapperProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  fallback?: ReactNode;
}

export default function RoleBasedWrapper({
  children,
  requiredPermissions = [],
  fallback = null,
}: RoleBasedWrapperProps) {
  const { hasPermission } = useAuth();

  // Kiểm tra xem người dùng có tất cả các quyền yêu cầu không
  const hasAllPermissions = requiredPermissions.every((permission) =>
    hasPermission(permission)
  );

  // Chỉ hiển thị nội dung nếu người dùng có đủ quyền
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}
