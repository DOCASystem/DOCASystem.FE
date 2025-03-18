"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";

interface FormSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

/**
 * Reusable form submit button that integrates with React Hook Form
 * Automatically disables when form is invalid or submitting
 */
const FormSubmitButton = ({
  children,
  loading = false,
  loadingText = "Processing...",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  disabled,
  ...props
}: FormSubmitButtonProps) => {
  const { formState } = useFormContext();
  const { isSubmitting } = formState;

  const isDisabled = disabled || isSubmitting || loading;

  // Button variants
  const variants = {
    primary: "bg-pink-doca text-white hover:bg-pink-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline:
      "border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  // Button sizes
  const sizes = {
    sm: "py-1 px-3 text-sm rounded",
    md: "py-2 px-4 text-base rounded-md",
    lg: "py-3 px-6 text-lg rounded-lg",
  };

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(
        sizes[size],
        variants[variant],
        "font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-doca",
        isDisabled && "opacity-70 cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isSubmitting || loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default FormSubmitButton;
