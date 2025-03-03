import Image from "next/image";

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
    path: "/admin",
  },
  {
    id: 3,
    name: "Blogs",
    icon: "/icons/blog.png",
    path: "/admin",
  },
  {
    id: 4,
    name: "Đơn hàng",
    icon: "/icons/order.png",
    path: "/admin",
  },
  {
    id: 5,
    name: "Người dùng",
    icon: "/icons/group-user.png",
    path: "/admin",
  },
];

export default function Sidebar() {
  return (
    <div className="w-[314px] p-6 ">
      {sidebarItems.map((item) => (
        <div key={item.name}>
          {item.name}
          <Image src={item.icon} alt={item.name} width={24} height={24} />
        </div>
      ))}
    </div>
  );
}
