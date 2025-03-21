"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useProductStore } from "@/hooks/use-product-store";

// Định nghĩa kiểu dữ liệu sản phẩm
interface ProductImage {
  id: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  productImages: ProductImage[];
}

export default function RecommendProducts() {
  const { products, setProducts } = useProductStore();
  const [loading, setLoading] = useState(false);

  // Hàm lấy danh sách sản phẩm gợi ý
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("[RecommendProducts] Đang tải sản phẩm gợi ý");

      // Sử dụng duy nhất 1 API URL
      const apiUrl =
        "https://production.doca.love/api/v1/products?page=1&size=8";
      console.log(`[RecommendProducts] Gọi API: ${apiUrl}`);

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const data = response.data;
        console.log(
          `[RecommendProducts] API thành công, nhận được ${
            data.items?.length || 0
          } sản phẩm`
        );
        setProducts(data.items || []);
      } else {
        console.error(`[RecommendProducts] API lỗi: ${response.status}`);
        throw new Error(`Lỗi API: ${response.status}`);
      }
    } catch (error) {
      console.error("[RecommendProducts] Lỗi khi tải sản phẩm gợi ý:", error);
    } finally {
      setLoading(false);
    }
  }, [setProducts]);

  useEffect(() => {
    // Chỉ tải dữ liệu nếu chưa có sản phẩm
    if (!products || products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products]);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sản phẩm gợi ý cho bạn
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col"
            >
              <div className="bg-gray-200 aspect-square w-full mb-4 rounded-md"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product: Product) => {
            // Lấy URL hình ảnh đầu tiên của sản phẩm
            const imageUrl =
              product.productImages && product.productImages.length > 0
                ? product.productImages[0].imageUrl
                : "/images/product-placeholder.jpg";

            return (
              <Link
                href={`/shop/${product.id}`}
                key={product.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col transform transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name || "Sản phẩm"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                <p className="text-pink-doca font-bold mt-auto">
                  {formatPrice(product.price)}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có sản phẩm nào để hiển thị.</p>
        </div>
      )}
    </div>
  );
}
