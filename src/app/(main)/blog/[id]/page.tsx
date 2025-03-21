"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Blog, BlogService } from "@/service/blog-service";

// Interface cho API error response
interface ApiErrorDetail {
  status: number;
  message: string;
  details?: string;
  timestamp?: string;
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDetail | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(
    "/images/blog-placeholder.png"
  );
  const router = useRouter();

  // Sử dụng một phương thức duy nhất để lấy chi tiết blog
  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(
          `[Blog Detail] Đang tải thông tin blog với ID: ${params.id}`
        );

        // URL API trực tiếp không được ẩn đi
        const apiUrl = `https://production.doca.love/api/v1/blogs/${params.id}`;
        console.log(`[Blog Detail] Gọi API trực tiếp: ${apiUrl}`);
        console.log(
          `[Blog Detail] API URL không được ẩn đi cho mục đích debug`
        );

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        // Log thông tin response để debug
        console.log(
          `[Blog Detail] Response status: ${response.status} ${response.statusText}`
        );

        // Lấy dữ liệu response
        const data = await response.json().catch(() => null);

        // Kiểm tra nếu response thành công
        if (response.ok && data) {
          console.log(`[Blog Detail] API thành công, dữ liệu:`, data.name);

          // Lưu dữ liệu blog vào state
          setBlog(data);

          // Lấy URL hình ảnh từ cấu trúc blog mới
          try {
            const blogImageUrl = BlogService.getBlogImageUrl(data);
            setImageUrl(blogImageUrl);
            console.log(`[Blog Detail] Đã tìm thấy hình ảnh: ${blogImageUrl}`);
          } catch (imgError) {
            console.warn(
              "[Blog Detail] Không thể lấy hình ảnh blog:",
              imgError
            );
            // Giữ nguyên ảnh mặc định
          }
        } else {
          console.error(
            `[Blog Detail] API không thành công (${response.status}):`,
            data
          );

          // Xử lý các lỗi
          const errorDetail = {
            status: response.status,
            message: data?.message || `Lỗi ${response.status} từ server`,
            details: data?.details || `API trả về lỗi ${response.status}`,
          };

          throw errorDetail;
        }
      } catch (err: unknown) {
        console.error("[Blog Detail] Chi tiết lỗi:", err);

        // Chuẩn hóa đối tượng error
        const errorDetail: ApiErrorDetail = {
          status:
            err && typeof err === "object" && "status" in err
              ? (err.status as number)
              : 0,
          message:
            err && typeof err === "object" && "message" in err
              ? (err.message as string)
              : "Không thể tải thông tin bài viết",
          details:
            err && typeof err === "object" && "details" in err
              ? (err.details as string)
              : "Đã xảy ra lỗi khi tải thông tin bài viết.",
        };

        setError(errorDetail);

        // Thông báo cho người dùng
        toast.error(errorDetail.message);

        // Nếu là lỗi xác thực, chuyển hướng đến trang đăng nhập sau 2 giây
        if (errorDetail.status === 401 || errorDetail.status === 403) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
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

  // Định dạng trạng thái blog
  const getStatusText = (status?: number): string => {
    if (status === undefined || status === null) return "";

    switch (status) {
      case 0:
        return "";
      case 1:
        return "";
      case 2:
        return "";
      default:
        return `Trạng thái ${status}`;
    }
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
          <p className="text-red-500 mb-4">
            {error?.message || "Không thể tải thông tin bài viết"}
          </p>
          {error?.details && (
            <p className="mb-6 text-sm text-gray-600">{error.details}</p>
          )}
          {error?.status === 500 && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>Lỗi máy chủ (500)</strong>: Máy chủ đang gặp sự cố. Nếu
                bạn là nhà phát triển, vui lòng kiểm tra logs của backend để
                biết thêm chi tiết.
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/blog"
              className="inline-block bg-pink-doca text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Quay lại trang blog
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/blog" className="text-pink-doca hover:underline">
          &larr; Quay lại trang Blog
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Blog Image */}
        {imageUrl && (
          <div className="relative h-[400px] md:h-[500px] w-full">
            <img
              src={imageUrl}
              alt={blog.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.name}</h1>

          <div className="flex items-center text-gray-500 mb-6">
            {blog.authorName && (
              <span className="mr-4">Tác giả: {blog.authorName}</span>
            )}
            <span className="mr-4">
              Đăng ngày: {formatDate(blog.createdAt)}
            </span>
            {blog.status !== undefined && (
              <span className="bg-gray-200 px-2 py-1 text-sm rounded">
                {getStatusText(blog.status)}
              </span>
            )}
          </div>

          {/* Danh mục blog nếu có */}
          {blog.blogCategories && blog.blogCategories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {blog.blogCategories.map((category) => (
                <span
                  key={category.id}
                  className="bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description || "" }}
          />
        </div>
      </article>
    </div>
  );
}
