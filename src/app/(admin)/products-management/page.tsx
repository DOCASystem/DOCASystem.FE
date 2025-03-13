"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";
import { ProductService } from "@/service/product-service";
import { toast } from "react-toastify";

interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  volume: number;
  price: number;
  isHidden: boolean;
  productImages: ProductImage[];
  categories: Category[];
}

interface ProductResponseIPaginate {
  items: Product[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  size: number;
}

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });

  // Lấy danh sách sản phẩm
  const fetchProducts = async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await ProductService.getProducts({
        page,
        size: pagination.pageSize,
      });

      if (response && response.data) {
        const data = response.data as ProductResponseIPaginate;
        setProducts(data.items);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.totalItems,
          pageSize: data.size,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      // toast.error("Không thể lấy danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await ProductService.deleteProduct(productToDelete);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts(pagination.currentPage);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  // Hiển thị dialog xác nhận xóa
  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setShowDeleteDialog(true);
  };

  // Lấy hình ảnh chính của sản phẩm
  const getMainImage = (product: Product) => {
    const mainImage = product.productImages?.find((img) => img.isMain);
    return mainImage?.imageUrl || "/images/placeholder.png";
  };

  // Lấy tên danh mục của sản phẩm
  const getCategoryNames = (product: Product) => {
    return (
      product.categories?.map((cat) => cat.name).join(", ") || "Chưa phân loại"
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Link href="/products-management/add">
          <Button variant="primary">Thêm sản phẩm</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Đang tải...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left">Hình ảnh</th>
                  <th className="py-3 px-4 border-b text-left">Tên sản phẩm</th>
                  <th className="py-3 px-4 border-b text-left">Danh mục</th>
                  <th className="py-3 px-4 border-b text-left">Số lượng</th>
                  <th className="py-3 px-4 border-b text-left">Giá (VNĐ)</th>
                  <th className="py-3 px-4 border-b text-left">Trạng thái</th>
                  <th className="py-3 px-4 border-b text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={getMainImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b">{product.name}</td>
                      <td className="py-3 px-4 border-b">
                        {getCategoryNames(product)}
                      </td>
                      <td className="py-3 px-4 border-b">{product.quantity}</td>
                      <td className="py-3 px-4 border-b">
                        {product.price.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            product.isHidden
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.isHidden ? "Ẩn" : "Hiển thị"}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="flex space-x-2">
                          <Link
                            href={`/products-management/view-product/${product.id}`}
                          >
                            <Button variant="secondary" size="sm">
                              Xem
                            </Button>
                          </Link>
                          <Link
                            href={`/products-management/edit/${product.id}`}
                          >
                            <Button variant="secondary" size="sm">
                              Sửa
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => confirmDelete(product.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      Không có sản phẩm nào. Hãy thêm sản phẩm mới.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setShowDeleteDialog(false);
          setProductToDelete(null);
        }}
        type="danger"
      />
    </div>
  );
}
