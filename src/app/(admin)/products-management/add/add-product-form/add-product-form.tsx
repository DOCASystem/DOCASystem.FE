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
import ImageUpload from "@/components/common/image-upload/image-upload";
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

// Định nghĩa kiểu dữ liệu cho form
type AddProductFormData = {
  name: string;
  categoryIds: string[];
  description: string;
  price: number;
  quantity: number;
  volume: number;
  isHidden: boolean;
  productImages: {
    imageUrl: string;
    isMain: boolean;
  }[];
};

export default function AddProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);

  // Giá trị mặc định
  const defaultValues: AddProductFormData = {
    name: "",
    categoryIds: [],
    description: "",
    price: 0,
    quantity: 0,
    volume: 0,
    isHidden: false,
    productImages: [],
  };

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      try {
        console.log("Đang gọi API lấy danh sách danh mục...");
        const response = await CategoryService.getCategories({
          page: 0,
          size: 100,
        });

        if (response && response.data) {
          console.log("Dữ liệu danh mục nhận được:", response.data);
          const data = response.data as CategoryResponseIPaginate;
          if (data.items && Array.isArray(data.items)) {
            if (data.items.length === 0) {
              console.log("Danh sách danh mục trống");
              setCategories([]);
            } else {
              const categoryOptions = data.items.map(
                (category: CategoryResponse) => ({
                  value: category.id,
                  label: category.name,
                })
              );
              setCategories(categoryOptions);
              console.log("Đã xử lý danh mục:", categoryOptions);
            }
          } else {
            console.error("Dữ liệu danh mục không đúng định dạng:", data);
            setCategories([]);
          }
        } else {
          console.error("Không nhận được dữ liệu từ API danh mục");
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi chi tiết khi lấy danh sách danh mục:", error);
        setCategories([]);
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý khi submit form
  const onSubmit = async (data: AddProductFormData) => {
    setIsLoading(true);
    try {
      await ProductService.createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        volume: data.volume,
        isHidden: data.isHidden,
        productImages: data.productImages,
        categoryIds: data.categoryIds,
      });

      toast.success("Thêm sản phẩm thành công");
      router.push("/products-management");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Không thể thêm sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý tạo danh mục mới
  const handleCreateCategory = async (
    name: string,
    description: string = ""
  ) => {
    // Kiểm tra token admin
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không có token admin");
      return null;
    }

    try {
      console.log("Đang tạo danh mục mới:", { name, description });

      if (!CategoryService || !CategoryService.createCategory) {
        console.error(
          "CategoryService hoặc CategoryService.createCategory không tồn tại"
        );
        return null;
      }

      const response = await CategoryService.createCategory({
        name,
        description,
      });

      console.log("Kết quả tạo danh mục:", response);

      if (response && response.data) {
        const newCategory = response.data as CategoryResponse;
        console.log("Danh mục mới đã được tạo:", newCategory);

        // Thêm danh mục mới vào danh sách
        const newCategoryOption = {
          value: newCategory.id,
          label: newCategory.name,
        };

        setCategories((prev) => [...prev, newCategoryOption]);
        toast.success(`Đã thêm danh mục "${newCategory.name}" thành công`);

        return newCategoryOption;
      } else {
        console.error("Không nhận được dữ liệu từ API tạo danh mục");
        return null;
      }
    } catch (error) {
      console.error("Chi tiết lỗi khi thêm danh mục:", error);
      return null;
    }
  };

  return (
    <div>
      <AdminForm<AddProductFormData>
        title="Thêm sản phẩm mới"
        schema={productSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        backLink="/products-management"
        submitButtonText="Lưu sản phẩm"
        maxHeight="max-h-[calc(100vh-200px)]"
        formClassName="h-[calc(100vh-150px)]"
        contentClassName="pb-4 custom-scrollbar"
        isSubmitting={isLoading}
      >
        {isFetchingCategories ? (
          <div className="flex items-center justify-center h-full">
            <p>Đang tải danh mục...</p>
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
              isCreatable
              onCreateOption={handleCreateCategory}
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
