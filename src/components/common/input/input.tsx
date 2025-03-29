import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn"; // ✅ Dùng `cn` thay vì `clsx`
import { useState } from "react";

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

  // Thêm state để quản lý việc hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  // Xác định type thực tế cho input dựa vào type ban đầu và state showPassword
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

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
          className={cn("px-4 py-2 border rounded-md", className)}
        />
      ) : (
        <div className="relative">
          <input
            {...register(name)}
            id={name}
            type={inputType}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={cn("w-full px-4 py-2 border rounded-md", className)}
          />

          {/* Hiển thị icon chỉ khi input type là password */}
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                // Icon con mắt đã mở (khi đang hiển thị mật khẩu)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // Icon con mắt đã đóng (khi đang ẩn mật khẩu)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {errors[name] && (
        <p className="text-red-500 text-sm">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
}
