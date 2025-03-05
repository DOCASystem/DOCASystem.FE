"use client";

import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { blogSchema } from "@/utils/validation";
import { useRef } from "react";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho form
type AddBlogFormData = {
  title: string;
  categoryIds: string[];
  status: string;
  description: string;
  mainImage: File | null;
};

export default function AddBlogForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Giá trị mặc định
  const defaultValues: AddBlogFormData = {
    title: "",
    categoryIds: [],
    status: "",
    description: "",
    mainImage: null,
  };

  // Xử lý khi submit form
  const onSubmit = (data: AddBlogFormData) => {
    console.log("Dữ liệu blog:", data);
    // Xử lý thêm (gọi API, lưu dữ liệu, v.v)

    // Giả lập thành công và điều hướng về trang quản lý blog
    setTimeout(() => {
      router.push("/blog-management");
    }, 1000);
  };

  return (
    <div>
      <AdminForm<AddBlogFormData>
        title="Thêm bài blog mới"
        schema={blogSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        backLink="/blog-management"
        submitButtonText="Lưu bài blog"
        maxHeight="max-h-[calc(100vh-200px)]"
        formClassName="h-[calc(100vh-150px)]"
        contentClassName="pb-4 custom-scrollbar"
      >
        <Input
          name="title"
          label="Tiêu đề bài blog"
          placeholder="Nhập tiêu đề bài blog"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-base font-semibold mb-2">Phân loại</p>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              name="categoryIds"
            >
              <option value="">Chọn phân loại</option>
              <option value="news">Tin tức</option>
              <option value="tips">Mẹo chăm sóc thú cưng</option>
              <option value="stories">Câu chuyện thú cưng</option>
              <option value="adoption">Nhận nuôi</option>
            </select>
          </div>

          <div className="flex flex-col">
            <p className="text-base font-semibold mb-2">Trạng thái</p>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              name="status"
            >
              <option value="">Chọn trạng thái</option>
              <option value="URGENT">Khẩn cấp</option>
              <option value="NEED_PRODUCT">Cần hỗ trợ</option>
              <option value="PUBLISHED">Xuất bản</option>
              <option value="DRAFT">Nháp</option>
            </select>
          </div>
        </div>

        <Input
          name="description"
          label="Mô tả"
          placeholder="Nhập mô tả bài blog"
          isTextArea={true}
        />

        <div className="mt-4">
          <p className="text-base font-semibold mb-2">Hình ảnh</p>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
            <p>Kéo và thả ảnh hoặc nhấp để chọn ảnh</p>
            <input
              type="file"
              name="mainImage"
              className="hidden"
              id="blog-image"
              ref={fileInputRef}
            />
            <label
              htmlFor="blog-image"
              className="mt-2 inline-block px-4 py-2 bg-pink-doca text-white rounded-md cursor-pointer"
            >
              Chọn ảnh
            </label>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
