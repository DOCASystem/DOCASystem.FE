"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/shop/product-detail/${product.id}`}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* Hình ảnh sản phẩm */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0] || "/images/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-medium">Hết hàng</span>
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-pink-doca">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.stock > 0 && (
            <span className="text-sm text-green-600">
              Còn {product.stock} sản phẩm
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
