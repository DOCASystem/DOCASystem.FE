"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  status: string;
  publishDate: string;
  image: string;
};

export default function AdminPostPage() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Cách bảo quản thực phẩm trong mùa hè",
      category: "Bảo quản thực phẩm",
      status: "Đã đăng",
      publishDate: "12/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "2",
      title: "Những loại thực phẩm tốt cho sức khỏe",
      category: "Dinh dưỡng",
      status: "Đã đăng",
      publishDate: "10/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "3",
      title: "Mẹo nấu ăn ngon mỗi ngày",
      category: "Nấu ăn",
      status: "Chờ đăng",
      publishDate: "15/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "4",
      title: "Thực phẩm giàu protein cho người tập gym",
      category: "Dinh dưỡng",
      status: "Đã đăng",
      publishDate: "05/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "5",
      title: "Công thức làm các món ăn vặt tại nhà",
      category: "Công thức",
      status: "Chờ duyệt",
      publishDate: "18/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "6",
      title: "Thực phẩm kiêng khem cho người giảm cân",
      category: "Dinh dưỡng",
      status: "Đã đăng",
      publishDate: "01/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "7",
      title: "Hướng dẫn nấu các món ăn Á Đông tại nhà",
      category: "Công thức",
      status: "Chờ đăng",
      publishDate: "20/06/2024",
      image: "/images/blog-placeholder.png",
    },
    {
      id: "8",
      title: "Cách bảo quản rau củ quả tươi lâu hơn",
      category: "Bảo quản thực phẩm",
      status: "Đã đăng",
      publishDate: "08/06/2024",
      image: "/images/blog-placeholder.png",
    },
  ]);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const openDeleteDialog = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setIsDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  // Tính toán blog cần hiển thị cho trang hiện tại
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [posts, currentPage]);

  // Tính tổng số trang
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
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
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-doca">Bài Viết</h1>
        <Button className="w-44 h-11 text-lg">
          <Link
            href="/blog-management/add-blog"
            className=" text-white rounded-lg transition-all"
          >
            Thêm bài viết
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-center p-4 border-b last:border-b-0 rounded-md my-2 bg-white shadow-sm"
          >
            <div className="h-16 w-16 mr-4 overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                width={100}
                height={100}
                sizes="100%"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">
                Phân loại: {post.category}
              </p>
            </div>

            <div className="flex-shrink-0 mx-4">
              <span
                className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                  post.status
                )}`}
              >
                {post.status}
              </span>
            </div>

            <div className="flex-shrink-0 mx-4 text-sm text-gray-600">
              Ngày đăng: {post.publishDate}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href={`/blog-management/edit-blog/${post.id}`}
                className="px-4 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
              >
                Edit
              </Link>

              <Link
                href={`/blog-management/view?id=${post.id}`}
                className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
              >
                Detail
              </Link>

              <button
                onClick={() => openDeleteDialog(post.id)}
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

      {/* Thêm phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xác nhận xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmButtonText="Xóa"
        cancelButtonText="Hủy"
        onConfirm={confirmDeletePost}
        onCancel={cancelDeletePost}
        type="danger"
      />
    </div>
  );
}
