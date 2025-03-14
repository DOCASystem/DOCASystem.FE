"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductService } from "@/service/product-service";
import RecommendProducts from "@/components/sections/shop/recommend-products/recommend-products";
import { useCartStore } from "@/store/cart-store";
import { useProductStore, Product } from "@/store/product-store";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { getToken } from "@/auth/auth-service";
import { REAL_API_BASE_URL } from "@/utils/api-config";

// Định nghĩa interface ProductDetail để phù hợp với dữ liệu API trả về
interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  quantity: number;
  volume: number;
  price: number;
  createdAt: string;
  modifiedAt: string;
  isHidden: boolean;
  productImages: ProductImage[];
  categories: Category[];
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFromCache, setIsFromCache] = useState(false);

  // Lấy hàm addItem từ cart store
  const addItem = useCartStore((state) => state.addItem);

  // Lấy product từ product store & saveProduct, nhưng KHÔNG đưa vào dependency array
  const getProduct = useProductStore((state) => state.getProduct);
  const saveProduct = useProductStore((state) => state.saveProduct);

  // Bọc hàm fetchProductDetail trong useCallback để tránh tạo hàm mới mỗi lần render
  const fetchProductDetail = useCallback(async () => {
    setLoading(true);
    try {
      // Log ID sản phẩm để debug
      console.log(`Đang tải thông tin sản phẩm với ID: ${params.id}`);

      // Kiểm tra trong cache trước
      const cachedProduct = getProduct(params.id);
      if (cachedProduct) {
        console.log("Sử dụng thông tin sản phẩm từ cache:", cachedProduct);
        setProduct(cachedProduct as ProductDetail);
        setIsFromCache(true);
        setLoading(false);

        // Vẫn tiếp tục tải API trong background để cập nhật dữ liệu mới nhất
        fetchFromApi().catch((err) => {
          console.log("Lỗi khi tải dữ liệu mới trong background:", err);
        });
        return;
      }

      // Nếu không có trong cache, gọi API
      await fetchFromApi();
    } catch (err: unknown) {
      console.error("Chi tiết lỗi khi tải sản phẩm:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
        response: (err as AxiosError)?.response,
      });

      const errorMessage =
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
        (err instanceof Error ? err.message : "Unknown error") ||
        "Không thể tải thông tin sản phẩm";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params.id]); // Chỉ phụ thuộc vào params.id

  // Tách riêng phần fetch API để tránh vòng lặp vô hạn
  const fetchFromApi = async () => {
    try {
      const token = getToken();
      const apiUrl = `${REAL_API_BASE_URL}/api/v1/products/${params.id}`;
      console.log(`Gọi API sản phẩm: ${apiUrl}`);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(apiUrl, {
        headers,
        timeout: 10000, // 10 giây timeout
      });

      if (response.data) {
        console.log("API trả về dữ liệu thành công:", response.data);

        // Kiểm tra và xử lý dữ liệu
        const productData = response.data as ProductDetail;

        if (productData && productData.id) {
          // Lưu sản phẩm vào store để dùng sau này
          saveProduct(productData as Product);

          setProduct(productData);
          setIsFromCache(false);
          return true; // Thành công
        } else {
          throw new Error("Dữ liệu sản phẩm không hợp lệ");
        }
      }
      return false;
    } catch (apiError) {
      console.error("Lỗi khi gọi API sản phẩm:", apiError);

      // Thử dùng ProductService
      try {
        console.log("Thử dùng ProductService...");
        const serviceResponse = await ProductService.getProductById(params.id);

        if (serviceResponse && serviceResponse.data) {
          console.log(
            "ProductService trả về dữ liệu thành công:",
            serviceResponse.data
          );

          // Kiểm tra và xử lý dữ liệu
          const productData = serviceResponse.data as ProductDetail;

          if (productData && productData.id) {
            // Lưu sản phẩm vào store
            saveProduct(productData as Product);

            setProduct(productData);
            setIsFromCache(false);
            return true; // Thành công
          }
        }
      } catch (serviceError) {
        console.error("Lỗi khi dùng ProductService:", serviceError);
        throw serviceError; // Ném lỗi để xử lý bên ngoài
      }

      // Nếu cả hai phương pháp đều thất bại
      throw new Error("Không thể lấy thông tin sản phẩm");
    }
  };

  // Chỉ phụ thuộc vào fetchProductDetail (đã được bọc trong useCallback)
  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleAddToCart = () => {
    if (product) {
      try {
        // Lấy URL ảnh chính của sản phẩm
        const imageUrl =
          product.productImages && product.productImages.length > 0
            ? product.productImages.find((img) => img.isMain)?.imageUrl ||
              product.productImages[0].imageUrl ||
              "/images/food-test.png"
            : "/images/food-test.png";

        // Thêm sản phẩm vào giỏ hàng
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageUrl: imageUrl,
        });

        // Hiển thị thông báo thành công
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      } catch (err: unknown) {
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
      ? product.productImages.find((img) => img.isMain)?.imageUrl ||
        product.productImages[0].imageUrl ||
        "/images/food-test.png"
      : "/images/food-test.png";

  const otherImages = product.productImages
    ? product.productImages
        .filter((img) => !img.isMain)
        .map((img) => img.imageUrl)
    : [];

  // Bọc phần render chính trong try-catch để tránh lỗi không hiển thị trong sản phẩm
  try {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 sm:px-6 lg:px-8">
        {isFromCache && (
          <div className="mb-4 bg-yellow-50 p-3 rounded-md text-yellow-700 text-sm border border-yellow-200">
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
              Đang hiển thị từ phiên bản đã lưu. Một số thông tin như giá cả, số
              lượng có thể không chính xác.
            </p>
          </div>
        )}

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
                {otherImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square w-full rounded-lg overflow-hidden"
                  >
                    <Image
                      src={imgUrl || "/images/food-test.png"}
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

            {/* Hiển thị danh mục sản phẩm */}
            {product.categories && product.categories.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-500">
                  Danh mục:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <span
                      key={category.id}
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
  } catch (renderError: unknown) {
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
