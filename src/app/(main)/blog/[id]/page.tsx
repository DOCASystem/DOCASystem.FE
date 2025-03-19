"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GetBlogDetailResponse } from "@/api/generated";
import { BlogService } from "@/service/blog-service";
import { useRouter } from "next/navigation";
import { getBlogById } from "@/mock/blogs";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<GetBlogDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        // Tránh truy cập localStorage trong quá trình SSR
        let token = "";
        if (typeof window !== "undefined") {
          token = localStorage.getItem("token") || "";
        }

        // Nếu không có token hoặc chạy trong SSR, thử lấy dữ liệu mẫu
        if (!token) {
          console.warn("Không có token xác thực, sử dụng dữ liệu mẫu");
          try {
            // Sử dụng dữ liệu mẫu từ mock
            const mockResponse = getBlogById(params.id);
            setBlog(mockResponse.data);
          } catch (mockError) {
            console.error("Không thể lấy dữ liệu mẫu:", mockError);
            setError("Không thể tải thông tin bài viết");
          }
        } else {
          // Có token, thử gọi API
          try {
            const response = await BlogService.getBlogById(params.id);
            if (response && response.data) {
              setBlog(response.data);
            } else {
              setError("Không thể tải thông tin bài viết");
            }
          } catch (apiError: unknown) {
            console.error("Lỗi API:", apiError);

            // Xử lý các mã lỗi HTTP cụ thể
            const errorResponse = (
              apiError as { response?: { status: number } }
            ).response;
            if (errorResponse) {
              const statusCode = errorResponse.status;

              if (statusCode === 400) {
                console.warn(
                  "Bad Request - Có thể ID không hợp lệ hoặc không tồn tại"
                );
                setError("ID bài viết không hợp lệ hoặc không tồn tại");
              } else if (statusCode === 401 || statusCode === 403) {
                console.warn("Lỗi xác thực hoặc phân quyền");
                setError("Bạn không có quyền xem bài viết này");

                // Chuyển hướng đến trang đăng nhập sau 2 giây
                setTimeout(() => {
                  router.push("/login");
                }, 2000);
              } else {
                setError(`Lỗi máy chủ: ${statusCode}`);
              }
            } else {
              // Lỗi không xác định
              setError("Không thể kết nối đến máy chủ");
            }

            // Dự phòng: thử dùng dữ liệu mẫu nếu không lấy được từ API
            try {
              const mockResponse = getBlogById(params.id);
              setBlog(mockResponse.data);
              // Nếu lấy được dữ liệu mẫu, xóa thông báo lỗi
              setError(null);
            } catch {
              // Giữ nguyên thông báo lỗi từ API
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết blog:", err);
        setError("Không thể tải thông tin bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [params.id, router]);

  // Format date to local date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-pulse">Đang tải thông tin bài viết...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="text-red-500">{error || "Không tìm thấy bài viết"}</div>
        <Link
          href="/blog"
          className="mt-4 inline-block bg-pink-doca text-white px-4 py-2 rounded"
        >
          Quay lại trang blog
        </Link>
      </div>
    );
  }

  // Lấy danh mục của blog
  const categoryNames =
    blog.blogCategories
      ?.map((cat) => cat.name)
      .filter(Boolean)
      .join(", ") || "";

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/blog"
          className="text-gray-600 hover:text-pink-doca flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Quay lại trang blog
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.name}</h1>

          <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(blog.createdAt)}</span>
            </div>

            {categoryNames && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>{categoryNames}</span>
              </div>
            )}
          </div>
        </header>

        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          {/* Sử dụng một div thông thường thay vì Image nếu gặp lỗi */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Ảnh blog</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line">{blog.description}</div>
        </div>
      </article>
    </div>
  );
}
