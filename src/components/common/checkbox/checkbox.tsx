import { cn } from "@/utils/cn";

interface CheckboxProps {
  label: string;
  checked: boolean;
  itemCount?: number;
  classNameInput?: string;
  classNameLabel?: string;
  classNameItemCount?: string;

  onChange: () => void;
}

export default function Checkbox({
  label,
  checked,
  itemCount,
  classNameInput,
  classNameLabel,
  classNameItemCount,
  onChange,
}: CheckboxProps) {
  return (
    <label className="flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn(
            "w-4 h-4 accent-slate-500 border-2 text-[16px] font-medium",
            classNameInput
          )}
        />
        <span className={cn("", classNameLabel)}>{label}</span>
      </div>
      <span
        className={cn(
          "py-1 px-2 flex items-center justify-center text-pink-doca rounded-xl bg-gray-100",
          classNameItemCount
        )}
      >
        {itemCount}
      </span>
    </label>
  );
}
