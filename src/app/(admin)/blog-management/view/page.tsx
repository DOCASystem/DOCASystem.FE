"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  status: string;
  content: string;
  publishDate: string;
  author: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

function BlogViewContent() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc lấy thông tin bài viết từ API
    // Trong thực tế, bạn sẽ gọi API thật để lấy thông tin bài viết dựa vào postId
    setTimeout(() => {
      setPost({
        id: postId || "1",
        title: "Cách bảo quản thực phẩm trong mùa hè",
        category: "Bảo quản thực phẩm",
        status: "Đã đăng",
        content:
          "Mùa hè với nhiệt độ cao có thể gây ra nhiều vấn đề cho việc bảo quản thực phẩm. Bài viết này sẽ cung cấp những lời khuyên hữu ích để giúp bạn bảo quản thực phẩm an toàn và tươi ngon trong mùa nóng.\n\nĐầu tiên, hãy đảm bảo tủ lạnh của bạn luôn được điều chỉnh ở nhiệt độ phù hợp. Ngăn mát nên giữ ở nhiệt độ từ 2-4 độ C, ngăn đông từ -18 đến -20 độ C. Kiểm tra nhiệt kế trong tủ lạnh thường xuyên để đảm bảo nhiệt độ ổn định.\n\nTiếp theo, tránh để thực phẩm dễ hỏng như thịt, cá, sữa ở ngoài quá lâu, đặc biệt trong thời tiết nóng. Sau khi mua về, hãy để ngay vào tủ lạnh. Không nên để thực phẩm dễ hỏng ở nhiệt độ phòng quá 2 giờ (hoặc 1 giờ nếu nhiệt độ ngoài trời trên 32 độ C).\n\nĐối với rau củ quả, nên rửa sạch, để khô và bảo quản trong hộp hoặc túi có lỗ thông khí để tránh bị úng nước. Một số loại rau củ cần được bảo quản riêng vì chúng sinh ra khí ethylene làm cho các loại rau củ khác chín nhanh hơn.\n\nCuối cùng, hãy chú ý đến dấu hiệu của thực phẩm hỏng như: mùi lạ, thay đổi màu sắc, xuất hiện nấm mốc. Nếu nghi ngờ thực phẩm đã hỏng, tốt nhất nên bỏ đi để đảm bảo sức khỏe.",
        publishDate: "12/06/2024",
        author: "Nguyễn Văn A",
        image: "/images/blog-placeholder.png",
        createdAt: "10/06/2024",
        updatedAt: "12/06/2024",
        tags: ["Bảo quản", "Thực phẩm", "Mùa hè", "An toàn thực phẩm"],
      });
      setLoading(false);
    }, 500);
  }, [postId]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        Không tìm thấy bài viết
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
          <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
          <div className="flex space-x-2">
            <Link
              href={`/blog-management/edit?id=${post.id}`}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
            >
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={post.image}
            alt={post.title}
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
              {post.author}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Phân loại</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {post.category}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${getStatusColor(
                post.status
              )}`}
            >
              {post.status}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Ngày đăng</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {post.publishDate}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {post.createdAt}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Cập nhật lần cuối
            </h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {post.updatedAt}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Nội dung</h3>
          <div className="prose prose-pink max-w-none text-gray-700">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewBlogPage() {
  return (
    <Suspense fallback={<div className="p-4">Đang tải...</div>}>
      <BlogViewContent />
    </Suspense>
  );
}
