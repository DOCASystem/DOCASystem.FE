import { cn } from "@/utils/cn";

interface CheckboxProps {
  label: string;
  checked: boolean;
  className?: string;
  onChange: () => void;
}

export default function Checkbox({
  label,
  checked,
  className,
  onChange,
}: CheckboxProps) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn("w-5 h-5 accent-slate-500", className)}
      />
      <span className={(cn(), className)}>{label}</span>
    </label>
  );
}
