"use client";

import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { productSchema } from "@/utils/validation";

// Định nghĩa kiểu dữ liệu cho form
type AddProductFormData = {
  name: string;
  categoryIds: string[];
  size: string;
  price: number;
  description: string;
  quantity: number;
  mainImage: File | null;
};

export default function AddProductForm() {
  // Giá trị mặc định
  const defaultValues: AddProductFormData = {
    name: "",
    categoryIds: [],
    size: "",
    price: 0,
    description: "",
    quantity: 0,
    mainImage: null,
  };

  // Xử lý khi submit form
  const onSubmit = (data: AddProductFormData) => {
    console.log("Dữ liệu sản phẩm:", data);
    // Xử lý thêm (gọi API, lưu dữ liệu, v.v)
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
      >
        <Input
          name="name"
          label="Tên sản phẩm"
          placeholder="Nhập tên sản phẩm"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-base font-semibold mb-2">Danh mục</p>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              name="categoryIds"
            >
              <option value="">Chọn danh mục</option>
              <option value="dog">Chó</option>
              <option value="cat">Mèo</option>
            </select>
          </div>

          <Input
            name="size"
            label="Kích thước"
            placeholder="Nhập kích thước sản phẩm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="price"
            label="Giá"
            placeholder="Nhập giá sản phẩm"
            type="number"
          />

          <Input
            name="quantity"
            label="Số lượng"
            placeholder="Nhập số lượng"
            type="number"
          />
        </div>

        <Input
          name="description"
          label="Mô tả"
          placeholder="Nhập mô tả sản phẩm"
          isTextArea={true}
        />

        <div className="mt-4">
          <p className="text-base font-semibold mb-2">Hình ảnh sản phẩm</p>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
            <p>Kéo và thả ảnh hoặc nhấp để chọn ảnh</p>
            <input
              type="file"
              name="mainImage"
              className="hidden"
              id="product-image"
            />
            <label
              htmlFor="product-image"
              className="mt-2 inline-block px-4 py-2 bg-pink-doca text-white rounded-md cursor-pointer"
            >
              Chọn ảnh
            </label>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
