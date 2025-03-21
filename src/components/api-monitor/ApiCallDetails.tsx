"use client";

import React from "react";
import { ApiCall } from "../../api/api-monitor";
import { formatDateTime } from "../../utils/date-utils";

interface ApiCallDetailsProps {
  apiCall: ApiCall;
  onClose: () => void;
}

export default function ApiCallDetails({
  apiCall,
  onClose,
}: ApiCallDetailsProps) {
  // Format JSON để hiển thị
  const formatJson = (data: unknown): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return "Không thể hiển thị dữ liệu";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gray-100 px-6 py-3 flex justify-between items-center border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Chi tiết API Call
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded">
            <div className="flex flex-wrap justify-between">
              <div className="mb-2">
                <span className="font-semibold">Phương thức:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    apiCall.method === "GET"
                      ? "bg-blue-100 text-blue-800"
                      : apiCall.method === "POST"
                      ? "bg-green-100 text-green-800"
                      : apiCall.method === "PUT"
                      ? "bg-yellow-100 text-yellow-800"
                      : apiCall.method === "DELETE"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {apiCall.method}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Trạng thái:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    apiCall.status &&
                    apiCall.status >= 200 &&
                    apiCall.status < 300
                      ? "bg-green-100 text-green-800"
                      : apiCall.status &&
                        apiCall.status >= 400 &&
                        apiCall.status < 500
                      ? "bg-orange-100 text-orange-800"
                      : apiCall.status && apiCall.status >= 500
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {apiCall.status || "Không có trạng thái"}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Thời gian:</span>{" "}
                {formatDateTime(apiCall.timestamp)}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Thời gian xử lý:</span>{" "}
                {apiCall.duration}ms
              </div>
            </div>
            <div className="mt-2">
              <span className="font-semibold">URL:</span> {apiCall.url}
            </div>
          </div>

          {/* Request */}
          <div className="border rounded p-4">
            <h4 className="font-medium text-lg mb-2">Request</h4>

            <div className="mb-4">
              <h5 className="font-medium mb-1">Headers</h5>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
                {formatJson(apiCall.requestHeaders)}
              </pre>
            </div>

            {apiCall.requestData && (
              <div>
                <h5 className="font-medium mb-1">Body</h5>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-80">
                  {formatJson(apiCall.requestData)}
                </pre>
              </div>
            )}
          </div>

          {/* Response */}
          <div className="border rounded p-4">
            <h4 className="font-medium text-lg mb-2">Response</h4>

            {apiCall.status && (
              <>
                <div className="mb-4">
                  <h5 className="font-medium mb-1">Headers</h5>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
                    {formatJson(apiCall.responseHeaders)}
                  </pre>
                </div>

                <div>
                  <h5 className="font-medium mb-1">Body</h5>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-80">
                    {formatJson(apiCall.responseData)}
                  </pre>
                </div>
              </>
            )}

            {apiCall.error && (
              <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded">
                <h5 className="font-medium text-red-700 mb-1">Lỗi</h5>
                <div className="text-red-600 mb-2">{apiCall.error.message}</div>
                {apiCall.error.stack && (
                  <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40 text-red-500">
                    {apiCall.error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
