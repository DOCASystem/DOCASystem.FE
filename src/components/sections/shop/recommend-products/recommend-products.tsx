"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductService } from "@/service/product-service";
import axios from "axios";
import { getToken } from "@/auth/auth-service";
import { REAL_API_BASE_URL } from "@/utils/api-config";
import { useProductStore, Product } from "@/store/product-store";

// Định nghĩa interface cho sản phẩm gợi ý
interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

interface RecommendProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productImages: ProductImage[];
}

interface RecommendProductsProps {
  currentProductId: string;
}

export default function RecommendProducts({
  currentProductId,
}: RecommendProductsProps) {
  const [products, setProducts] = useState<RecommendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy hàm saveProducts từ store
  const saveProducts = useProductStore((state) => state.saveProducts);

  // Bọc hàm fetchProducts trong useCallback
  const fetchRecommendProducts = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Đang tải sản phẩm đề xuất...");

      // Gọi trực tiếp API sản phẩm thay vì qua proxy
      try {
        const token = getToken();

        // Xác định baseURL tùy theo môi trường
        let baseUrl = REAL_API_BASE_URL;
        if (
          typeof window !== "undefined" &&
          window.location.hostname === "doca.love"
        ) {
          baseUrl = "https://doca.love";
        }

        const apiUrl = `${baseUrl}/api/v1/products?page=1&size=8`;
        console.log(`[Recommend Products] Gọi API từ: ${baseUrl}`);
        console.log(`[Recommend Products] URL đầy đủ: ${apiUrl}`);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(apiUrl, {
          headers,
          timeout: 8000, // 8 giây timeout
        });

        if (response.data && response.data.content) {
          console.log(
            "API trả về dữ liệu thành công:",
            response.data.content.length,
            "sản phẩm"
          );

          // Lưu danh sách sản phẩm vào store, sử dụng kỹ thuật debounce để tránh render lại quá nhiều
          setTimeout(() => {
            saveProducts(response.data.content as Product[]);
          }, 100);

          // Lọc ra sản phẩm hiện tại
          const filteredProducts = response.data.content.filter(
            (product: RecommendProduct) => product.id !== currentProductId
          );

          if (filteredProducts.length > 0) {
            setProducts(filteredProducts.slice(0, 4));
            setLoading(false);
            return; // Thoát sớm nếu thành công
          }
        }
      } catch (apiError) {
        console.error("Lỗi khi gọi API danh sách sản phẩm:", apiError);
      }

      // Fallback: Thử dùng ProductService
      try {
        console.log("Thử dùng ProductService...");
        const serviceResponse = await ProductService.getProducts({
          page: 1,
          size: 8,
        });

        if (serviceResponse && serviceResponse.data) {
          console.log(
            "ProductService trả về dữ liệu thành công:",
            serviceResponse.data.items?.length || 0,
            "sản phẩm"
          );

          // Lọc ra sản phẩm hiện tại
          const filteredProducts = (serviceResponse.data.items || []).filter(
            (product) => product.id !== currentProductId
          );

          if (filteredProducts.length > 0) {
            // Chuyển đổi sang định dạng RecommendProduct
            const mappedProducts: RecommendProduct[] = filteredProducts.map(
              (product) => ({
                id: product.id || "",
                name: product.name || "",
                price: product.price || 0,
                quantity: product.quantity || 0,
                productImages: (product.productImages || []).map((img) => ({
                  id: img.id || "",
                  imageUrl: img.imageUrl || "",
                  isMain: img.isMain || false,
                })),
              })
            );

            setProducts(mappedProducts.slice(0, 4));
            setLoading(false);
            return; // Thoát sớm nếu thành công
          }
        }
      } catch (serviceError) {
        console.error("Lỗi khi dùng ProductService:", serviceError);
        throw serviceError; // Ném lỗi để xử lý bên ngoài
      }

      // Nếu tất cả các phương pháp đều thất bại
      throw new Error("Không thể tải sản phẩm đề xuất");
    } catch (err: unknown) {
      console.error("Chi tiết lỗi khi tải sản phẩm đề xuất:", err);
      setError("Không thể tải sản phẩm đề xuất");
    } finally {
      setLoading(false);
    }
  }, [currentProductId]); // Chỉ phụ thuộc vào currentProductId

  // Tách riêng phần useEffect để tránh vòng lặp vô hạn
  useEffect(() => {
    fetchRecommendProducts();
  }, [fetchRecommendProducts]);

  // Format giá tiền
  const formatPrice = (price?: number) => {
    if (!price) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="bg-gray-200 aspect-square w-full rounded-md mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // Không hiển thị gì nếu có lỗi hoặc không có sản phẩm
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => {
        // Lấy URL ảnh chính
        const imageUrl =
          product.productImages && product.productImages.length > 0
            ? product.productImages.find((img) => img.isMain)?.imageUrl ||
              product.productImages[0].imageUrl ||
              "/images/food-test.png"
            : "/images/food-test.png";

        return (
          <Link
            href={`/shop/${product.id}`}
            key={product.id}
            className="bg-white p-3 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1"
          >
            <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3">
              <Image
                src={imageUrl}
                alt={product.name || "Sản phẩm gợi ý"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <h3 className="font-medium text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-pink-doca font-bold">
              {formatPrice(product.price)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
