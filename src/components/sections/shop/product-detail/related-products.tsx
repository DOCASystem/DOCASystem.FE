"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductImage {
  id: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  productImages: ProductImage[];
}

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách sản phẩm liên quan trong cùng danh mục
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          `[Related Products] Đang tải sản phẩm liên quan, danh mục: ${categoryId}`
        );

        // Tạo URL API để lấy sản phẩm theo danh mục
        const apiUrl = `https://production.doca.love/api/v1/products?page=1&size=5&categoryId=${categoryId}`;

        console.log(`[Related Products] Gọi API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi API: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `[Related Products] Nhận được ${data.items?.length || 0} sản phẩm`
        );

        // Lọc bỏ sản phẩm hiện tại và lấy tối đa 4 sản phẩm liên quan
        const filteredProducts = (data.items || [])
          .filter((product: Product) => product.id !== currentProductId)
          .slice(0, 4);

        setProducts(filteredProducts);
      } catch (err) {
        console.error(
          "[Related Products] Lỗi khi tải sản phẩm liên quan:",
          err
        );
        setError("Không thể tải sản phẩm liên quan");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Nếu đang tải
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="bg-gray-200 aspect-square w-full rounded-md mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-4/5 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Nếu có lỗi hoặc không có sản phẩm liên quan
  if (error || products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          // Lấy URL ảnh đầu tiên của sản phẩm
          const imageUrl =
            product.productImages && product.productImages.length > 0
              ? product.productImages[0].imageUrl
              : "/images/product-placeholder.jpg";

          return (
            <Link
              href={`/shop/${product.id}`}
              key={product.id}
              className="bg-white p-3 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3">
                <Image
                  src={imageUrl}
                  alt={product.name || "Sản phẩm liên quan"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">
                {product.name}
              </h3>
              <p className="text-pink-doca font-bold">
                {formatPrice(product.price)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
