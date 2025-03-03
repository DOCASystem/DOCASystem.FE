import Button from "@/components/common/button/button";
import Image from "next/image";

export default function ContentHeaderHome() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="w-full md:w-1/2 lg:w-[456px] flex flex-col gap-7 pt-2">
        <p className="text-2xl md:text-[32px] font-semibold">
          Chúng em cần yêu thương, một chút tấm lòng nhỏ.
        </p>
        <p className="text-base text-[16px]/[160%]">
          Để một con vật cảm thấy an toàn và hạnh phúc, tình yêu thương và sẻ
          chia là điều vô cùng quan trọng.
        </p>
        <Button>Gửi tặng</Button>
      </div>

      <div className="relative w-full md:w-1/2 lg:w-[600px] h-[300px] md:h-[400px] lg:h-[500px] mt-6 md:mt-0">
        <Image
          src="/images/bg-header.png"
          alt="Header Home"
          fill
          className="object-cover"
          priority
        />

        <Image
          src="/images/pet-love.png"
          alt="Pet love"
          width={300}
          height={450}
          className="absolute top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10"
          priority
        />
      </div>
    </div>
  );
}
