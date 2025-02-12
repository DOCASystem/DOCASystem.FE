import Button from "@/components/common/button/button";
import Image from "next/image";

export default function ContentHeaderHome() {
  return (
    <div className="flex flex-row">
      <div className="w-[1200px] pt-[30px] mx-14 flex flex-row justify-between items-center gap-1">
        <div className="w-[456px] flex flex-col gap-7 pt-2">
          <p className="text-[32px] font-semibold">
            Chúng em cần yêu thương, một chút tấm lòng nhỏ.
          </p>
          <p className="text-[16px]/[160%]">
            Để một con vật cảm thấy an toàn và hạnh phúc, tình yêu thương và sẻ
            chia là điều vô cùng quan trọng.
          </p>
          <Button>Gửi tặng</Button>
        </div>
        <div className="relative w-[800px] h-[500px]">
          <Image
            src="/images/bg-header.png"
            alt="Header Home"
            width={700}
            height={600}
            className="absolute top-0 left-0 w-full h-full"
          />

          <Image
            src="/images/pet-love.png"
            alt="Pet love"
            width={400}
            height={600}
            className="absolute top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10"
          />
        </div>
      </div>
    </div>
  );
}
