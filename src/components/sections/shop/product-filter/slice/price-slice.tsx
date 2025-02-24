"use client"; // Next.js 14 cần "use client" khi dùng state

import { useState } from "react";

interface PriceSliderProps {
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  min = 0,
  max = 1000000,
  step = 10000,
  onChange,
}) => {
  const [price, setPrice] = useState(max);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setPrice(newValue);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <h3 className="font-bold text-lg mb-2">Filter by Price</h3>
      <div className="flex justify-between text-sm font-medium">
        <span>0 VND</span>
        <span>{price.toLocaleString()} VND</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={price}
        onChange={handleChange}
        className="w-full accent-pink-doca cursor-pointer"
      />
    </div>
  );
};

export default PriceSlider;
