"use client";

import { useState } from "react";
import Checkbox from "@/components/common/checkbox/checkbox";
import PriceSlider from "../slice/price-slice";
import Button from "@/components/common/button/button";

// Định nghĩa kiểu dữ liệu bộ lọc
interface FilterProps {
  categories: string[];
  brands: string[];
  priceRange: number;
}

// Định nghĩa kiểu dữ liệu cho props của ProductFilter
interface ProductFilterProps {
  onFilterChange: (filters: FilterProps) => void;
}

const info1 = [
  { id: 1, label: "Đồ ăn cho chó", checked: false, itemCount: 10 },
  { id: 2, label: "Đồ ăn cho mèo", checked: false, itemCount: 10 },
];

const info2 = [
  { id: 1, label: "Natural food", checked: false, itemCount: 10 },
  { id: 2, label: "Pet care", checked: false, itemCount: 10 },
  { id: 3, label: "Dogs friend", checked: false, itemCount: 10 },
  { id: 4, label: "Pet food", checked: false, itemCount: 10 },
  { id: 5, label: "Favourite pet", checked: false, itemCount: 10 },
  { id: 6, label: "Green line", checked: false, itemCount: 10 },
];

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    brands: true,
  });

  const handleCategoryChange = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const handleBrandChange = (label: string) => {
    setSelectedBrands((prev) =>
      prev.includes(label) ? prev.filter((b) => b !== label) : [...prev, label]
    );
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange,
    });
  };

  const toggleSection = (section: "price" | "categories" | "brands") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full md:w-[250px] lg:w-[306px] flex flex-col gap-3 md:gap-4 p-4 bg-white rounded-lg shadow-sm md:border-r">
      <div className="border-b pb-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("price")}
        >
          <h3 className="font-bold text-base">Giá</h3>
          <span className="text-gray-500">
            {expandedSections.price ? "−" : "+"}
          </span>
        </div>

        {expandedSections.price && (
          <div className="mt-3">
            <PriceSlider
              min={0}
              max={1000000}
              step={10000}
              onChange={handlePriceChange}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>0đ</span>
              <span>{priceRange.toLocaleString()}đ</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-b pb-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("categories")}
        >
          <h3 className="font-bold text-base">Thể loại</h3>
          <span className="text-gray-500">
            {expandedSections.categories ? "−" : "+"}
          </span>
        </div>

        {expandedSections.categories && (
          <div className="mt-2 space-y-2">
            {info1.map((item) => (
              <Checkbox
                key={item.id}
                name={`category-${item.id}`}
                label={item.label}
                checked={selectedCategories.includes(item.label)}
                itemCount={item.itemCount}
                onChange={() => handleCategoryChange(item.label)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-b pb-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("brands")}
        >
          <h3 className="font-bold text-base">Hãng</h3>
          <span className="text-gray-500">
            {expandedSections.brands ? "−" : "+"}
          </span>
        </div>

        {expandedSections.brands && (
          <div className="mt-2 space-y-2">
            {info2.map((item) => (
              <Checkbox
                key={item.id}
                name={`brand-${item.id}`}
                label={item.label}
                checked={selectedBrands.includes(item.label)}
                itemCount={item.itemCount}
                onChange={() => handleBrandChange(item.label)}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={applyFilters}
        className="mt-4 w-full bg-pink-doca text-white py-2 rounded-md hover:bg-pink-500 transition-colors"
      >
        Áp dụng
      </Button>
    </div>
  );
};

export default ProductFilter;
