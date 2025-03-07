"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  type?: "warning" | "danger" | "info";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  confirmButtonClass,
  cancelButtonClass,
  type = "info",
}) => {
  if (!isOpen) return null;

  // Các màu sắc dựa theo loại dialog
  const typeClasses = {
    warning: {
      header: "bg-yellow-50 border-yellow-200",
      title: "text-yellow-700",
      confirmButton: "bg-yellow-500 hover:bg-yellow-600",
    },
    danger: {
      header: "bg-red-50 border-red-200",
      title: "text-red-700",
      confirmButton: "bg-red-500 hover:bg-red-600",
    },
    info: {
      header: "bg-blue-50 border-blue-200",
      title: "text-blue-700",
      confirmButton: "bg-blue-500 hover:bg-blue-600",
    },
  };

  // Client-side only
  if (typeof window === "object") {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
          <div className={cn("px-6 py-4 border-b", typeClasses[type].header)}>
            <h3 className={cn("text-lg font-medium", typeClasses[type].title)}>
              {title}
            </h3>
          </div>

          <div className="px-6 py-4">
            <p className="text-gray-700">{message}</p>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className={cn(
                "px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors",
                cancelButtonClass
              )}
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                "px-4 py-2 text-white rounded-md transition-colors",
                typeClasses[type].confirmButton,
                confirmButtonClass
              )}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
};

export default ConfirmDialog;
