"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ImageGallery from "@/components/sections/shop/product-detail/image-gallery";
import ProductInfo from "@/components/sections/shop/product-detail/product-info";
import RelatedProducts from "@/components/sections/shop/product-detail/related-products";

// Định nghĩa interface cho Product Detail và các thành phần liên quan
interface ProductImage {
  id: string;
  imageUrl: string;
  isMain?: boolean;
}

interface ProductCategory {
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
  categories?: ProductCategory[];
  volume?: number;
  isHidden?: boolean;
}

// Interface cho API error response
interface ApiErrorDetail {
  status: number;
  message: string;
  details?: string;
  timestamp?: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDetail | null>(null);
  const router = useRouter();

  // Sử dụng một phương thức duy nhất để lấy chi tiết sản phẩm khi vào trang
  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // Tải thông tin sản phẩm với ID từ URL
        console.log(
          `[Product Detail] Đang tải thông tin sản phẩm với ID: ${params.id}`
        );

        // Gọi API từ production.doca.love
        const apiUrl = `https://production.doca.love/api/v1/products/${params.id}`;
        console.log(`[Product Detail] Gọi API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        // Log thông tin response
        console.log(
          `[Product Detail] Response status: ${response.status} ${response.statusText}`
        );

        // Lấy dữ liệu response
        const data = await response.json().catch(() => null);

        // Kiểm tra nếu response thành công
        if (response.ok && data) {
          console.log(`[Product Detail] API thành công, dữ liệu:`, {
            id: data.id,
            name: data.name,
            price: data.price,
            categories: data.categories
              ?.map((c: { name: string }) => c.name)
              .join(", "),
          });
          setProduct(data);
        } else {
          console.error(
            `[Product Detail] API không thành công (${response.status}):`,
            data
          );

          // Xử lý các lỗi
          const errorDetail = {
            status: response.status,
            message: data?.message || `Lỗi ${response.status} từ server`,
            details: data?.details || `API trả về lỗi ${response.status}`,
          };

          throw errorDetail;
        }
      } catch (err: unknown) {
        console.error("[Product Detail] Chi tiết lỗi:", err);

        // Chuẩn hóa đối tượng error
        const errorDetail: ApiErrorDetail = {
          status:
            err && typeof err === "object" && "status" in err
              ? (err.status as number)
              : 0,
          message:
            err && typeof err === "object" && "message" in err
              ? (err.message as string)
              : "Không thể tải thông tin sản phẩm",
          details:
            err && typeof err === "object" && "details" in err
              ? (err.details as string)
              : "Đã xảy ra lỗi khi tải thông tin sản phẩm.",
        };

        setError(errorDetail);

        // Thông báo cho người dùng
        toast.error(errorDetail.message);

        // Nếu là lỗi xác thực, chuyển hướng đến trang đăng nhập sau 2 giây
        if (errorDetail.status === 401 || errorDetail.status === 403) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    // Gọi hàm tải dữ liệu
    fetchProductDetail();
  }, [params.id, router]);

  // Tính toán các mức giá sản phẩm nếu có khuyến mãi
  const priceInfo = useMemo(() => {
    if (!product)
      return { currentPrice: 0, originalPrice: 0, discountPercentage: 0 };

    const originalPrice = product.price || 0;
    let currentPrice = originalPrice;
    let discountPercentage = 0;

    // Nếu có giảm giá và là giá trị số hợp lệ
    if (
      product.salePrice !== undefined &&
      typeof product.salePrice === "number" &&
      product.salePrice < originalPrice
    ) {
      currentPrice = product.salePrice;
      discountPercentage = Math.round(
        ((originalPrice - currentPrice) / originalPrice) * 100
      );
    }

    return {
      currentPrice,
      originalPrice,
      discountPercentage,
    };
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca mb-4"></div>
          <p className="text-lg">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-20 text-center">
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
          <p className="text-red-500 mb-4">
            {error?.message || "Không thể tải thông tin sản phẩm"}
          </p>
          {error?.details && (
            <p className="mb-6 text-sm text-gray-600">{error.details}</p>
          )}
          {error?.status === 500 && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                Máy chủ đang gặp lỗi. Vui lòng thử lại sau.
              </p>
            </div>
          )}
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="bg-pink-doca text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Quay lại cửa hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Đường dẫn breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-pink-doca">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-pink-doca">
          Cửa hàng
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">
          {product.name}
        </span>
      </div>

      {/* Chi tiết sản phẩm */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ảnh sản phẩm */}
          <div>
            <ImageGallery
              images={product.productImages || []}
              productName={product.name}
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div>
            <ProductInfo product={product} priceInfo={priceInfo} />
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-8">
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}
