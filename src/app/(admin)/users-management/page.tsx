"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";

// Định nghĩa kiểu dữ liệu cho người dùng
type User = {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: "ADMIN" | "USER" | "STAFF";
  status: "Hoạt động" | "Bị khóa";
  createdAt: string;
};

type RoleFilterType = "ALL" | "ADMIN" | "USER" | "STAFF";
type StatusFilterType = "ALL" | "Hoạt động" | "Bị khóa";

export default function AdminUsersPage() {
  // Mock dữ liệu người dùng để hiển thị - sẽ được thay thế bằng API trong thực tế
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "johndoe",
      fullName: "John Doe",
      phoneNumber: "0901234567",
      role: "USER",
      status: "Hoạt động",
      createdAt: "2024-03-01",
    },
    {
      id: "2",
      username: "adminuser",
      fullName: "Admin User",
      phoneNumber: "0912345678",
      role: "ADMIN",
      status: "Hoạt động",
      createdAt: "2024-03-02",
    },
    {
      id: "3",
      username: "staffmember",
      fullName: "Staff Member",
      phoneNumber: "0923456789",
      role: "STAFF",
      status: "Hoạt động",
      createdAt: "2024-03-03",
    },
    {
      id: "4",
      username: "blockeduser",
      fullName: "Blocked User",
      phoneNumber: "0934567890",
      role: "USER",
      status: "Bị khóa",
      createdAt: "2024-03-04",
    },
    {
      id: "5",
      username: "newstaff",
      fullName: "New Staff",
      phoneNumber: "0945678901",
      role: "STAFF",
      status: "Hoạt động",
      createdAt: "2024-03-05",
    },
    {
      id: "6",
      username: "customer1",
      fullName: "Customer 1",
      phoneNumber: "0956789012",
      role: "USER",
      status: "Hoạt động",
      createdAt: "2024-03-06",
    },
    {
      id: "7",
      username: "customer2",
      fullName: "Customer 2",
      phoneNumber: "0967890123",
      role: "USER",
      status: "Hoạt động",
      createdAt: "2024-03-07",
    },
  ]);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // State cho dialog xóa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // State cho dialog khóa/mở khóa tài khoản
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");

  // Mở dialog xóa
  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  // Xử lý xóa người dùng
  const confirmDeleteUser = () => {
    if (userToDelete) {
      // Trong thực tế, gọi API xóa người dùng
      setUsers(users.filter((user) => user.id !== userToDelete));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Hủy xóa người dùng
  const cancelDeleteUser = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Mở dialog chuyển trạng thái người dùng
  const openToggleStatusDialog = (userId: string) => {
    setUserToToggleStatus(userId);
    setIsToggleStatusDialogOpen(true);
  };

  // Xử lý chuyển trạng thái người dùng
  const confirmToggleStatus = () => {
    if (userToToggleStatus) {
      // Trong thực tế, gọi API cập nhật trạng thái người dùng
      setUsers(
        users.map((user) => {
          if (user.id === userToToggleStatus) {
            return {
              ...user,
              status: user.status === "Hoạt động" ? "Bị khóa" : "Hoạt động",
            };
          }
          return user;
        })
      );
      setIsToggleStatusDialogOpen(false);
      setUserToToggleStatus(null);
    }
  };

  // Hủy chuyển trạng thái người dùng
  const cancelToggleStatus = () => {
    setIsToggleStatusDialogOpen(false);
    setUserToToggleStatus(null);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Lọc và tìm kiếm người dùng
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Lọc theo vai trò
      const roleMatch = roleFilter === "ALL" || user.role === roleFilter;

      // Lọc theo trạng thái
      const statusMatch =
        statusFilter === "ALL" || user.status === statusFilter;

      // Tìm kiếm theo tên người dùng hoặc tên đầy đủ hoặc số điện thoại
      const searchMatch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm);

      return roleMatch && statusMatch && searchMatch;
    });
  }, [users, roleFilter, statusFilter, searchTerm]);

  // Tính toán người dùng hiển thị trên trang hiện tại
  const currentUsers = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(firstPageIndex, lastPageIndex);
  }, [filteredUsers, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <Link href="/users-management/add">
          <Button
            variant="primary"
            className="bg-pink-doca hover:bg-pink-doca w-56 h-11 text-base"
          >
            Thêm người dùng mới
          </Button>
        </Link>
      </div>

      {/* Phần tìm kiếm và lọc */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilterType)}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Nhân viên</option>
              <option value="USER">Khách hàng</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilterType)
              }
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bị khóa">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tên người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Họ tên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số điện thoại
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vai trò
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
                  Ngày tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "Hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/users-management/view/${user.id}`}>
                          <button
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2 py-1 transition-colors"
                            title="Xem chi tiết"
                          >
                            Xem
                          </button>
                        </Link>
                        <Link href={`/users-management/edit/${user.id}`}>
                          <button
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md px-2 py-1 transition-colors"
                            title="Chỉnh sửa"
                          >
                            Sửa
                          </button>
                        </Link>
                        <button
                          onClick={() => openToggleStatusDialog(user.id)}
                          className={`${
                            user.status === "Hoạt động"
                              ? "text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100"
                              : "text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100"
                          } rounded-md px-2 py-1 transition-colors`}
                          title={
                            user.status === "Hoạt động"
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                          }
                        >
                          {user.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                        </button>
                        <button
                          onClick={() => openDeleteDialog(user.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md px-2 py-1 transition-colors"
                          title="Xóa"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}

      {/* Dialog xác nhận xóa */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmButtonText="Xóa"
        cancelButtonText="Hủy"
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
        type="danger"
      />

      {/* Dialog xác nhận khóa/mở khóa tài khoản */}
      <ConfirmDialog
        isOpen={isToggleStatusDialogOpen}
        title={`${
          userToToggleStatus &&
          users.find((user) => user.id === userToToggleStatus)?.status ===
            "Hoạt động"
            ? "Khóa tài khoản"
            : "Mở khóa tài khoản"
        }`}
        message={`Bạn có chắc chắn muốn ${
          userToToggleStatus &&
          users.find((user) => user.id === userToToggleStatus)?.status ===
            "Hoạt động"
            ? "khóa"
            : "mở khóa"
        } tài khoản này?`}
        confirmButtonText={
          userToToggleStatus &&
          users.find((user) => user.id === userToToggleStatus)?.status ===
            "Hoạt động"
            ? "Khóa"
            : "Mở khóa"
        }
        cancelButtonText="Hủy"
        onConfirm={confirmToggleStatus}
        onCancel={cancelToggleStatus}
        type={
          userToToggleStatus &&
          users.find((user) => user.id === userToToggleStatus)?.status ===
            "Hoạt động"
            ? "warning"
            : "info"
        }
      />
    </div>
  );
}
