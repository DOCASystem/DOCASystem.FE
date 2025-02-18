import { cn } from "@/utils/cn";
import { useFormContext } from "react-hook-form";
interface InputProps {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  className?: string;
  isTextArea?: boolean;
}

export default function Input({
  name,
  label,
  type,
  placeholder,
  className,
  isTextArea = false,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-base font-semibold">{label}</label>

      {isTextArea ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          className={cn("px-4 py-4", className)}
        />
      ) : (
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={cn("px-4 py-[9px]", className)}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {(errors[name]?.message as string) || "Lỗi không xác định"}
        </p>
      )}
    </div>
  );
}
