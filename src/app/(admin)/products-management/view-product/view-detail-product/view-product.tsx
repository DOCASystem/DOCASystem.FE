"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// Định nghĩa kiểu dữ liệu giả cho sản phẩm - giống với trang edit
interface ProductData {
  id: string;
  name: string;
  categoryIds: string[];
  size: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Map danh mục để hiển thị
const categoryMap: Record<string, string> = {
  dog: "Chó",
  cat: "Mèo",
};

function ViewProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Không tìm thấy ID sản phẩm");
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);

        // Đây là nơi bạn sẽ gọi API thực tế
        // const response = await fetch(`/api/products/${productId}`);
        // const data = await response.json();

        // Sử dụng dữ liệu mock giống với trang edit
        const mockData: ProductData = {
          id: productId,
          name: "Thức ăn cho chó ROYAL CANIN",
          categoryIds: ["dog"],
          size: "2kg",
          price: 250000,
          description: "Thức ăn dinh dưỡng cao cấp dành cho chó",
          quantity: 50,
          imageUrl: "https://example.com/product-image.jpg",
          createdAt: "10/06/2024",
          updatedAt: "12/06/2024",
        };

        setProduct(mockData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white/80">
        <div className="text-lg font-medium text-pink-doca">
          Đang tải dữ liệu sản phẩm...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center py-10 text-red-500">
          {error || "Không tìm thấy sản phẩm"}
          <div className="mt-4">
            <button
              onClick={() => router.push("/products-management")}
              className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị danh mục dựa vào categoryIds
  const categoryDisplay = product.categoryIds
    .map((catId) => categoryMap[catId] || catId)
    .join(", ");

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6 flex items-center">
        <Link
          href="/products-management"
          className="mr-4 text-pink-doca hover:text-pink-doca"
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
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="aspect-square overflow-hidden rounded-lg shadow-md bg-gray-100 flex items-center justify-center">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  Không có hình ảnh
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {product.name}
              </h2>
              <div className="flex space-x-2">
                <Link
                  href={`/products-management/edit/?id=${product.id}`}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                >
                  Chỉnh sửa
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phân loại</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {categoryDisplay}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Kích thước
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.size}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Giá</h3>
                <p className="mt-1 text-lg font-bold text-pink-600">
                  {product.price.toLocaleString()}đ
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Số lượng còn lại
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.quantity} SP
                </p>
              </div>

              {product.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Ngày tạo
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {product.createdAt}
                  </p>
                </div>
              )}

              {product.updatedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Cập nhật lần cuối
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {product.updatedAt}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">
                Mô tả sản phẩm
              </h3>
              <p className="mt-2 text-base text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewProductPage() {
  return (
    <Suspense fallback={<div className="p-4">Đang tải...</div>}>
      <ViewProductContent />
    </Suspense>
  );
}
