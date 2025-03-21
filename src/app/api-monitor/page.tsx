"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useApiMonitor from "@/hooks/useApiMonitor";
import ApiMonitorTable from "@/components/api-monitor/ApiMonitorTable";
import ApiCallDetails from "@/components/api-monitor/ApiCallDetails";
import { ApiCall } from "@/api/api-monitor";

export default function ApiMonitorPage() {
  const router = useRouter();
  const { apiCalls, filter, updateFilter, clearLogs } = useApiMonitor();
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);

  // Xử lý khi click vào nút chi tiết
  const handleViewDetails = (call: ApiCall) => {
    setSelectedCall(call);
  };

  // Đóng modal chi tiết
  const handleCloseDetails = () => {
    setSelectedCall(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Giám sát API</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
          >
            Quay lại
          </button>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Xóa logs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              value={filter.url}
              onChange={(e) => updateFilter({ url: e.target.value })}
              placeholder="Tìm theo URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phương thức
            </label>
            <select
              value={filter.method}
              onChange={(e) => updateFilter({ method: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <input
              type="text"
              value={filter.status}
              onChange={(e) => updateFilter({ status: e.target.value })}
              placeholder="Ví dụ: 200, 404, 500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filter.hasError}
                onChange={(e) => updateFilter({ hasError: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Chỉ hiển thị lỗi
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lịch sử API Calls</h2>
          <ApiMonitorTable
            apiCalls={apiCalls}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {selectedCall && (
        <ApiCallDetails apiCall={selectedCall} onClose={handleCloseDetails} />
      )}
    </div>
  );
}
