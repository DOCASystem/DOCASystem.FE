import Image from "next/image";

export default function ContentAboutUs() {
  return (
    <div className="w-[1200px] flex flex-row justify-between items-center gap-1 mx-auto">
      <div className="w-[456px] flex flex-col gap-7 pt-2">
        <p className="text-[32px] font-semibold">
          Tình yêu không mua được, nhưng có thể nhận được từ thú cưng.
        </p>
        <p className="text-[16px]/[160%]">
          Sự gắn bó với chó mèo không phải bằng tiền bạc, mà bằng tình cảm chân
          thật mà chúng mang lại.
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
          src="/images/pet-blog.png"
          alt="Pet love"
          width={400}
          height={600}
          className="absolute top-[60%] left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10"
        />
      </div>
    </div>
  );
}
