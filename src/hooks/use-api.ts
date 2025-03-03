import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import {
  BlogCategoryApi,
  StaffApi,
  // Import các API khác khi cần
} from "../api/generated";

export function useApi() {
  const { token, updateApiConfig } = useAuth();
  const [blogCategoryApi, setBlogCategoryApi] = useState<BlogCategoryApi>(
    new BlogCategoryApi()
  );
  const [staffApi, setStaffApi] = useState<StaffApi>(new StaffApi());
  // Thêm các API state khác khi cần

  useEffect(() => {
    // Cập nhật API khi token thay đổi
    const config = updateApiConfig();
    setBlogCategoryApi(new BlogCategoryApi(config));
    setStaffApi(new StaffApi(config));
    // Cập nhật các API khác khi cần
  }, [token, updateApiConfig]);

  return {
    blogCategoryApi,
    staffApi,
    // Trả về các API khác khi cần
  };
}
