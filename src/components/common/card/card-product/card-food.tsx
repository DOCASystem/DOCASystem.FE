"use client";

import Image from "next/image";
import { useState } from "react";
import { GetProductDetailResponse } from "@/api/generated";
import { toast } from "react-toastify";
import Link from "next/link";
import { CartService } from "@/service/cart-service";

interface CardProductProps {
  product: GetProductDetailResponse;
}

export default function CardProduct({ product }: CardProductProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const defaultProduct = {
    id: "0",
    name: "Sản phẩm không xác định",
    prices: 0,
  };

  // Lấy URL ảnh chính của sản phẩm (nếu có)
  const mainImage =
    product?.productImages && product.productImages.length > 0
      ? product.productImages[0].imageUrl || "/images/food-test.png"
      : "/images/food-test.png";

  // Format giá tiền
  const formatPrice = (price?: number) => {
    if (!price) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)

    if (product?.quantity !== undefined && product.quantity <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      setIsAddingToCart(true);

      // Gọi API thêm vào giỏ hàng
      await CartService.addToCart({
        productId: product?.id || defaultProduct.id,
        quantity: 1,
      });

      // Hiển thị thông báo thành công
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error(
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="w-full border-2 border-slate-100 rounded-[20px]">
      <Link
        href={`/shop/product-detail/${product?.id}`}
        className="cursor-pointer"
      >
        <div className="relative aspect-square">
          <Image
            src={mainImage}
            alt={product?.name || defaultProduct.name}
            fill
            sizes="100%"
            className="object-cover rounded-t-[20px]"
          />
          {product?.quantity !== undefined && product.quantity <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-medium">Hết hàng</span>
            </div>
          )}
        </div>
        <div className="p-5 bg-slate-100 rounded-b-[20px]">
          <p className="mb-3 font-semibold line-clamp-2 h-12">
            {product?.name || defaultProduct.name}
          </p>
          <div className="flex flex-row justify-between items-center">
            <p className="text-pink-doca font-bold">
              {formatPrice(product?.price || defaultProduct.prices)}
            </p>
            <button
              data-cart-button="true"
              className={`p-2 rounded-full transition-colors ${
                isAddingToCart ||
                (product?.quantity !== undefined && product.quantity <= 0)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-pink-doca text-white hover:bg-pink-600"
              }`}
              onClick={handleAddToCart}
              disabled={
                isAddingToCart ||
                (product?.quantity !== undefined && product.quantity <= 0)
              }
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
