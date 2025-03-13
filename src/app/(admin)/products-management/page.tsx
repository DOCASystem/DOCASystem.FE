"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Hàm trình xử lý lỗi hình ảnh
const fallbackImageUrl = "/images/placeholder.png";

// Tối ưu hiệu suất cho các thành phần con
const ProductTableItem = React.memo(
  ({
    product,
    onDelete,
  }: {
    product: Product;
    onDelete: (id: string) => void;
  }) => {
    // Lấy hình ảnh chính của sản phẩm
    const mainImage = useMemo(() => {
      const img = product.productImages?.find((img) => img.isMain);
      return img?.imageUrl || fallbackImageUrl;
    }, [product.productImages]);

    // Lấy tên danh mục của sản phẩm
    const categoryNames = useMemo(() => {
      return (
        product.categories?.map((cat) => cat.name).join(", ") ||
        "Chưa phân loại"
      );
    }, [product.categories]);

    const [imgError, setImgError] = useState(false);
    const [isImgLoaded, setIsImgLoaded] = useState(false);

    const handleImageError = () => {
      setImgError(true);
    };

    const handleImageLoad = () => {
      setIsImgLoaded(true);
    };

    return (
      <tr key={product.id} className="hover:bg-gray-50">
        <td className="py-3 px-4 border-b">
          <div className="w-16 h-16 relative bg-gray-100 rounded">
            {!isImgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              src={imgError ? fallbackImageUrl : mainImage}
              alt={product.name}
              fill
              className={`object-cover rounded transition-opacity ${
                isImgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              sizes="(max-width: 640px) 64px, 64px"
              priority={false}
            />
          </div>
        </td>
        <td className="py-3 px-4 border-b">{product.name}</td>
        <td className="py-3 px-4 border-b">{categoryNames}</td>
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
              className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
            >
              Chi tiết
            </Link>
            <Link
              href={`/products-management/edit/${product.id}`}
              className="px-4 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
            >
              Chỉnh sửa
            </Link>
            <button
              onClick={() => onDelete(product.id)}
              className="px-4 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-all"
            >
              Xóa
            </button>
          </div>
        </td>
      </tr>
    );
  }
);
ProductTableItem.displayName = "ProductTableItem";

// Component chính
export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });
  const [cachedData, setCachedData] = useState<{
    [page: number]: {
      products: Product[];
      pagination: typeof pagination;
      timestamp: number;
    };
  }>({});

  // Lấy danh sách sản phẩm với bộ nhớ đệm
  const fetchProducts = useCallback(
    async (page = 1) => {
      // Kiểm tra cache
      const now = Date.now();
      const cacheMaxAge = 5 * 60 * 1000; // Tăng thời gian cache lên 5 phút
      const cachedEntry = cachedData[page];

      if (cachedEntry && now - cachedEntry.timestamp < cacheMaxAge) {
        console.log(
          `Sử dụng dữ liệu đã lưu trong bộ nhớ đệm cho trang ${page}`
        );
        setProducts(cachedEntry.products);
        setPagination(cachedEntry.pagination);
        return;
      }

      // Tránh nhiều request cùng lúc
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await ProductService.getProducts({
          page,
          size: pagination.pageSize,
        });

        if (response && response.data) {
          const data = response.data as ProductResponseIPaginate;

          // Kiểm tra dữ liệu trước khi cập nhật state
          if (Array.isArray(data.items)) {
            setProducts(data.items);
            setPagination({
              currentPage: data.currentPage || 1,
              totalPages: data.totalPages || 1,
              totalItems: data.totalItems || 0,
              pageSize: data.size || pagination.pageSize,
            });

            // Lưu vào cache
            setCachedData((prev) => ({
              ...prev,
              [page]: {
                products: data.items,
                pagination: {
                  currentPage: data.currentPage || 1,
                  totalPages: data.totalPages || 1,
                  totalItems: data.totalItems || 0,
                  pageSize: data.size || pagination.pageSize,
                },
                timestamp: now,
              },
            }));
          } else {
            console.error("Dữ liệu trả về không hợp lệ:", data);
            toast.error("Dữ liệu sản phẩm không hợp lệ", {
              toastId: "invalid-data-error",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        // Sử dụng toastId để tránh hiển thị nhiều thông báo trùng lặp
        toast.error("Không thể lấy danh sách sản phẩm", {
          toastId: "fetch-products-error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.pageSize, cachedData, isLoading]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;

    try {
      await ProductService.deleteProduct(productToDelete);
      toast.success("Xóa sản phẩm thành công", {
        toastId: "delete-product-success",
      });

      // Xóa cache khi có thay đổi dữ liệu
      setCachedData({});

      fetchProducts(pagination.currentPage);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm", {
        toastId: "delete-product-error",
      });
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  }, [productToDelete, pagination.currentPage, fetchProducts]);

  // Xử lý khi thay đổi trang
  const handlePageChange = useCallback(
    (page: number) => {
      fetchProducts(page);
    },
    [fetchProducts]
  );

  // Hiển thị dialog xác nhận xóa
  const confirmDelete = useCallback((id: string) => {
    setProductToDelete(id);
    setShowDeleteDialog(true);
  }, []);

  // Tối ưu hiệu suất khi hiển thị danh sách sản phẩm
  const productTableItems = useMemo(() => {
    if (!products.length) {
      return (
        <tr>
          <td colSpan={7} className="py-8 text-center">
            Không có sản phẩm nào. Hãy thêm sản phẩm mới.
          </td>
        </tr>
      );
    }

    return products.map((product) => (
      <ProductTableItem
        key={product.id}
        product={product}
        onDelete={confirmDelete}
      />
    ));
  }, [products, confirmDelete]);

  // Tối ưu tải trang và ngăn chặn lỗi runtime
  const safeTableRender = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p>Đang tải...</p>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="bg-white p-6 rounded shadow-sm">
          <p className="text-center text-gray-500">
            Không có sản phẩm nào. Hãy thêm sản phẩm mới.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="overflow-x-auto bg-white rounded shadow-sm">
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
            <tbody>{productTableItems}</tbody>
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

      {safeTableRender()}

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
