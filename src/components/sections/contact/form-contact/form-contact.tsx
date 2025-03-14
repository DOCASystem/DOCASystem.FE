"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formSchema } from "@/utils/validation";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button/button";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  message?: string;
}

export default function Form() {
  const methods = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Dữ liệu nhập:", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full lg:flex-1 bg-gray-100 p-4 md:p-6 rounded-xl shadow-md"
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
          <Button className="w-full sm:w-32 h-12 bg-pink-doca text-white hover:bg-pink-500 transition-colors">
            Gửi
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
