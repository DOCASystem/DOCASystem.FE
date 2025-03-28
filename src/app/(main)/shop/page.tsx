"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductService } from "@/service/product-service";
import { toast } from "react-toastify";
import ShopProductFilter, {
  ShopFilters,
} from "@/components/common/filter/shop-product-filter";
import Pagination from "@/components/common/pagination/pagination";

interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  volume: number;
  price: number;
  isHidden: boolean;
  productImages: ProductImage[];
  categories: Category[];
  createdAt: string;
}

interface ProductResponseIPaginate {
  items: Product[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  size: number;
}

// Hàm trình xử lý lỗi hình ảnh
const fallbackImageUrl = "/images/placeholder.png";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 12,
  });
  const [filters, setFilters] = useState<ShopFilters>({});

  // Lấy danh sách sản phẩm
  const fetchProducts = useCallback(
    async (page = 1) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await ProductService.getProducts({
          page,
          size: pagination.pageSize,
          ...filters,
        });

        if (response && response.data) {
          const data = response.data as ProductResponseIPaginate;

          if (Array.isArray(data.items)) {
            setProducts(data.items);
            setPagination({
              currentPage: data.currentPage || 1,
              totalPages: data.totalPages || 1,
              totalItems: data.totalItems || 0,
              pageSize: data.size || pagination.pageSize,
            });
          } else {
            console.error("Dữ liệu trả về không hợp lệ:", data);
            toast.error("Dữ liệu sản phẩm không hợp lệ", {
              toastId: "invalid-data-error",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        toast.error("Không thể lấy danh sách sản phẩm", {
          toastId: "fetch-products-error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.pageSize, filters]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Xử lý khi thay đổi filter
  const handleFilterChange = useCallback((newFilters: ShopFilters) => {
    setFilters(newFilters);
    // Reset về trang 1 khi thay đổi filter
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Xử lý khi thay đổi trang
  const handlePageChange = useCallback(
    (page: number) => {
      fetchProducts(page);
    },
    [fetchProducts]
  );

  // Lấy hình ảnh chính của sản phẩm
  const getMainImage = (product: Product) => {
    const mainImage = product.productImages?.find((img) => img.isMain);
    return mainImage?.imageUrl || fallbackImageUrl;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-pink-doca mb-6">Cửa hàng</h1>

      {/* Filter */}
      <ShopProductFilter onFilterChange={handleFilterChange} />

      {/* Danh sách sản phẩm */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-doca"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/product-detail/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <div className="relative h-48">
                    <Image
                      src={getMainImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-pink-doca">
                        {product.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                      {product.quantity > 0 ? (
                        <span className="text-sm text-green-600">
                          Còn {product.quantity} sản phẩm
                        </span>
                      ) : (
                        <span className="text-sm text-red-600">Hết hàng</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
        </div>
      )}
    </div>
  );
}
