import AddProductForm from "./add-product-form/add-product-form";

// Xác định trang không dùng bộ đệm tĩnh
export const dynamic = "force-dynamic";

export default function AddProductPage() {
  return (
    <div>
      <AddProductForm />
    </div>
  );
}
