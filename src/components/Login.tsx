"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import {
  Form,
  FormInput,
  FormSubmitButton,
  FormError,
} from "@/components/common/form";
import Link from "next/link";

// Schema validation using Zod
const loginSchema = z.object({
  usernameOrPhoneNumber: z
    .string()
    .min(1, "Username or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (data: LoginFormValues) => {
    try {
      setAuthError(null);
      await login(data.usernameOrPhoneNumber, data.password);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setAuthError(
        axiosError.response?.data?.message ||
          "Kiểm tra lại tài khoản và mật khẩu"
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form
          schema={loginSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            usernameOrPhoneNumber: "",
            password: "",
          }}
          className="space-y-6"
        >
          <FormInput
            name="usernameOrPhoneNumber"
            label="Tên đăng nhập hoặc số điện thoại"
            type="text"
            autoComplete="username"
            placeholder="Nhập tên đăng nhập hoặc số điện thoại"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-pink-doca hover:text-pink-600"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <FormInput
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              containerClassName="mt-0"
              labelClassName="sr-only"
            />
          </div>

          {authError && <FormError message={authError} />}

          <FormSubmitButton
            loading={isLoading}
            loadingText="Đang xử lý..."
            fullWidth
            size="md"
          >
            Đăng nhập
          </FormSubmitButton>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-pink-doca hover:text-pink-600"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
