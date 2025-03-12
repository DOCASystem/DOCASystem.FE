"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductService } from "@/service/product-service";
import { toast } from "react-toastify";
import Button from "@/components/common/button/button";

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface ProductData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  volume: number;
  price: number;
  isHidden: boolean;
  createdAt: string;
  modifiedAt: string;
  productImages: {
    id: string;
    imageUrl: string;
    isMain: boolean;
  }[];
  categories: {
    id: string;
    name: string;
    description: string;
  }[];
}

function ViewProductContent() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Không tìm thấy ID sản phẩm");
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await ProductService.getProductById(productId);

        if (response) {
          setProduct(response as unknown as ProductData);
        } else {
          setError("Không tìm thấy thông tin sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        setError("Không thể lấy thông tin sản phẩm");
        toast.error("Không thể lấy thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Lấy hình ảnh chính của sản phẩm
  const getMainImage = () => {
    if (
      !product ||
      !product.productImages ||
      product.productImages.length === 0
    ) {
      return "/images/placeholder.png";
    }

    const mainImage = product.productImages.find((img) => img.isMain);
    return mainImage ? mainImage.imageUrl : product.productImages[0].imageUrl;
  };

  // Lấy tên danh mục
  const getCategoryNames = () => {
    if (!product || !product.categories || product.categories.length === 0) {
      return "Chưa phân loại";
    }

    return product.categories.map((cat) => cat.name).join(", ");
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button
          variant="primary"
          onClick={() => router.push("/products-management")}
        >
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4">Không tìm thấy thông tin sản phẩm</p>
        <Button
          variant="primary"
          onClick={() => router.push("/products-management")}
        >
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
        <div className="flex space-x-3">
          <Link href={`/products-management/edit/${product.id}`}>
            <Button variant="secondary">Chỉnh sửa</Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => router.push("/products-management")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="md:col-span-1">
          <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={getMainImage()}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {product.productImages && product.productImages.length > 1 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Hình ảnh khác</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.productImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative w-full h-20 rounded-md overflow-hidden border border-gray-200"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {image.isMain && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5">
                        Chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Danh mục:</p>
                <p className="font-medium">{getCategoryNames()}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Giá:</p>
                <p className="text-xl font-bold text-pink-600">
                  {product.price.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Số lượng trong kho:</p>
                <p className="font-medium">{product.quantity} sản phẩm</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Khối lượng:</p>
                <p className="font-medium">{product.volume || "Không có"} ml</p>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <p className="text-gray-600 mb-1">Trạng thái:</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    product.isHidden
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.isHidden ? "Đã ẩn" : "Đang hiển thị"}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Ngày tạo:</p>
                <p className="font-medium">{formatDate(product.createdAt)}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Cập nhật lần cuối:</p>
                <p className="font-medium">{formatDate(product.modifiedAt)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewProductPage() {
  return (
    <div className="container mx-auto p-4">
      <ViewProductContent />
    </div>
  );
}
