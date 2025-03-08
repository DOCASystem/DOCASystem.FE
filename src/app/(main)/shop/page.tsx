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

  const handleFilterChange = (newFilters: FilterProps) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <ShopHeader />
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-4">
          <ProductFilter onFilterChange={handleFilterChange} />
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}
