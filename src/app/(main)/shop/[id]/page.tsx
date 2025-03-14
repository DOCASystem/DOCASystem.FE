"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetProductDetailResponse } from "@/api/generated";
import { ProductService } from "@/service/product-service";
import RecommendProducts from "@/components/sections/shop/recommend-products/recommend-products";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-toastify";
import axios from "axios";
import { getToken } from "@/auth/auth-service";
import { REAL_API_BASE_URL } from "@/utils/api-config";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<GetProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Lấy hàm addItem từ store
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        // Log ID sản phẩm để debug
        console.log(`Đang tải thông tin sản phẩm với ID: ${params.id}`);

        // Thử gọi API trực tiếp bằng axios trước
        const token = getToken();
        const directApiUrl = `${REAL_API_BASE_URL}/api/v1/products/${params.id}`;

        console.log(`Gọi API trực tiếp: ${directApiUrl}`);

        try {
          const response = await axios.get(directApiUrl, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            timeout: 10000, // 10 giây timeout
          });

          console.log("API response:", response);

          if (response.data) {
            setProduct(response.data);
          } else {
            throw new Error("Không nhận được dữ liệu từ API");
          }
        } catch (directApiError) {
          console.error("Lỗi khi gọi API trực tiếp:", directApiError);

          // Nếu gọi trực tiếp thất bại, thử dùng ProductService
          console.log("Thử dùng ProductService...");
          const serviceResponse = await ProductService.getProductById(
            params.id
          );

          if (serviceResponse && serviceResponse.data) {
            setProduct(serviceResponse.data);
          } else {
            throw new Error("Không nhận được dữ liệu từ ProductService");
          }
        }
      } catch (err: any) {
        console.error("Chi tiết lỗi khi tải sản phẩm:", {
          message: err.message,
          stack: err.stack,
          response: err.response,
        });

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Không thể tải thông tin sản phẩm";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      try {
        // Lấy URL ảnh chính của sản phẩm
        const imageUrl =
          product.productImages && product.productImages.length > 0
            ? product.productImages[0].imageUrl || "/images/food-test.png"
            : "/images/food-test.png";

        // Thêm sản phẩm vào giỏ hàng
        addItem({
          id: product.id || "",
          name: product.name || "",
          price: product.price || 0,
          quantity: quantity,
          imageUrl: imageUrl,
        });

        // Hiển thị thông báo thành công
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      } catch (err: any) {
        console.error("Lỗi khi thêm vào giỏ hàng:", err);
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && product && newQuantity <= (product.quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca mb-4"></div>
          <p className="text-lg">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-16 px-4 sm:px-6 text-center">
        <div className="bg-white rounded-lg p-8 shadow-md max-w-lg mx-auto">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-bold mb-4">
            Không thể hiển thị sản phẩm
          </h2>
          <div className="text-red-500 mb-6 text-sm">
            {error ||
              "Không tìm thấy thông tin sản phẩm hoặc sản phẩm không tồn tại"}
          </div>
          <Link
            href="/shop"
            className="inline-block bg-pink-doca text-white px-6 py-3 rounded-md hover:bg-pink-600 transition-colors"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  // Format giá tiền
  const formatPrice = (price?: number) => {
    if (!price) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Lấy URL ảnh chính và các ảnh phụ
  const mainImage =
    product.productImages && product.productImages.length > 0
      ? product.productImages[0].imageUrl || "/images/food-test.png"
      : "/images/food-test.png";

  const otherImages = product.productImages?.slice(1) || [];

  // Bọc phần render chính trong try-catch để tránh lỗi không hiển thị trong sản phẩm
  try {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 md:mb-6">
          <Link
            href="/shop"
            className="text-gray-600 hover:text-pink-doca flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Quay lại cửa hàng
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Phần ảnh sản phẩm */}
          <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name || "Sản phẩm"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={true}
              />
            </div>

            {otherImages.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {otherImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square w-full rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img.imageUrl || "/images/food-test.png"}
                      alt={`${product.name} - Ảnh ${index + 2}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phần thông tin sản phẩm */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <p className="text-xl md:text-2xl font-bold text-pink-doca">
                {formatPrice(product.price)}
              </p>
              {product.quantity && product.quantity > 0 ? (
                <p className="text-green-600 mt-1">
                  Còn {product.quantity} sản phẩm trong kho
                </p>
              ) : (
                <p className="text-red-500 mt-1">Hết hàng</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line">
                  {product.description || "Chưa có mô tả cho sản phẩm này"}
                </p>
              </div>
            </div>

            {product.quantity && product.quantity > 0 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Số lượng</h3>
                  <div className="flex items-center">
                    <button
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-md"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-16 px-3 py-1 text-center border-gray-200 border-y"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      min={1}
                      max={product.quantity}
                    />
                    <button
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-md"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.quantity || 0)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-pink-doca text-white py-3 px-6 rounded-md hover:bg-pink-600 transition-colors w-full md:w-auto shadow-sm"
                >
                  Thêm vào giỏ hàng
                </button>
              </>
            )}
          </div>
        </div>

        {/* Phần sản phẩm đề xuất */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-2">
            Sản phẩm tương tự
          </h2>
          <RecommendProducts currentProductId={params.id} />
        </div>
      </div>
    );
  } catch (renderError: any) {
    console.error("Lỗi khi render trang chi tiết sản phẩm:", renderError);
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-lg p-6 shadow-md max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">
            Đã xảy ra lỗi khi hiển thị sản phẩm
          </h2>
          <p className="mb-6">
            Vui lòng thử lại sau hoặc liên hệ với quản trị viên.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-pink-doca text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }
}
