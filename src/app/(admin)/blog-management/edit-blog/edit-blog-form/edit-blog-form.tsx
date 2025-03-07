"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { blogSchema } from "@/utils/validation";
import { BlogService } from "@/service/blog-service";
import { BlogEnum } from "@/api/generated";
import Image from "next/image";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";

// Định nghĩa kiểu dữ liệu cho phân loại blog
interface BlogCategory {
  id: string | number;
  name?: string;
}

// Định nghĩa kiểu dữ liệu cho form
type EditBlogFormData = {
  title: string;
  categoryIds: string[];
  status: string;
  description: string;
  mainImage: File | null;
};

// Định nghĩa kiểu dữ liệu cho blog
type BlogData = {
  id: string;
  title: string;
  categoryIds: string[];
  status: string;
  description: string;
  mainImage: string | null;
};

export default function EditBlogForm() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [formValues, setFormValues] = useState<EditBlogFormData>({
    title: "",
    categoryIds: [],
    status: "",
    description: "",
    mainImage: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Thêm state cho dialog xác nhận cập nhật blog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<EditBlogFormData | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // Trong môi trường thực tế, sử dụng service để lấy dữ liệu
        const response = await BlogService.getBlogById(id as string);

        // Xử lý dữ liệu từ API
        // Lưu ý: thuộc tính mainImage có thể không tồn tại trong API response
        // Sử dụng đường dẫn ảnh mặc định hoặc triển khai API riêng để lấy ảnh
        const mockData: BlogData = {
          id: id as string,
          title: response?.data?.name || "Blog demo",
          categoryIds: response?.data?.blogCategories?.map(
            (cat: BlogCategory) => String(cat.id)
          ) || ["news"],
          status: response?.data?.status || "PUBLISHED",
          description: response?.data?.description || "Mô tả blog demo",
          // Trong thực tế cần triển khai API để lấy ảnh từ server
          mainImage: "/images/placeholder-blog.jpg",
        };

        setBlogData(mockData);
        setFormValues({
          title: mockData.title,
          categoryIds: mockData.categoryIds,
          status: mockData.status,
          description: mockData.description,
          mainImage: null,
        });

        // Nếu có hình ảnh, hiển thị preview
        if (mockData.mainImage) {
          setPreviewImage(mockData.mainImage);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Không thể tải dữ liệu blog. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cập nhật file trong formValues
    setFormValues((prev) => ({
      ...prev,
      mainImage: file,
    }));

    // Hiển thị preview ảnh
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Hàm mở dialog xác nhận cập nhật
  const openUpdateDialog = (data: EditBlogFormData) => {
    setFormDataToSubmit(data);
    setIsUpdateDialogOpen(true);
  };

  // Hàm hủy cập nhật blog
  const cancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setFormDataToSubmit(null);
  };

  // Sửa lại hàm onSubmit để hiển thị dialog xác nhận trước
  const onSubmit = (data: EditBlogFormData) => {
    openUpdateDialog(data);
  };

  // Hàm thực hiện cập nhật blog sau khi xác nhận
  const confirmUpdate = async () => {
    if (!id || !formDataToSubmit) return;

    setIsSaving(true);
    try {
      // Chuyển đổi status thành BlogEnum
      const blogStatus = formDataToSubmit.status as unknown as BlogEnum;

      // Gọi API cập nhật blog
      await BlogService.updateBlog(id as string, {
        title: formDataToSubmit.title,
        description: formDataToSubmit.description,
        status: blogStatus,
        isHidden: false,
      });

      // Nếu có hình ảnh mới, tải lên hình ảnh
      // Lưu ý: API uploadBlogImage chưa được triển khai
      // if (formDataToSubmit.mainImage) {
      //   await BlogService.uploadBlogImage(id as string, formDataToSubmit.mainImage);
      // }

      toast.success("Cập nhật blog thành công!");
      setIsUpdateDialogOpen(false);

      // Chuyển hướng về trang quản lý blog sau khi lưu thành công
      setTimeout(() => {
        router.push("/blog-management");
      }, 1000);
    } catch (err) {
      console.error("Error updating blog:", err);
      toast.error("Cập nhật blog thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  // Chuyển hướng đến trang xem chi tiết blog
  const viewBlog = () => {
    router.push(`/blog-management/view?id=${id}`);
  };

  return (
    <div>
      {error ? (
        <div className="text-center py-10 text-red-500">
          {error}
          <div className="mt-4">
            <button
              onClick={() => router.push("/blog-management")}
              className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      ) : (
        <AdminForm<EditBlogFormData>
          title="Chỉnh sửa bài blog"
          schema={blogSchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          backLink="/blog-management"
          submitButtonText={isSaving ? "Đang lưu..." : "Cập nhật bài blog"}
          maxHeight="max-h-[calc(100vh-200px)]"
          formClassName="h-[calc(100vh-150px)]"
          contentClassName="pb-4 custom-scrollbar"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <div className="text-lg font-medium text-pink-doca">
                Đang tải dữ liệu blog...
              </div>
            </div>
          )}

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={viewBlog}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Xem bài viết
            </button>
          </div>

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
                defaultValue={blogData?.categoryIds[0] || ""}
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
                defaultValue={blogData?.status || ""}
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
              {previewImage ? (
                <div className="mb-4">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mx-auto object-cover rounded"
                  />
                </div>
              ) : (
                <p>Kéo và thả ảnh hoặc nhấp để chọn ảnh</p>
              )}

              <input
                type="file"
                accept="image/*"
                name="mainImage"
                className="hidden"
                id="blog-image-edit"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <label
                htmlFor="blog-image-edit"
                className="mt-2 inline-block px-4 py-2 bg-pink-doca text-white rounded-md cursor-pointer"
              >
                {previewImage ? "Đổi ảnh khác" : "Chọn ảnh"}
              </label>
            </div>
          </div>
        </AdminForm>
      )}

      {/* Dialog xác nhận cập nhật */}
      <ConfirmDialog
        isOpen={isUpdateDialogOpen}
        title="Xác nhận cập nhật bài viết"
        message="Bạn có chắc chắn muốn cập nhật bài viết này với những thay đổi đã nhập?"
        confirmButtonText="Cập nhật"
        cancelButtonText="Hủy"
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
        type="info"
      />
    </div>
  );
}
