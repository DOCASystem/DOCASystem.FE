import React from "react";

interface TextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  placeholder,
  required,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full min-h-[100px] rounded-md p-2 border-gray-300 shadow-sm focus:border-pink-doca focus:ring focus:ring-pink-doca focus:ring-opacity-50"
      />
    </div>
  );
};

export default Textarea;
