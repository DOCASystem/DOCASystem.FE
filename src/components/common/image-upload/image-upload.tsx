import React, { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  label?: string;
  multiple?: boolean;
  required?: boolean;
  value?: FileList | null;
  onChange?: (files: FileList | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label,
  multiple,
  required,
  onChange,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Tạo URL preview cho các file đã chọn
      const newPreviewUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newPreviewUrls.push(URL.createObjectURL(files[i]));
      }
      setPreviewUrls(newPreviewUrls);

      if (onChange) {
        onChange(files);
      }
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
          required={required}
        />
        <label htmlFor={name} className="cursor-pointer">
          <div className="text-gray-500 mb-2">
            Kéo và thả ảnh hoặc nhấp để chọn
          </div>
          <button
            type="button"
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
          >
            Chọn ảnh
          </button>
        </label>

        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative h-24 rounded-md overflow-hidden"
              >
                <Image
                  src={url}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
