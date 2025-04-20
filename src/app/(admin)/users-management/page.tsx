"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";
import useMembers from "@/hooks/use-members";

// Định nghĩa kiểu dữ liệu cho người dùng trên UI
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
  // Sử dụng hook useMembers để lấy dữ liệu từ API
  const { members, loading, error, pagination, changePage } = useMembers();

  // Map dữ liệu member từ API sang dạng dữ liệu User cho UI
  const users: User[] = useMemo(() => {
    if (loading || error || !members.length) return [];

    return members.map((member) => ({
      id: member.id,
      username: member.username || "",
      fullName: member.fullName || "",
      phoneNumber: member.phoneNumber || "",
      role:
        member.roleText === "Admin"
          ? "ADMIN"
          : member.roleText === "Nhân viên"
          ? "STAFF"
          : "USER",
      status: member.statusText as "Hoạt động" | "Bị khóa",
      createdAt: member.formattedDate,
    }));
  }, [members, loading, error]);

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

  // Xử lý xóa người dùng - ở đây chỉ log ra thông tin, cần API endpoint để xóa
  const confirmDeleteUser = () => {
    if (userToDelete) {
      console.log(`Xóa người dùng với ID: ${userToDelete}`);
      // Ở đây cần gọi API để xóa người dùng
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Hủy xóa người dùng
  const cancelDeleteUser = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Xử lý chuyển trạng thái người dùng - ở đây chỉ log ra thông tin, cần API endpoint để cập nhật
  const confirmToggleStatus = () => {
    if (userToToggleStatus) {
      const user = users.find((u) => u.id === userToToggleStatus);
      const newStatus = user?.status === "Hoạt động" ? "Bị khóa" : "Hoạt động";
      console.log(
        `Chuyển trạng thái người dùng ${userToToggleStatus} sang ${newStatus}`
      );
      // Ở đây cần gọi API để cập nhật trạng thái

      setIsToggleStatusDialogOpen(false);
      setUserToToggleStatus(null);
    }
  };

  // Hủy chuyển trạng thái người dùng
  const cancelToggleStatus = () => {
    setIsToggleStatusDialogOpen(false);
    setUserToToggleStatus(null);
  };

  // Xử lý thay đổi trang sử dụng hook
  const handlePageChange = (page: number) => {
    changePage(page);
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
  const ITEMS_PER_PAGE = pagination?.size || 5;
  const currentPage = pagination?.page || 1;

  const currentUsers = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(firstPageIndex, lastPageIndex);
  }, [filteredUsers, currentPage, ITEMS_PER_PAGE]);

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

      {/* Hiển thị trạng thái loading/error */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-doca"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Bảng danh sách người dùng */}
      {!loading && !error && (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/users-management/view/${user.id}`)
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id.substring(0, 8)}...
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
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
      )}

      {/* Phân trang */}
      {!loading && !error && filteredUsers.length > 0 && (
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
        confirmText="Xóa"
        cancelText="Hủy"
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
        confirmText={
          userToToggleStatus &&
          users.find((user) => user.id === userToToggleStatus)?.status ===
            "Hoạt động"
            ? "Khóa"
            : "Mở khóa"
        }
        cancelText="Hủy"
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
