import { cn } from "@/utils/cn";
import React from "react";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit" | "reset";
}

export default function Button({
  className,
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "w-[172px] h-[60px] text-[20px] text-center font-medium rounded-xl transition-all duration-200";
  const variants = {
    primary: "bg-pink-doca text-white hover:bg-pink-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline:
      "border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading ? <span className="animate-spin">⏳</span> : children}
    </button>
  );
}
