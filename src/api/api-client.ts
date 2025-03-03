import { Configuration } from "./generated";

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
    basePath: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    baseOptions: {
      headers: {},
    },
  });
};

// Tạo cấu hình với Authorization header cho client-side
const createClientConfig = () => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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
