"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Lấy hàm addItem từ store
  const addItem = useCartStore((state) => state.addItem);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)

    // Thêm sản phẩm vào giỏ hàng
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0] || "/images/placeholder.png",
    });

    // Hiển thị thông báo thành công
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
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
              className="bg-pink-doca text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
              onClick={handleAddToCart}
            >
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
      </Link>
    </div>
  );
}
