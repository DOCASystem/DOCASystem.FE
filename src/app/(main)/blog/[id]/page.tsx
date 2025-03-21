"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Định nghĩa interface cho Blog Detail
interface BlogImage {
  id: string;
  imageUrl: string;
}

interface BlogDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  modifiedAt: string;
  isHidden: boolean;
  blogImage: BlogImage;
  authorName?: string;
  description?: string;
}

// Interface cho API error response
interface ApiErrorDetail {
  status: number;
  message: string;
  details?: string;
  timestamp?: string;
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDetail | null>(null);
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

        // Sử dụng duy nhất 1 API URL
        const apiUrl = `https://production.doca.love/api/v1/blogs/${params.id}`;
        console.log(`[Blog Detail] Gọi API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        // Lấy dữ liệu response
        const data = await response.json().catch(() => null);

        // Kiểm tra nếu response thành công
        if (response.ok && data) {
          console.log(`[Blog Detail] API thành công`);
          setBlog(data);
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
        {blog.blogImage && (
          <div className="relative h-[400px] md:h-[500px] w-full">
            <img
              src={blog.blogImage.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center text-gray-500 mb-6">
            <span className="mr-4">
              {blog.authorName ? `Tác giả: ${blog.authorName}` : ""}
            </span>
            <span>Đăng ngày: {formatDate(blog.createdAt)}</span>
          </div>

          {blog.description && (
            <div className="mb-6 italic text-lg text-gray-600">
              {blog.description}
            </div>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
        </div>
      </article>
    </div>
  );
}
