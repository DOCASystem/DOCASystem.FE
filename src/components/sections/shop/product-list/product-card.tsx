"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { toast } from "react-toastify";
import { CartService } from "@/service/cart-service";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)

    if (product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      setIsAddingToCart(true);

      // Gọi API thêm vào giỏ hàng
      await CartService.addToCart({
        productId: product.id,
        quantity: 1,
      });

      // Hiển thị thông báo thành công
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Bạn cần đăng nhập để mua hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Format giá tiền trực tiếp thay vì import
  const formatPriceLocal = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full border-2 border-slate-100 rounded-[20px] transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link
        href={`/shop/product-detail/${product.id}`}
        className="cursor-pointer"
      >
        <div className="relative aspect-square">
          <Image
            src={product.images[0] || "/images/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-[20px]"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-medium">Hết hàng</span>
            </div>
          )}
        </div>
        <div className="p-5 bg-slate-100 rounded-b-[20px]">
          <p className="mb-3 font-semibold line-clamp-2 h-12">{product.name}</p>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <p className="text-pink-doca font-bold">
                {formatPriceLocal(product.price)}
              </p>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPriceLocal(product.originalPrice)}
                  </p>
                )}
            </div>
            <button
              data-cart-button="true"
              className={`p-2 rounded-full transition-colors ${
                isAddingToCart || product.stock <= 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-pink-doca text-white hover:bg-pink-600"
              }`}
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
            >
              {isAddingToCart ? (
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
      </Link>
    </div>
  );
}
