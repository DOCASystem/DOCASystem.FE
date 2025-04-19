"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";
import { BlogService, Blog, BlogParams } from "@/service/blog-service";
import { toast } from "react-toastify";

// Chuyển đổi trạng thái blog từ số sang chuỗi
const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return "Đã đăng";
    case 1:
      return "Đã đăng";
    case 2:
      return "Chờ đăng";
    default:
      return "Không xác định";
  }
};

// Lấy màu cho trạng thái
const getStatusColor = (status: number | string) => {
  if (typeof status === "string") {
    switch (status) {
      case "Đã đăng":
        return "bg-green-100 text-green-600";
      case "Chờ đăng":
        return "bg-blue-100 text-blue-600";
      case "Chờ duyệt":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  } else {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-600";
      case 2:
        return "bg-blue-100 text-blue-600";
      case 0:
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }
};

// Format định dạng ngày tháng
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function AdminPostPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // State cho phân trang
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5, // Hiển thị tối đa 5 bài blog mỗi trang
  });

  // Hàm lấy danh sách blog
  const fetchBlogs = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        // Cập nhật trang hiện tại
        setPagination((prev) => ({ ...prev, currentPage: page }));

        const params: BlogParams = {
          page: page,
          size: pagination.pageSize,
          isAsc: true,
        };

        const response = await BlogService.getBlogs(params);

        if (response && response.success && response.data) {
          console.log(
            "[BlogManagement] Lấy dữ liệu blog thành công:",
            response.data
          );

          setBlogs(response.data.items || []);
          setPagination((prev) => ({
            ...prev,
            currentPage: page,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.totalItems || 0,
          }));
        } else {
          console.error(
            "[BlogManagement] Lỗi khi lấy danh sách blog:",
            response
          );
          setError("Không thể lấy danh sách bài viết");
          toast.error(
            "Không thể tải danh sách bài viết. Vui lòng thử lại sau."
          );
        }
      } catch (error) {
        console.error("[BlogManagement] Lỗi khi tải danh sách blog:", error);
        setError("Đã xảy ra lỗi khi tải danh sách bài viết");
        toast.error("Không thể tải danh sách bài viết. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.pageSize]
  );

  // Load dữ liệu khi component được mount
  useEffect(() => {
    fetchBlogs(1);
  }, [fetchBlogs]);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    fetchBlogs(page);
  };

  // Mở dialog xác nhận xóa blog
  const openDeleteDialog = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  // Xác nhận xóa blog
  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return;

    setIsLoading(true);
    try {
      // API xóa blog sẽ được thêm vào khi có
      // Tạm thời chỉ xóa khỏi state
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete));
      toast.success("Xóa bài viết thành công");
    } catch (error) {
      console.error("[BlogManagement] Lỗi khi xóa blog:", error);
      toast.error("Không thể xóa bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  // Hủy xóa blog
  const cancelDeleteBlog = () => {
    setIsDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  // Lấy URL hình ảnh blog
  const getBlogImageUrl = (blog: Blog): string => {
    return BlogService.getBlogImageUrl(blog);
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-doca">Bài Viết</h1>
        <Button className="w-44 h-11 text-lg">
          <Link
            href="/blog-management/add-blog"
            className="text-white rounded-lg transition-all"
          >
            Thêm bài viết
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca"></div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchBlogs(pagination.currentPage)}>
            Thử lại
          </Button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="mb-4">Không có bài viết nào.</p>
          <Link href="/blog-management/add-blog">
            <Button>Thêm bài viết mới</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-2">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center p-4 border-b last:border-b-0 rounded-md my-2 bg-white shadow-sm"
            >
              <div className="h-16 w-16 mr-4 overflow-hidden rounded-lg">
                <Image
                  src={getBlogImageUrl(blog)}
                  alt={blog.name || "Bài viết"}
                  width={100}
                  height={100}
                  sizes="100%"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{blog.name}</h3>
                <p className="text-sm text-gray-600">
                  Phân loại:{" "}
                  {blog.blogCategories?.map((cat) => cat.name).join(", ") ||
                    "Chưa phân loại"}
                </p>
              </div>

              <div className="flex-shrink-0 mx-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                    blog.status
                  )}`}
                >
                  {getStatusText(blog.status)}
                </span>
              </div>

              <div className="flex-shrink-0 mx-4 text-sm text-gray-600">
                Ngày đăng: {formatDate(blog.createdAt)}
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/blog-management/edit-blog/${blog.id}`}
                  className="px-4 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
                >
                  Edit
                </Link>

                <Link
                  href={`/blog-management/view/${blog.id}`}
                  className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
                >
                  Detail
                </Link>

                <button
                  onClick={() => openDeleteDialog(blog.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xác nhận xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        onConfirm={confirmDeleteBlog}
        onCancel={cancelDeleteBlog}
        type="danger"
      />
    </div>
  );
}
