"use client";

import React from "react";
import { toast as hotToast, ToastOptions } from "react-hot-toast";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error" | "loading" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
}

/**
 * Custom toast component that wraps react-hot-toast with consistent styling
 */
export const Toast = ({ visible, message, type }: ToastProps) => {
  const getIconByType = (type: ToastType) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "loading":
        return (
          <svg
            className="w-5 h-5 text-blue-500 animate-spin"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      case "info":
      default:
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getBgColorByType = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "loading":
        return "bg-blue-50 border-blue-200";
      case "info":
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={cn(
        "transform transition-all duration-300 ease-in-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto border",
        getBgColorByType(type)
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIconByType(type)}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => hotToast.dismiss()}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast utility functions
export const showToast = (
  message: string,
  type: ToastType = "info",
  options?: ToastOptions
) => {
  return hotToast.custom(
    (t) => <Toast visible={t.visible} message={message} type={type} />,
    options
  );
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return showToast(message, "success", options);
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return showToast(message, "error", options);
};

export const showLoadingToast = (
  message: string = "Loading...",
  options?: ToastOptions
) => {
  return showToast(message, "loading", { ...options, duration: Infinity });
};

export const updateToast = (
  toastId: string,
  message: string,
  type: ToastType
) => {
  return hotToast.custom(
    (t) => <Toast visible={t.visible} message={message} type={type} />,
    { id: toastId }
  );
};

export const dismissToast = (toastId?: string) => {
  if (toastId) {
    hotToast.dismiss(toastId);
  } else {
    hotToast.dismiss();
  }
};
