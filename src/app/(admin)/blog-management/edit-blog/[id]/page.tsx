"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogService } from "@/service/blog-service";
import { toast } from "react-toastify";

interface BlogEditParams {
  params: {
    id: string;
  };
}

export default function EditBlogPage({ params }: BlogEditParams) {
  const router = useRouter();
  const blogId = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0,
    categoryIds: [] as string[],
    isHidden: false,
  });

  // Available categories
  const [categories] = useState([
    { id: "1", name: "Tin tức" },
    { id: "2", name: "Thú cưng" },
    { id: "3", name: "Thức ăn" },
    { id: "4", name: "Chăm sóc" },
  ]);

  // Blog image
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch blog details
  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!blogId) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`[BlogEdit] Đang tải chi tiết blog ID: ${blogId}`);

        // Gọi API lấy chi tiết blog thay vì dùng dữ liệu giả
        const blogData = await BlogService.getBlogById(blogId);

        if (blogData) {
          console.log(`[BlogEdit] Đã tải thành công blog: ${blogData.name}`);

          // Cập nhật form với dữ liệu blog
          setFormData({
            title: blogData.name || "",
            description: blogData.description || "",
            status: blogData.status || 0,
            categoryIds:
              blogData.blogCategories?.map((cat: { id: string }) => cat.id) ||
              [],
            isHidden: blogData.isHidden || false,
          });

          // Cập nhật preview hình ảnh
          setImagePreview(BlogService.getBlogImageUrl(blogData));

          setLoading(false);
        } else {
          setError("Không tìm thấy thông tin bài viết");
          toast.error("Không thể tải thông tin bài viết");
          setLoading(false);
        }
      } catch (error) {
        console.error(`[BlogEdit] Lỗi khi tải chi tiết blog:`, error);
        setError("Đã xảy ra lỗi khi tải thông tin bài viết");
        toast.error("Không thể tải thông tin bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        categoryIds: [...prev.categoryIds, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryIds: prev.categoryIds.filter((id) => id !== value),
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      console.log("[BlogEdit] Đang cập nhật blog:", {
        id: blogId,
        ...formData,
        imageFile: imageFile ? "Có file ảnh" : "Không có file ảnh",
      });

      // Giả lập cập nhật blog (thành công sau 1 giây)
      setTimeout(() => {
        toast.success("Cập nhật bài viết thành công");
        // Chuyển hướng về trang chi tiết blog
        router.push(`/blog-management/view/${blogId}`);
      }, 1000);
    } catch (error) {
      console.error("[BlogEdit] Lỗi khi cập nhật blog:", error);
      toast.error("Không thể cập nhật bài viết. Vui lòng thử lại sau.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mx-auto">
        <div className="mb-6 flex items-center">
          <Link
            href="/blog-management"
            className="mr-4 text-pink-500 hover:text-pink-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa bài viết
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/blog-management">
            <button className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-700 transition-all">
              Quay lại danh sách
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6 flex items-center">
        <Link
          href="/blog-management"
          className="mr-4 text-pink-500 hover:text-pink-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Tiêu đề */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Hình ảnh */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh
            </label>
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="w-full md:w-1/3">
                <div className="aspect-video border border-gray-300 rounded-md overflow-hidden bg-gray-100">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Blog preview"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Chưa có hình ảnh
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 bg-white border border-gray-300 rounded-md p-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chọn hình ảnh định dạng JPG, PNG hoặc WebP, kích thước tối đa
                  5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Danh mục */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <label key={category.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={handleCategoryChange}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Trạng thái */}
          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value={0}>Đã đăng</option>
              <option value={1}>Đã đăng</option>
              <option value={2}>Chờ đăng</option>
            </select>
          </div>

          {/* Trạng thái hiển thị */}
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isHidden"
                checked={formData.isHidden}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">Ẩn bài viết</span>
            </label>
          </div>

          {/* Nút lưu và hủy */}
          <div className="flex justify-end space-x-4">
            <Link href={`/blog-management/view/${blogId}`}>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-700 ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </span>
              ) : (
                "Lưu bài viết"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
