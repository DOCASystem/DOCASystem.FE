import Image from "next/image";

export default function ServiceHeader() {
  return (
    <div className="flex flex-row justify-between items-center gap-1 px-10">
      <div className="w-[456px] flex flex-col gap-7 pt-2">
        <p className="text-[32px] font-semibold">
          Chó mèo không nói, nhưng chúng biết cảm nhận.
        </p>
        <p className="text-[16px]/[160%]">
          Qua ánh mắt và hành động, thú cưng thể hiện lòng biết ơn và sự yêu
          thương mà lời nói không thể diễn tả
        </p>
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
          src="/images/pet-ship.png"
          alt="Pet love"
          width={400}
          height={600}
          className="absolute top-[60%] left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10"
        />
      </div>
    </div>
  );
}
