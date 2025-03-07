"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import Image from "next/image";
import LinkNav from "@/components/common/link/link";

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
  const methods = useForm<FormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log("Dữ liệu nhập:", data);
  });

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

            <Input
              name="opt"
              label="OTP"
              placeholder="Nhập OTP"
              className="w-[404px]"
            />

            <div className="mt-6 flex flex-col gap-4">
              <Button className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]">
                Đăng ký
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
