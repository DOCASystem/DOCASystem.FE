import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

// Các trường hợp sử dụng:
// 1. Hình ảnh từ domain S3: Chuyển đổi sang đường dẫn localhost hoặc hiển thị hình ảnh mặc định
// 2. Hình ảnh từ các domain khác: Chuyển đổi sang đường dẫn localhost hoặc hiển thị hình ảnh mặc định
// 3. Hình ảnh đã có sẵn trong dự án (public folder): Giữ nguyên đường dẫn

interface ImageWrapperProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string; // Hình ảnh thay thế nếu không thể tải hình chính
  localPath?: string; // Đường dẫn tương đối tới thư mục public
}

export default function ImageWrapper({
  src,
  fallbackSrc = "/images/placeholder.jpg",
  localPath = "/images",
  alt,
  ...props
}: ImageWrapperProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Nếu src là URL từ S3 bucket
    if (src && src.includes("s3-hcm5-r1.longvan.net")) {
      try {
        // Trích xuất tên file từ URL
        const fileName = src.split("/").pop();
        // Tạo đường dẫn mới trỏ đến thư mục public/images
        const localSrc = `${localPath}/${fileName}`;
        console.log(`Chuyển đổi URL hình ảnh: ${src} -> ${localSrc}`);
        setImageSrc(localSrc);
      } catch (e) {
        console.error("Lỗi khi xử lý URL hình ảnh:", e);
        setError(true);
      }
    } else {
      // Giữ nguyên src nếu không phải từ S3
      setImageSrc(src);
    }
  }, [src, localPath]);

  // Xử lý lỗi khi tải hình ảnh
  const handleError = () => {
    console.warn(`Không thể tải hình ảnh: ${imageSrc}. Sử dụng hình thay thế.`);
    setError(true);
  };

  // Hiển thị hình ảnh thay thế nếu có lỗi
  if (error) {
    return (
      <Image src={fallbackSrc} alt={alt || "Hình ảnh thay thế"} {...props} />
    );
  }

  // Không hiển thị gì nếu chưa xử lý xong đường dẫn
  if (!imageSrc) {
    return null;
  }

  return (
    <Image
      src={imageSrc}
      alt={alt || "Hình ảnh"}
      {...props}
      onError={handleError}
    />
  );
}
