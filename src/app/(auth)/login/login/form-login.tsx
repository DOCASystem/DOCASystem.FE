"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import Image from "next/image";
import LinkNav from "@/components/common/link/link";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const methods = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
          <h1 className="text-2xl font-semibold">Đăng nhập</h1>
          <div className="flex flex-col gap-4 mt-6">
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

            <LinkNav
              href="/forgot-password"
              className="text-pink-doca hover:underline left-0 "
            >
              Quên mật khẩu?
            </LinkNav>
            <div className="mt-6 flex flex-col gap-4">
              <Button className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]">
                Đăng Nhập
              </Button>
              <div className="flex gap-2 items-center justify-center">
                <p>Bạn chưa có tài khoản? </p>
                <LinkNav
                  href="/signup"
                  className="text-pink-doca  left-0 text-right hover:underline"
                >
                  Tạo tài khoản
                </LinkNav>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <Image
        src="/images/bg-login.png"
        alt="bg-login"
        width={600}
        height={900}
        className="w-[700px] h-[700px] rounded-l-2xl"
      />
    </div>
  );
}
