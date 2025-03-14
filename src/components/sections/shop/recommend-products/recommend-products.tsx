"use client";

import { useState, useEffect } from "react";
import { GetProductDetailResponse } from "@/api/generated";
import CardProduct from "@/components/common/card/card-product/card-food";
import { ProductService } from "@/service/product-service";
import axios from "axios";
import { REAL_API_BASE_URL } from "@/utils/api-config";

interface RecommendProductsProps {
  currentProductId: string;
}

export default function RecommendProducts({
  currentProductId,
}: RecommendProductsProps) {
  const [products, setProducts] = useState<GetProductDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendedProducts();
  }, [currentProductId]);

  const fetchRecommendedProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Đang tải sản phẩm gợi ý...");

      // Phương pháp 1: Sử dụng API proxy trong Next.js
      try {
        // Đây là API route trong Next.js, không phải API external
        const proxyUrl = `/api/proxy/products-simple`;
        console.log(`Gọi API proxy để lấy sản phẩm tương tự: ${proxyUrl}`);

        const proxyResponse = await axios.get(proxyUrl, {
          timeout: 8000, // 8 giây timeout
        });

        if (proxyResponse.data && proxyResponse.data.items) {
          console.log("API proxy trả về danh sách sản phẩm thành công");

          // Lọc sản phẩm hiện tại ra khỏi danh sách gợi ý
          const filteredProducts = proxyResponse.data.items.filter(
            (product: GetProductDetailResponse) =>
              product.id !== currentProductId
          );

          // Lấy tối đa 4 sản phẩm
          setProducts(filteredProducts.slice(0, 4));
          return; // Thoát sớm nếu thành công
        }
      } catch (proxyError) {
        console.error(
          "Lỗi khi gọi API proxy cho sản phẩm tương tự:",
          proxyError
        );
      }

      // Phương pháp 2: Thử gọi API trực tiếp
      try {
        const directApiUrl = `${REAL_API_BASE_URL}/api/v1/products?page=1&size=8`;
        console.log(`Gọi API trực tiếp: ${directApiUrl}`);

        const response = await axios.get(directApiUrl, {
          timeout: 8000, // 8 giây timeout
        });

        if (response.data && response.data.items) {
          console.log("API trực tiếp trả về danh sách sản phẩm thành công");

          // Lọc sản phẩm hiện tại ra khỏi danh sách gợi ý
          const filteredProducts = response.data.items.filter(
            (product: GetProductDetailResponse) =>
              product.id !== currentProductId
          );

          // Lấy tối đa 4 sản phẩm
          setProducts(filteredProducts.slice(0, 4));
          return; // Thoát sớm nếu thành công
        }
      } catch (directApiError) {
        console.error("Lỗi khi gọi API trực tiếp:", directApiError);
      }

      // Phương pháp 3: Fallback dùng ProductService
      try {
        console.log("Thử dùng ProductService...");
        const response = await ProductService.getProducts({
          page: 1,
          size: 8,
        });

        if (response.data.items) {
          console.log("ProductService trả về danh sách sản phẩm thành công");
          const filteredProducts = response.data.items.filter(
            (product) => product.id !== currentProductId
          );
          setProducts(filteredProducts.slice(0, 4));
          return; // Thoát sớm nếu thành công
        }
      } catch (serviceError) {
        console.error("Lỗi khi dùng ProductService:", serviceError);
        throw serviceError; // Ném lỗi để xử lý bên ngoài
      }

      // Nếu tất cả phương pháp đều thất bại
      throw new Error("Không thể tải sản phẩm gợi ý");
    } catch (error: unknown) {
      console.error("Lỗi khi tải sản phẩm gợi ý:", error);
      setError("Không thể tải sản phẩm gợi ý");
      // Vẫn hiển thị UI mà không có sản phẩm
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-pink-doca animate-spin mb-4"></div>
            <p className="text-gray-500">Đang tải sản phẩm đề xuất...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-center text-gray-500 py-6">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-center text-gray-500 py-6">
          Hiện chưa có sản phẩm gợi ý
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="transform transition-transform hover:scale-[1.02]"
          >
            <CardProduct product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
