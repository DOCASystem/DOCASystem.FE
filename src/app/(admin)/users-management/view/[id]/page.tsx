"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/button/button";

// Định nghĩa kiểu dữ liệu cho người dùng
type User = {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: "ADMIN" | "USER" | "STAFF";
  status: "Hoạt động" | "Bị khóa";
  createdAt: string;
  lastLogin?: string;
  address?: string;
  email?: string;
};

// Định nghĩa kiểu dữ liệu cho lịch sử đơn hàng
type OrderHistory = {
  id: string;
  date: string;
  total: number;
  status: string;
  products: { name: string; quantity: number; price: number }[];
};

export default function ViewUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Trong thực tế, gọi API để lấy thông tin người dùng
        // Ở đây chúng ta giả lập dữ liệu
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock dữ liệu
        if (userId === "1") {
          setUser({
            id: "1",
            username: "johndoe",
            fullName: "John Doe",
            phoneNumber: "0901234567",
            role: "USER",
            status: "Hoạt động",
            createdAt: "2024-03-01",
            lastLogin: "2024-03-10 15:30:22",
            address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
            email: "johndoe@example.com",
          });

          // Fake data cho lịch sử đơn hàng
          setOrderHistory([
            {
              id: "ORD00123",
              date: "2024-03-15",
              total: 1250000,
              status: "Đã giao",
              products: [
                { name: "Sản phẩm A", quantity: 2, price: 500000 },
                { name: "Sản phẩm B", quantity: 1, price: 250000 },
              ],
            },
            {
              id: "ORD00098",
              date: "2024-02-28",
              total: 850000,
              status: "Đã giao",
              products: [{ name: "Sản phẩm C", quantity: 1, price: 850000 }],
            },
          ]);
        } else if (userId === "2") {
          setUser({
            id: "2",
            username: "adminuser",
            fullName: "Admin User",
            phoneNumber: "0912345678",
            role: "ADMIN",
            status: "Hoạt động",
            createdAt: "2024-03-02",
            lastLogin: "2024-03-11 08:15:40",
            email: "admin@example.com",
          });

          // Admin không có lịch sử đơn hàng
          setOrderHistory([]);
        } else {
          // Giả lập không tìm thấy người dùng
          setError("Không tìm thấy thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Có lỗi xảy ra khi tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết người dùng
          </h1>
          <Link href="/users-management">
            <Button className="bg-pink-doca hover:bg-pink-doca w-52 h-11 text-lg">
              Quay lại
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Đang tải thông tin người dùng...</div>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết người dùng
          </h1>
          <Link href="/users-management">
            <Button className="border-pink-doca hover:bg-pink-doca w-52 h-11 text-lg">
              Quay lại
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-red-500">
            {error || "Không tìm thấy thông tin người dùng"}
          </div>
        </div>
      </div>
    );
  }

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Chi tiết người dùng
        </h1>
        <div className="flex space-x-3">
          <Link href={`/users-management/edit/${user.id}`}>
            <Button className="bg-pink-doca hover:bg-pink-doca w-52 h-11 text-lg">
              Chỉnh sửa
            </Button>
          </Link>
          <Link href="/users-management">
            <Button className="border-pink-doca hover:bg-pink-doca w-52 h-11 text-lg">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Thông tin cơ bản
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-600">ID:</div>
                  <div className="col-span-2 font-medium">{user.id}</div>

                  <div className="col-span-1 text-gray-600">Tên đăng nhập:</div>
                  <div className="col-span-2 font-medium">{user.username}</div>

                  <div className="col-span-1 text-gray-600">Họ tên:</div>
                  <div className="col-span-2 font-medium">{user.fullName}</div>

                  <div className="col-span-1 text-gray-600">Email:</div>
                  <div className="col-span-2 font-medium">
                    {user.email || "Chưa cung cấp"}
                  </div>

                  <div className="col-span-1 text-gray-600">Số điện thoại:</div>
                  <div className="col-span-2 font-medium">
                    {user.phoneNumber}
                  </div>

                  <div className="col-span-1 text-gray-600">Địa chỉ:</div>
                  <div className="col-span-2 font-medium">
                    {user.address || "Chưa cung cấp"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Thông tin tài khoản
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-600">Vai trò:</div>
                  <div className="col-span-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "STAFF"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "ADMIN"
                        ? "Admin"
                        : user.role === "STAFF"
                        ? "Nhân viên"
                        : "Khách hàng"}
                    </span>
                  </div>

                  <div className="col-span-1 text-gray-600">Trạng thái:</div>
                  <div className="col-span-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Hoạt động"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="col-span-1 text-gray-600">Ngày tạo:</div>
                  <div className="col-span-2 font-medium">{user.createdAt}</div>

                  <div className="col-span-1 text-gray-600">
                    Đăng nhập gần nhất:
                  </div>
                  <div className="col-span-2 font-medium">
                    {user.lastLogin || "Chưa có thông tin"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Lịch sử đơn hàng
          </h2>
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            {orderHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mã đơn hàng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày đặt
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tổng tiền
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
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderHistory.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-doca">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "Đã giao"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Đang giao"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Đã hủy"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              // Có thể thêm logic mở modal chi tiết đơn hàng ở đây
                              window.alert(
                                `Chi tiết đơn hàng ${
                                  order.id
                                }:\n${order.products
                                  .map(
                                    (p) =>
                                      `${p.name} x${
                                        p.quantity
                                      } - ${formatCurrency(p.price)}`
                                  )
                                  .join("\n")}`
                              );
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                <p>Người dùng chưa có đơn hàng nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
