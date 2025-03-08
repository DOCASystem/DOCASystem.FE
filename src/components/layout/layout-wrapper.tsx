"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/header-all";
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
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className="container mx-auto flex-1 overflow-hidden">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
