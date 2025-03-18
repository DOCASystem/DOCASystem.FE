"use client";

import React, { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  UseFormReturn,
  DefaultValues,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { cn } from "@/utils/cn";

interface FormProps<TFormValues extends FieldValues> {
  // Schema and form configuration
  schema: ZodSchema<TFormValues>;
  defaultValues?: DefaultValues<TFormValues>;

  // Handlers and callbacks
  onSubmit: SubmitHandler<TFormValues>;

  // External form methods if needed (e.g., for parent control)
  methods?: UseFormReturn<TFormValues>;

  // Styling and structure
  className?: string;
  formClassName?: string;

  // Form content
  children: ReactNode;
}

/**
 * A reusable form component using Zod validation and React Hook Form
 */
export default function Form<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  methods: externalMethods,
  className,
  formClassName,
  children,
}: FormProps<TFormValues>) {
  // Create internal form methods if not provided externally
  const internalMethods = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Use external methods if provided, otherwise use internal ones
  const methods = externalMethods || internalMethods;

  // Handler to process the form submission
  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <div className={cn("w-full", className)}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit}
          noValidate
          className={cn("flex flex-col space-y-4", formClassName)}
        >
          {children}
        </form>
      </FormProvider>
    </div>
  );
}

/**
 * Form error message component
 */
export function FormError({ message }: { message: string }) {
  if (!message) return null;

  return <div className="text-sm text-red-500 mt-1">{message}</div>;
}

/**
 * Form success message component
 */
export function FormSuccess({ message }: { message: string }) {
  if (!message) return null;

  return <div className="text-sm text-green-500 mt-1">{message}</div>;
}

/**
 * Form section component to group related form fields
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
