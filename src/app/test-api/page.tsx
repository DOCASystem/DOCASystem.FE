"use client";

import { useState } from "react";
import axiosInstance from "@/api/axios-interceptor";
import { useRouter } from "next/navigation";

export default function TestApiPage() {
  const router = useRouter();
  const [response, setResponse] = useState<string>("");
  const [requestUrl, setRequestUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;

      switch (method) {
        case "GET":
          result = await axiosInstance.get(requestUrl);
          break;
        case "POST":
          result = await axiosInstance.post(
            requestUrl,
            JSON.parse(body || "{}")
          );
          break;
        case "PUT":
          result = await axiosInstance.put(
            requestUrl,
            JSON.parse(body || "{}")
          );
          break;
        case "DELETE":
          result = await axiosInstance.delete(requestUrl);
          break;
        case "PATCH":
          result = await axiosInstance.patch(
            requestUrl,
            JSON.parse(body || "{}")
          );
          break;
        default:
          result = await axiosInstance.get(requestUrl);
      }

      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error: any) {
      console.error("Lỗi API:", error);
      setResponse(
        JSON.stringify(
          {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data,
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMonitor = () => {
    router.push("/api-monitor");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kiểm tra API</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleViewMonitor}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Xem API Monitor
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Quay lại
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4 md:p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">URL API</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập URL API (ví dụ: /api/products)"
              value={requestUrl}
              onChange={(e) => setRequestUrl(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Phương thức
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Body (JSON)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="{ ... }"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>

      {response && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-3">Kết quả:</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-80 text-sm">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
