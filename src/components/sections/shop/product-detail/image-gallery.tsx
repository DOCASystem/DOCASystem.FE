"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({
  images,
  productName,
}: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState<string>(
    images && images.length > 0
      ? images[0].imageUrl
      : "/images/product-placeholder.jpg"
  );

  // Nếu không có hình ảnh nào
  if (!images || images.length === 0) {
    return (
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-4">
        <Image
          src="/images/product-placeholder.jpg"
          alt={productName || "Sản phẩm"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Ảnh chính */}
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-4">
        <Image
          src={mainImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Danh sách ảnh phụ */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                mainImage === image.imageUrl
                  ? "border-pink-doca"
                  : "border-transparent"
              }`}
              onClick={() => setMainImage(image.imageUrl)}
            >
              <Image
                src={image.imageUrl}
                alt={`${productName} - Ảnh ${image.id}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
