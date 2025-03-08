"use client";

import { useState, useEffect } from "react";
import CardProduct from "@/components/common/card/card-product/card-food";
import Pagination from "@/components/common/pagination/pagination";
import { GetProductDetailResponse } from "@/api/generated";
import { getPaginatedProducts } from "@/mock/products";

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

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Sử dụng dữ liệu giả thay vì gọi API
      const categoryIds = filters?.categories?.length
        ? filters.categories
        : undefined;

      const minPrice = 0;
      const maxPrice = filters?.priceRange || 1000000;

      const response = getPaginatedProducts(currentPage, pageSize, {
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
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="w-full text-center py-10">Đang tải...</div>;
  }

  return (
    <div className="flex-1">
      {products.length === 0 ? (
        <div className="text-center py-10">Không tìm thấy sản phẩm</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <CardProduct key={product.id} product={product} />
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
