"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import Image from "next/image";
import LinkNav from "@/components/common/link/link";
import { customAuthApi } from "@/api/custom/auth-api";
import { useState, useEffect } from "react";
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
  const [countdown, setCountdown] = useState(0);
  const [isOtpDisabled, setIsOtpDisabled] = useState(false);

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

  // Đếm ngược cho nút OTP
  useEffect(() => {
    if (countdown <= 0) {
      setIsOtpDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

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
        username: data.email, // Username chính là email
        password: data.password,
        phoneNumber: data.phone,
        fullName: `${data.firstName} ${data.lastName}`.trim(), // fullName chính là họ + tên
        otp: data.otp,
      };

      console.log("Dữ liệu đăng ký:", signupData);

      // Gọi API đăng ký
      const response = await customAuthApi.signup(signupData);

      // Xử lý phản hồi thành công
      toast.success("Đăng ký thành công!");
      console.log("Đăng ký thành công:", response);

      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        console.log(
          "Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công"
        );
        // Sử dụng cả hai cách để đảm bảo chuyển hướng hoạt động
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 2000);
    } catch (error: unknown) {
      // Xử lý lỗi
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      console.error("Lỗi chi tiết khi đăng ký:", axiosError.response?.data);

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
      } else if (
        errorMessage.toLowerCase().includes("token") ||
        errorMessage.toLowerCase().includes("xác thực")
      ) {
        toast.error("Lỗi xác thực. Vui lòng gửi lại OTP và thử lại.");
        setOtpSent(false);
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

      console.log("Gửi yêu cầu OTP đến email:", email);

      // Gọi API gửi OTP
      const otpResponse = await customAuthApi.requestOtp({ email });
      console.log("Kết quả gửi OTP:", otpResponse);

      // Thông báo thành công
      toast.success("Đã gửi mã OTP đến email của bạn!");
      setOtpSent(true);

      // Bắt đầu đếm ngược 30 giây
      setCountdown(30);
      setIsOtpDisabled(true);
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
    <div className="flex flex-col md:flex-row w-full">
      <FormProvider {...methods}>
        <form
          onSubmit={onSubmit}
          className="bg-gray-100 flex flex-col justify-center items-center p-4 sm:p-6 rounded-xl shadow-md w-full md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]"
        >
          <h1 className="text-xl sm:text-2xl font-semibold">Tạo tài khoản</h1>
          <div className="flex flex-col gap-4 mt-6 w-full max-w-[404px]">
            <Input
              name="firstName"
              label="Họ"
              placeholder="Nhập họ"
              className="w-full"
            />
            <Input
              name="lastName"
              label="Tên"
              placeholder="Nhập tên"
              className="w-full"
            />
            <Input
              name="email"
              label="Email"
              placeholder="Nhập email"
              className="w-full"
            />
            <Input
              name="phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              className="w-full"
            />
            <Input
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              className="w-full"
            />

            <Input
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              type="password"
              className="w-full"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Input
                name="otp"
                label="OTP email"
                placeholder="Nhập OTP"
                className="w-full sm:w-[250px]"
              />
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isRequestingOtp || isOtpDisabled}
                className="h-11 w-full sm:w-[100px] bg-pink-doca text-white rounded-md text-[16px]"
              >
                {isRequestingOtp
                  ? "Đang gửi..."
                  : isOtpDisabled
                  ? `${countdown}s`
                  : otpSent
                  ? "Gửi lại"
                  : "Gửi OTP"}
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-pink-doca text-white rounded-3xl text-[16px]"
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
      <div className="hidden md:block">
        <LinkNav href="/" className="block">
          <Image
            src="/images/doca.png"
            alt="bg-login"
            width={600}
            height={900}
            className="w-full h-auto flex max-h-[700px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-l-2xl object-cover"
          />
        </LinkNav>
      </div>
    </div>
  );
}
