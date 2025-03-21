"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cart-store";

interface ProductImage {
  id: string;
  imageUrl: string;
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
    if (newQuantity > 0 && product && newQuantity <= (product.quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (product) {
      try {
        // Lấy URL ảnh chính của sản phẩm
        const imageUrl =
          product.productImages && product.productImages.length > 0
            ? product.productImages[0].imageUrl ||
              "/images/product-placeholder.jpg"
            : "/images/product-placeholder.jpg";

        // Thêm sản phẩm vào giỏ hàng
        addItem({
          id: product.id,
          name: product.name,
          price: priceInfo.currentPrice,
          quantity: quantity,
          imageUrl: imageUrl,
        });

        // Hiển thị thông báo thành công
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      } catch (err: unknown) {
        console.error("[Product Detail] Lỗi khi thêm vào giỏ hàng:", err);
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      }
    }
  };

  // Format ngày
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {/* Hiển thị giá */}
      <div className="flex items-baseline mb-6">
        <span className="text-2xl font-bold text-pink-doca mr-2">
          {formatPrice(priceInfo.currentPrice)}
        </span>

        {priceInfo.discountPercentage > 0 && (
          <>
            <span className="text-lg text-gray-500 line-through mr-2">
              {formatPrice(priceInfo.originalPrice)}
            </span>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{priceInfo.discountPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="mb-6">
        <ul className="space-y-2">
          <li className="flex">
            <span className="w-32 text-gray-600">Danh mục:</span>
            <span className="font-medium">
              {product.categoryName || "Chưa phân loại"}
            </span>
          </li>
          <li className="flex">
            <span className="w-32 text-gray-600">Trạng thái:</span>
            <span className="font-medium">
              {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </li>
          <li className="flex">
            <span className="w-32 text-gray-600">Số lượng có sẵn:</span>
            <span className="font-medium">{product.quantity} sản phẩm</span>
          </li>
          {product.createdAt && (
            <li className="flex">
              <span className="w-32 text-gray-600">Ngày đăng:</span>
              <span className="font-medium">
                {formatDate(product.createdAt)}
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Số lượng và nút thêm vào giỏ hàng */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <label htmlFor="quantity" className="mr-4 text-gray-700">
            Số lượng:
          </label>
          <div className="flex border border-gray-300 rounded">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-12 h-8 text-center border-x border-gray-300"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              disabled={quantity >= product.quantity}
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.quantity || product.quantity <= 0}
          className={`w-full py-3 px-4 ${
            product.quantity > 0
              ? "bg-pink-doca hover:bg-pink-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white rounded-lg transition-colors`}
        >
          {product.quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
        </button>
      </div>

      {/* Mô tả ngắn */}
      {product.shortDescription && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Mô tả ngắn</h2>
          <div className="text-gray-700">{product.shortDescription}</div>
        </div>
      )}
    </div>
  );
}
