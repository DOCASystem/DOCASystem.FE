"use client";

import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Form() {
  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  // Xử lý khi người dùng click nút Gửi
  const handleSendClick = () => {
    // Hiển thị toast thông báo thành công - Chỉ xử lý UI
    toast.success("Gửi thông tin thành công", {
      position: "top-right",
      autoClose: 3000,
    });

    // Reset form để xóa dữ liệu đã nhập
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      {/* Thêm ToastContainer vào component */}
      <ToastContainer />

      <form
        className="w-full lg:flex-1 bg-gray-100 p-4 md:p-6 rounded-xl shadow-md"
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn chặn form submit mặc định
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="firstName" label="Họ" placeholder="Nhập họ" />
          <Input name="lastName" label="Tên" placeholder="Nhập tên" />
        </div>
        <div className="mt-4">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div className="mt-4">
          <Input
            name="message"
            label="Nội dung"
            placeholder="Nhập nội dung..."
            isTextArea
          />
        </div>
        <div className="mt-6">
          <Button
            type="button"
            onClick={handleSendClick}
            className="w-full sm:w-32 h-12 bg-pink-doca text-white hover:bg-pink-500 transition-colors"
          >
            Gửi
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
