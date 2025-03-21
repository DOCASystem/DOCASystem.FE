"use client";

import React from "react";
import { ApiCall } from "../../api/api-monitor";
import { formatDistanceToNow } from "../../utils/date-utils";

interface ApiMonitorTableProps {
  apiCalls: ApiCall[];
  onViewDetails: (call: ApiCall) => void;
}

export default function ApiMonitorTable({
  apiCalls,
  onViewDetails,
}: ApiMonitorTableProps) {
  const getStatusColor = (status?: number) => {
    if (!status) return "bg-gray-200";
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
    if (status >= 400 && status < 500) return "bg-orange-100 text-orange-800";
    if (status >= 500) return "bg-red-100 text-red-800";
    return "bg-gray-100";
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "PATCH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Tạo URL hiển thị ngắn gọn
  const formatUrl = (url: string) => {
    const maxLength = 40;
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Thời gian
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Phương thức
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              URL
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Trạng thái
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Thời gian xử lý
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {apiCalls.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
              >
                Chưa có dữ liệu API call nào. Hãy thực hiện một số thao tác sử
                dụng API.
              </td>
            </tr>
          ) : (
            apiCalls.map((call) => (
              <tr key={call.id} className={call.error ? "bg-red-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(call.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodColor(
                      call.method
                    )}`}
                  >
                    {call.method}
                  </span>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  title={call.url}
                >
                  {formatUrl(call.url)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      call.status
                    )}`}
                  >
                    {call.status || "Chờ phản hồi"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {call.duration ? `${call.duration}ms` : "Đang xử lý..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(call)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
