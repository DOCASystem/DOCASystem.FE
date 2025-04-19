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
    <aside className="w-[250px] h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-6">
          <h2 className="text-xs uppercase font-semibold text-gray-500 tracking-wide mb-3 pl-3">
            Menu chính
          </h2>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <LinkNav
                  key={item.name}
                  href={item.path}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "text-pink-doca bg-pink-50 border-l-4 border-pink-doca"
                        : "text-gray-700 hover:text-pink-doca hover:bg-gray-50"
                    }
                  `}
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-lg mr-3 ${
                      isActive ? "bg-pink-100" : "bg-gray-100"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={22}
                      height={22}
                      className={`transition-all ${
                        isActive ? "scale-110" : ""
                      }`}
                    />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <svg
                      className="h-5 w-5 text-pink-doca"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </LinkNav>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src="/icons/foot-pet.png"
                alt="Doca"
                width={28}
                height={28}
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Doca System</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
