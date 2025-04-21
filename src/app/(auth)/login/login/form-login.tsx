"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import Image from "next/image";
import LinkNav from "@/components/common/link/link";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import axios from "axios";
import { getApiUrl, API_ENDPOINTS } from "@/utils/api-config";
import { useAuthContext } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/api/generated";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [isApiConnecting, setIsApiConnecting] = useState(false);
  const { login, refreshAuth } = useAuthContext();
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Tạo anti-CSRF token khi component mount
  useEffect(() => {
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

    setCsrfToken(generateCSRFToken());
  }, []);

  const onSubmit = methods.handleSubmit(async (data) => {
    console.log("Form submitted with data:", data);

    // Kiểm tra cứng: nếu email/username là "admin"
    if (data.email.toLowerCase() === "admin") {
      console.log("[FormLogin] Phát hiện đăng nhập tài khoản ADMIN đặc biệt");
      try {
        setLoading(true);
        setIsApiConnecting(true);

        // Thực hiện đăng nhập bình thường để có token
        const response = await login(data.email, data.password);

        // Lưu token và thông tin người dùng
        localStorage.setItem("token", response.token || "");
        sessionStorage.setItem("token", response.token || "");

        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
          sessionStorage.setItem("refreshToken", response.refreshToken);
        }

        // Đảm bảo có quyền admin trong dữ liệu người dùng
        const adminUserData = {
          ...response,
          username: "admin",
          roles: ["ADMIN"],
        };

        // Lưu thông tin user với quyền admin đã được đảm bảo
        const adminUserDataStr = JSON.stringify(adminUserData);
        localStorage.setItem("userData", adminUserDataStr);
        sessionStorage.setItem("cached_user_data", adminUserDataStr);

        // Lưu vào cookie để middleware có thể truy cập
        document.cookie = `userData=${encodeURIComponent(
          adminUserDataStr
        )}; path=/; max-age=86400`;
        document.cookie = `token=${
          response.token || ""
        }; path=/; max-age=86400`;

        // Làm mới thông tin xác thực
        refreshAuth();

        console.log(
          "[FormLogin] Đã lưu thông tin admin đặc biệt vào localStorage và cookies"
        );

        // Kích hoạt sự kiện đăng nhập thành công
        if (typeof window !== "undefined") {
          const LOGIN_SUCCESS_EVENT = "doca-login-success";
          const event = new CustomEvent(LOGIN_SUCCESS_EVENT);
          window.dispatchEvent(event);
        }

        // Chuyển hướng ngay lập tức đến trang admin
        console.log(
          "[FormLogin] Chuyển hướng trực tiếp đến trang quản lý cho admin"
        );

        // Thêm timeout ngắn để đảm bảo dữ liệu được lưu trước khi chuyển trang
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);

        return;
      } catch (error) {
        // Xử lý lỗi như bình thường
        handleLoginError(error);
      } finally {
        setLoading(false);
        setIsApiConnecting(false);
      }
      return;
    }

    // Xử lý đăng nhập bình thường cho các tài khoản khác
    try {
      setLoading(true);
      setIsApiConnecting(true);

      // Log URL API login
      const loginUrl = getApiUrl(API_ENDPOINTS.AUTH.LOGIN);
      console.log(`Đang kết nối đến API login tại: ${loginUrl}`);

      try {
        // Sử dụng login từ AuthContext thay vì gọi API trực tiếp
        const response = await login(data.email, data.password);
        console.log("Login response:", response);

        // Xử lý đăng nhập thành công với phương thức mới
        handleLoginSuccess(response);
        return;
      } catch (apiError) {
        console.error("Error from login:", apiError);
        throw apiError;
      } finally {
        setIsApiConnecting(false);
      }
    } catch (error: unknown) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  });

  // Sau khi đăng nhập thành công và đã nhận được token
  const handleLoginSuccess = (response: LoginResponse) => {
    console.log("Xử lý đăng nhập thành công:", response);

    // Kiểm tra và lưu token
    if (response.token) {
      console.log(
        "Lưu token đăng nhập:",
        response.token.substring(0, 10) + "..."
      );
      localStorage.setItem("token", response.token);
      sessionStorage.setItem("token", response.token);
    } else {
      console.error("Không có token trong phản hồi đăng nhập");
    }

    // Lưu refresh token nếu có
    if (response.refreshToken) {
      localStorage.setItem("refreshToken", response.refreshToken);
      sessionStorage.setItem("refreshToken", response.refreshToken);
    }

    // Tạo và lưu dữ liệu người dùng
    const userData = {
      id: response.id || "",
      username: response.username || "",
      phoneNumber: response.phoneNumber || "",
      fullName: response.fullName || "",
      roles: response.roles || ["USER"],
    };

    const userDataStr = JSON.stringify(userData);
    try {
      localStorage.setItem("userData", userDataStr);
      sessionStorage.setItem("cached_user_data", userDataStr);
      console.log("[FormLogin] Đã lưu thông tin người dùng:", userData);
    } catch (error) {
      console.error("[FormLogin] Lỗi khi lưu thông tin người dùng:", error);
    }

    // Xác nhận lưu trữ thành công sau một khoảng thời gian ngắn
    setTimeout(() => {
      try {
        // Xác nhận lưu trữ đã thành công
        const storedToken = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("userData");

        if (storedToken && storedUserData) {
          console.log("[FormLogin] Xác nhận dữ liệu đã được lưu thành công");

          // Dispatch sự kiện LOGIN_SUCCESS_EVENT để thông báo cho các component khác
          if (typeof window !== "undefined") {
            const LOGIN_SUCCESS_EVENT = "doca-login-success";
            const event = new CustomEvent(LOGIN_SUCCESS_EVENT);
            window.dispatchEvent(event);
            console.log("[FormLogin] Đã phát sự kiện đăng nhập thành công");
          }

          // Làm mới trạng thái auth
          refreshAuth();

          // Kiểm tra vai trò người dùng để điều hướng phù hợp
          try {
            const userDataObj = JSON.parse(storedUserData);
            const userRoles = userDataObj.roles || [];

            // Nếu là ADMIN, chuyển hướng đến trang quản lý
            if (userRoles.includes("ADMIN")) {
              console.log(
                "[FormLogin] Phát hiện user ADMIN, chuyển hướng đến trang quản lý"
              );
              router.push("/admin");
            } else {
              // Nếu là user thường, chuyển hướng đến trang chủ
              console.log(
                "[FormLogin] User thường, chuyển hướng đến trang chủ"
              );
              router.push("/");
            }
          } catch (parseError) {
            console.error(
              "[FormLogin] Lỗi khi phân tích dữ liệu roles:",
              parseError
            );
            // Fallback về trang chủ nếu có lỗi
            router.push("/");
          }
        } else {
          console.error(
            "[FormLogin] Dữ liệu lưu trữ không nhất quán sau khi đăng nhập"
          );
        }
      } catch (error) {
        console.error("[FormLogin] Lỗi xác nhận lưu trữ:", error);
      }
    }, 300); // Đợi 300ms để đảm bảo localStorage được cập nhật
  };

  // Hàm xử lý lỗi đăng nhập (tách ra để tái sử dụng)
  const handleLoginError = (error: unknown) => {
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
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <FormProvider {...methods}>
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted via native submit");
            onSubmit(e);
          }}
          className="bg-gray-100 flex flex-col justify-center items-center p-4 sm:p-6 rounded-xl shadow-md w-full md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]"
        >
          {/* CSRF token ẩn */}
          <input type="hidden" name="csrf_token" value={csrfToken} />

          <h1 className="text-xl sm:text-2xl font-semibold">Đăng nhập</h1>

          <div className="flex flex-col gap-4 mt-6 w-full max-w-[404px]">
            <Input
              name="email"
              label="Email hoặc số điện thoại"
              placeholder="Nhập email hoặc số điện thoại"
              className="w-full"
              autoComplete="username"
            />
            <Input
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              className="w-full"
              autoComplete="current-password"
            />

            <LinkNav
              href="/forgot-password"
              className="text-pink-doca hover:underline left-0"
            >
              Quên mật khẩu?
            </LinkNav>

            <Button
              className="h-12 w-full bg-pink-doca text-white rounded-3xl text-[16px]"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>
                    {isApiConnecting
                      ? "Đang kết nối đến máy chủ..."
                      : "Đang xử lý..."}
                  </span>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              ) : (
                "Đăng Nhập"
              )}
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
        </form>
      </FormProvider>
      <div className="hidden md:block">
        <LinkNav href="/">
          <Image
            src="/images/doca.png"
            alt="bg-login"
            width={1000}
            height={900}
            className="w-full h-auto max-h-[800px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-l-2xl object-cover"
          />
        </LinkNav>
      </div>
    </div>
  );
}
