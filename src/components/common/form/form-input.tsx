"use client";

import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { FormError } from "./form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  error?: string;
}

/**
 * Reusable form input component that integrates with React Hook Form
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      label,
      description,
      containerClassName,
      labelClassName,
      inputClassName,
      error,
      type = "text",
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
            <input
              {...field}
              {...props}
              id={name}
              type={type}
              ref={ref}
              placeholder={placeholder}
              className={cn(
                "block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm",
                "focus:ring-2 focus:ring-pink-doca focus:border-pink-doca focus:outline-none",
                "text-gray-900 placeholder-gray-400",
                "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
                errorMessage &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500",
                inputClassName
              )}
              aria-invalid={!!errorMessage}
              aria-describedby={`${name}-error`}
            />
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

FormInput.displayName = "FormInput";

export default FormInput;
