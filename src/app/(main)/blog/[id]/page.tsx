"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GetBlogDetailResponse } from "@/api/generated";
import { BlogService } from "@/service/blog-service";
import { useRouter } from "next/navigation";
import { getBlogById } from "@/mock/blogs";
import { extractErrorMessage } from "@/utils/api-config";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<GetBlogDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Hàm trực tiếp gọi API để lấy blog theo ID
  const fetchBlogByIdDirectly = async (blogId: string) => {
    try {
      console.log(
        `[Blog Detail] Đang gọi API trực tiếp để lấy blog ID: ${blogId}`
      );

      // Tạo URL API trực tiếp để lấy blog
      const apiUrl = `https://production.doca.love/api/v1/blogs/${blogId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      // Kiểm tra xem API có trả về kết quả thành công không
      if (response.ok) {
        const data = await response.json();
        console.log("[Blog Detail] Lấy blog thành công từ API trực tiếp");
        return data;
      } else {
        console.error(
          `[Blog Detail] API trả về lỗi: ${response.status} ${response.statusText}`
        );
        return null;
      }
    } catch (error) {
      console.error("[Blog Detail] Lỗi khi gọi API trực tiếp:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        console.log(
          `[Blog Detail] Đang tải thông tin blog với ID: ${params.id}`
        );

        // Kiểm tra môi trường client-side
        const isClientSide = typeof window !== "undefined";
        if (!isClientSide) {
          console.log(
            "[Blog Detail] Đang chạy trong SSR, sẽ tải lại ở client-side"
          );
          setLoading(false);
          return;
        }

        // Tránh truy cập localStorage trong quá trình SSR
        let token = "";
        if (isClientSide) {
          try {
            token = localStorage.getItem("token") || "";
          } catch (storageError) {
            console.warn(
              "[Blog Detail] Không thể truy cập localStorage:",
              storageError
            );
          }
        }

        // Cách 1: Thử gọi API trực tiếp không qua service
        const directApiData = await fetchBlogByIdDirectly(params.id);
        if (directApiData) {
          console.log("[Blog Detail] Đã lấy blog từ API trực tiếp");
          setBlog(directApiData);
          setLoading(false);
          return;
        }

        // Cách 2: Nếu không có token hoặc chạy trong SSR, thử lấy dữ liệu mẫu
        if (!token) {
          console.warn(
            "[Blog Detail] Không có token xác thực, sử dụng dữ liệu mẫu"
          );
          try {
            // Sử dụng dữ liệu mẫu từ mock
            const mockResponse = getBlogById(params.id);
            if (mockResponse && mockResponse.data) {
              console.log("[Blog Detail] Đã lấy được dữ liệu mẫu");
              setBlog(mockResponse.data);
              setLoading(false);
              return;
            } else {
              throw new Error("Dữ liệu mẫu không hợp lệ");
            }
          } catch (mockError) {
            console.error(
              "[Blog Detail] Không thể lấy dữ liệu mẫu:",
              mockError
            );
            // Tiếp tục với các phương thức khác
          }
        }

        // Cách 3: Có token, thử gọi API qua BlogService
        try {
          console.log("[Blog Detail] Thử dùng BlogService để lấy blog...");
          const response = await BlogService.getBlogById(params.id);
          if (response && response.data) {
            console.log("[Blog Detail] Đã lấy được blog từ BlogService");
            setBlog(response.data);
            setLoading(false);
            return;
          } else {
            throw new Error("Không thể tải thông tin bài viết");
          }
        } catch (apiError: unknown) {
          console.error("[Blog Detail] Lỗi API:", apiError);

          // Xử lý các mã lỗi HTTP cụ thể
          const errorResponse = (apiError as { response?: { status: number } })
            .response;

          if (errorResponse) {
            const statusCode = errorResponse.status;

            if (statusCode === 400) {
              console.warn(
                "[Blog Detail] Bad Request - Có thể ID không hợp lệ hoặc không tồn tại"
              );
              setError("ID bài viết không hợp lệ hoặc không tồn tại");
            } else if (statusCode === 401 || statusCode === 403) {
              console.warn("[Blog Detail] Lỗi xác thực hoặc phân quyền");
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
            console.log("[Blog Detail] Thử dùng dữ liệu mẫu sau khi API lỗi");
            const mockResponse = getBlogById(params.id);
            if (mockResponse && mockResponse.data) {
              console.log(
                "[Blog Detail] Đã lấy được dữ liệu mẫu (sau khi API lỗi)"
              );
              setBlog(mockResponse.data);
              // Nếu lấy được dữ liệu mẫu, xóa thông báo lỗi
              setError(null);
              setLoading(false);
              return;
            }
          } catch (mockError) {
            console.error(
              "[Blog Detail] Không thể lấy dữ liệu mẫu:",
              mockError
            );
            // Giữ nguyên thông báo lỗi từ API
          }
        }
      } catch (err) {
        console.error("[Blog Detail] Lỗi khi tải chi tiết blog:", err);
        setError(
          extractErrorMessage(err) || "Không thể tải thông tin bài viết"
        );
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
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca mb-4"></div>
          <p className="text-lg">Đang tải thông tin bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="bg-white rounded-lg p-8 shadow-md max-w-lg mx-auto">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-bold mb-4">
            Không thể hiển thị bài viết
          </h2>
          <div className="text-red-500 mb-6 text-sm">
            {error || "Không tìm thấy bài viết hoặc bài viết không tồn tại"}
          </div>
          <Link
            href="/blog"
            className="inline-block bg-pink-doca text-white px-4 py-2 rounded"
          >
            Quay lại trang blog
          </Link>
        </div>
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
          {/* Sử dụng một div thông thường thay vì Image để tránh lỗi */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                blog && "imageUrl" in blog
                  ? `url('${blog.imageUrl}')`
                  : "url(/images/blog-placeholder.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line">{blog.description}</div>
        </div>
      </article>
    </div>
  );
}
