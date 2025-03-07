"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { productSchema } from "@/utils/validation";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";

// Định nghĩa kiểu dữ liệu cho form
type EditProductFormData = {
  name: string;
  categoryIds: string[];
  size: string;
  price: number;
  description: string;
  quantity: number;
  mainImage: File | null;
};

// Định nghĩa kiểu dữ liệu giả cho sản phẩm
interface ProductData {
  id: string;
  name: string;
  categoryIds: string[];
  size: string;
  price: number;
  description: string;
  quantity: number;
  imageUrl?: string;
}

export default function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Lấy ID từ cả params và searchParams để đảm bảo
  const id = (params?.id as string) || searchParams.get("id");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Thêm state cho dialog xác nhận cập nhật sản phẩm
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<EditProductFormData | null>(null);

  // Giá trị mặc định
  const defaultValues: EditProductFormData = {
    name: "",
    categoryIds: [],
    size: "",
    price: 0,
    description: "",
    quantity: 0,
    mainImage: null,
  };

  // Giả lập việc fetch dữ liệu
  useEffect(() => {
    console.log("ID sản phẩm:", id);

    if (!id) {
      setError("Không tìm thấy ID sản phẩm");
      setIsLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        setIsLoading(true);

        // Đây là nơi bạn sẽ gọi API thực tế
        // const response = await fetch(`/api/products/${id}`);
        // const data = await response.json();

        // Mô phỏng việc gọi API
        // Sử dụng dữ liệu hardcode để đảm bảo luôn hiển thị
        const mockData: ProductData = {
          id: id || "1",
          name: "Thức ăn cho chó ROYAL CANIN",
          categoryIds: ["dog"],
          size: "2kg",
          price: 250000,
          description: "Thức ăn dinh dưỡng cao cấp dành cho chó",
          quantity: 50,
          imageUrl: "https://example.com/product-image.jpg",
        };

        setProductData(mockData);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Cập nhật giá trị mặc định khi có dữ liệu sản phẩm
  const formValues = productData
    ? {
        name: productData.name,
        categoryIds: productData.categoryIds,
        size: productData.size,
        price: productData.price,
        description: productData.description,
        quantity: productData.quantity,
        mainImage: null,
      }
    : defaultValues;

  // Hàm mở dialog xác nhận cập nhật
  const openUpdateDialog = (data: EditProductFormData) => {
    setFormDataToSubmit(data);
    setIsUpdateDialogOpen(true);
  };

  // Hàm hủy cập nhật sản phẩm
  const cancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setFormDataToSubmit(null);
  };

  // Sửa lại hàm onSubmit để hiển thị dialog xác nhận trước
  const onSubmit = (data: EditProductFormData) => {
    openUpdateDialog(data);
  };

  // Hàm thực hiện cập nhật sản phẩm sau khi xác nhận
  const confirmUpdate = async () => {
    if (!formDataToSubmit) return;

    // Chuyển hướng về trang quản lý sản phẩm sau khi lưu thành công
    alert("Cập nhật sản phẩm thành công!");
    setIsUpdateDialogOpen(false);
    router.push("/products-management");
  };

  // Hiển thị không sử dụng điều kiện loading để đảm bảo form luôn hiển thị
  return (
    <div>
      {error ? (
        <div className="text-center py-10 text-red-500">
          {error}
          <div className="mt-4">
            <button
              onClick={() => router.push("/products-management")}
              className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      ) : (
        <AdminForm<EditProductFormData>
          title="Chỉnh sửa sản phẩm"
          schema={productSchema}
          defaultValues={formValues}
          onSubmit={onSubmit}
          backLink="/products-management"
          submitButtonText="Cập nhật sản phẩm"
          maxHeight="max-h-[calc(100vh-200px)]"
          formClassName="h-[calc(100vh-150px)]"
          contentClassName="pb-4 custom-scrollbar"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <div className="text-lg font-medium text-pink-doca">
                Đang tải dữ liệu sản phẩm...
              </div>
            </div>
          )}

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
                defaultValue={productData?.categoryIds[0] || ""}
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
            {productData?.imageUrl && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Hình ảnh hiện tại:</p>
                <img
                  src={productData.imageUrl}
                  alt={productData.name}
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
              <p>Kéo và thả ảnh hoặc nhấp để chọn ảnh mới</p>
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
      )}

      {/* Dialog xác nhận cập nhật */}
      <ConfirmDialog
        isOpen={isUpdateDialogOpen}
        title="Xác nhận cập nhật sản phẩm"
        message="Bạn có chắc chắn muốn cập nhật sản phẩm này với những thay đổi đã nhập?"
        confirmButtonText="Cập nhật"
        cancelButtonText="Hủy"
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
        type="info"
      />
    </div>
  );
}
