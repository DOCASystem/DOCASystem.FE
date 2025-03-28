"use client";

import { useState, useEffect, Suspense } from "react";
import { ProductService } from "@/service/product-service";
import { toast } from "react-toastify";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ShopFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
}

interface ShopProductFilterProps {
  onFilterChange: (filters: ShopFilters) => void;
}

type SortByType = "price" | "name";
type SortOrderType = "asc" | "desc";

// Component cho phần danh mục
const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryChange,
}: {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (id: string) => void;
}) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-2">Danh mục</h3>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {categories.map((category) => (
        <label
          key={category.id}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(category.id)}
            onChange={() => onCategoryChange(category.id)}
            className="rounded border-gray-300 text-pink-doca focus:ring-pink-doca"
          />
          <span className="text-sm text-gray-600">{category.name}</span>
        </label>
      ))}
    </div>
  </div>
);

// Component cho phần khoảng giá
const PriceRangeFilter = ({
  priceRange,
  onPriceChange,
}: {
  priceRange: [number, number];
  onPriceChange: (value: number | number[]) => void;
}) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-2">Khoảng giá</h3>
    <div className="space-y-4">
      <Slider
        range
        min={0}
        max={1000000}
        step={10000}
        value={priceRange}
        onChange={onPriceChange}
        railStyle={{ backgroundColor: "#e5e7eb" }}
        trackStyle={[{ backgroundColor: "#ec4899" }]}
        handleStyle={[
          { borderColor: "#ec4899", backgroundColor: "#fff" },
          { borderColor: "#ec4899", backgroundColor: "#fff" },
        ]}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{priceRange[0].toLocaleString("vi-VN")} VNĐ</span>
        <span>{priceRange[1].toLocaleString("vi-VN")} VNĐ</span>
      </div>
    </div>
  </div>
);

// Component cho phần sắp xếp
const SortFilter = ({
  sortBy,
  sortOrder,
  onSortChange,
}: {
  sortBy: SortByType;
  sortOrder: SortOrderType;
  onSortChange: (by: SortByType, order: SortOrderType) => void;
}) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-2">Sắp xếp</h3>
    <div className="space-y-2">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortByType, sortOrder)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-doca focus:ring-pink-doca"
      >
        <option value="name">Tên sản phẩm</option>
        <option value="price">Giá</option>
      </select>
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={sortOrder === "asc"}
            onChange={() => onSortChange(sortBy, "asc")}
            name="sortOrder"
            className="text-pink-doca focus:ring-pink-doca"
          />
          <span className="text-sm text-gray-600">Tăng dần</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={sortOrder === "desc"}
            onChange={() => onSortChange(sortBy, "desc")}
            name="sortOrder"
            className="text-pink-doca focus:ring-pink-doca"
          />
          <span className="text-sm text-gray-600">Giảm dần</span>
        </label>
      </div>
    </div>
  </div>
);

// Loading component
const FilterLoading = () => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function ShopProductFilter({
  onFilterChange,
}: ShopProductFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<SortByType>("name");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("asc");
  const [isLoading, setIsLoading] = useState(true);

  // Lấy danh sách danh mục từ API sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ProductService.getProducts({
          page: 1,
          size: 100,
        });

        if (response?.data?.items) {
          // Lấy tất cả danh mục từ các sản phẩm
          const allCategories = response.data.items
            .flatMap((product) => product.categories || [])
            .filter((category): category is Category => {
              return (
                category !== null &&
                category !== undefined &&
                typeof category.id === "string" &&
                typeof category.name === "string" &&
                typeof category.description === "string"
              );
            });

          // Lọc danh mục trùng lặp
          const uniqueCategories = allCategories.filter(
            (category, index, self) =>
              index === self.findIndex((c) => c.id === category.id)
          );

          // Sắp xếp danh mục theo tên
          uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        toast.error("Không thể lấy danh sách danh mục");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý khi thay đổi danh mục
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      onFilterChange({
        categoryIds: newCategories.length > 0 ? newCategories : undefined,
      });

      return newCategories;
    });
  };

  // Xử lý khi thay đổi khoảng giá
  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange(value as [number, number]);
      onFilterChange({
        minPrice: value[0],
        maxPrice: value[1],
      });
    }
  };

  // Xử lý khi thay đổi sắp xếp
  const handleSortChange = (by: SortByType, order: SortOrderType) => {
    setSortBy(by);
    setSortOrder(order);
    onFilterChange({ sortBy: by, sortOrder: order });
  };

  if (isLoading) {
    return <FilterLoading />;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
          }
        >
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
          }
        >
          <PriceRangeFilter
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
          }
        >
          <SortFilter
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </Suspense>
      </div>
    </div>
  );
}
