import axios from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  DEFAULT_TIMEOUT,
  isSuccessStatus,
  SWAGGER_URL,
} from "../utils/api-config";

/**
 * Kiểm tra kết nối đến Swagger JSON để xác nhận API hoạt động
 * @returns Promise<boolean> - true nếu kết nối thành công, false nếu không
 */
export const checkSwaggerConnection = async (): Promise<boolean> => {
  try {
    console.log(`Đang kiểm tra kết nối đến Swagger tại: ${SWAGGER_URL}`);
    const response = await axios({
      method: "GET",
      url: SWAGGER_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    console.log("Phản hồi từ Swagger:", response.status);
    return (
      isSuccessStatus(response.status) &&
      response.data &&
      typeof response.data === "object"
    );
  } catch (error) {
    console.error("Không thể kết nối đến Swagger:", error);
    return false;
  }
};

/**
 * Kiểm tra kết nối đến API server
 * @returns Promise<boolean> - true nếu kết nối thành công, false nếu không
 */
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    console.log(`Đang kiểm tra kết nối đến API tại: ${API_BASE_URL}`);

    // Thử GET request đơn giản thay vì OPTIONS
    const response = await axios({
      method: "GET",
      url: API_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        Accept: "text/html,application/json",
        "Cache-Control": "no-cache",
      },
      validateStatus: () => true, // Chấp nhận mọi mã trạng thái
    });

    console.log("Phản hồi từ API base:", response.status);

    // Coi như thành công nếu nhận được bất kỳ phản hồi nào (kể cả 404)
    // vì điều đó chứng tỏ server đang hoạt động
    return response.status > 0;
  } catch (error) {
    console.error("Không thể kết nối đến API server:", error);
    return false;
  }
};

/**
 * Kiểm tra tình trạng của các endpoints cụ thể
 * @returns Promise với kết quả kiểm tra
 */
export const checkApiEndpoints = async (): Promise<Record<string, boolean>> => {
  const endpoints = [
    API_ENDPOINTS.AUTH.LOGIN,
    // Thêm các endpoints khác cần kiểm tra
  ];

  const results: Record<string, boolean> = {};

  await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        const response = await axios({
          method: "OPTIONS",
          url: `${API_BASE_URL}${endpoint}`,
          timeout: DEFAULT_TIMEOUT / 6,
        });
        results[endpoint] = isSuccessStatus(response.status);
      } catch {
        results[endpoint] = false;
      }
    })
  );

  return results;
};

/**
 * Lấy thông tin chi tiết của lỗi API
 * @param error Lỗi từ axios
 * @returns Thông tin chi tiết về lỗi
 */
export const getApiErrorDetails = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Lỗi từ server (status code không phải 2xx)
      return `Lỗi server: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      // Không nhận được response
      return "Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.";
    } else {
      // Lỗi khi thiết lập request
      return `Lỗi khi gửi yêu cầu: ${error.message}`;
    }
  }
  // Các lỗi khác không phải từ axios
  return "Đã xảy ra lỗi không xác định.";
};

/**
 * Kiểm tra API login cụ thể
 * @returns Promise<boolean> - true nếu kết nối thành công, false nếu không
 */
export const checkLoginApiStatus = async (): Promise<boolean> => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
    console.log(`Đang kiểm tra API login tại: ${url}`);

    // Kiểm tra kết nối bằng request OPTIONS (an toàn, không gửi data)
    // rồi thử POST với dữ liệu không hợp lệ nếu OPTIONS không thành công
    try {
      // Thử OPTIONS trước
      const optionsResponse = await axios({
        method: "OPTIONS",
        url: url,
        timeout: DEFAULT_TIMEOUT,
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        validateStatus: () => true,
      });

      console.log(`Phản hồi OPTIONS từ API login: ${optionsResponse.status}`);

      // Nếu OPTIONS thành công hoặc trả về 404 (API tồn tại nhưng không hỗ trợ OPTIONS)
      if (optionsResponse.status === 200 || optionsResponse.status === 404) {
        return true;
      }
    } catch {
      console.log("OPTIONS request không thành công, thử POST request...");
    }

    // Nếu OPTIONS không thành công, thử POST với dữ liệu không hợp lệ
    const postResponse = await axios({
      method: "POST",
      url: url,
      timeout: DEFAULT_TIMEOUT,
      data: { test: "test" }, // Dữ liệu không hợp lệ
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      validateStatus: () => true, // Chấp nhận mọi mã trạng thái
    });

    console.log(`Phản hồi POST từ API login: ${postResponse.status}`);

    // API tồn tại nếu trả về 400 Bad Request, 401 Unauthorized, 403 Forbidden
    // hoặc bất kỳ phản hồi nào không phải 404 Not Found
    return postResponse.status !== 404;
  } catch (error) {
    console.error("Không thể kết nối đến API login:", error);
    return false;
  }
};
