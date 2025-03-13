import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

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
  const { register, setValue, watch } = useFormContext();
  const currentValue = watch(name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Đăng ký field với react-hook-form
  useEffect(() => {
    register(name);
  }, [register, name]);

  // Log giá trị hiện tại để debug
  useEffect(() => {
    console.log(`ImageUpload ${name} - Giá trị hiện tại:`, currentValue);
  }, [currentValue, name]);

  // Xử lý sự kiện khi người dùng nhấp vào nút "Chọn ảnh"
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        console.log(`ImageUpload ${name} - Không có files được chọn`);
        return;
      }

      console.log(
        `ImageUpload ${name} - Files đã chọn:`,
        files.length,
        "files"
      );

      // Kiểm tra kích thước và định dạng file
      const validFiles = Array.from(files).filter((file) => {
        // Kiểm tra định dạng file
        if (!file.type.startsWith("image/")) {
          toast.error(`"${file.name}" không phải là file ảnh hợp lệ`);
          return false;
        }

        // Kiểm tra kích thước file (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`"${file.name}" vượt quá kích thước tối đa (5MB)`);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) {
        console.log(`ImageUpload ${name} - Không có file hợp lệ`);
        return;
      }

      // Tạo URL preview cho các file đã chọn
      const newPreviewUrls: string[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        newPreviewUrls.push(URL.createObjectURL(validFiles[i]));
      }

      console.log(
        `ImageUpload ${name} - Đã tạo ${newPreviewUrls.length} URLs preview`
      );
      setPreviewUrls(newPreviewUrls);

      // Xử lý dữ liệu cho react-hook-form
      if (multiple) {
        // Nếu là multiple, tạo mảng các đối tượng { imageUrl, isMain }
        const imageObjects = validFiles.map((file, index) => {
          const objectUrl = URL.createObjectURL(file);
          console.log(
            `File ${index}: ${file.name}, URL: ${objectUrl.substring(0, 30)}...`
          );
          return {
            imageUrl: objectUrl,
            isMain: index === 0, // Ảnh đầu tiên là ảnh chính
          };
        });

        console.log(
          `ImageUpload ${name} - Setting value với ${imageObjects.length} objects`
        );
        setValue(name, imageObjects, { shouldValidate: true });
      } else {
        // Nếu không phải multiple, chỉ lấy file đầu tiên
        const objectUrl = URL.createObjectURL(validFiles[0]);
        console.log(
          `ImageUpload ${name} - Setting single value với URL: ${objectUrl.substring(
            0,
            30
          )}...`
        );

        setValue(
          name,
          {
            imageUrl: objectUrl,
            isMain: true,
          },
          { shouldValidate: true }
        );
      }

      // Gọi callback onChange nếu có
      if (onChange) {
        onChange(files);
      }

      // Thông báo thành công
      toast.success(`Đã chọn ${validFiles.length} ảnh thành công`);
    } catch (error) {
      console.error(`ImageUpload ${name} - Lỗi khi xử lý files:`, error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên");
    }
  };

  // Xử lý kéo thả file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileInput = fileInputRef.current;
      if (fileInput) {
        // Tạo DataTransfer object mới để gán files
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          dataTransfer.items.add(e.dataTransfer.files[i]);
        }
        fileInput.files = dataTransfer.files;

        // Kích hoạt sự kiện change
        const event = new Event("change", { bubbles: true });
        fileInput.dispatchEvent(event);

        // Xử lý file đã chọn
        handleChange({
          target: { files: fileInput.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
          required={required}
          ref={fileInputRef}
        />
        <label htmlFor={name} className="cursor-pointer">
          <div className="text-gray-500 mb-2">
            Kéo và thả ảnh hoặc nhấp để chọn
          </div>
          <button
            type="button"
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
            onClick={handleButtonClick}
          >
            Chọn ảnh
          </button>
        </label>

        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative h-24 rounded-md overflow-hidden border border-gray-300"
              >
                <Image
                  src={url}
                  alt={`Ảnh ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-1 py-0.5">
                    Chính
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        * Ảnh đầu tiên sẽ được đặt làm ảnh chính. Mỗi ảnh tối đa 5MB.
      </div>
    </div>
  );
};

export default ImageUpload;
