"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogService, Blog } from "@/service/blog-service";
import { toast } from "react-toastify";

interface BlogDetailParams {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailParams) {
  const blogId = params.id;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!blogId) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`[BlogDetail] Đang tải chi tiết blog ID: ${blogId}`);
        const blogData = await BlogService.getBlogById(blogId);

        if (blogData) {
          console.log(`[BlogDetail] Đã tải thành công blog: ${blogData.name}`);
          setBlog(blogData);
        } else {
          setError("Không tìm thấy thông tin bài viết");
          toast.error("Không thể tải thông tin bài viết");
        }
      } catch (error) {
        console.error(`[BlogDetail] Lỗi khi tải chi tiết blog:`, error);
        setError("Đã xảy ra lỗi khi tải thông tin bài viết");
        toast.error("Không thể tải thông tin bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

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
  const getStatusColor = (status: number): string => {
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

  // Lấy URL hình ảnh blog
  const getBlogImageUrl = (blog: Blog): string => {
    return BlogService.getBlogImageUrl(blog);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca"></div>
      </div>
    );
  }

  if (error || !blog) {
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
            Chi tiết bài viết
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">
            {error || "Không tìm thấy bài viết"}
          </p>
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
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết bài viết</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{blog.name}</h2>
          <div className="flex space-x-2">
            <Link
              href={`/blog-management/edit-blog/${blog.id}`}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
            >
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={getBlogImageUrl(blog)}
            alt={blog.name || "Bài viết"}
            width={1200}
            height={675}
            sizes="100%"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tác giả</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {blog.authorName || "Không có thông tin"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Phân loại</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {blog.blogCategories?.map((cat) => cat.name).join(", ") ||
                "Chưa phân loại"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${getStatusColor(
                blog.status
              )}`}
            >
              {getStatusText(blog.status)}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {formatDate(blog.createdAt)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Cập nhật lần cuối
            </h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {formatDate(blog.modifiedAt)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Nội dung</h3>
          <div className="prose prose-pink max-w-none text-gray-700">
            <p className="whitespace-pre-line">{blog.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
