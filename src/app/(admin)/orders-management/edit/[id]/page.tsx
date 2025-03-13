"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Input from "@/components/common/input/input";
import AdminForm from "@/components/common/form/admin-form";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// Định nghĩa schema cho form chỉnh sửa đơn hàng
const editOrderSchema = yup.object().shape({
  customerName: yup.string().required("Tên khách hàng là bắt buộc"),
  customerPhone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Số điện thoại là bắt buộc"),
  customerEmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc"),
  customerAddress: yup.string().required("Địa chỉ là bắt buộc"),
  status: yup.string().required("Trạng thái đơn hàng là bắt buộc"),
  blogId: yup.string().nullable(),
});

// Định nghĩa kiểu dữ liệu cho form
type EditOrderFormData = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  status: string;
  blogId: string | null;
};

// Định nghĩa kiểu dữ liệu cho đơn hàng
type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  orderDate: string;
  total: number;
  status: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category: string;
    image?: string;
  }[];
  blog?: {
    id: string;
    title: string;
  };
};

// Định nghĩa kiểu dữ liệu cho blog
type Blog = {
  id: string;
  title: string;
};

export default function EditOrderPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<EditOrderFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    status: "",
    blogId: null,
  });

  // State cho dialog xác nhận
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<EditOrderFormData | null>(null);

  // Form methods
  const methods = useForm<EditOrderFormData>({
    resolver: yupResolver(editOrderSchema),
    defaultValues: formValues,
  });

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchOrderAndBlogs = async () => {
      setIsLoading(true);
      try {
        // Giả lập delay để mô phỏng việc gọi API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dữ liệu mẫu cho đơn hàng
        const sampleOrder: Order = {
          id: id as string,
          customerName: "Nguyễn Văn A",
          customerPhone: "0901234567",
          customerEmail: "nguyenvana@example.com",
          customerAddress: "123 Đường Lê Lợi, Q.1, TP.HCM",
          orderDate: "15/03/2024",
          total: 450000,
          status: "Chờ xác nhận",
          products: [
            {
              id: "1",
              name: "Mì Ý cao cấp nhập khẩu",
              quantity: 2,
              price: 120000,
              category: "Thực phẩm khô",
              image: "/images/blog-placeholder.png",
            },
            {
              id: "3",
              name: "Gạo Nhật Bản đặc biệt",
              quantity: 1,
              price: 85000,
              category: "Gạo & Ngũ cốc",
              image: "/images/blog-placeholder.png",
            },
          ],
          blog: {
            id: "2",
            title: "Cách bảo quản thực phẩm trong mùa hè",
          },
        };

        // Cập nhật danh sách blog để có nội dung phù hợp với đồ ăn
        // Dữ liệu mẫu cho danh sách blog
        const sampleBlogs: Blog[] = [
          { id: "1", title: "Những loại thực phẩm tốt cho sức khỏe" },
          { id: "2", title: "Cách bảo quản thực phẩm trong mùa hè" },
          { id: "3", title: "Mẹo nấu ăn ngon mỗi ngày" },
          { id: "4", title: "Thực phẩm giàu protein cho người tập gym" },
          { id: "5", title: "Công thức làm các món ăn vặt tại nhà" },
        ];

        setOrder(sampleOrder);
        setBlogs(sampleBlogs);

        // Cập nhật giá trị mặc định cho form
        const defaultValues: EditOrderFormData = {
          customerName: sampleOrder.customerName,
          customerPhone: sampleOrder.customerPhone,
          customerEmail: sampleOrder.customerEmail,
          customerAddress: sampleOrder.customerAddress,
          status: sampleOrder.status,
          blogId: sampleOrder.blog?.id || null,
        };

        setFormValues(defaultValues);
        methods.reset(defaultValues);

        setError(null);
      } catch (err) {
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
        console.error("Error fetching order and blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderAndBlogs();
    }
  }, [id, methods]);

  // Hàm mở dialog xác nhận cập nhật
  const openUpdateDialog = (data: EditOrderFormData) => {
    setFormDataToSubmit(data);
    setIsUpdateDialogOpen(true);
  };

  // Hàm hủy cập nhật đơn hàng
  const cancelUpdate = () => {
    setIsUpdateDialogOpen(false);
    setFormDataToSubmit(null);
  };

  // Hàm xử lý khi submit form
  const onSubmit = (data: EditOrderFormData) => {
    openUpdateDialog(data);
  };

  // Hàm xử lý khi xác nhận cập nhật đơn hàng
  const confirmUpdate = async () => {
    if (!formDataToSubmit) return;

    setIsSaving(true);
    try {
      // Giả lập delay để mô phỏng việc gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Trong thực tế, ở đây sẽ gọi API để cập nhật đơn hàng

      toast.success("Cập nhật đơn hàng thành công!");
      setIsUpdateDialogOpen(false);

      // Chuyển hướng về trang quản lý đơn hàng sau khi lưu thành công
      setTimeout(() => {
        router.push("/orders-management");
      }, 1000);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Cập nhật đơn hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-pink-doca">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Không tìm thấy thông tin đơn hàng"}
        <div className="mt-4">
          <button
            onClick={() => router.push("/orders-management")}
            className="px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <AdminForm<EditOrderFormData>
        title="Chỉnh sửa đơn hàng"
        schema={editOrderSchema}
        defaultValues={formValues}
        onSubmit={onSubmit}
        backLink="/orders-management"
        submitButtonText={isSaving ? "Đang lưu..." : "Cập nhật đơn hàng"}
        methods={methods}
        maxHeight="max-h-[calc(100vh-200px)]"
        formClassName="h-[calc(100vh-150px)]"
        contentClassName="pb-4 custom-scrollbar"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div className="text-lg font-medium text-pink-doca">
              Đang tải dữ liệu đơn hàng...
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Thông tin khách hàng
            </h3>
            <Input
              name="customerName"
              label="Tên khách hàng"
              placeholder="Nhập tên khách hàng"
            />
            <Input
              name="customerPhone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
            />
            <Input
              name="customerEmail"
              label="Email"
              placeholder="Nhập email"
            />
            <Input
              name="customerAddress"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              isTextArea
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Thông tin đơn hàng
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã đơn hàng
              </label>
              <input
                type="text"
                value={order.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày đặt
              </label>
              <input
                type="text"
                value={order.orderDate}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tổng tiền
              </label>
              <input
                type="text"
                value={`${order.total.toLocaleString()}đ`}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái đơn hàng
              </label>
              <select
                {...methods.register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-doca focus:border-transparent"
              >
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Đã giao hàng">Đã giao hàng</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
              {methods.formState.errors.status && (
                <p className="mt-1 text-xs text-red-500">
                  {methods.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog liên quan
              </label>
              <select
                {...methods.register("blogId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-doca focus:border-transparent"
              >
                <option value="">Không có</option>
                {blogs.map((blog) => (
                  <option key={blog.id} value={blog.id}>
                    {blog.title}
                  </option>
                ))}
              </select>
              {methods.formState.errors.blogId && (
                <p className="mt-1 text-xs text-red-500">
                  {methods.formState.errors.blogId.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Danh sách sản phẩm
          </h3>
          <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sản phẩm
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phân loại
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Đơn giá
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số lượng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              sizes="100%"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(product.price * product.quantity).toLocaleString()}đ
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-right font-semibold"
                  >
                    Tổng cộng:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {order.total.toLocaleString()}đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Sản phẩm không thể chỉnh sửa sau khi đơn hàng đã được tạo.
          </p>
        </div>
      </AdminForm>

      {/* Dialog xác nhận cập nhật */}
      <ConfirmDialog
        isOpen={isUpdateDialogOpen}
        title="Xác nhận cập nhật đơn hàng"
        message="Bạn có chắc chắn muốn cập nhật đơn hàng này với những thay đổi đã nhập?"
        confirmButtonText="Cập nhật"
        cancelButtonText="Hủy"
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
        type="info"
      />
    </div>
  );
}
