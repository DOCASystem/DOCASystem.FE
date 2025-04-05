"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProductService } from "@/service/product-service";
import { Product, mapApiToProduct } from "@/types/product";
import ShopProductFilter, {
  ShopFilters,
} from "@/components/common/filter/shop-product-filter";
import ProductList from "@/components/sections/shop/product-list";
import ShopHeader from "@/components/sections/shop/content-shop/shop-header";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ShopFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Tạo ref cho phần sản phẩm
  const productsRef = useRef<HTMLDivElement>(null);

  // Hàm scroll đến phần sản phẩm
  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Fetch sản phẩm với các filter
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ProductService.getProducts({
        page: currentPage,
        size: 12,
        categoryIds: filters.categoryIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });

      if (response?.data?.items) {
        // Chuyển đổi API response sang kiểu dữ liệu Product
        const mappedProducts = response.data.items
          .filter((item) => item && item.id) // Lọc các item không hợp lệ
          .map((item) => mapApiToProduct(item))
          .filter(Boolean) as Product[]; // Filter null products after mapping

        setProducts(mappedProducts);

        // Cập nhật thông tin phân trang
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Lấy sản phẩm khi component mount hoặc filters thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Xử lý thay đổi filter
  const handleFilterChange = (newFilters: ShopFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Truyền hàm scrollToProducts vào ShopHeader */}
      <ShopHeader scrollToProducts={scrollToProducts} />

      <div className="container mx-auto px-4 py-8">
        {/* Thêm ref vào phần tiêu đề sản phẩm */}
        <h1 ref={productsRef} className="text-3xl font-bold mb-8 text-center">
          Sản phẩm của DOCA
        </h1>

        {/* Filter */}
        <ShopProductFilter onFilterChange={handleFilterChange} />

        {/* Danh sách sản phẩm */}
        <ProductList products={products} isLoading={isLoading} />

        {/* Phân trang */}
        {!isLoading && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center justify-center">
              <ul className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? "bg-pink-doca text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
