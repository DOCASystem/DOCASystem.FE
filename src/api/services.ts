import {
  BlogCategoryApi,
  StaffApi,
  AuthApi,
  // Import các API khác khi cần
} from "./generated";
import apiClient from "./api-client";
import { customAuthApi } from "./custom/auth-api";

// Export các API services đã cấu hình sẵn
export const blogCategoryApi = new BlogCategoryApi(apiClient);
export const staffApi = new StaffApi(apiClient);

// Export và log cấu hình authApi
console.log("Creating AuthApi with config:", apiClient);
export const authApi = new AuthApi(apiClient);
// Export các API clients khác khi cần

// Export API tùy chỉnh cho chức năng xác thực
export { customAuthApi };
