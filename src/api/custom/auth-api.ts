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

// Email người dùng đã gửi OTP
let otpEmail: string | null = null;

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
      // Tạo đúng format dữ liệu theo API
      const payload = {
        username: data.username, // Username là email
        password: data.password,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        otp: data.otp,
      };

      // Kiểm tra nếu email đăng ký khác với email đã gửi OTP
      if (otpEmail && otpEmail !== data.username) {
        console.warn("Email đăng ký khác với email đã gửi OTP:", {
          otpEmail,
          signupEmail: data.username,
        });
      }

      console.log("Dữ liệu đăng ký gửi đi:", JSON.stringify(payload));

      // Gọi API đăng ký theo cách đơn giản nhất
      const response = await axios.post(
        `${this.baseUrl}/api/v1/signup`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Phản hồi từ API đăng ký:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi khi đăng ký:", error);

      // Hiển thị lỗi chi tiết
      if (axios.isAxiosError(error) && error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
        console.error("Mã lỗi:", error.response.status);
      }

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
      // Lưu email đã gửi OTP để kiểm tra tính nhất quán
      otpEmail = data.email;

      console.log("Gửi yêu cầu OTP đến email:", data.email);

      // Tạo payload đúng format
      const payload = { email: data.email };

      // Gọi API OTP theo cách đơn giản nhất
      const response = await axios.post(`${this.baseUrl}/api/v1/otp`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Phản hồi từ API OTP:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi khi gửi OTP:", error);

      // Hiển thị lỗi chi tiết
      if (axios.isAxiosError(error) && error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
        console.error("Mã lỗi:", error.response.status);
      }

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
      console.log("Gửi yêu cầu quên mật khẩu:", data.phoneNumber);

      // Gọi API quên mật khẩu theo cách đơn giản nhất
      const response = await axios.post(
        `${this.baseUrl}/api/v1/forget-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Phản hồi từ API quên mật khẩu:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);

      // Hiển thị lỗi chi tiết
      if (axios.isAxiosError(error) && error.response) {
        console.error("Chi tiết lỗi:", error.response.data);
        console.error("Mã lỗi:", error.response.status);
      }

      throw error;
    }
  }
}

// Tạo và export instance của CustomAuthApi
export const customAuthApi = new CustomAuthApi();
