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
  const handleEmailSubmit = emailMethods.handleSubmit((data) => {
    console.log("Email đã nhập:", data.email);
    setEmail(data.email);
    // Trong thực tế, gửi request đến API để gửi OTP
    console.log("Gửi OTP đến email:", data.email);
    // Chuyển sang bước tiếp theo
    setStep(2);
  });

  // Xử lý submit cho form OTP (bước 2)
  const handleOtpSubmit = otpMethods.handleSubmit((data) => {
    console.log("OTP đã nhập:", data.otp);
    // Kiểm tra OTP - hiện tại cứng là 123456
    if (data.otp === "123456") {
      // OTP đúng, chuyển sang bước đặt lại mật khẩu
      setStep(3);
    } else {
      otpMethods.setError("otp", {
        type: "manual",
        message: "OTP không chính xác. Vui lòng thử lại.",
      });
    }
  });

  // Xử lý submit cho form đặt lại mật khẩu (bước 3)
  const handleResetPasswordSubmit = resetPasswordMethods.handleSubmit(
    (data) => {
      console.log("Mật khẩu mới:", data.password);
      // Trong thực tế, gửi request đến API để cập nhật mật khẩu
      console.log("Đặt lại mật khẩu cho email:", email);
      alert(
        "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới."
      );
      // Chuyển hướng đến trang đăng nhập có thể được thực hiện ở đây
      window.location.href = "/login";
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
                    className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                  >
                    Tiếp tục
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
                <div className="mt-6 flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                  >
                    Xác nhận
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
                    className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                  >
                    Hoàn tất
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        )}
      </div>

      <LinkNav href="/home" className="w-[700px] h-[700px] rounded-l-2xl">
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
