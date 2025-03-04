"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
      title: "Chăm sóc thú cưng mùa nóng",
      category: "Chăm sóc thú cưng",
      status: "Đã đăng",
      publishDate: "12/06/2024",
      image: "/images/pet-care.png",
    },
    {
      id: "2",
      title: "Những loại thức ăn tốt cho chó",
      category: "Dinh dưỡng",
      status: "Đã đăng",
      publishDate: "10/06/2024",
      image: "/images/dog-food.png",
    },
    {
      id: "3",
      title: "Cách huấn luyện mèo con",
      category: "Huấn luyện",
      status: "Chờ đăng",
      publishDate: "15/06/2024",
      image: "/images/cat-training.png",
    },
    {
      id: "4",
      title: "Bệnh thường gặp ở thú cưng",
      category: "Sức khỏe",
      status: "Đã đăng",
      publishDate: "05/06/2024",
      image: "/images/pet-health.png",
    },
    {
      id: "5",
      title: "Mẹo chăm sóc lông cho chó",
      category: "Chăm sóc",
      status: "Chờ duyệt",
      publishDate: "18/06/2024",
      image: "/images/dog-grooming.png",
    },
  ]);

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
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
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-500">Bài Viết</h1>
        <Link
          href="/blog-management/add"
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full transition-all"
        >
          Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center p-4 border-b last:border-b-0 rounded-md my-2 bg-white shadow-sm"
          >
            <div className="h-16 w-16 mr-4 overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                width={64}
                height={64}
                className="object-cover"
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
                href={`/blog-management/edit?id=${post.id}`}
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
                onClick={() => handleDeletePost(post.id)}
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
    </div>
  );
}
