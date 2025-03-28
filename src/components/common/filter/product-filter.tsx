"use client";

import { useState, useEffect } from "react";
import { CategoryService } from "@/service/category-service";
import { toast } from "react-toastify";

interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Filters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  isHidden?: boolean;
}

interface ProductFilterProps {
  onFilterChange: (filters: Filters) => void;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });
  const [isHidden, setIsHidden] = useState<boolean | undefined>(undefined);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories({
          page: 1,
          size: 100,
        });

        if (response && response.data) {
          setCategories(response.data.items || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        toast.error("Không thể lấy danh sách danh mục");
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
  const handlePriceChange = (type: "min" | "max", value: string) => {
    setPriceRange((prev) => {
      const newRange = { ...prev, [type]: value };

      onFilterChange({
        minPrice: newRange.min ? Number(newRange.min) : undefined,
        maxPrice: newRange.max ? Number(newRange.max) : undefined,
      });

      return newRange;
    });
  };

  // Xử lý khi thay đổi trạng thái hiển thị
  const handleVisibilityChange = (value: boolean | undefined) => {
    setIsHidden(value);
    onFilterChange({ isHidden: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Danh mục */}
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
                  onChange={() => handleCategoryChange(category.id)}
                  className="rounded border-gray-300 text-pink-doca focus:ring-pink-doca"
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Khoảng giá */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Khoảng giá</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Giá tối thiểu
              </label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-doca focus:ring-pink-doca"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Giá tối đa
              </label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-doca focus:ring-pink-doca"
                placeholder="1000000"
              />
            </div>
          </div>
        </div>

        {/* Trạng thái hiển thị */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Trạng thái hiển thị
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={isHidden === undefined}
                onChange={() => handleVisibilityChange(undefined)}
                name="visibility"
                className="text-pink-doca focus:ring-pink-doca"
              />
              <span className="text-sm text-gray-600">Tất cả</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={isHidden === false}
                onChange={() => handleVisibilityChange(false)}
                name="visibility"
                className="text-pink-doca focus:ring-pink-doca"
              />
              <span className="text-sm text-gray-600">Đang hiển thị</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={isHidden === true}
                onChange={() => handleVisibilityChange(true)}
                name="visibility"
                className="text-pink-doca focus:ring-pink-doca"
              />
              <span className="text-sm text-gray-600">Đã ẩn</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
