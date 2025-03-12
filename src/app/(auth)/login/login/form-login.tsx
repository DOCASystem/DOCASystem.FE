"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import Image from "next/image";
import LinkNav from "@/components/common/link/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/services";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import axios from "axios";
import { getApiUrl, API_ENDPOINTS } from "@/utils/api-config";

// Helper để kiểm tra môi trường browser
const isBrowser = () => typeof window !== "undefined";

interface FormData {
  email: string;
  password: string;
}

// Thêm hàm setCookie để lưu cookie
const setCookie = (name: string, value: string, days: number) => {
  if (isBrowser()) {
    try {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(
        value
      )}; expires=${expires}; path=/; SameSite=Lax`;
      console.log(`Đã lưu cookie ${name}`);
    } catch (error) {
      console.error(`Lỗi khi lưu cookie ${name}:`, error);
    }
  }
};

// Tạo anti-CSRF token
const generateCSRFToken = () => {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  }
  return Math.random().toString(36).substring(2);
};

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Tạo CSRF token khi component mount
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  const onSubmit = methods.handleSubmit(async (data) => {
    console.log("Form submitted with data:", data);
    try {
      setLoading(true);

      // Log URL API login
      const loginUrl = getApiUrl(API_ENDPOINTS.AUTH.LOGIN);
      console.log(`Đang gọi API login tại: ${loginUrl}`);

      let response;
      try {
        // Cố gắng gọi API login sử dụng Swagger-generated client
        response = await authApi.apiV1LoginPost({
          usernameOrPhoneNumber: data.email,
          password: data.password,
        });

        console.log("API response:", response);
      } catch (apiError) {
        console.error("Error from Swagger client:", apiError);

        // Thử gọi trực tiếp bằng axios nếu Swagger client gặp lỗi
        console.log("Trying direct API call with axios...");
        const directResponse = await axios.post(
          loginUrl,
          {
            usernameOrPhoneNumber: data.email,
            password: data.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Direct API response:", directResponse);

        // Sử dụng response từ axios
        response = { data: directResponse.data };
      }

      // Lưu token vào localStorage và cookie
      if (response.data.token && isBrowser()) {
        try {
          localStorage.setItem("token", response.data.token);
          setCookie("token", response.data.token, 7); // Lưu cookie trong 7 ngày
          console.log("Token đã được lưu trữ");
        } catch (error) {
          console.error("Lỗi khi lưu token:", error);
        }
      } else if (!response.data.token) {
        throw new Error("Token không được trả về từ server");
      }

      // Lưu thông tin người dùng
      const userData = {
        id: response.data.id,
        username: response.data.username,
        phoneNumber: response.data.phoneNumber,
        fullName: response.data.fullName,
      };

      if (isBrowser()) {
        try {
          const userDataString = JSON.stringify(userData);
          localStorage.setItem("userData", userDataString);
          setCookie("userData", userDataString, 7); // Lưu cookie trong 7 ngày
          console.log("userData đã được lưu trữ");

          // Kiểm tra lại xem đã lưu thành công chưa
          console.log(
            "Token trong localStorage:",
            !!localStorage.getItem("token")
          );
          console.log(
            "userData trong localStorage:",
            !!localStorage.getItem("userData")
          );
        } catch (error) {
          console.error("Lỗi khi lưu userData:", error);
        }
      }

      toast.success("Đăng nhập thành công!");

      // Kiểm tra nếu là admin thì chuyển đến trang admin, ngược lại về trang chủ
      if (data.email === "admin" || userData.username === "admin") {
        console.log(
          "Đăng nhập với tài khoản admin, chuyển hướng đến trang admin"
        );
        router.push("/admin");

        // Xác nhận và log thông tin điều hướng
        setTimeout(() => {
          console.log(
            "URL hiện tại sau khi điều hướng:",
            window.location.pathname
          );
        }, 500);
      } else {
        // Chuyển hướng người dùng về trang chủ
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("Lỗi đăng nhập:", error);

      let message = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;

        // Chi tiết hơn về lỗi
        console.error("Chi tiết lỗi Axios:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            baseURL: axiosError.config?.baseURL,
          },
        });

        if (axiosError.response) {
          // Lỗi từ server
          if (axiosError.response.status === 401) {
            message = "Tên đăng nhập hoặc mật khẩu không đúng";
          } else if (axiosError.response.status === 403) {
            message = "Tài khoản của bạn đã bị khóa";
          } else if (axiosError.response.status === 404) {
            message = "Không tìm thấy tài khoản";
          } else if (axiosError.response.data?.message) {
            message = axiosError.response.data.message;
          } else {
            message = `Lỗi server: ${axiosError.response.status} ${axiosError.response.statusText}`;
          }
        } else if (axiosError.request) {
          // Lỗi không nhận được response
          message = `Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại sau.`;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.error("Error message:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-row">
      <FormProvider {...methods}>
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted via native submit");
            onSubmit(e);
          }}
          className="bg-gray-100 flex flex-col justify-center items-center max-w-[1536px] p-6 rounded-xl shadow-md min-w-[700px]"
        >
          {/* CSRF token ẩn */}
          <input type="hidden" name="csrf_token" value={csrfToken} />

          <h1 className="text-2xl font-semibold">Đăng nhập</h1>

          <div className="flex flex-col gap-4 mt-6">
            <Input
              name="email"
              label="Email hoặc số điện thoại"
              placeholder="Nhập email hoặc số điện thoại"
              className="w-[404px]"
              autoComplete="username"
            />
            <Input
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              className="w-[404px]"
              autoComplete="current-password"
            />

            <LinkNav
              href="/forgot-password"
              className="text-pink-doca hover:underline left-0 "
            >
              Quên mật khẩu?
            </LinkNav>
            <div className="mt-6 flex flex-col gap-4">
              <Button
                className="h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]"
                disabled={loading}
                type="submit"
              >
                {loading ? "Đang xử lý..." : "Đăng Nhập"}
              </Button>
              <div className="flex gap-2 items-center justify-center">
                <p>Bạn chưa có tài khoản? </p>
                <LinkNav
                  href="/signup"
                  className="text-pink-doca left-0 text-right hover:underline"
                >
                  Tạo tài khoản
                </LinkNav>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <LinkNav href="/">
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
