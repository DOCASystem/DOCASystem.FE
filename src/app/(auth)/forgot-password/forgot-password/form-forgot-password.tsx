"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  forgotPasswordEmailSchema,
  forgotPasswordOtpSchema,
  forgotPasswordResetSchema,
} from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import LinkNav from "@/components/common/link/link";
import Image from "next/image";
import { customAuthApi } from "@/api/custom/auth-api";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

// Định nghĩa các kiểu dữ liệu cho form
interface EmailFormData {
  email: string;
}

interface OtpFormData {
  otp: string;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ForgotPasswordForm() {
  // State để theo dõi bước hiện tại trong flow quên mật khẩu
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");

  // Form cho bước 1: Nhập email
  const emailMethods = useForm<EmailFormData>({
    resolver: yupResolver(forgotPasswordEmailSchema),
    defaultValues: { email: "" },
  });

  // Form cho bước 2: Nhập OTP
  const otpMethods = useForm<OtpFormData>({
    resolver: yupResolver(forgotPasswordOtpSchema),
    defaultValues: { otp: "" },
  });

  // Form cho bước 3: Đặt lại mật khẩu
  const resetPasswordMethods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(forgotPasswordResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Xử lý submit cho form email (bước 1)
  const handleEmailSubmit = emailMethods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setEmail(data.email);

      // Gọi API để gửi OTP
      await customAuthApi.requestOtp({ email: data.email });

      // Yêu cầu người dùng nhập số điện thoại để xác nhận (có thể lấy từ form khác hoặc dùng prompt)
      const phone = prompt("Vui lòng nhập số điện thoại của bạn để xác thực:");
      if (phone) {
        setPhoneNumber(phone);
        // Chuyển sang bước tiếp theo
        setStep(2);
        toast.success("Đã gửi mã OTP đến email của bạn!");
      } else {
        toast.error("Vui lòng nhập số điện thoại để tiếp tục.");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Không thể gửi OTP. Vui lòng thử lại.";
      toast.error(errorMessage);
      console.error("Lỗi khi gửi OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  // Xử lý gửi lại OTP
  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true);

      // Gọi API để gửi lại OTP
      await customAuthApi.requestOtp({ email });

      // Thông báo thành công
      toast.success("Đã gửi lại mã OTP đến email của bạn!");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Không thể gửi lại OTP. Vui lòng thử lại.";
      toast.error(errorMessage);
      console.error("Lỗi khi gửi lại OTP:", error);
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Xử lý submit cho form OTP (bước 2)
  const handleOtpSubmit = otpMethods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setOtpCode(data.otp);

      // Chưa thực hiện kiểm tra OTP ở đây, sẽ kiểm tra khi đặt lại mật khẩu
      setStep(3);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Xác thực OTP thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
      console.error("Lỗi khi xác thực OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  // Xử lý submit cho form đặt lại mật khẩu (bước 3)
  const handleResetPasswordSubmit = resetPasswordMethods.handleSubmit(
    async (data) => {
      try {
        setIsSubmitting(true);

        // Gọi API đặt lại mật khẩu
        await customAuthApi.forgotPassword({
          otp: otpCode,
          phoneNumber: phoneNumber,
          password: data.password,
        });

        toast.success(
          "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới."
        );

        // Chuyển hướng đến trang đăng nhập
        window.location.href = "/login";
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";

        // Kiểm tra nếu lỗi liên quan đến OTP
        if (
          errorMessage.toLowerCase().includes("otp") ||
          errorMessage.toLowerCase().includes("mã xác thực")
        ) {
          toast.error(
            "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng quay lại bước xác nhận OTP."
          );
          // Quay lại bước OTP
          setStep(2);
        } else {
          toast.error(errorMessage);
        }

        console.error("Lỗi khi đặt lại mật khẩu:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  // Hiển thị form tương ứng với bước hiện tại
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="min-w-[700px]">
        {step === 1 && (
          <FormProvider {...emailMethods}>
            <form
              onSubmit={handleEmailSubmit}
              className="bg-gray-100 flex flex-col justify-center items-center max-w-[1536px] p-6 rounded-xl shadow-md min-w-[700px]"
            >
              <h1 className="text-2xl font-semibold">Quên mật khẩu</h1>
              <p className="text-gray-600 mt-2 mb-6 text-center">
                Nhập email của bạn để nhận mã OTP xác nhận
              </p>
              <div className="flex flex-col gap-4 mt-6">
                <Input
                  name="email"
                  label="Email"
                  placeholder="Nhập email của bạn"
                  className="w-[404px]"
                />
                <div className="mt-6 flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
                  </Button>
                  <div className="text-center">
                    <LinkNav
                      href="/login"
                      className="text-pink-doca hover:underline"
                    >
                      Quay lại đăng nhập
                    </LinkNav>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        )}

        {step === 2 && (
          <FormProvider {...otpMethods}>
            <form
              onSubmit={handleOtpSubmit}
              className="bg-gray-100 flex flex-col justify-center items-center max-w-[1536px] p-6 rounded-xl shadow-md min-w-[700px]"
            >
              <h1 className="text-2xl font-semibold">Xác nhận OTP</h1>
              <p className="text-gray-600 mt-2 mb-6 text-center">
                Chúng tôi đã gửi mã OTP đến email {email}.<br />
                Vui lòng kiểm tra và nhập mã OTP vào ô bên dưới.
              </p>
              <div className="flex flex-col gap-4 mt-6">
                <Input
                  name="otp"
                  label="Mã OTP"
                  placeholder="Nhập mã OTP"
                  className="w-[404px]"
                />

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp}
                    className="text-pink-doca hover:underline text-sm"
                  >
                    {isResendingOtp ? "Đang gửi lại..." : "Gửi lại mã OTP"}
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-pink-doca hover:underline"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        )}

        {step === 3 && (
          <FormProvider {...resetPasswordMethods}>
            <form
              onSubmit={handleResetPasswordSubmit}
              className="bg-gray-100 flex flex-col justify-center items-center max-w-[1536px] p-6 rounded-xl shadow-md min-w-[700px]"
            >
              <h1 className="text-2xl font-semibold">Đặt lại mật khẩu</h1>
              <p className="text-gray-600 mt-2 mb-6 text-center">
                Tạo mật khẩu mới cho tài khoản của bạn
              </p>
              <div className="flex flex-col gap-4 mt-6">
                <Input
                  name="password"
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới"
                  type="password"
                  className="w-[404px]"
                />
                <Input
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu mới"
                  type="password"
                  className="w-[404px]"
                />
                <div className="mt-6 flex flex-col gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Hoàn tất"}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        )}
      </div>

      <LinkNav href="/" className="w-[700px] h-[700px] rounded-l-2xl">
        <Image
          src="/images/bg-login.png"
          alt="bg-login"
          width={600}
          height={900}
          className="w-[700px] h-[700px] rounded-l-2xl"
        />
      </LinkNav>
    </div>
  );
}
