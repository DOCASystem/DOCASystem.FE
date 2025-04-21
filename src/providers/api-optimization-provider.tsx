"use client";

import { ReactNode, useEffect } from "react";
import { optimizedAxios } from "@/api/api-optimizations";
import AuthService from "@/service/auth.service";

interface ApiOptimizationProviderProps {
  children: ReactNode;
}

// Tạo event custom để thông báo khi đăng nhập thành công
export const LOGIN_SUCCESS_EVENT = "doca-login-success";

/**
 * Provider để khởi tạo tối ưu hóa API khi ứng dụng khởi động
 * Ưu tiên tải profile user và giỏ hàng trước sau khi đăng nhập
 */
export function ApiOptimizationProvider({
  children,
}: ApiOptimizationProviderProps) {
  useEffect(() => {
    // Thêm custom event cho login success
    const createLoginSuccessEvent = () => {
      if (typeof window !== "undefined") {
        const event = new CustomEvent(LOGIN_SUCCESS_EVENT);
        window.dispatchEvent(event);
        console.log("[ApiOptimization] Đã phát sự kiện đăng nhập thành công");
      }
    };

    // Thêm response interceptor để xử lý các response từ server
    optimizedAxios.interceptors.response.use(
      (response) => {
        // Nếu là response từ login API
        if (response.config.url?.includes("/api/v1/login")) {
          console.log(
            "[ApiOptimization] Đăng nhập thành công, ưu tiên tải profile và giỏ hàng"
          );

          // Kiểm tra xem response có chứa token và thông tin user không
          if (response.data && response.data.token) {
            const { token, id, username, fullName, phoneNumber, roles } =
              response.data;

            // Đảm bảo token được lưu trữ đúng cách
            if (token) {
              localStorage.setItem("token", token);

              // Lưu thông tin người dùng
              const userData = {
                id: id || "",
                username: username || "",
                fullName: fullName || "",
                phoneNumber: phoneNumber || "",
                roles: roles || ["USER"],
              };

              const userDataStr = JSON.stringify(userData);
              try {
                localStorage.setItem("userData", userDataStr);
                sessionStorage.setItem("cached_user_data", userDataStr);
                console.log(
                  "[ApiOptimization] Đã lưu thông tin người dùng:",
                  userData
                );

                // Phát event đăng nhập thành công
                createLoginSuccessEvent();
              } catch (error) {
                console.error(
                  "[ApiOptimization] Lỗi khi lưu trữ dữ liệu người dùng:",
                  error
                );
              }
            }

            // Tạo một khoảng trễ nhỏ để đảm bảo token đã được lưu
            setTimeout(() => {
              // Tải profile trước
              fetch("https://production.doca.love/api/v1/profile", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "X-Priority": "high",
                },
              }).catch(() => {
                // Bỏ qua lỗi - chỉ ưu tiên tải trước
              });

              // Tải giỏ hàng
              fetch("https://production.doca.love/api/v1/carts", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "X-Priority": "high",
                },
              }).catch(() => {
                // Bỏ qua lỗi - chỉ ưu tiên tải trước
              });
            }, 100);
          }
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Thêm event listener để xử lý khi đăng nhập thành công
    const handleLoginSuccess = () => {
      console.log("[ApiOptimization] Xử lý sự kiện đăng nhập thành công");

      // Cập nhật UI (có thể dispatch event để các component khác biết)
      const token = localStorage.getItem("token");
      if (token) {
        // Kiểm tra thông tin người dùng đã được lưu chưa
        const storedUserData = localStorage.getItem("userData");
        if (!storedUserData) {
          console.log(
            "[ApiOptimization] Dữ liệu người dùng chưa được lưu, thử lấy từ AuthService"
          );
          const userInfo = AuthService.fetchUserProfile();
          if (userInfo) {
            localStorage.setItem("userData", JSON.stringify(userInfo));
            sessionStorage.setItem(
              "cached_user_data",
              JSON.stringify(userInfo)
            );
            console.log(
              "[ApiOptimization] Đã cập nhật dữ liệu người dùng từ AuthService"
            );
          }
        }
      }
    };

    // Đăng ký lắng nghe sự kiện đăng nhập thành công
    window.addEventListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess);

    // Log khởi tạo
    console.log("[ApiOptimization] Khởi tạo tối ưu hóa API thành công");

    // Cleanup
    return () => {
      window.removeEventListener(LOGIN_SUCCESS_EVENT, handleLoginSuccess);
    };
  }, []);

  return <>{children}</>;
}
