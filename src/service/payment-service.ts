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

      // Kiểm tra và log thông tin response
      if (responseData && responseData.redirectUrl) {
        console.log(
          "[PaymentService] Thanh toán thành công:",
          responseData.redirectUrl
        );
      } else {
        console.error(
          "[PaymentService] Response không có redirectUrl:",
          responseData
        );
      }

      return responseData;
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
