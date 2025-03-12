"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { CategoryService } from "@/service/product-service";
import { toast } from "react-toastify";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";

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

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });

  // Lấy danh sách danh mục
  const fetchCategories = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await CategoryService.getCategories({
        page,
        size: pagination.pageSize,
      });

      if (response && response.data) {
        const data = response.data as CategoryResponseIPaginate;
        setCategories(data.items);
        setPagination({
          currentPage: data.currentPage || 0,
          totalPages: data.totalPages || 0,
          totalItems: data.totalItems || 0,
          pageSize: pagination.pageSize,
        });
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
  }, []);

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

  // Cập nhật mô tả danh mục
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewCategory({ ...newCategory, description: e.target.value });
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

      {/* Dialog thêm danh mục - Đã cập nhật để hiển thị đẹp hơn */}
      <ConfirmDialog
        isOpen={showAddDialog}
        title="Thêm danh mục mới"
        confirmText="Thêm"
        cancelText="Hủy"
        onConfirm={handleAddCategory}
        onCancel={() => setShowAddDialog(false)}
        type="info"
      >
        <div className="space-y-4 px-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700"
            >
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              id="categoryName"
              type="text"
              placeholder="Nhập tên danh mục"
              value={newCategory.name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="categoryDescription"
              className="text-sm font-medium text-gray-700"
            >
              Mô tả
            </label>
            <textarea
              id="categoryDescription"
              placeholder="Nhập mô tả danh mục"
              value={newCategory.description}
              onChange={handleDescriptionChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mô tả ngắn gọn về danh mục này
            </p>
          </div>
        </div>
      </ConfirmDialog>

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
