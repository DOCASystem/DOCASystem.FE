"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetBlogDetailResponse } from "@/api/generated";
import Pagination from "@/components/common/pagination/pagination";
import { getPaginatedBlogs } from "@/mock/blogs";

export default function BlogList() {
  const [blogs, setBlogs] = useState<GetBlogDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Sử dụng dữ liệu giả thay vì gọi API
      const response = getPaginatedBlogs(currentPage, pageSize);

      if (response.data.items) {
        setBlogs(response.data.items);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <div className="container mx-auto text-center py-10">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {blogs.length === 0 ? (
        <div className="text-center py-10">Không có bài viết nào</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${blog.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={"/images/blog-placeholder.png"}
                      alt={blog.name || "Bài viết"}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-gray-500 text-sm mb-2">
                      {formatDate(blog.createdAt)}
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {blog.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="mt-4 text-pink-doca font-semibold">
                      Đọc thêm →
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
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
