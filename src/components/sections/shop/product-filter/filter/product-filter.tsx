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

  return (
    <div className="w-[306px] flex flex-col gap-4 p-4 border-r">
      <PriceSlider
        min={0}
        max={1000000}
        step={10000}
        onChange={handlePriceChange}
      />

      <h3 className="font-bold">Lọc theo thể loại</h3>
      {info1.map((item) => (
        <Checkbox
          key={item.id}
          label={item.label}
          checked={selectedCategories.includes(item.label)}
          itemCount={item.itemCount}
          onChange={() => handleCategoryChange(item.label)}
        />
      ))}

      <h3 className="font-bold">Lọc theo hãng</h3>
      {info2.map((item) => (
        <Checkbox
          key={item.id}
          label={item.label}
          checked={selectedBrands.includes(item.label)}
          itemCount={item.itemCount}
          onChange={() => handleBrandChange(item.label)}
        />
      ))}

      <Button
        onClick={applyFilters}
        className="mt-4 w-full text-white py-2 rounded-md hover:accent-pink-doca transition"
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
