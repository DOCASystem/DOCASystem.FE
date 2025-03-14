import Image from "next/image";

export default function ContactHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="w-full lg:w-[456px] flex flex-col gap-3 md:gap-5 lg:gap-7 pb-6 lg:pb-0 text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-semibold">
              Cứu giúp, bạn đang cho đi phần tốt đẹp nhất.
            </h1>
            <p className="text-sm md:text-base lg:text-[16px]/[160%]">
              Khi giúp đỡ một con vật, bạn đang thể hiện lòng nhân ái và làm
              sáng lên giá trị con người mình.
            </p>
          </div>

          {/* Hình ảnh header */}
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:w-[50%] lg:h-[400px]">
            {/* Hình nền */}
            <div className="absolute inset-0">
              <Image
                src="/images/bg-header.png"
                alt="Header Home"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Hình chính */}
            <div className="absolute top-[60%] left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10 w-[150px] h-[250px] sm:w-[200px] sm:h-[300px] md:w-[250px] md:h-[350px]">
              <Image
                src="/images/pet-love.png"
                alt="Pet love"
                fill
                sizes="(max-width: 768px) 200px, 300px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
