"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import Image from "next/image";
import LinkNav from "@/components/common/link/link";
import { customAuthApi } from "@/api/custom/auth-api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  otp: string;
}

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const methods = useForm<FormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      otp: "",
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // Kiểm tra xem OTP đã được gửi hay chưa
      if (!otpSent) {
        toast.error("Vui lòng gửi và nhập mã OTP trước khi đăng ký");
        return;
      }

      // Kiểm tra xem OTP có được nhập hay không
      if (!data.otp) {
        toast.error("Vui lòng nhập mã OTP đã được gửi đến email của bạn");
        methods.setError("otp", {
          type: "manual",
          message: "Vui lòng nhập mã OTP",
        });
        return;
      }

      setIsSubmitting(true);

      // Tạo đối tượng dữ liệu phù hợp với API
      const signupData = {
        username: data.email, // Sử dụng email làm username
        password: data.password,
        phoneNumber: data.phone,
        fullName: `${data.firstName} ${data.lastName}`,
        otp: data.otp,
      };

      // Gọi API đăng ký
      const response = await customAuthApi.signup(signupData);

      // Xử lý phản hồi thành công
      toast.success("Đăng ký thành công!");
      console.log("Đăng ký thành công:", response);

      // Chuyển hướng đến trang đăng nhập
      window.location.href = "/login";
    } catch (error: unknown) {
      // Xử lý lỗi
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      // Kiểm tra nếu lỗi liên quan đến OTP
      if (
        errorMessage.toLowerCase().includes("otp") ||
        errorMessage.toLowerCase().includes("mã xác thực")
      ) {
        toast.error("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        methods.setError("otp", {
          type: "manual",
          message: "Mã OTP không hợp lệ hoặc đã hết hạn",
        });
      } else {
        toast.error(errorMessage);
      }

      console.error("Lỗi khi đăng ký:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  // Xử lý gửi OTP
  const handleSendOtp = async () => {
    // Lấy giá trị email từ form
    const email = methods.getValues("email");

    // Kiểm tra email hợp lệ
    if (!email) {
      methods.setError("email", {
        type: "manual",
        message: "Vui lòng nhập email trước khi gửi OTP",
      });
      toast.error("Vui lòng nhập email trước khi gửi OTP");
      return;
    }

    try {
      setIsRequestingOtp(true);

      // Gọi API gửi OTP
      await customAuthApi.requestOtp({ email });

      // Thông báo thành công
      toast.success("Đã gửi mã OTP đến email của bạn!");
      setOtpSent(true);
    } catch (error: unknown) {
      // Xử lý lỗi
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Không thể gửi OTP. Vui lòng thử lại."
      );
      console.error("Lỗi khi gửi OTP:", error);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  return (
    <div className="flex flex-row">
      <FormProvider {...methods}>
        <form
          onSubmit={onSubmit}
          className="bg-gray-100 flex flex-col justify-center items-center max-w-[1536px] p-6 rounded-xl shadow-md min-w-[700px]"
        >
          <h1 className="text-2xl font-semibold">Tạo tài khoản</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Input
              name="firstName"
              label="Họ"
              placeholder="Nhập họ"
              className="w-[404px]"
            />
            <Input
              name="lastName"
              label="Tên"
              placeholder="Nhập tên"
              className="w-[404px]"
            />
            <Input
              name="email"
              label="Email"
              placeholder="Nhập email"
              className="w-[404px]"
            />
            <Input
              name="phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              className="w-[404px]"
            />
            <Input
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              className="w-[404px]"
            />

            <Input
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              type="password"
              className="w-[404px]"
            />

            <div className="flex flex-row justify-between gap-4">
              <Input
                name="otp"
                label="OTP email"
                placeholder="Nhập OTP"
                className="w-[250px]"
              />
              <div className="flex flex-row items-center justify-center mt-8">
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isRequestingOtp}
                  className="h-11 w-[100px] bg-pink-doca text-white rounded-md text-[16px]"
                >
                  {isRequestingOtp
                    ? "Đang gửi..."
                    : otpSent
                    ? "Gửi lại"
                    : "Gửi OTP"}
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
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
