import axios from "axios";
import { SWAGGER_URL } from "@/utils/api-config";

/**
 * Trích xuất URL API base từ Swagger JSON
 * @returns Promise<string | null> - URL API base hoặc null nếu không thể trích xuất
 */
export const extractApiBaseUrlFromSwagger = async (): Promise<
  string | null
> => {
  try {
    console.log(`Đang tải Swagger từ: ${SWAGGER_URL}`);
    const response = await axios.get(SWAGGER_URL);

    if (!response.data || typeof response.data !== "object") {
      console.error("Swagger JSON không hợp lệ");
      return null;
    }

    // Kiểm tra các trường phổ biến trong Swagger để lấy URL base
    const swaggerData = response.data;

    // 1. Kiểm tra trường servers (OpenAPI 3.0)
    if (
      swaggerData.servers &&
      Array.isArray(swaggerData.servers) &&
      swaggerData.servers.length > 0
    ) {
      const serverUrl = swaggerData.servers[0].url;
      if (serverUrl) {
        console.log(`Tìm thấy URL base từ trường servers: ${serverUrl}`);
        return serverUrl;
      }
    }

    // 2. Kiểm tra trường host + basePath (Swagger 2.0)
    if (swaggerData.host) {
      const scheme =
        swaggerData.schemes && swaggerData.schemes.includes("https")
          ? "https"
          : "http";
      const basePath = swaggerData.basePath || "";
      const baseUrl = `${scheme}://${swaggerData.host}${basePath}`;
      console.log(`Tìm thấy URL base từ trường host+basePath: ${baseUrl}`);
      return baseUrl;
    }

    // 3. Kiểm tra từ path của API đầu tiên
    // Giả sử API URL có dạng: https://example.com/api/v1/endpoint
    // Thì base URL là: https://example.com
    if (swaggerData.paths) {
      // Lấy path đầu tiên
      const firstPathKey = Object.keys(swaggerData.paths)[0];
      if (firstPathKey) {
        const firstPath = firstPathKey;
        const swaggerUrlObj = new URL(SWAGGER_URL);
        const origin = swaggerUrlObj.origin; // https://production.doca.love

        console.log(`URL gốc từ Swagger: ${origin}`);

        if (firstPath.startsWith("/api")) {
          // Nếu API paths có /api, thì base URL có thể chính là origin
          console.log(`Tìm thấy URL base từ origin: ${origin}`);
          return origin;
        }
      }
    }

    // Không tìm thấy URL base từ Swagger, thử phỏng đoán
    const swaggerUrlObj = new URL(SWAGGER_URL);
    const guessedBaseUrl = swaggerUrlObj.origin;
    console.log(
      `Không thể tìm thấy URL base chính xác, sử dụng origin: ${guessedBaseUrl}`
    );
    return guessedBaseUrl;
  } catch (error) {
    console.error("Lỗi khi tải Swagger JSON:", error);
    return null;
  }
};

/**
 * Phát hiện URL API endpoint từ Swagger
 * @param endpoint Tên endpoint cần tìm (ví dụ: 'login')
 * @returns URL đầy đủ của API endpoint hoặc null nếu không tìm thấy
 */
export const discoverApiEndpoint = async (
  endpoint: string
): Promise<string | null> => {
  try {
    const response = await axios.get(SWAGGER_URL);
    const swaggerData = response.data;

    if (!swaggerData.paths) {
      return null;
    }

    // Tìm path chứa endpoint
    const matchedPath = Object.keys(swaggerData.paths).find((path) =>
      path.toLowerCase().includes(endpoint.toLowerCase())
    );

    if (!matchedPath) {
      return null;
    }

    // Lấy URL base
    const baseUrl = await extractApiBaseUrlFromSwagger();
    if (!baseUrl) {
      return null;
    }

    // Xây dựng URL đầy đủ
    const fullUrl = `${baseUrl}${matchedPath}`;
    console.log(`Đã tìm thấy URL endpoint cho ${endpoint}: ${fullUrl}`);
    return fullUrl;
  } catch (error) {
    console.error(`Lỗi khi tìm endpoint ${endpoint}:`, error);
    return null;
  }
};
