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

// Hàm nén hình ảnh
const compressImage = async (
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Giảm kích thước nếu cần
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Không thể tạo context canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Không thể chuyển đổi canvas thành blob"));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              console.log(
                `Đã nén ảnh từ ${file.size} xuống ${compressedFile.size} bytes`
              );
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    } catch (error) {
      console.error("Lỗi khi nén ảnh:", error);
      reject(error);
    }
  });
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label,
  multiple,
  required,
  onChange,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        console.log(`ImageUpload ${name} - Không có files được chọn`);
        return;
      }

      // Hiển thị thông báo đang xử lý
      setIsProcessing(true);
      toast.info("Đang xử lý hình ảnh...", {
        toastId: "processing-images",
        autoClose: 2000,
      });

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

        // Kiểm tra kích thước file (max 10MB trước khi nén)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`"${file.name}" vượt quá kích thước tối đa (10MB)`);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) {
        console.log(`ImageUpload ${name} - Không có file hợp lệ`);
        setIsProcessing(false);
        return;
      }

      // Nén các hình ảnh
      const compressedFiles: File[] = [];
      for (const file of validFiles) {
        try {
          // Nén nếu ảnh lớn hơn 1MB
          if (file.size > 1024 * 1024) {
            const compressed = await compressImage(file);
            compressedFiles.push(compressed);
          } else {
            compressedFiles.push(file);
          }
        } catch (error) {
          console.error(`Lỗi khi nén ảnh ${file.name}:`, error);
          compressedFiles.push(file); // Sử dụng file gốc nếu không nén được
        }
      }

      // Tạo URL preview cho các file đã chọn
      const newPreviewUrls: string[] = [];
      for (let i = 0; i < compressedFiles.length; i++) {
        newPreviewUrls.push(URL.createObjectURL(compressedFiles[i]));
      }

      console.log(
        `ImageUpload ${name} - Đã tạo ${newPreviewUrls.length} URLs preview`
      );
      setPreviewUrls(newPreviewUrls);

      // Xử lý dữ liệu cho react-hook-form
      if (multiple) {
        // Nếu là multiple, tạo mảng các đối tượng { imageUrl, isMain }
        const imageObjects = compressedFiles.map((file, index) => {
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
        const objectUrl = URL.createObjectURL(compressedFiles[0]);
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
        const dataTransfer = new DataTransfer();
        compressedFiles.forEach((file) => dataTransfer.items.add(file));
        onChange(dataTransfer.files);
      }

      // Thông báo thành công
      toast.success(`Đã xử lý ${compressedFiles.length} ảnh thành công`, {
        toastId: "compress-success",
      });
    } catch (error) {
      console.error(`ImageUpload ${name} - Lỗi khi xử lý files:`, error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên");
    } finally {
      setIsProcessing(false);
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

  const setMainImage = (index: number) => {
    // Chỉ áp dụng cho multiple
    if (multiple && Array.isArray(currentValue)) {
      const newValue = currentValue.map((item, i) => ({
        ...item,
        isMain: i === index,
      }));

      setValue(name, newValue, { shouldValidate: true });
      toast.success("Đã đặt ảnh chính mới");
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`border-2 border-dashed border-gray-300 p-6 rounded-lg text-center ${
          isProcessing ? "opacity-70 pointer-events-none" : ""
        }`}
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
          disabled={isProcessing}
        />
        <label
          htmlFor={name}
          className={`cursor-pointer ${
            isProcessing ? "pointer-events-none" : ""
          }`}
        >
          <div className="text-gray-500 mb-2">
            {isProcessing
              ? "Đang xử lý..."
              : "Kéo và thả ảnh hoặc nhấp để chọn"}
          </div>
          <button
            type="button"
            className={`${
              isProcessing ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
            } text-white px-4 py-2 rounded-md transition-colors`}
            onClick={handleButtonClick}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Chọn ảnh"}
          </button>
        </label>

        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative h-24 rounded-md overflow-hidden border border-gray-300 group"
                onClick={() => multiple && setMainImage(index)}
              >
                <Image
                  src={url}
                  alt={`Ảnh ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                {currentValue &&
                  Array.isArray(currentValue) &&
                  currentValue[index]?.isMain && (
                    <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-1 py-0.5">
                      Chính
                    </div>
                  )}
                {multiple && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-medium">
                      Đặt làm ảnh chính
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        * Ảnh đầu tiên sẽ được đặt làm ảnh chính. Mỗi ảnh tối đa 10MB (sẽ được
        nén nếu cần).
        {multiple &&
          previewUrls.length > 0 &&
          " Nhấp vào ảnh để đặt làm ảnh chính."}
      </div>
    </div>
  );
};

export default ImageUpload;
