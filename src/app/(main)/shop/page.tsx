"use client";

import { useState } from "react";
import ShopHeader from "@/components/sections/shop/content-shop/shop-header";
import ProductFilter from "@/components/sections/shop/product-filter/filter/product-filter";
import ProductList from "@/components/sections/shop/product-list/product-list";

interface FilterProps {
  categories: string[];
  brands: string[];
  priceRange: number;
}

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterProps>({
    categories: [],
    brands: [],
    priceRange: 1000000,
  });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleFilterChange = (newFilters: FilterProps) => {
    setFilters(newFilters);
    // Đóng bộ lọc trên mobile sau khi áp dụng
    setShowMobileFilter(false);
  };

  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  return (
    <div>
      <ShopHeader />
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Nút hiển thị filter trên mobile */}
        <div className="flex justify-end mb-4 md:hidden">
          <button
            onClick={toggleMobileFilter}
            className="flex items-center gap-2 px-4 py-2 bg-pink-doca text-white rounded-md"
          >
            <span>{showMobileFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
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
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter trên mobile */}
          <div
            className={`md:hidden ${
              showMobileFilter ? "block" : "hidden"
            } transition-all duration-300 ease-in-out`}
          >
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>

          {/* Filter trên desktop - luôn hiển thị */}
          <div className="hidden md:block">
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>

          {/* Danh sách sản phẩm */}
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}
