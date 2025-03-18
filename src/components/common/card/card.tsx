import React from "react";
import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  border?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

/**
 * Card component for containing content with consistent styling
 */
export const Card = ({
  className,
  border = true,
  shadow = "md",
  padding = "md",
  radius = "md",
  children,
  ...props
}: CardProps) => {
  // Shadow variants
  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  // Padding variants
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  // Border radius variants
  const radiuses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "bg-white",
        border && "border border-gray-200",
        shadows[shadow],
        paddings[padding],
        radiuses[radius],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card header component
 */
export const CardHeader = ({
  className,
  children,
  ...props
}: CardHeaderProps) => {
  return (
    <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

/**
 * Card title component
 */
export const CardTitle = ({
  className,
  children,
  ...props
}: CardTitleProps) => {
  return (
    <h3
      className={cn("text-xl font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

/**
 * Card description component
 */
export const CardDescription = ({
  className,
  children,
  ...props
}: CardDescriptionProps) => {
  return (
    <p className={cn("text-sm text-gray-500", className)} {...props}>
      {children}
    </p>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card content component
 */
export const CardContent = ({
  className,
  children,
  ...props
}: CardContentProps) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card footer component
 */
export const CardFooter = ({
  className,
  children,
  ...props
}: CardFooterProps) => {
  return (
    <div className={cn("mt-4 flex items-center", className)} {...props}>
      {children}
    </div>
  );
};
