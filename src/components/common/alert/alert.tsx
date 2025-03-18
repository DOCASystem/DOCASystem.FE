import React from "react";
import { cn } from "@/utils/cn";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

/**
 * Reusable alert component for notifications and feedback
 */
const Alert = ({
  title,
  variant = "info",
  children,
  icon,
  className,
  onClose,
  ...props
}: AlertProps) => {
  // Variant specific styles
  const variants = {
    info: {
      wrapper: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "text-blue-500",
      closeButton: "text-blue-500 hover:bg-blue-100",
    },
    success: {
      wrapper: "bg-green-50 border-green-200 text-green-800",
      icon: "text-green-500",
      closeButton: "text-green-500 hover:bg-green-100",
    },
    warning: {
      wrapper: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: "text-yellow-500",
      closeButton: "text-yellow-500 hover:bg-yellow-100",
    },
    error: {
      wrapper: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-500",
      closeButton: "text-red-500 hover:bg-red-100",
    },
  };

  // Default icons
  const defaultIcons = {
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        "relative rounded-md border p-4",
        variants[variant].wrapper,
        className
      )}
      {...props}
    >
      <div className="flex">
        {/* Icon */}
        {(icon || defaultIcons[variant]) && (
          <div className={cn("flex-shrink-0", variants[variant].icon)}>
            {icon || defaultIcons[variant]}
          </div>
        )}

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={cn("text-sm", title && "mt-2")}>{children}</div>
        </div>

        {/* Close button */}
        {onClose && (
          <div className="flex-shrink-0 pl-4">
            <button
              type="button"
              className={cn(
                "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                variants[variant].closeButton
              )}
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
