import { cn } from "@/utils/cn";

interface InputProps {
  label: string;
  type?: string;
  placeholder: string;
  className?: string;
}

export default function Input({
  label,
  type,
  placeholder,
  className,
}: InputProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-base font-semibold">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={cn("px-4 py-[9px]", className)}
      />
    </div>
  );
}
