import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { productSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type ProductFormData = Record<string, unknown> & {
  name: string;
  categoryIds: string;
  size: string;
  price: string;
  description: string;
  quantity: number;
  img: string;
};

export default function ProductForm() {
  const methods = useForm<FormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      categoryIds: "",
      size: "",
      price: "",
      description: "",
      quantity: 0,
      img: "",
    },
  });

  const onSubmit = (data: ProductFormData) => {
    console.log("Dữ liệu nhập:", data);
  };

  return (
    <div>
      <AdminForm<ProductFormData>
        title="Thêm sản phẩm mới"
        schema={productSchema}
        defaultValues={methods.defaultValues}
        onSubmit={methods.handleSubmit(onSubmit)}
        backLink="/admin/products"
        submitButtonText="Lưu sản phẩm"
      >
        <Input
          name="name"
          label="Tên sản phẩm"
          placeholder="Nhập tên sản phẩm"
        ></Input>
      </AdminForm>
    </div>
  );
}
