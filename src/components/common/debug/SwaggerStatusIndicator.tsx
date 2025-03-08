"use client";

import { useState, useEffect, useCallback } from "react";
import { checkSwaggerConnection, checkApiConnection } from "@/api/api-status";
import { SWAGGER_URL, API_BASE_URL } from "@/utils/api-config";
import ConfigureApiDialog from "../dialog/ConfigureApiDialog";

export default function SwaggerStatusIndicator() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState(API_BASE_URL);
  const [currentSwaggerUrl, setCurrentSwaggerUrl] = useState(SWAGGER_URL);

  const checkApiStatus = useCallback(async () => {
    try {
      // Kiểm tra kết nối API trước
      const apiConnected = await checkApiConnection();
      if (!apiConnected) {
        setStatus("error");
        setErrorDetails(
          `Không thể kết nối đến API: ${currentApiUrl}. URL không chính xác hoặc server không hoạt động.`
        );
        return;
      }

      // Sau đó kiểm tra Swagger
      const isConnected = await checkSwaggerConnection();
      if (!isConnected) {
        setStatus("error");
        setErrorDetails(
          `API hoạt động nhưng không thể kết nối đến Swagger: ${currentSwaggerUrl}`
        );
        return;
      }

      setStatus("connected");
    } catch (error) {
      setStatus("error");
      setErrorDetails(
        `Lỗi không xác định: ${
          error instanceof Error ? error.message : "Không xác định"
        }`
      );
    }
  }, [currentApiUrl, currentSwaggerUrl]);

  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);

  const handleSaveConfig = (apiUrl: string, swaggerUrl: string) => {
    setCurrentApiUrl(apiUrl);
    setCurrentSwaggerUrl(swaggerUrl);
    // Sau khi cập nhật URLs, trạng thái sẽ được kiểm tra lại do dependency của useEffect
    setStatus("loading");
  };

  if (status === "loading") {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg text-sm z-50">
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-3 w-3 rounded-full bg-yellow-400"></div>
          <span>Đang kiểm tra kết nối API...</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <>
        <ConfigureApiDialog
          isOpen={isConfigDialogOpen}
          onClose={() => setIsConfigDialogOpen(false)}
          onSave={handleSaveConfig}
        />

        <div className="fixed bottom-4 right-4 bg-red-700 text-white px-4 py-2 rounded-md shadow-lg text-sm z-50 max-w-md">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <span>Lỗi kết nối API {expanded ? "▼" : "►"}</span>
          </div>

          {expanded && (
            <>
              <div className="text-xs mt-2 font-mono break-all">
                {errorDetails}
              </div>

              <div className="mt-3 text-xs bg-red-800 p-2 rounded">
                <div className="font-semibold">URL API không chính xác!</div>
                <p className="mt-1">
                  URL API hiện tại ({currentApiUrl}) không hoạt động. Có thể URL
                  không đúng hoặc máy chủ không hoạt động.
                </p>
              </div>

              <div className="mt-3 text-xs">
                <div className="font-semibold">Hướng dẫn:</div>
                <ul className="list-decimal pl-5 mt-1 space-y-1">
                  <li>Xác nhận URL API chính xác từ team backend</li>
                  <li>Cấu hình URL API trong phiên làm việc hiện tại</li>
                  <li>
                    Cập nhật file <span className="font-mono">.env.local</span>{" "}
                    với URL đúng
                  </li>
                  <li>Khởi động lại ứng dụng</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConfigDialogOpen(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
                >
                  Cấu hình URL API
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(currentApiUrl, "_blank");
                  }}
                  className="bg-red-800 hover:bg-red-900 px-2 py-1 rounded text-xs"
                >
                  Kiểm tra URL API trực tiếp
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(currentSwaggerUrl, "_blank");
                  }}
                  className="bg-red-800 hover:bg-red-900 px-2 py-1 rounded text-xs"
                >
                  Kiểm tra Swagger JSON
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setStatus("loading");
                    checkApiStatus();
                  }}
                  className="bg-red-800 hover:bg-red-900 px-2 py-1 rounded text-xs"
                >
                  Kiểm tra lại kết nối
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfigureApiDialog
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
        onSave={handleSaveConfig}
      />

      <div
        className="fixed bottom-4 right-4 bg-green-700 text-white px-4 py-2 rounded-md shadow-lg text-sm z-50 hover:bg-green-800 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
          <span>API đã kết nối {expanded ? "▼" : "►"}</span>
        </div>

        {expanded && (
          <div className="mt-2 text-xs">
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-semibold">API URL:</span>
                <a
                  href={currentApiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-green-200 hover:text-white underline inline-block max-w-[250px] truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {currentApiUrl}
                </a>
              </div>
              <div>
                <span className="font-semibold">Swagger JSON:</span>
                <a
                  href={currentSwaggerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-green-200 hover:text-white underline inline-block max-w-[250px] truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {currentSwaggerUrl}
                </a>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfigDialogOpen(true);
                }}
                className="mt-2 bg-green-800 hover:bg-green-900 px-2 py-1 rounded text-xs"
              >
                Cấu hình URL API
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
