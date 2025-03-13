"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho đơn hàng
type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  orderDate: string;
  total: number;
  status:
    | "Chờ xác nhận"
    | "Đã xác nhận"
    | "Đang vận chuyển"
    | "Đã giao hàng"
    | "Đã hủy";
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category: string;
    image?: string;
  }[];
  blog?: {
    id: string;
    title: string;
  };
};

export default function ViewOrderPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // Trong dự án thực tế, bạn sẽ gọi API ở đây
        // Giả lập delay để mô phỏng việc gọi API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dữ liệu mẫu
        const sampleOrder: Order = {
          id: id as string,
          customerName: "Nguyễn Văn A",
          customerPhone: "0901234567",
          customerEmail: "nguyenvana@example.com",
          customerAddress: "123 Đường Lê Lợi, Q.1, TP.HCM",
          orderDate: "15/03/2024",
          total: 450000,
          status: "Chờ xác nhận",
          products: [
            {
              id: "1",
              name: "Mì Ý cao cấp nhập khẩu",
              quantity: 2,
              price: 120000,
              category: "Thực phẩm khô",
              image: "/images/blog-placeholder.png",
            },
            {
              id: "3",
              name: "Gạo Nhật Bản đặc biệt",
              quantity: 1,
              price: 85000,
              category: "Gạo & Ngũ cốc",
              image: "/images/blog-placeholder.png",
            },
          ],
          blog: {
            id: "2",
            title: "Cách chăm sóc thú cưng mùa nóng",
          },
        };

        setOrder(sampleOrder);
        setError(null);
      } catch (err) {
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
        console.error("Error fetching order:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Hàm lấy màu sắc dựa theo trạng thái đơn hàng
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-600";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-600";
      case "Đang vận chuyển":
        return "bg-purple-100 text-purple-600";
      case "Đã giao hàng":
        return "bg-green-100 text-green-600";
      case "Đã hủy":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-pink-doca">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Không tìm thấy thông tin đơn hàng"}
        <div className="mt-4">
          <button
            onClick={() => router.push("/orders-management")}
            className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/orders-management"
            className="text-pink-doca hover:text-pink-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng {order.id}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/orders-management/edit/${order.id}`}
            className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 transition-all"
          >
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin đơn hàng
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Mã đơn hàng:</span> {order.id}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Ngày đặt:</span> {order.orderDate}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Tổng tiền:</span>{" "}
                {order.total.toLocaleString()}đ
              </p>
            </div>
            <div>
              {order.blog && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Blog liên quan:</span>{" "}
                  <Link
                    href={`/blog-management/view?id=${order.blog.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.blog.title}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin khách hàng
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Tên:</span> {order.customerName}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">SĐT:</span> {order.customerPhone}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Email:</span>{" "}
                {order.customerEmail}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Địa chỉ:</span>{" "}
                {order.customerAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Danh sách sản phẩm
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sản phẩm
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phân loại
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Đơn giá
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số lượng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              sizes="100%"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            href={`/products-management/view-product?id=${product.id}`}
                            className="hover:text-pink-doca"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(product.price * product.quantity).toLocaleString()}đ
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-right font-semibold"
                  >
                    Tổng cộng:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {order.total.toLocaleString()}đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
