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

export default function ViewUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
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
            Lịch sử hoạt động
          </h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-500 italic">
              Chức năng đang được phát triển...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
