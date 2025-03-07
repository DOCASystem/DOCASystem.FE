"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";

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
    {
      id: "6",
      name: "Thức ăn cho mèo Whiskas",
      category: "Đồ ăn cho mèo",
      quantity: 80,
      price: 90000,
      image: "/images/cat-food.png",
    },
    {
      id: "7",
      name: "Vòng cổ chó mèo",
      category: "Phụ kiện",
      quantity: 50,
      price: 85000,
      image: "/images/pet-collar.png",
    },
    {
      id: "8",
      name: "Cát vệ sinh cho mèo",
      category: "Vệ sinh",
      quantity: 60,
      price: 125000,
      image: "/images/cat-litter.png",
    },
  ]);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== productToDelete));
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDeleteProduct = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Tính toán sản phẩm cần hiển thị cho trang hiện tại
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  // Tính tổng số trang
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className=" mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-pink-doca">Sản Phẩm</h1>
        <Button className="w-44 h-11 text-lg">
          <Link
            href="/products-management/add"
            className=" text-white text-lg rounded-lg transition-all"
          >
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2">
        {currentProducts.map((product) => (
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
                onClick={() => openDeleteDialog(product.id)}
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

      {/* Thêm phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmButtonText="Xóa"
        cancelButtonText="Hủy"
        onConfirm={confirmDeleteProduct}
        onCancel={cancelDeleteProduct}
        type="danger"
      />
    </div>
  );
}
