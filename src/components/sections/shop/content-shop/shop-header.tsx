import Image from "next/image";

export default function ShopHeader() {
  return (
    <div className="flex flex-row justify-between items-center  px-10">
      <div className="w-[456px] flex flex-col gap-7 pt-2">
        <p className="text-[32px] font-semibold">
          Một lần mua sắm, một cuộc đời đổi thay, yêu thương được lan tỏa
        </p>
        <p className="text-[16px]/[160%]">
          Mỗi sinh linh đều có giá trị, và chỉ cần một hành động nhỏ, bạn đã
          thay đổi cả cuộc đời của một con vật
        </p>
      </div>
      <div className="relative w-[800px] h-[500px]">
        <Image
          src="/images/bg-header.png"
          alt="Header Home"
          width={760}
          height={600}
          className="absolute top-0 left-0 w-full h-full"
        />

        <Image
          src="/images/donate.png"
          alt="Pet love"
          width={300}
          height={600}
          className="absolute top-[60%] left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10"
        />
      </div>
    </div>
  );
}
