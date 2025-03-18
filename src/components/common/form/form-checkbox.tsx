"use client";

import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { FormError } from "./form";

interface FormCheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  name: string;
  label: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  error?: string;
}

/**
 * Reusable form checkbox component that integrates with React Hook Form
 */
const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      name,
      label,
      description,
      containerClassName,
      labelClassName,
      checkboxClassName,
      error,
      ...props
    },
    ref
  ) => {
    const { control, formState } = useFormContext();
    const fieldError = error || formState.errors[name]?.message;
    const errorMessage = fieldError ? String(fieldError) : undefined;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-start">
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <div className="flex items-center h-5">
                <input
                  {...field}
                  {...props}
                  id={name}
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  ref={ref}
                  className={cn(
                    "h-4 w-4 rounded border-gray-300 text-pink-doca",
                    "focus:ring-2 focus:ring-pink-doca focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    checkboxClassName
                  )}
                  aria-invalid={!!errorMessage}
                  aria-describedby={`${name}-error`}
                />
              </div>
            )}
          />

          <div className="ml-3 text-sm">
            <label
              htmlFor={name}
              className={cn("font-medium text-gray-700", labelClassName)}
            >
              {label}
            </label>

            {description && <p className="text-gray-500">{description}</p>}
          </div>
        </div>

        {errorMessage && <FormError message={errorMessage} />}
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
