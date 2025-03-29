"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { CartService } from "@/service/cart-service";

// Interface cho Product Info component
interface ProductInfoProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  categoryName?: string;
  volume?: number;
}

export default function ProductInfo({
  id,
  name,
  description,
  price,
  originalPrice,
  discount,
  quantity,
  categoryName,
  volume,
}: ProductInfoProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Format giá tiền
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  };

  // Xử lý tăng giảm số lượng
  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (selectedQuantity < quantity) {
      setSelectedQuantity(selectedQuantity + 1);
    } else {
      toast.warning("Đã đạt số lượng tối đa có sẵn.");
    }
  };

  // Xử lý khi nhập số lượng trực tiếp
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (isNaN(value) || value < 1) {
      setSelectedQuantity(1);
    } else if (value > quantity) {
      setSelectedQuantity(quantity);
      toast.warning("Đã đạt số lượng tối đa có sẵn.");
    } else {
      setSelectedQuantity(value);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (selectedQuantity < 1 || selectedQuantity > quantity) {
      toast.error("Số lượng không hợp lệ");
      return;
    }

    try {
      setIsAddingToCart(true);

      await CartService.addToCart({
        productId: id,
        quantity: selectedQuantity,
      });

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
    <div className="flex flex-col space-y-4">
      {/* Tên sản phẩm */}
      <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>

      {/* Hiển thị giá */}
      <div className="flex items-center space-x-3 my-2">
        <span className="text-2xl font-bold text-pink-doca">
          {formatPrice(price)}
        </span>

        {originalPrice && originalPrice > price && (
          <span className="text-gray-500 line-through text-lg">
            {formatPrice(originalPrice)}
          </span>
        )}

        {discount && discount > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Danh mục */}
      {categoryName && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Danh mục:</span> {categoryName}
        </div>
      )}

      {/* Khối lượng/Dung tích */}
      {volume && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Khối lượng/Dung tích:</span> {volume} kg
        </div>
      )}

      {/* Số lượng tồn kho */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Tình trạng:</span>{" "}
        {quantity > 0 ? (
          <span className="text-green-600">Còn hàng ({quantity} sản phẩm)</span>
        ) : (
          <span className="text-red-600">Hết hàng</span>
        )}
      </div>

      {/* Mô tả sản phẩm */}
      <div className="my-4">
        <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
        <div className="text-gray-700 whitespace-pre-line">{description}</div>
      </div>

      {/* Chọn số lượng và thêm vào giỏ hàng */}
      {quantity > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Số lượng:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                className="px-3 py-1 bg-gray-100 border-r border-gray-300"
                onClick={decreaseQuantity}
                disabled={isAddingToCart}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={quantity}
                value={selectedQuantity}
                onChange={handleQuantityChange}
                className="w-12 text-center py-1 border-none focus:ring-0"
                disabled={isAddingToCart}
              />
              <button
                className="px-3 py-1 bg-gray-100 border-l border-gray-300"
                onClick={increaseQuantity}
                disabled={isAddingToCart}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || quantity <= 0}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-medium text-white transition-colors ${
              isAddingToCart || quantity <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-doca hover:bg-pink-600"
            }`}
          >
            {isAddingToCart ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Thêm vào giỏ hàng</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
