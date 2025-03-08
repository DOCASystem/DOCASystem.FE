import { Configuration } from "./generated";
import { REAL_API_BASE_URL } from "../utils/api-config";

// Helper để kiểm tra môi trường
const isBrowser = () => typeof window !== "undefined";

// Hàm lấy token an toàn
const getToken = () => {
  if (isBrowser()) {
    return localStorage.getItem("token") || "";
  }
  return "";
};

// Tạo cấu hình cơ bản không có Authorization header cho SSR
const createBaseConfig = () => {
  return new Configuration({
    basePath: REAL_API_BASE_URL,
    baseOptions: {
      headers: {},
    },
  });
};

// Tạo cấu hình với Authorization header cho client-side
const createClientConfig = () => {
  return new Configuration({
    basePath: REAL_API_BASE_URL,
    baseOptions: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  });
};

// Cung cấp cấu hình phù hợp theo môi trường
const apiClient = isBrowser() ? createClientConfig() : createBaseConfig();

export default apiClient;
