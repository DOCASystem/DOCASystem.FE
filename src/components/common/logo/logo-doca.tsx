import Image from "next/image";
import Link from "next/link";

export default function LogoDoca() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Logo DOCA */}
      <Link href="/" className="flex items-center">
        <div className="flex items-center">
          <Image
            src="/icons/foot-pet.png"
            alt="Doca"
            width={32}
            height={26}
            priority
          />
          <span className="text-base sm:text-lg font-bold text-[#F36] ml-1">
            DOCA
          </span>
        </div>
      </Link>

      {/* Dấu x thể hiện sự hợp tác */}
      <span className="text-gray-400 text-xs sm:text-sm">×</span>

      {/* Logo Saigontime với liên kết đến Facebook */}
      <Link
        href="https://www.facebook.com/savesgt"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <div className="relative w-[32px] h-[32px] sm:w-[36px] sm:h-[36px]">
          <Image
            src="/icons/saigon-time-icon.png"
            alt="Saigontime"
            fill
            sizes="(max-width: 640px) 32px, 36px"
            className="rounded-full border border-gray-100 shadow-sm object-cover"
          />
        </div>
        {/* Tooltip hiển thị khi hover */}
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
          Trạm cứu hộ chó mèo Sài Gòn Time
        </span>
      </Link>
    </div>
  );
}
