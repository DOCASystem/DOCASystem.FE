"use client";

import React, { Fragment, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Reusable dialog (modal) component
 */
const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  contentClassName,
  width = "md",
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: DialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle outside click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOutsideClick) return;

    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  // Width variants
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  if (!isOpen) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Dialog */}
        <div
          ref={dialogRef}
          className={cn(
            "bg-white rounded-lg shadow-xl transform transition-all",
            "w-full mx-auto relative",
            widthClasses[width],
            className
          )}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Dialog content */}
          <div className={cn("p-6", contentClassName)}>
            {/* Header */}
            {(title || description) && (
              <div className="mb-5">
                {title && (
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-2 text-sm text-gray-500">{description}</p>
                )}
              </div>
            )}

            {/* Content */}
            <div>{children}</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dialog;
