"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const isAuthPage = pathname.startsWith("/auth");
  const isAuthPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAuthPage && <Header />}
      <div className="container mx-auto">{children}</div>
      {!isAuthPage && <Footer />}
    </>
  );
}
