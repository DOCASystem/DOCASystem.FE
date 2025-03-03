"use client";

import * as yup from "yup";
import AdminForm from "@/components/common/form/admin-form-new";
import Input from "@/components/common/input/input";

// Định nghĩa schema validation bằng Yup
const blogSchema = yup.object({
  title: yup.string().required("Tiêu đề không được để trống"),
  category: yup.string().required("Phân loại không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
  status: yup.string().required("Trạng thái không được để trống"),
  images: yup.array().of(yup.string()).min(1, "Cần có ít nhất 1 ảnh"),
});

// Định nghĩa kiểu dữ liệu
type BlogFormData = Record<string, unknown> & {
  title: string;
  category: string;
  description: string;
  status: string;
  images: string[];
};

export default function BlogFormExample() {
  // Giá trị mặc định
  const defaultValues: BlogFormData = {
    title: "",
    category: "Blog của chó",
    description: "",
    status: "Khẩn cấp",
    images: [],
  };

  // Xử lý khi submit form
  const onSubmit = (data: BlogFormData) => {
    console.log("Dữ liệu blog:", data);
    // Xử lý thêm (gọi API, lưu dữ liệu, v.v)
  };

  // Component tải ảnh (giả lập)
  const ImageUpload = () => (
    <div className="mt-4">
      <p className="text-base font-semibold mb-2">Ảnh</p>
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <p>Kéo và thả ảnh hoặc nhấp để chọn ảnh</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
          <span>Ảnh con chó</span>
        </div>
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
          <span>Ảnh nổ đề thương</span>
        </div>
      </div>
    </div>
  );

  return (
    <AdminForm<BlogFormData>
      title="Thêm Blog Mới"
      schema={blogSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      backLink="/admin/blogs"
      submitButtonText="Lưu Blog"
      maxHeight="max-h-[calc(100vh-200px)]"
      formClassName="h-[calc(100vh-150px)]"
      contentClassName="pb-4"
    >
      {/* Children là các field input */}
      <Input name="title" label="Tiêu đề" placeholder="Nhập tiêu đề blog" />

      <Input
        name="category"
        label="Phân loại"
        placeholder="Chọn phân loại blog"
      />

      <div className="flex flex-col gap-2">
        <p className="text-base font-semibold">Trạng thái</p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Khẩn cấp
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Cần sản phẩm
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Cần quyên góp
          </button>
        </div>
      </div>

      <Input
        name="description"
        label="Mô tả"
        placeholder="Nhập mô tả chi tiết"
        isTextArea={true}
      />

      <ImageUpload />
    </AdminForm>
  );
}
