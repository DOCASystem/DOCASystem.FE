import * as React from "react";
interface HeartIconProps {
  width?: number;
  height?: number;
  viewBox?: string;
  className?: string;
}

const UserIcon: React.FC<HeartIconProps> = ({
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  className = "text-black hover:text-[#F36]",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />{" "}
  </svg>
);
export default UserIcon;
