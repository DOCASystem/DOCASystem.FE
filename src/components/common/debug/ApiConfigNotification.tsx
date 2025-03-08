"use client";

import { useEffect, useState } from "react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  REAL_API_BASE_URL,
  REAL_LOGIN_API_URL,
  updateRealApiBaseUrl,
  updateRealLoginApiUrl,
} from "@/utils/api-config";
import {
  extractApiBaseUrlFromSwagger,
  discoverApiEndpoint,
} from "@/api/api-discovery";

export default function ApiConfigNotification() {
  const [show, setShow] = useState(true);
  const [apiBaseUrl, setApiBaseUrl] = useState(API_BASE_URL);
  const [loginApiUrl, setLoginApiUrl] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Khám phá URL API từ Swagger
    const discoverApi = async () => {
      try {
        setIsInitializing(true);

        // 1. Trích xuất URL API base từ Swagger
        const discoveredBaseUrl = await extractApiBaseUrlFromSwagger();
        if (discoveredBaseUrl) {
          updateRealApiBaseUrl(discoveredBaseUrl);
          setApiBaseUrl(discoveredBaseUrl);
        }

        // 2. Tìm endpoint login
        const loginEndpoint = await discoverApiEndpoint("login");
        if (loginEndpoint) {
          updateRealLoginApiUrl(loginEndpoint);
          setLoginApiUrl(loginEndpoint);
        } else {
          // Nếu không tìm được URL chính xác, dùng đường dẫn mặc định
          const defaultLoginUrl = `${discoveredBaseUrl || API_BASE_URL}${
            API_ENDPOINTS.AUTH.LOGIN
          }`;
          updateRealLoginApiUrl(defaultLoginUrl);
          setLoginApiUrl(defaultLoginUrl);
        }

        setIsInitializing(false);
      } catch (error) {
        console.error("Lỗi khi phát hiện URL API:", error);
        setIsError(true);
        setIsInitializing(false);
      }
    };

    discoverApi();

    // Tự động ẩn sau 15 giây
    const timer = setTimeout(() => {
      setShow(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  if (isInitializing) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md z-50 max-w-lg">
        <div className="flex">
          <div className="py-1">
            <svg
              className="animate-spin h-5 w-5 text-blue-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div>
            <p className="font-bold">Đang khám phá URL API...</p>
            <p className="text-sm">
              Vui lòng chờ trong khi hệ thống tìm URL API chính xác từ Swagger.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md z-50 max-w-lg">
        <div className="flex">
          <div className="py-1">
            <svg
              className="h-6 w-6 text-yellow-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold">Không thể xác định URL API tự động</p>
            <p className="text-sm">
              Đang sử dụng URL cấu hình:{" "}
              <span className="font-mono">{apiBaseUrl}</span>
            </p>
            <button
              onClick={() => setShow(false)}
              className="mt-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 py-1 px-2 rounded text-xs"
            >
              Đóng thông báo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 max-w-lg">
      <div className="flex">
        <div className="py-1">
          <svg
            className="h-6 w-6 text-green-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold">API đã được cấu hình!</p>
          <p className="text-sm">
            URL API base: <span className="font-mono">{apiBaseUrl}</span>
          </p>
          <p className="text-sm">
            API login: <span className="font-mono">{loginApiUrl}</span>
          </p>
          <button
            onClick={() => setShow(false)}
            className="mt-2 bg-green-200 hover:bg-green-300 text-green-800 py-1 px-2 rounded text-xs"
          >
            Đóng thông báo
          </button>
        </div>
      </div>
    </div>
  );
}
