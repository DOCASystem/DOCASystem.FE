"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  size: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function ViewProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc lấy thông tin sản phẩm từ API
    // Trong thực tế, bạn sẽ gọi API thật để lấy thông tin sản phẩm dựa vào productId
    setTimeout(() => {
      setProduct({
        id: productId || "1",
        name: "Đồ ăn hình xương",
        category: "Đồ ăn cho chó",
        quantity: 100,
        price: 100000,
        description:
          "Đồ ăn hình xương dành cho chó với nhiều dưỡng chất thiết yếu, giúp chó cưng của bạn phát triển khỏe mạnh và tăng cường hệ miễn dịch. Sản phẩm được sản xuất từ nguyên liệu tự nhiên, không chứa chất bảo quản, an toàn cho thú cưng.",
        size: "Trung bình",
        image: "/images/dog-food.png",
        createdAt: "10/06/2024",
        updatedAt: "12/06/2024",
      });
      setLoading(false);
    }, 500);
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6 flex items-center">
        <Link
          href="/products-management"
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
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="aspect-square overflow-hidden rounded-lg shadow-md">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {product.name}
              </h2>
              <div className="flex space-x-2">
                <Link
                  href={`/products-management/edit?id=${product.id}`}
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
                  {product.category}
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

              <div>
                <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.createdAt}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Cập nhật lần cuối
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.updatedAt}
                </p>
              </div>
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
