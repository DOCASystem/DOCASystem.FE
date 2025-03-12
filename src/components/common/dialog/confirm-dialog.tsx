"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  type?: "warning" | "danger" | "info";
  children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  confirmButtonClass,
  cancelButtonClass,
  type = "info",
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

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

  // Sử dụng createPortal để render dialog bên ngoài DOM hiện tại
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay nền mờ */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Dialog container */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-lg">
        {/* Dialog header */}
        <div className={cn("border-b p-4", typeClasses[type].header)}>
          <h3 className={cn("text-lg font-semibold", typeClasses[type].title)}>
            {title}
          </h3>
        </div>

        {/* Dialog body */}
        <div className="p-4 sm:p-6">
          {message && <p className="text-gray-700">{message}</p>}
          {children}
        </div>

        {/* Dialog footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">
          <button
            onClick={onCancel}
            className={cn(
              "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50",
              cancelButtonClass
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm",
              typeClasses[type].confirmButton,
              confirmButtonClass
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
