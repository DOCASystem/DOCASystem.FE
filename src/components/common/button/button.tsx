import { cn } from "@/utils/cn";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function Button({ className, children }: ButtonProps) {
  return (
    <button
      className={cn(
        // "w-[282px]",
        // "h-[38px]",
        "w-[172px] h-[60px] px-10 py-[17px] text-[20px] text-white font-medium bg-[#F36] rounded-xl",
        className
      )}
    >
      {children}
    </button>
  );
}
