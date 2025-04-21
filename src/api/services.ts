import {
  BlogCategoryApi,
  StaffApi,
  AuthApi,
  // Import các API khác khi cần
} from "./generated";
import apiClient from "./api-client";
import { customAuthApi } from "./custom/auth-api";
import { Configuration } from "./generated";

// Đảm bảo chỉ sử dụng API base URL duy nhất theo yêu cầu
const API_URL = "https://production.doca.love";

// Tạo cấu hình cụ thể cho AuthApi để đảm bảo đúng tham số
const authApiConfig = new Configuration({
  basePath: API_URL,
  baseOptions: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

// Export các API services đã cấu hình sẵn
export const blogCategoryApi = new BlogCategoryApi(apiClient);
export const staffApi = new StaffApi(apiClient);

// Cấu hình rõ ràng cho authApi với config đầy đủ
console.log("Creating AuthApi with specific config to:", API_URL);
export const authApi = new AuthApi(authApiConfig);

// Export API tùy chỉnh cho chức năng xác thực
export { customAuthApi };
