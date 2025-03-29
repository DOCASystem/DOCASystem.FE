"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Blog, BlogService } from "@/service/blog-service";
import { GetProductDetailResponse } from "@/api/generated";
import { ProductService } from "@/service/product-service";
import CardProduct from "@/components/common/card/card-product/card-food";
import Image from "next/image";
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
  const [randomProduct, setRandomProduct] =
    useState<GetProductDetailResponse | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
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

  // Lấy một sản phẩm ngẫu nhiên
  useEffect(() => {
    const fetchRandomProduct = async () => {
      setLoadingProduct(true);
      try {
        // Lấy danh sách sản phẩm từ API
        const response = await ProductService.getProducts({
          page: 1,
          size: 10, // Lấy 10 sản phẩm để chọn ngẫu nhiên 1 sản phẩm
        });

        if (response.data.items && response.data.items.length > 0) {
          // Chọn ngẫu nhiên 1 sản phẩm từ danh sách
          const randomIndex = Math.floor(
            Math.random() * response.data.items.length
          );
          setRandomProduct(response.data.items[randomIndex]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm ngẫu nhiên:", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    // Chỉ gọi API khi blog đã được load thành công
    if (!loading && blog) {
      fetchRandomProduct();
    }
  }, [loading, blog]);

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
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"></div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
          {/* Blog Image */}
          {imageUrl && (
            <div className="relative h-[300px] md:h-[400px] w-full">
              <Image
                src={imageUrl}
                alt={blog.name}
                width={1000}
                height={1000}
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

            {/* Blog description */}
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{blog.description}</p>
            </div>

            {/* Tags or Categories */}
            {blog.blogCategories && blog.blogCategories.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Danh mục:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.blogCategories.map((category) => (
                    <span
                      key={category.id}
                      className="bg-pink-50 text-pink-doca px-3 py-1 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Sản phẩm ngẫu nhiên */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-pink-doca">
              Gợi ý cho bạn
            </h2>

            {loadingProduct ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-doca"></div>
              </div>
            ) : randomProduct ? (
              <div className="mb-8">
                <CardProduct product={randomProduct} />
                <div className="mt-4 text-center">
                  <Link
                    href="/shop"
                    className="inline-block bg-pink-doca text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Xem thêm sản phẩm
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có sản phẩm nào để hiển thị
              </p>
            )}

            {/* Các mục blog khác có thể thêm vào đây sau */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-4">Bài viết liên quan</h3>
              <p className="text-sm text-gray-500">
                Xem thêm các bài viết khác tại mục Blog của chúng tôi.
              </p>
              <div className="mt-4">
                <Link
                  href="/blog"
                  className="text-pink-doca hover:underline text-sm font-medium"
                >
                  Xem tất cả bài viết &rarr;
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
