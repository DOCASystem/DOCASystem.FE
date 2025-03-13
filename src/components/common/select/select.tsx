"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

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
  onCreateOption?: (
    inputValue: string,
    description?: string
  ) => Promise<Option | null>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
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
      console.error("Tên danh mục không được để trống");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-gray-100 p-4">
          <h3 className="text-lg font-medium text-pink-doca">
            Thêm danh mục mới
          </h3>
          <button
            onClick={onClose}
            className="text-pink-doca hover:text-pink-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </h3>
              <input
                type="text"
                placeholder="Nhập tên danh mục"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-md border border-pink-300 px-4 py-2 focus:border-pink-doca focus:outline-none focus:ring-1 focus:ring-pink-doca"
                autoFocus
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Mô tả:</h3>
              <textarea
                placeholder="Nhập mô tả danh mục"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-doca focus:outline-none focus:ring-1 focus:ring-pink-doca min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-5">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md bg-gray-200 px-8 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-md bg-pink-doca px-8 py-2 font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
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
  // Đảm bảo options không bao giờ là undefined hoặc null
  const safeOptions = Array.isArray(options) ? options : [];

  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Log ra thông tin options và giá trị đã chọn khi component mount
  useEffect(() => {
    console.log(`Select [${name}] - Số lượng options:`, safeOptions.length);
    console.log(`Select [${name}] - Giá trị đã chọn:`, selectedValues);

    // Log chi tiết các options để dễ debug
    if (safeOptions.length > 0) {
      console.log(
        `Select [${name}] - Chi tiết 5 options đầu tiên:`,
        safeOptions.slice(0, 5).map((opt) => ({ ...opt }))
      );
    }
  }, [name, safeOptions, selectedValues]);

  // Cập nhật selectedValues khi prop value thay đổi
  useEffect(() => {
    if (value !== undefined) {
      const newValues = Array.isArray(value) ? value : value ? [value] : [];
      console.log(`Select [${name}] - Value prop thay đổi:`, newValues);
      setSelectedValues(newValues);
    }
  }, [value, name]);

  // Cập nhật selectedValues khi options thay đổi để loại bỏ các giá trị không hợp lệ
  useEffect(() => {
    if (safeOptions.length > 0 && selectedValues.length > 0) {
      const validOptionValues = safeOptions.map((opt) => opt.value);
      const validSelectedValues = selectedValues.filter((val) =>
        validOptionValues.includes(val)
      );

      // Chỉ cập nhật nếu có thay đổi để tránh render lại không cần thiết
      if (validSelectedValues.length !== selectedValues.length) {
        console.log(
          `Select [${name}] - Loại bỏ các giá trị không hợp lệ:`,
          selectedValues.filter((val) => !validOptionValues.includes(val))
        );
        setSelectedValues(validSelectedValues);

        // Chỉ gọi onChange nếu thực sự có thay đổi
        if (onChange) {
          onChange(
            isMulti ? validSelectedValues : validSelectedValues[0] || ""
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return;

    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    console.log(`Select [${name}] - Lựa chọn mới:`, selectedOptions);

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

  const handleAddCategory = async (
    newCategory: string,
    description: string
  ) => {
    if (newCategory && onCreateOption) {
      try {
        console.log(`Select [${name}] - Đang thêm danh mục mới:`, {
          name: newCategory,
          description,
        });

        const result = await onCreateOption(newCategory, description);
        console.log(`Select [${name}] - Kết quả thêm danh mục:`, result);

        if (result) {
          toast.success(`Đã thêm danh mục "${newCategory}" thành công`);
          // Nếu là multi select, thêm giá trị mới vào các giá trị đã chọn
          if (isMulti && onChange) {
            const newValues = [...selectedValues, result.value];
            onChange(newValues);
            setSelectedValues(newValues);
          } else if (onChange) {
            // Nếu là single select, chọn giá trị mới
            onChange(result.value);
            setSelectedValues([result.value]);
          }
          setShowAddDialog(false);
        } else {
          console.error(`Select [${name}] - Không thể thêm danh mục`);
          toast.error("Không thể thêm danh mục");
          setShowAddDialog(false);
        }
      } catch (error) {
        console.error(`Select [${name}] - Lỗi khi thêm danh mục:`, error);
        toast.error("Đã xảy ra lỗi khi thêm danh mục");
        setShowAddDialog(false);
      }
    } else {
      if (!newCategory) {
        console.error(`Select [${name}] - Tên danh mục không được để trống`);
      } else if (!onCreateOption) {
        console.error(
          `Select [${name}] - Không có hàm onCreateOption được cung cấp`
        );
      }
      setShowAddDialog(false);
    }
  };

  // Dropdown cải tiến sử dụng styled select
  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isMulti && <span className="text-xs text-gray-500 ml-1"></span>}
        </label>
      )}

      <div className="relative">
        <select
          name={name}
          id={name}
          className="w-full rounded-md border border-gray-300 shadow-sm py-1 px-2 bg-white focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 appearance-none cursor-pointer text-sm"
          onChange={handleChange}
          value={isMulti ? selectedValues : selectedValues[0] || ""}
          multiple={isMulti}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
          style={{
            height: isMulti ? "auto" : "36px",
            overflowY: isMulti ? "visible" : "hidden",
            minHeight: isMulti ? "36px" : "auto",
            fontSize: "13px",
            lineHeight: "1.2",
          }}
          size={isMulti ? Math.min(safeOptions.length, 6) : 1}
        >
          {!isMulti && (
            <option value="">{placeholder || "Chọn danh mục"}</option>
          )}
          {safeOptions.length > 0 ? (
            safeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="py-1 text-sm"
              >
                {option.label}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Không có dữ liệu
            </option>
          )}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Hiển thị các giá trị đã chọn dưới dạng badge khi là multiselect */}
      {isMulti && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedValues.map((val) => {
            const option = safeOptions.find((opt) => opt.value === val);
            return option ? (
              <span
                key={val}
                className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-pink-100 text-pink-800"
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 text-pink-500 hover:text-pink-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onChange) {
                      const newValues = selectedValues.filter((v) => v !== val);
                      onChange(newValues);
                      setSelectedValues(newValues);
                    }
                  }}
                >
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {isCreatable && (
        <div className="mt-1">
          <button
            type="button"
            className="text-xs text-pink-600 hover:text-pink-800 flex items-center"
            onClick={() => setShowAddDialog(true)}
          >
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Thêm danh mục mới
          </button>
        </div>
      )}

      {/* Dialog thêm danh mục */}
      <AddCategoryDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};

export default Select;
