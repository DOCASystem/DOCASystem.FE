import { cn } from "@/utils/cn";

interface InputProps {
  label: string;
  type?: string;
  placeholder: string;
  className?: string;
  isTextArea?: boolean;
}

export default function Input({
  label,
  type,
  placeholder,
  className,
  isTextArea = false,
}: InputProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-base font-semibold">{label}</label>

      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          className={cn("px-4 py-4", className)}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={cn("px-4 py-[9px]", className)}
        />
      )}
    </div>
  );
}
