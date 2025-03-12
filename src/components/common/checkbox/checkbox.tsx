import React from "react";
import { cn } from "@/utils/cn";

interface CheckboxProps {
  name: string;
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  itemCount?: number;
  classNameInput?: string;
  classNameLabel?: string;
  classNameItemCount?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  checked,
  onChange,
  itemCount,
  classNameInput,
  classNameLabel,
  classNameItemCount,
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500",
          classNameInput
        )}
      />
      {label && (
        <label
          htmlFor={name}
          className={cn("ml-2 text-sm text-gray-700", classNameLabel)}
        >
          {label}
        </label>
      )}
      {itemCount !== undefined && (
        <span
          className={cn(
            "py-1 px-2 ml-2 flex items-center justify-center text-pink-doca rounded-xl bg-gray-100",
            classNameItemCount
          )}
        >
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
