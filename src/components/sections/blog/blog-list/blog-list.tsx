"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetBlogDetailResponse } from "@/api/generated";
import Pagination from "@/components/common/pagination/pagination";
import { BlogService } from "@/service/blog-service";
import { toast } from "react-toastify";

export default function BlogList() {
  const [blogs, setBlogs] = useState<GetBlogDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 9;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`[BlogList] Đang tải danh sách blog trang ${currentPage}`);

      // Sử dụng BlogService thay vì dữ liệu giả
      const response = await BlogService.getBlogs({
        page: currentPage,
        size: pageSize,
      });

      if (response && response.data) {
        console.log(
          `[BlogList] Tải dữ liệu blog thành công, nhận được ${
            response.data.items?.length || 0
          } bài viết`
        );
        setBlogs(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.warn("[BlogList] Phản hồi API không chứa dữ liệu hợp lệ");
        setError("Không nhận được dữ liệu blog từ server");
        toast.error("Không thể tải danh sách blog. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("[BlogList] Lỗi khi tải dữ liệu blog:", error);
      setError("Không thể tải danh sách blog");
      toast.error("Không thể tải danh sách blog. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Cuộn trang lên đầu khi chuyển trang
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
      <div className="w-full flex-1 flex items-center justify-center p-10">
        <div className="text-pink-doca">
          <svg
            className="animate-spin h-8 w-8"
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không thể tải danh sách blog
        </h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={() => fetchBlogs()}
          className="mt-4 px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      {blogs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có bài viết nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mx-auto sm:mx-0 max-w-md w-full"
              >
                <Link href={`/blog/${blog.id}`}>
                  <div className="relative h-40 sm:h-44 md:h-48">
                    <Image
                      src={"/images/blog-placeholder.png"}
                      alt={blog.name || "Bài viết"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="text-gray-500 text-xs md:text-sm mb-2">
                      {formatDate(blog.createdAt)}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">
                      {blog.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="mt-3 md:mt-4 text-pink-doca font-semibold">
                      Đọc thêm →
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
