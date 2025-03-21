"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cart-store";

interface ProductImage {
  id: string;
  imageUrl: string;
  isMain?: boolean;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
  status: string;
  categoryId: string;
  categoryName: string;
  userId: string;
  createdAt: string;
  modifiedAt: string;
  productImages: ProductImage[];
  salePrice?: number;
  shortDescription?: string;
  volume?: number;
  categories?: { id: string; name: string }[];
}

interface PriceInfo {
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
}

interface ProductInfoProps {
  product: ProductDetail;
  priceInfo: PriceInfo;
}

export default function ProductInfo({ product, priceInfo }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (newQuantity > Math.max(1, product.quantity)) {
      setQuantity(Math.max(1, product.quantity));
      return;
    }

    setQuantity(newQuantity);
  };

  // Tăng số lượng sản phẩm
  const increaseQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (product.quantity <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    // Lấy hình ảnh đầu tiên của sản phẩm (nếu có)
    const mainImage =
      product.productImages && product.productImages.length > 0
        ? product.productImages.find((img) => img.isMain)?.imageUrl ||
          product.productImages[0].imageUrl
        : "/images/product-placeholder.jpg";

    // Thêm sản phẩm vào giỏ hàng
    addItem({
      id: product.id,
      name: product.name,
      price: priceInfo.currentPrice,
      quantity: quantity,
      imageUrl: mainImage,
    });

    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  // Thông tin chi tiết sản phẩm
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

      {/* Giá sản phẩm */}
      <div className="mb-6">
        {priceInfo.discountPercentage > 0 ? (
          <div className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-pink-doca">
              {formatPrice(priceInfo.currentPrice)}
            </span>
            <span className="text-gray-500 line-through ml-2">
              {formatPrice(priceInfo.originalPrice)}
            </span>
            <span className="ml-2 bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
              -{priceInfo.discountPercentage}%
            </span>
          </div>
        ) : (
          <span className="text-xl md:text-2xl font-bold text-pink-doca">
            {formatPrice(priceInfo.originalPrice)}
          </span>
        )}
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
        <div className="text-gray-700 whitespace-pre-line">
          {product.description}
        </div>
      </div>

      {/* Thông tin thêm */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Thông tin chi tiết</h2>
        <ul className="space-y-2 text-gray-700">
          {product.volume !== undefined && (
            <li className="flex">
              <span className="font-medium w-32">Khối lượng:</span>
              <span>{product.volume} kg</span>
            </li>
          )}
          <li className="flex">
            <span className="font-medium w-32">Tình trạng:</span>
            <span>
              {product.quantity > 0
                ? `Còn hàng (${product.quantity})`
                : "Hết hàng"}
            </span>
          </li>
          {product.categories && product.categories.length > 0 && (
            <li className="flex">
              <span className="font-medium w-32">Danh mục:</span>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Nút thêm vào giỏ hàng */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md">
            <button
              onClick={decreaseQuantity}
              className="w-10 h-10 flex items-center justify-center border-r text-gray-600 hover:text-pink-doca"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              min="1"
              max="100"
              className="w-14 h-10 text-center focus:outline-none"
            />
            <button
              onClick={increaseQuantity}
              className="w-10 h-10 flex items-center justify-center border-l text-gray-600 hover:text-pink-doca"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className={`flex-1 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 ${
              product.quantity <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-doca hover:bg-pink-700"
            }`}
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {product.quantity <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}
