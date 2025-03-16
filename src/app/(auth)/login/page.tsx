"use client";

import React from "react";
import LoginForm from "@/app/(auth)/login/login/form-login";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <Toaster position="top-right" />
      <LoginForm />
    </div>
  );
}
