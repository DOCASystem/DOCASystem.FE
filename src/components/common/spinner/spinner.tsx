"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div className={cn("animate-spin rounded-full", className)}>
      <div className="border-4 border-t-pink-doca border-b-pink-100 border-l-pink-100 border-r-pink-100 rounded-full w-full h-full" />
    </div>
  );
};
