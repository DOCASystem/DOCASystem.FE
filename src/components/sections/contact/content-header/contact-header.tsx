import Image from "next/image";

export default function ContactHeader() {
  return (
    <div className="bg-[#F9F9F9]">
      <div className="flex flex-row items-center gap-1 px-10 mx-auto ">
        <div className="w-[456px] flex flex-col gap-7 pt-2">
          <p className="text-[32px] font-semibold">
            Cứu giúp, bạn đang cho đi phần tốt đẹp nhất.
          </p>
          <p className="text-[16px]/[160%]">
            Khi giúp đỡ một con vật, bạn đang thể hiện lòng nhân ái và làm sáng
            lên giá trị con người mình.
          </p>
        </div>

        <div className="relative w-[800px] h-[500px]">
          <Image
            src="/images/bg-header.png"
            alt="Header Home"
            width={500}
            height={500}
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
