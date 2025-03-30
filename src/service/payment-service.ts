import axios, { AxiosError } from "axios";
import { getToken } from "@/auth/auth-service";

// URL API duy nhất
const API_URL = "https://production.doca.love";

// Interface cho payload thanh toán
export interface CheckoutPayload {
  address: string;
}

// Interface cho kết quả thanh toán
export interface CheckoutResponse {
  id: string;
  redirectUrl: string; // URL chuyển hướng thanh toán
  qrCodeUrl?: string;
}

// Service cho thanh toán
export const PaymentService = {
  // Xử lý thanh toán
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    try {
      console.log(
        "[PaymentService] Gọi API thanh toán:",
        `${API_URL}/api/v1/payments/checkout`
      );
      console.log("[PaymentService] Payload:", payload);

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${API_URL}/api/v1/payments/checkout`,
        payload,
        {
          headers,
          timeout: 60000, // 60 giây timeout
        }
      );

      const responseData = response.data;

      // Kiểm tra chi tiết response data để debug
      console.log(
        "[PaymentService] Response data:",
        JSON.stringify(responseData, null, 2)
      );

      // Xử lý và chuẩn hóa redirectUrl từ response
      const result: CheckoutResponse = {
        id: responseData.id || "",
        redirectUrl: "",
        qrCodeUrl: responseData.qrCodeUrl || "",
      };

      // Xử lý trường hợp redirectUrl có thể nằm ở các vị trí khác nhau trong response
      if (typeof responseData === "string" && responseData.includes("http")) {
        // Trường hợp response trả về trực tiếp là URL string
        result.redirectUrl = responseData;
      } else if (responseData.redirectUrl) {
        // Trường hợp chuẩn với redirectUrl trong object
        result.redirectUrl = responseData.redirectUrl;
      } else if (responseData.url) {
        // Trường hợp url thay vì redirectUrl
        result.redirectUrl = responseData.url;
      } else if (responseData.paymentUrl) {
        // Trường hợp paymentUrl thay vì redirectUrl
        result.redirectUrl = responseData.paymentUrl;
      }

      // Kiểm tra xem đã có URL chưa
      if (!result.redirectUrl) {
        console.error(
          "[PaymentService] Không tìm thấy URL trong response:",
          responseData
        );
        throw new Error(
          "Không tìm thấy URL thanh toán trong phản hồi từ máy chủ"
        );
      }

      // Đảm bảo URL không có khoảng trắng thừa
      result.redirectUrl = result.redirectUrl.trim();

      console.log(
        "[PaymentService] URL thanh toán đã xử lý:",
        result.redirectUrl
      );
      return result;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(
        "[PaymentService] Lỗi khi gọi API thanh toán:",
        axiosError.response?.data || axiosError.message
      );

      // Ném lỗi để component xử lý
      throw error;
    }
  },
};
