import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn"; // ✅ Dùng `cn` thay vì `clsx`

interface InputProps {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  className?: string;
  isTextArea?: boolean;
  autoComplete?: string;
}

export default function Input({
  name,
  label,
  type = "text",
  placeholder,
  className,
  isTextArea = false,
  autoComplete,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-base font-semibold">
        {label}
      </label>

      {isTextArea ? (
        <textarea
          {...register(name)}
          id={name}
          placeholder={placeholder}
          className={cn(
            "px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500",
            className
          )}
        />
      ) : (
        <input
          {...register(name)}
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500",
            className
          )}
        />
      )}

      {errors[name] && (
        <p className="text-red-500 text-sm">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
}
