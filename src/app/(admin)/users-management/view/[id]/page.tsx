"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/button/button";
import memberService, { Member } from "@/service/member-service";
import AuthService from "@/service/auth.service";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";

export default function ViewUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Lấy token từ localStorage
        const token = AuthService.getToken();

        if (!token) {
          setError("Bạn cần đăng nhập để xem thông tin này");
          setIsLoading(false);
          return;
        }

        console.log(`Đang tải thông tin người dùng với ID: ${userId}`);
        const data = await memberService.getMemberById(userId, token);
        console.log("Dữ liệu người dùng:", data);
        setMember(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setError("Có lỗi xảy ra khi tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Xử lý xóa người dùng
  const handleDeleteUser = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(() => {
    console.log(`Xóa người dùng với ID: ${userId}`);
    // Ở đây cần gọi API để xóa người dùng
    setIsDeleteDialogOpen(false);
    // Sau khi xóa, chuyển về trang danh sách
    router.push("/users-management");
  }, [userId, router]);

  const cancelDeleteUser = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  // Xử lý chuyển đổi trạng thái người dùng
  const handleToggleStatus = useCallback(() => {
    setIsToggleStatusDialogOpen(true);
  }, []);

  const confirmToggleStatus = useCallback(() => {
    console.log(`Chuyển trạng thái người dùng ${userId}`);
    // Ở đây cần gọi API để cập nhật trạng thái
    setIsToggleStatusDialogOpen(false);
  }, [userId]);

  const cancelToggleStatus = useCallback(() => {
    setIsToggleStatusDialogOpen(false);
  }, []);

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
  if (error || !member) {
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

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (err) {
      console.error("Lỗi định dạng ngày", err);
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Chi tiết người dùng
        </h1>
        <div className="flex space-x-3">
          <Link href={`/users-management/edit/${member.id}`}>
            <Button className="bg-pink-doca hover:bg-pink-doca px-4 py-2 text-sm">
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            className="border border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-4 py-2 text-sm"
            onClick={handleToggleStatus}
          >
            Khóa tài khoản
          </Button>
          <Button
            className="border border-red-500 text-red-700 hover:bg-red-50 px-4 py-2 text-sm"
            onClick={handleDeleteUser}
          >
            Xóa
          </Button>
          <Link href="/users-management">
            <Button className="border-pink-doca hover:bg-pink-doca px-4 py-2 text-sm">
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
                  <div className="col-span-2 font-medium">{member.id}</div>

                  <div className="col-span-1 text-gray-600">Tên đăng nhập:</div>
                  <div className="col-span-2 font-medium">
                    {member.username || "Chưa cung cấp"}
                  </div>

                  <div className="col-span-1 text-gray-600">Họ tên:</div>
                  <div className="col-span-2 font-medium">
                    {member.fullName || "Chưa cung cấp"}
                  </div>

                  <div className="col-span-1 text-gray-600">Email:</div>
                  <div className="col-span-2 font-medium">
                    {member.username || "Chưa cung cấp"}
                  </div>

                  <div className="col-span-1 text-gray-600">Số điện thoại:</div>
                  <div className="col-span-2 font-medium">
                    {member.phoneNumber || "Chưa cung cấp"}
                  </div>

                  <div className="col-span-1 text-gray-600">Địa chỉ:</div>
                  <div className="col-span-2 font-medium">
                    {member.address
                      ? `${member.address}${
                          member.commune ? `, ${member.commune}` : ""
                        }${member.district ? `, ${member.district}` : ""}${
                          member.province ? `, ${member.province}` : ""
                        }`
                      : "Chưa cung cấp"}
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
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                    >
                      Khách hàng
                    </span>
                  </div>

                  <div className="col-span-1 text-gray-600">Trạng thái:</div>
                  <div className="col-span-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                    >
                      Hoạt động
                    </span>
                  </div>

                  <div className="col-span-1 text-gray-600">ID người dùng:</div>
                  <div className="col-span-2 font-medium">
                    {member.userId || "Không có"}
                  </div>

                  <div className="col-span-1 text-gray-600">Số đơn hàng:</div>
                  <div className="col-span-2 font-medium">
                    {member.orders?.length || 0} đơn hàng
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
            {member.orders && member.orders.length > 0 ? (
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
                        Địa chỉ
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
                    {member.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-doca">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipping"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status === "Pending"
                              ? "Chờ xử lý"
                              : order.status === "Processing"
                              ? "Đang xử lý"
                              : order.status === "Shipping"
                              ? "Đang giao"
                              : order.status === "Completed"
                              ? "Hoàn thành"
                              : order.status === "Cancelled"
                              ? "Đã hủy"
                              : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {order.address || "Không có"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link href={`/orders-management/view/${order.id}`}>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Xem chi tiết
                            </button>
                          </Link>
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
        title="Khóa tài khoản"
        message="Bạn có chắc chắn muốn khóa tài khoản này?"
        confirmText="Khóa"
        cancelText="Hủy"
        onConfirm={confirmToggleStatus}
        onCancel={cancelToggleStatus}
        type="warning"
      />
    </div>
  );
}
