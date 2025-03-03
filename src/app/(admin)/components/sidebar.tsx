"use client"; // Quan trọng khi dùng hooks trong App Router

import LinkNav from "@/components/common/link/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    id: 1,
    name: "Dashboard",
    icon: "/icons/dashboard.png",
    path: "/admin",
  },
  {
    id: 2,
    name: "Sản Phẩm",
    icon: "/icons/product.png",
    path: "/products-management",
  },
  {
    id: 3,
    name: "Blogs",
    icon: "/icons/blog.png",
    path: "/blog-management",
  },
  {
    id: 4,
    name: "Đơn hàng",
    icon: "/icons/order.png",
    path: "/orders-management",
  },
  {
    id: 5,
    name: "Người dùng",
    icon: "/icons/group-user.png",
    path: "/users-management",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <div className="w-[314px] h-screen p-6 bg-gray-50 overflow-hidden">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <LinkNav
              key={item.name}
              href={item.path}
              className={`${
                isActive ? "text-pink-doca" : ""
              } hover:text-pink-doca flex flex-row items-center gap-4 mb-6`}
            >
              <Image src={item.icon} alt={item.name} width={45} height={45} />
              {item.name}
            </LinkNav>
          );
        })}
      </div>
    </>
  );
}
