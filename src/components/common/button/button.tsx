import { cn } from "@/utils/cn";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
}

export default function Button({
  className,
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  type = "button",
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-pink-doca text-white hover:bg-pink-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline:
      "border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "py-1 px-3 text-sm rounded",
    md: "py-2 px-4 text-base rounded-md",
    lg: "w-[172px] h-[60px] text-[20px] font-medium rounded-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={cn(
        sizes[size],
        variants[variant],
        "transition-all duration-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading ? <span className="animate-spin">⏳</span> : children}
    </button>
  );
}
