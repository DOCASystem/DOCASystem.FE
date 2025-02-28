"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";

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
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="bg-gray-100 p-6 rounded-xl shadow-md min-w-[550px]"
      >
        <h1 className="text-2xl font-semibold text-center">Đăng nhập</h1>
        <Input name="email" label="Email" placeholder="Nhập email" />
        <Input
          name="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          type="password"
        />

        <div className="mt-6">
          <Button className="w-32 h-12 bg-pink-doca text-white rounded">
            Gửi
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
