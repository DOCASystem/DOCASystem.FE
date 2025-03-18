import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  rounded?: boolean;
  animate?: boolean;
}

/**
 * Skeleton component for loading state
 */
const Skeleton = ({
  className,
  width,
  height,
  circle = false,
  rounded = true,
  animate = true,
  ...props
}: SkeletonProps) => {
  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={cn(
        "bg-gray-200",
        rounded && !circle && "rounded",
        circle && "rounded-full",
        animate && "animate-pulse",
        className
      )}
      style={style}
      {...props}
    />
  );
};

/**
 * Text skeleton for loading text content
 */
export const SkeletonText = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  );
};

/**
 * Avatar skeleton for loading profile images
 */
export const SkeletonAvatar = ({
  size = 48,
  className,
  ...props
}: { size?: number } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Skeleton
      className={className}
      circle
      width={size}
      height={size}
      {...props}
    />
  );
};

/**
 * Card skeleton for loading card-like content
 */
export const SkeletonCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("space-y-5 rounded-2xl bg-white p-4", className)}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size={40} />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <SkeletonText />
    </div>
  );
};

export default Skeleton;
