"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";

// Định nghĩa kiểu dữ liệu cho người dùng
type User = {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  role: "ADMIN" | "USER" | "STAFF";
  status: "Hoạt động" | "Bị khóa";
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState<User>({
    id: "",
    username: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    role: "USER",
    status: "Hoạt động",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lấy thông tin người dùng khi component được mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        // Trong thực tế, gọi API để lấy thông tin người dùng
        // Ở đây chúng ta giả lập dữ liệu
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock dữ liệu
        if (userId === "1") {
          setFormData({
            id: "1",
            username: "johndoe",
            fullName: "John Doe",
            phoneNumber: "0901234567",
            email: "johndoe@example.com",
            address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
            role: "USER",
            status: "Hoạt động",
          });
        } else if (userId === "2") {
          setFormData({
            id: "2",
            username: "adminuser",
            fullName: "Admin User",
            phoneNumber: "0912345678",
            email: "admin@example.com",
            role: "ADMIN",
            status: "Hoạt động",
          });
        } else {
          // Giả lập không tìm thấy người dùng
          alert("Không tìm thấy thông tin người dùng");
          router.push("/users-management");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        alert("Có lỗi xảy ra khi tải thông tin người dùng");
        router.push("/users-management");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, router]);

  // Xác thực form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý khi thay đổi giá trị input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Đánh dấu đã có thay đổi
    setHasChanges(true);

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Trong thực tế, gọi API cập nhật thông tin người dùng
      console.log("Cập nhật người dùng với dữ liệu:", formData);

      // Giả lập chờ API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Đánh dấu không còn thay đổi
      setHasChanges(false);

      // Chuyển hướng về trang chi tiết sau khi cập nhật thành công
      router.push(`/users-management/view/${userId}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin người dùng");
    } finally {
      setIsSaving(false);
    }
  };

  // Xử lý khi quay lại
  const handleBack = () => {
    if (hasChanges) {
      setShowConfirmLeave(true);
    } else {
      router.push(`/users-management/view/${userId}`);
    }
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa người dùng
          </h1>
          <Link href={`/users-management/view/${userId}`}>
            <Button className="bg-pink-doca hover:bg-pink-doca h-11 w-48">
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Chỉnh sửa người dùng
        </h1>
        <Button
          className="bg-pink-doca hover:bg-pink-doca h-11 w-48"
          onClick={handleBack}
          disabled={isSaving}
        >
          Quay lại
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID người dùng - chỉ đọc */}
            <div className="mb-4">
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
                readOnly
              />
            </div>

            {/* Tên đăng nhập */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Họ tên */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Vai trò */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSaving}
              >
                <option value="USER">Khách hàng</option>
                <option value="STAFF">Nhân viên</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSaving}
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bị khóa">Bị khóa</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Địa chỉ
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isSaving}
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 hover:bg-gray-100 py-2 px-4"
              onClick={handleBack}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-pink-doca hover:bg-pink-doca-dark py-2 px-4"
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>

      {/* Dialog xác nhận thoát khi có thay đổi chưa lưu */}
      <ConfirmDialog
        isOpen={showConfirmLeave}
        title="Xác nhận thoát"
        message="Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?"
        confirmButtonText="Thoát"
        cancelButtonText="Ở lại"
        onConfirm={() => {
          setShowConfirmLeave(false);
          router.push(`/users-management/view/${userId}`);
        }}
        onCancel={() => setShowConfirmLeave(false)}
        type="warning"
      />
    </div>
  );
}
