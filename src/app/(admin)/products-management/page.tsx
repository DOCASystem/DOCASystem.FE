"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
};

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Đồ ăn hình xương",
      category: "Đồ ăn cho chó",
      quantity: 100,
      price: 100000,
      image: "/images/dog-food.png",
    },
    {
      id: "2",
      name: "Đồ ăn hình xương",
      category: "Đồ ăn cho chó",
      quantity: 100,
      price: 100000,
      image: "/images/dog-food.png",
    },
    {
      id: "3",
      name: "Đồ ăn hình xương",
      category: "Đồ ăn cho chó",
      quantity: 100,
      price: 100000,
      image: "/images/dog-food.png",
    },
    {
      id: "4",
      name: "Đồ ăn hình xương",
      category: "Đồ ăn cho chó",
      quantity: 100,
      price: 100000,
      image: "/images/dog-food.png",
    },
    {
      id: "5",
      name: "Đồ ăn hình xương",
      category: "Đồ ăn cho chó",
      quantity: 100,
      price: 100000,
      image: "/images/dog-food.png",
    },
  ]);

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-500">Sản Phẩm</h1>
        <Link
          href="/products-management/add"
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full transition-all"
        >
          Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center p-4 border-b last:border-b-0 rounded-md my-2 bg-white shadow-sm"
          >
            <div className="h-16 w-16 mr-4 overflow-hidden rounded-full">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Phân loại: {product.category}
              </p>
            </div>

            <div className="flex-shrink-0 mx-4 text-sm text-gray-600">
              SL còn lại: {product.quantity} SP
            </div>

            <div className="flex-shrink-0 mx-4 font-medium">
              {product.price.toLocaleString()}đ
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href={`/products-management/edit?id=${product.id}`}
                className="px-4 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
              >
                Edit
              </Link>

              <Link
                href={`/products-management/view-product?id=${product.id}`}
                className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
              >
                Detail
              </Link>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
