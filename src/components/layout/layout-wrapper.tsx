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
  const isAuthPage = pathname.startsWith("/auth");
  return (
    <>
      {!isAuthPage && <Header />}
      <div className="container w-[1296px]">{children}</div>
      {!isAuthPage && <Footer />}
    </>
  );
}
