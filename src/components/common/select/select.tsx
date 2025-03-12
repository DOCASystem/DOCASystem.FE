import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  isMulti?: boolean;
  isCreatable?: boolean;
  onCreateOption?: (inputValue: string) => Promise<Option | null>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  placeholder,
  options,
  isMulti,
  isCreatable,
  onCreateOption,
  value,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return;

    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    if (isMulti) {
      // Nếu là multiselect, trả về mảng các giá trị
      onChange(selectedOptions);
      setSelectedValues(selectedOptions);
    } else {
      // Nếu không phải multiselect, chỉ lấy giá trị đầu tiên
      const selectedValue = e.target.value;
      onChange(selectedValue);
      setSelectedValues([selectedValue]);
    }
  };

  // Đây là phiên bản đơn giản, sau này có thể nâng cấp thành select với React Select
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        name={name}
        id={name}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
        onChange={handleChange}
        value={isMulti ? selectedValues : selectedValues[0] || ""}
        multiple={isMulti}
      >
        {!isMulti && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {isCreatable && (
        <div className="mt-2">
          <button
            type="button"
            className="text-sm text-pink-600 hover:text-pink-800"
            onClick={() => {
              const newCategory = prompt("Nhập tên danh mục mới:");
              if (newCategory && onCreateOption) {
                onCreateOption(newCategory);
              }
            }}
          >
            + Thêm danh mục mới
          </button>
        </div>
      )}
    </div>
  );
};

export default Select;
