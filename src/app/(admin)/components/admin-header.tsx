"use client";

import Image from "next/image";
import { useAuthContext } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { logout, userData } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between gap-3 h-20 p-10 bg-gray-100">
      <div className="flex items-center gap-3">
        <Image src="/icons/foot-pet.png" alt="logo" width={40} height={40} />
        <div className="font-semibold text-pink-doca">Doca Management</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="font-medium text-gray-700">{userData?.username}</div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
