"use client";

import Image from "next/image";
import { useAuthContext } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminHeader() {
  const { logout, userData } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-full mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center space-x-3 transition-opacity hover:opacity-80"
          >
            <div className="relative h-10 w-10">
              <Image
                src="/icons/foot-pet.png"
                alt="Doca Logo"
                className="object-contain"
                fill
                sizes="40px"
              />
            </div>
            <span className="font-bold text-xl text-pink-doca">
              Doca <span className="text-gray-700 font-medium">Management</span>
            </span>
          </Link>

          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              <span className="font-medium text-gray-700">
                {userData?.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
