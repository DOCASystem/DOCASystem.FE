"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import useOutsideClick from "@/hooks/useOutsideClick";
import { cn } from "@/utils/cn";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  name?: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  isMulti?: boolean;
  onAddCategory?: (value: string) => void;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  isSearchable?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
}

// Component thêm danh mục mới
interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string, description: string) => void;
}

function AddCategoryDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddCategoryDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isOpen || !isMounted) return null;

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setIsSubmitting(true);
      try {
        onSubmit(inputValue.trim(), description.trim());
        setInputValue("");
        setDescription("");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Vui lòng nhập tên danh mục");
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="Nhập tên danh mục"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả (bắt buộc)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            rows={3}
            placeholder="Nhập mô tả về danh mục"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-70"
            disabled={isSubmitting || !inputValue.trim()}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  placeholder = "Chọn...",
  options = [],
  isMulti = false,
  onAddCategory,
  value,
  onChange,
  isSearchable = false,
  isLoading = false,
  disabled = false,
  error,
  className = "",
  labelClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(selectRef, () => {
    setIsOpen(false);
    setSearch("");
  });

  // Xử lý gợi ý tìm kiếm
  const filteredOptions = isSearchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Kiểm tra giá trị đã chọn
  const getSelectedOptions = (): Option[] => {
    if (isMulti && Array.isArray(value)) {
      return options.filter((option) => value.includes(option.value));
    } else if (!isMulti && !Array.isArray(value) && value) {
      const selectedOption = options.find((option) => option.value === value);
      return selectedOption ? [selectedOption] : [];
    }
    return [];
  };

  const selectedOptions = getSelectedOptions();

  // Xử lý khi chọn một option
  const handleOptionSelect = (optionValue: string) => {
    if (onChange) {
      if (isMulti) {
        if (Array.isArray(value)) {
          if (value.includes(optionValue)) {
            onChange(value.filter((val) => val !== optionValue));
          } else {
            onChange([...value, optionValue]);
          }
        } else {
          onChange([optionValue]);
        }
      } else {
        // Single select - chỉ chọn một giá trị
        console.log(
          "Select.handleOptionSelect: Chọn một option với giá trị =",
          optionValue
        );
        onChange(optionValue);
        console.log("Selected option value:", optionValue);
        setIsOpen(false);
      }
    } else {
      console.warn("onChange function not provided to Select component");
    }
  };

  // Xử lý khi xóa một lựa chọn
  const handleRemoveOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    if (onChange) {
      if (isMulti && Array.isArray(value)) {
        onChange(value.filter((val) => val !== optionValue));
      } else {
        onChange("");
      }
    }
  };

  // Hiển thị giá trị đã chọn
  const renderSelectedValue = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-gray-500 truncate">
          {placeholder || "Chọn danh mục"}
        </span>
      );
    }

    if (isMulti) {
      return (
        <div className="flex flex-wrap gap-1 overflow-x-auto max-w-full">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-1 bg-gray-200 rounded px-2 py-0.5 truncate"
            >
              <span className="text-sm truncate">{option.label}</span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => handleRemoveOption(e, option.value)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      );
    }

    // Single select - hiển thị giá trị đã chọn
    return (
      <div className="flex items-center justify-between w-full">
        <span className="truncate text-black">{selectedOptions[0]?.label}</span>
        {selectedOptions.length > 0 && (
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 ml-2"
            onClick={(e) => handleRemoveOption(e, selectedOptions[0].value)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    );
  };

  // Focus vào input khi mở dropdown
  useEffect(() => {
    if (isOpen && isSearchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  const handleAddCategory = async (value: string, description: string) => {
    if (onAddCategory) {
      try {
        // Gọi hàm thêm danh mục và lấy kết quả
        const result = {
          value,
          label: value,
          description,
        };

        toast.success(`Đã thêm danh mục: ${value}`);

        // Nếu là multi select, thêm giá trị mới vào các giá trị đã chọn
        if (isMulti && onChange) {
          const newValues = [...selectedOptions, result];
          onChange(newValues.map((opt) => opt.value));
        } else if (onChange) {
          // Nếu là single select, chọn giá trị mới
          onChange(result.value);
        }
        setShowAddDialog(false);
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        toast.error("Có lỗi xảy ra khi thêm danh mục mới");
      }
    }
  };

  // Xử lý class và style
  const selectClasses = cn(
    "relative w-full border border-gray-300 rounded-md shadow-sm",
    "bg-white py-2 px-3 cursor-pointer transition-all",
    {
      "border-red-500": error,
      "border-gray-300": !error,
      "opacity-70 cursor-not-allowed": disabled,
      "border-pink-600 ring-1 ring-pink-500": isOpen && !error,
    },
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className={cn("block text-sm font-medium mb-1", labelClassName)}>
          {label}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <div
          className={selectClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 truncate">{renderSelectedValue()}</div>
            <div className="flex items-center ml-2">
              {isLoading ? (
                <div className="h-4 w-4 border-t-2 border-pink-500 border-solid rounded-full animate-spin"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <polyline points="7 13 12 18 17 13"></polyline>
                  <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
              )}
            </div>
          </div>
          <input type="hidden" name={name} value={value || ""} />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {isSearchable && (
              <div className="p-2 border-b">
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-700">
                Không tìm thấy kết quả
              </div>
            ) : (
              <ul className="py-1" role="listbox">
                {filteredOptions.map((option) => {
                  const isSelected = isMulti
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value;

                  return (
                    <li
                      key={option.value}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100",
                        isSelected ? "bg-pink-50 text-pink-700" : ""
                      )}
                      onClick={() => handleOptionSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-pink-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Thêm danh mục mới khi được truyền vào prop onAddCategory */}
            {onAddCategory && (
              <div className="border-t p-2">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-pink-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowAddDialog(true)}
                >
                  + Thêm danh mục mới
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}

      {/* Dialog thêm danh mục mới */}
      {showAddDialog && (
        <AddCategoryDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={handleAddCategory}
        />
      )}
    </div>
  );
};

export default Select;
