"use client";

import Link from "next/link";
import Image from "next/image";
import { GetProductDetailResponse } from "@/api/generated";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-toastify";

interface CardProductProps {
  product: GetProductDetailResponse;
}

export default function CardProduct({ product }: CardProductProps) {
  // Lấy trực tiếp hàm addItem từ store, không cần định nghĩa type phức tạp
  const addItem = useCartStore((state) => state.addItem);

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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển trang)

    // Thêm sản phẩm vào giỏ hàng với kiểu dữ liệu CartItem
    addItem({
      id: product?.id || defaultProduct.id,
      name: product?.name || defaultProduct.name,
      price: product?.price || defaultProduct.prices,
      quantity: 1,
      imageUrl: mainImage,
    });

    // Hiển thị thông báo thành công
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  return (
    <div className="w-full border-2 border-slate-100 rounded-[20px]">
      <Link href={`/shop/${product?.id || defaultProduct.id}`}>
        <div className="relative aspect-square">
          <Image
            src={mainImage}
            alt={product?.name || defaultProduct.name}
            fill
            sizes="100%"
            className="object-cover rounded-t-[20px]"
          />
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
