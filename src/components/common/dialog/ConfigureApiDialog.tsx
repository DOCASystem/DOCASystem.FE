"use client";

import { useState, useEffect } from "react";
import { SWAGGER_URL, API_BASE_URL } from "@/utils/api-config";

interface ConfigureApiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiUrl: string, swaggerUrl: string) => void;
}

export default function ConfigureApiDialog({
  isOpen,
  onClose,
  onSave,
}: ConfigureApiDialogProps) {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [swaggerUrl, setSwaggerUrl] = useState(SWAGGER_URL);

  useEffect(() => {
    // Reset form khi mở dialog
    if (isOpen) {
      setApiUrl(API_BASE_URL);
      setSwaggerUrl(SWAGGER_URL);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(apiUrl, swaggerUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Cấu hình URL API</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL cơ sở API
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://api.example.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ví dụ: https://api.example.com
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Swagger JSON
          </label>
          <input
            type="text"
            value={swaggerUrl}
            onChange={(e) => setSwaggerUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://api.example.com/swagger/v1/swagger.json"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ví dụ: https://api.example.com/swagger/v1/swagger.json
          </p>
        </div>

        <div className="text-xs bg-yellow-50 border border-yellow-200 p-2 rounded-md mb-4">
          <p className="font-semibold text-yellow-700">Lưu ý:</p>
          <p className="text-yellow-700">
            Cấu hình này chỉ có hiệu lực trong phiên làm việc hiện tại. Để lưu
            lâu dài, bạn cần cập nhật file .env.local và khởi động lại ứng dụng.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
