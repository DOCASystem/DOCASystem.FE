"use client";

import { useState, useEffect, useCallback } from "react";
import CardProduct from "@/components/common/card/card-product/card-food";
import Pagination from "@/components/common/pagination/pagination";
import { GetProductDetailResponse } from "@/api/generated";
import { ProductService } from "@/service/product-service";

interface FilterProps {
  categories: string[];
  brands: string[];
  priceRange: number;
}

interface ProductListProps {
  filters?: FilterProps;
}

export default function ProductList({ filters }: ProductListProps) {
  const [products, setProducts] = useState<GetProductDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  // Convert fetchProducts to useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng API thực thay vì dữ liệu giả
      const categoryIds = filters?.categories?.length
        ? filters.categories
        : undefined;

      const minPrice = 0;
      const maxPrice = filters?.priceRange || 1000000;

      const response = await ProductService.getProducts({
        page: currentPage,
        size: pageSize,
        categoryIds,
        minPrice,
        maxPrice,
      });

      if (response.data.items) {
        setProducts(response.data.items);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]); // Include all dependencies

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // fetchProducts is now a dependency

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Cuộn trang lên đầu khi chuyển trang
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-10">
        <div className="text-pink-doca">
          <svg
            className="animate-spin h-8 w-8"
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      {products.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy sản phẩm
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Vui lòng thử điều chỉnh bộ lọc.
          </p>
        </div>
      ) : (
        <>
          {/* Hiển thị số lượng sản phẩm tìm thấy */}
          <div className="mb-4 text-sm text-gray-500">
            Tìm thấy {products.length} sản phẩm
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex justify-center">
                <div className="w-full max-w-xs">
                  <CardProduct product={product} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
