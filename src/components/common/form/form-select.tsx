"use client";

import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { FormError } from "./form";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  name: string;
  label?: string;
  description?: string;
  options: SelectOption[];
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  error?: string;
  placeholder?: string;
}

/**
 * Reusable form select component that integrates with React Hook Form
 */
const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      name,
      label,
      description,
      options,
      containerClassName,
      labelClassName,
      selectClassName,
      error,
      placeholder,
      ...props
    },
    ref
  ) => {
    const { control, formState } = useFormContext();
    const fieldError = error || formState.errors[name]?.message;
    const errorMessage = fieldError ? String(fieldError) : undefined;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "block text-sm font-medium text-gray-700",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <select
              {...field}
              {...props}
              id={name}
              ref={ref}
              className={cn(
                "block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm",
                "focus:ring-2 focus:ring-pink-doca focus:border-pink-doca focus:outline-none",
                "text-gray-900 bg-white",
                "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
                errorMessage &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500",
                selectClassName
              )}
              aria-invalid={!!errorMessage}
              aria-describedby={`${name}-error`}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}

              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}

        {errorMessage && <FormError message={errorMessage} />}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
