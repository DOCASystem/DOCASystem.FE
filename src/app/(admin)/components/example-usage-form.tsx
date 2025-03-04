"use client";

import * as yup from "yup";
import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";

// Định nghĩa schema validation bằng Yup
const productSchema = yup.object({
  name: yup
    .string()
    .required("Tên sản phẩm không được để trống")
    .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  price: yup.string().required("Giá sản phẩm không được để trống"),
  description: yup.string(),
  category: yup.string().required("Danh mục không được để trống"),
});

// Định nghĩa kiểu dữ liệu
type ProductFormData = Record<string, unknown> & {
  name: string;
  price: string;
  description: string;
  category: string;
};

export default function ExampleProductForm() {
  // Giá trị mặc định
  const defaultValues: ProductFormData = {
    name: "",
    price: "",
    description: "",
    category: "",
  };

  // Xử lý khi submit form
  const onSubmit = (data: ProductFormData) => {
    console.log("Dữ liệu sản phẩm:", data);
    // Xử lý thêm (gọi API, lưu dữ liệu, v.v)
  };

  return (
    <AdminForm<ProductFormData>
      title="Thêm Sản Phẩm Mới"
      schema={productSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      backLink="/admin/products"
      submitButtonText="Lưu Sản Phẩm"
    >
      {/* Children là các field input */}
      <Input name="name" label="Tên sản phẩm" placeholder="Nhập tên sản phẩm" />

      <Input
        name="price"
        label="Giá sản phẩm"
        placeholder="Nhập giá sản phẩm"
      />

      <Input name="category" label="Danh mục" placeholder="Chọn danh mục" />

      <Input
        name="description"
        label="Mô tả"
        placeholder="Nhập mô tả sản phẩm"
        isTextArea={true}
      />
    </AdminForm>
  );
}
