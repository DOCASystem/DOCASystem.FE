"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { CartService } from "@/service/cart-service";

// Định nghĩa kiểu dữ liệu sản phẩm
interface ProductImage {
  id: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  productImages: ProductImage[];
}

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

// Simple store implementation for products
const useProductStore = (): ProductStore => {
  const [products, setProducts] = useState<Product[]>([]);
  return { products, setProducts };
};

export default function RecommendProducts() {
  const { products, setProducts } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  // Hàm lấy danh sách sản phẩm gợi ý
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("[RecommendProducts] Đang tải sản phẩm gợi ý");

      // URL API trực tiếp không được ẩn đi
      const apiUrl =
        "https://production.doca.love/api/v1/products?page=1&size=8";
      console.log(`[RecommendProducts] Gọi API trực tiếp: ${apiUrl}`);
      console.log(
        `[RecommendProducts] API URL không được ẩn đi cho mục đích debug`
      );

      const response = await axios.get(apiUrl);

      // Log thông tin response để debug
      console.log(
        `[RecommendProducts] Response status: ${response.status} ${response.statusText}`
      );

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

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Ngăn chặn hành vi chuyển trang

    if (product.quantity !== undefined && product.quantity <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      setAddingToCartId(product.id);

      // Gọi API thêm vào giỏ hàng
      await CartService.addToCart({
        productId: product.id,
        quantity: 1,
      });

      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      console.error("[RecommendProducts] Lỗi khi thêm vào giỏ hàng:", error);
      toast.error(
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."
      );
    } finally {
      setAddingToCartId(null);
    }
  };

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
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col transform transition-all hover:shadow-md hover:-translate-y-1 relative"
              >
                <Link
                  href={`/shop/product-detail/${product.id}`}
                  className="group"
                >
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name || "Sản phẩm"}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-auto pt-2 flex justify-between items-center">
                  <p className="text-pink-doca font-bold">
                    {formatPrice(product.price)}
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={
                      addingToCartId === product.id ||
                      (product.quantity !== undefined && product.quantity <= 0)
                    }
                    className={`p-2 rounded-full transition-colors ${
                      addingToCartId === product.id ||
                      (product.quantity !== undefined && product.quantity <= 0)
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-pink-doca text-white hover:bg-pink-600"
                    }`}
                  >
                    {addingToCartId === product.id ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
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
