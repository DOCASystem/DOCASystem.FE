"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { productSchema } from "@/utils/validation";
import { ProductService } from "@/service/product-service";
import { CategoryService } from "@/service/category-service";
import { toast } from "react-toastify";
import Select from "@/components/common/select/select";
import Textarea from "@/components/common/textarea/textarea";
import ImageUpload from "../../../../../components/common/image-upload/image-upload";
import Checkbox from "@/components/common/checkbox/checkbox";

// Định nghĩa kiểu dữ liệu cho API response
interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

interface CategoryResponseIPaginate {
  items: CategoryResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  volume: number;
  isHidden: boolean;
  productImages: ProductImage[];
  categories: CategoryResponse[];
  createdAt: string;
  modifiedAt: string;
}

// Định nghĩa kiểu dữ liệu cho form
type EditProductFormData = {
  name: string;
  categoryIds: string[];
  description: string;
  price: number;
  quantity: number;
  volume: number;
  isHidden: boolean;
  productImages: {
    id?: string;
    imageUrl: string;
    isMain: boolean;
  }[];
};

export interface EditProductFormProps {
  productId: string;
}

export default function EditProductContent({
  productId,
}: EditProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  // Giá trị mặc định
  const defaultValues: EditProductFormData = {
    name: "",
    categoryIds: [],
    description: "",
    price: 0,
    quantity: 0,
    volume: 0,
    isHidden: false,
    productImages: [],
  };

  // Lấy danh sách danh mục và thông tin sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      setIsFormLoading(true);
      try {
        // Lấy danh sách danh mục
        const categoryResponse = await CategoryService.getCategories({
          page: 1,
          size: 100,
        });

        if (categoryResponse && categoryResponse.data) {
          const categoryData =
            categoryResponse.data as CategoryResponseIPaginate;
          const categoryOptions = categoryData.items.map(
            (category: CategoryResponse) => ({
              value: category.id,
              label: category.name,
            })
          );
          setCategories(categoryOptions);
        }

        // Lấy thông tin sản phẩm
        if (productId) {
          const productResponse = await ProductService.getProductById(
            productId
          );
          if (productResponse && productResponse.data) {
            const productData = productResponse.data as ProductResponse;
            setProduct(productData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể lấy dữ liệu");
      } finally {
        setIsFormLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Xử lý khi submit form
  const onSubmit = async (data: EditProductFormData) => {
    setIsLoading(true);
    try {
      // Cập nhật thông tin cơ bản
      await ProductService.updateProduct(productId, {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        volume: data.volume,
        isHidden: data.isHidden,
      });

      // Cập nhật hình ảnh sản phẩm
      if (data.productImages && data.productImages.length > 0) {
        await ProductService.updateProductImage(productId, data.productImages);
      }

      // Cập nhật danh mục sản phẩm
      if (data.categoryIds && data.categoryIds.length > 0) {
        // TODO: API hiện tại không hỗ trợ cập nhật danh mục
        // Cần phát triển tính năng này sau
        console.log("Danh mục được chọn:", data.categoryIds);
      }

      toast.success("Cập nhật sản phẩm thành công");
      router.push("/products-management");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể cập nhật sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý tạo danh mục mới
  // const handleCreateCategory = async (name: string) => {
  //   try {
  //     const response = await CategoryService.createCategory({
  //       name,
  //       description: "",
  //     });

  //     if (response && response.data) {
  //       const newCategory = response.data as CategoryResponse;
  //       toast.success("Thêm danh mục thành công");
  //       // Thêm danh mục mới vào danh sách
  //       setCategories((prev) => [
  //         ...prev,
  //         { value: newCategory.id, label: newCategory.name },
  //       ]);
  //       return { value: newCategory.id, label: newCategory.name };
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error("Lỗi khi thêm danh mục:", error);
  //     toast.error("Không thể thêm danh mục");
  //     return null;
  //   }
  // };

  // Chuẩn bị dữ liệu form từ sản phẩm
  const prepareFormData = (): EditProductFormData => {
    if (!product) return defaultValues;

    return {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      volume: product.volume,
      isHidden: product.isHidden,
      productImages: product.productImages,
      categoryIds: product.categories.map((category) => category.id),
    };
  };

  return (
    <div>
      <AdminForm<EditProductFormData>
        title="Chỉnh sửa sản phẩm"
        schema={productSchema}
        defaultValues={prepareFormData()}
        onSubmit={onSubmit}
        backLink="/products-management"
        submitButtonText="Lưu sản phẩm"
        maxHeight="max-h-[calc(100vh-200px)]"
        formClassName="h-[calc(100vh-150px)]"
        contentClassName="pb-4 custom-scrollbar"
        isSubmitting={isLoading}
      >
        {isFormLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Đang tải...</p>
          </div>
        ) : (
          <>
            <Input
              name="name"
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
            />

            <Select
              name="categoryIds"
              label="Danh mục"
              placeholder="Chọn danh mục"
              options={categories}
              isMulti
            />

            <Textarea
              name="description"
              label="Mô tả"
              placeholder="Nhập mô tả sản phẩm"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="price"
                label="Giá (VNĐ)"
                type="number"
                placeholder="Nhập giá sản phẩm"
              />

              <Input
                name="quantity"
                label="Số lượng"
                type="number"
                placeholder="Nhập số lượng"
              />

              <Input
                name="volume"
                label="Khối lượng"
                type="number"
                placeholder="Nhập khối lượng"
              />
            </div>

            <ImageUpload
              name="productImages"
              label="Hình ảnh sản phẩm"
              multiple
            />

            <Checkbox name="isHidden" label="Ẩn sản phẩm" />
          </>
        )}
      </AdminForm>
    </div>
  );
}
