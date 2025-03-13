"use client";

import { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  UseFormReturn,
  DefaultValues,
  Resolver,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/common/button/button";
import LinkNav from "@/components/common/link/link";
import { cn } from "@/utils/cn";
import { AnyObjectSchema } from "yup";

interface AdminFormProps<T extends Record<string, unknown>> {
  title?: string;
  children: ReactNode;
  onSubmit: (data: T) => void;
  schema: AnyObjectSchema;
  defaultValues: DefaultValues<T>;
  backLink?: string;
  backButtonText?: string;
  submitButtonText?: string;
  methods?: UseFormReturn<T>;
  className?: string;
  formClassName?: string;
  submitButtonClassName?: string;
  contentClassName?: string;
  maxHeight?: string;
  isSubmitting?: boolean;
}

export default function AdminForm<T extends Record<string, unknown>>({
  title,
  children,
  onSubmit,
  schema,
  defaultValues,
  backLink = "",
  backButtonText = "Quay lại",
  submitButtonText = "Lưu",
  methods: externalMethods,
  className,
  formClassName,
  submitButtonClassName,
  contentClassName,
  maxHeight = "max-h-[70vh]",
  isSubmitting = false,
}: AdminFormProps<T>) {
  const internalMethods = useForm<T>({
    resolver: yupResolver(schema) as unknown as Resolver<T>,
    defaultValues,
  });

  const methods = externalMethods || internalMethods;
  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-6">
        {title && (
          <h1 className="text-2xl font-semibold text-pink-doca">{title}</h1>
        )}
        {backLink && (
          <Button className="w-32 h-11 text-lg" variant="primary">
            <LinkNav href={backLink}>{backButtonText}</LinkNav>
          </Button>
        )}
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "bg-white p-6 rounded-lg shadow-md flex flex-col h-full",
            formClassName
          )}
        >
          <div
            className={cn(
              "flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar",
              maxHeight,
              contentClassName
            )}
          >
            {children}
          </div>

          <div className="mt-6 flex justify-end sticky bottom-0 pt-4 bg-white border-t border-gray-100">
            <Button
              type="submit"
              variant="primary"
              className={cn(
                "h-12 text-white text-base rounded-md px-6",
                submitButtonClassName
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : submitButtonText}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
