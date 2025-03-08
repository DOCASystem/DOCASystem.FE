import axios from "axios";
import { REAL_API_BASE_URL } from "@/utils/api-config";

// Interface cho dữ liệu đăng ký
export interface SignupData {
  username: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  otp: string;
}

// Interface cho dữ liệu gửi OTP
export interface OtpRequestData {
  email: string;
}

// Interface cho dữ liệu quên mật khẩu
export interface ForgotPasswordData {
  otp: string;
  phoneNumber: string;
  password: string;
}

// Class API tùy chỉnh cho xác thực
export class CustomAuthApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = REAL_API_BASE_URL;
  }

  /**
   * Gửi yêu cầu đăng ký tài khoản mới
   * @param data Dữ liệu đăng ký
   * @returns Promise với kết quả đăng ký
   */
  async signup(data: SignupData) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/signup`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      throw error;
    }
  }

  /**
   * Gửi yêu cầu OTP đến email
   * @param data Dữ liệu yêu cầu OTP
   * @returns Promise với kết quả gửi OTP
   */
  async requestOtp(data: OtpRequestData) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/otp`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);
      throw error;
    }
  }

  /**
   * Gửi yêu cầu đặt lại mật khẩu
   * @param data Dữ liệu quên mật khẩu
   * @returns Promise với kết quả đặt lại mật khẩu
   */
  async forgotPassword(data: ForgotPasswordData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/forget-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      throw error;
    }
  }
}

// Tạo và export instance của CustomAuthApi
export const customAuthApi = new CustomAuthApi();
