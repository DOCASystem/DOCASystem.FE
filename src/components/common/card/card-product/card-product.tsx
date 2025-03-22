"use client";

import Image from "next/image";
import Link from "next/link";
import { GetProductDetailResponse } from "@/api/generated";

interface CardProductProps {
  product: GetProductDetailResponse;
}

export default function CardProduct({ product }: CardProductProps) {
  // Lấy URL ảnh chính của sản phẩm (nếu có)
  const mainImage =
    product.productImages && product.productImages.length > 0
      ? product.productImages[0].imageUrl || "/images/food-test.png"
      : "/images/food-test.png"; // Ảnh mặc định nếu không có

  // Format giá tiền
  const formatPrice = (price?: number) => {
    if (!price) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link href={`/shop/product-detail/${product.id}`}>
      <div className="w-full border-2 border-slate-100 rounded-[20px] transition-transform hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-square">
          <Image
            src={mainImage}
            alt={product.name || "Sản phẩm"}
            fill
            sizes="100%"
            className="object-cover rounded-t-[20px]"
          />
        </div>
        <div className="p-5 bg-slate-100 rounded-b-[20px]">
          <p className="mb-3 font-semibold line-clamp-2 h-12">{product.name}</p>
          <div className="flex flex-row justify-between items-center">
            <p className="text-pink-doca font-bold">
              {formatPrice(product.price)}
            </p>
            <button className="bg-pink-doca text-white p-2 rounded-full hover:bg-pink-600 transition-colors">
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
                <path d="M9 20h6" />
                <path d="M12 16v4" />
                <path d="M6.33 12h11.34" />
                <path d="M5 10 2 7l3-3" />
                <path d="m19 10 3-3-3-3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
