"use client";

import React, { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { FormError } from "./form";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface FormRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  options: RadioOption[];
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  optionsContainerClassName?: string;
  radioClassName?: string;
  radioLabelClassName?: string;
  error?: string;
  orientation?: "vertical" | "horizontal";
}

/**
 * Reusable form radio group component that integrates with React Hook Form
 */
const FormRadioGroup = forwardRef<HTMLDivElement, FormRadioGroupProps>(
  (
    {
      name,
      label,
      options,
      description,
      containerClassName,
      labelClassName,
      optionsContainerClassName,
      radioClassName,
      radioLabelClassName,
      error,
      orientation = "vertical",
      ...props
    },
    ref
  ) => {
    const { control, formState } = useFormContext();
    const fieldError = error || formState.errors[name]?.message;
    const errorMessage = fieldError ? String(fieldError) : undefined;

    return (
      <div className={cn("space-y-2", containerClassName)} ref={ref} {...props}>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium text-gray-700",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {description && <p className="text-sm text-gray-500">{description}</p>}

        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div
              className={cn(
                "space-y-4",
                orientation === "horizontal" &&
                  "flex flex-wrap gap-4 space-y-0",
                optionsContainerClassName
              )}
              role="radiogroup"
              aria-labelledby={`${name}-label`}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-start",
                    orientation === "horizontal" && "mr-4"
                  )}
                >
                  <div className="flex items-center h-5">
                    <input
                      id={`${name}-${option.value}`}
                      type="radio"
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "h-4 w-4 border-gray-300 text-pink-doca",
                        "focus:ring-2 focus:ring-pink-doca focus:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        radioClassName
                      )}
                    />
                  </div>

                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className={cn(
                        "font-medium text-gray-700",
                        option.disabled && "opacity-50",
                        radioLabelClassName
                      )}
                    >
                      {option.label}
                    </label>
                    {option.description && (
                      <p className="text-gray-500">{option.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        />

        {errorMessage && <FormError message={errorMessage} />}
      </div>
    );
  }
);

FormRadioGroup.displayName = "FormRadioGroup";

export default FormRadioGroup;
