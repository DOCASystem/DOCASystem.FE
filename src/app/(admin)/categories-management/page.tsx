"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { CategoryService } from "@/service/category-service";
import { toast } from "react-toastify";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";
import { createPortal } from "react-dom";

interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

interface CategoryResponseIPaginate {
  items: CategoryResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

// Tạo component Dialog mới theo yêu cầu
interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  newCategory: { name: string; description: string };
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
}

function AddCategoryDialog({
  isOpen,
  onClose,
  onBack,
  newCategory,
  onNameChange,
  onSubmit,
}: AddCategoryDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isOpen || !isMounted) return null;

  const handleSubmit = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Header với nút quay lại và nút đóng */}
        <div className="relative flex items-center justify-between border-b border-gray-100 p-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-pink-doca hover:text-pink-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          {!onBack && <div></div>}
          <button
            onClick={onClose}
            className="text-pink-doca hover:text-pink-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-8 text-center">
            <h3 className="text-xl font-medium text-pink-doca mb-4">
              Nhập tên danh mục mới:
            </h3>
            <input
              id="categoryName"
              type="text"
              placeholder="Nhập tên danh mục"
              value={newCategory.name}
              onChange={onNameChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-doca focus:outline-none focus:ring-1 focus:ring-pink-doca"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-5">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-8 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-8 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });

  // Lấy danh sách danh mục
  const fetchCategories = async (page = 1) => {
    // Tránh nhiều request cùng lúc
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await CategoryService.getCategories({
        page,
        size: pagination.pageSize,
      });

      if (response && response.data) {
        const data = response.data as CategoryResponseIPaginate;
        // Kiểm tra dữ liệu trước khi cập nhật state
        if (Array.isArray(data.items)) {
          setCategories(data.items);
          setPagination({
            currentPage: data.currentPage || 1,
            totalPages: data.totalPages || 1,
            totalItems: data.totalItems || 0,
            pageSize: pagination.pageSize,
          });
        } else {
          console.error("Dữ liệu danh mục không hợp lệ:", data);
          toast.error("Dữ liệu danh mục không hợp lệ");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      toast.error("Không thể lấy danh sách danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý thêm danh mục
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      await CategoryService.createCategory({
        name: newCategory.name,
        description: newCategory.description,
      });

      toast.success("Thêm danh mục thành công");
      setNewCategory({ name: "", description: "" });
      setShowAddDialog(false);
      fetchCategories(pagination.currentPage);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      toast.error("Không thể thêm danh mục");
    }
  };

  // Xử lý xóa danh mục
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      // Lưu ý: API hiện tại không hỗ trợ xóa danh mục
      // Đây là code mẫu, cần cập nhật khi API hỗ trợ
      await CategoryService.deleteCategory(categoryToDelete);
      toast.success("Xóa danh mục thành công");
      fetchCategories(pagination.currentPage);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Không thể xóa danh mục");
    } finally {
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  // Hiển thị dialog xác nhận xóa
  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteDialog(true);
  };

  // Hiển thị dialog thêm danh mục
  const openAddDialog = () => {
    setNewCategory({ name: "", description: "" });
    setShowAddDialog(true);
  };

  // Cập nhật tên danh mục
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, name: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-pink-doca">
          Quản lý danh mục
        </h1>
        <Button
          onClick={openAddDialog}
          className="bg-pink-doca text-white px-4 py-2 rounded-md"
        >
          Thêm danh mục
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">Đang tải...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mô tả
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày tạo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không có danh mục nào
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {category.description || "Không có mô tả"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => confirmDelete(category.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Dialog thêm danh mục kiểu mới */}
      <AddCategoryDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        newCategory={newCategory}
        onNameChange={handleNameChange}
        onSubmit={handleAddCategory}
      />

      {/* Dialog xác nhận xóa */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa danh mục này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteCategory}
        onCancel={() => setShowDeleteDialog(false)}
        type="danger"
      />
    </div>
  );
}
