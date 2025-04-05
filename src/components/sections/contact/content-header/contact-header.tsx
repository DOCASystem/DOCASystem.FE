import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";

export default function ContactHeader() {
  return (
    <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
      <div className="container mx-auto py-10 md:py-16 lg:py-20 px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-1 space-y-4 md:space-y-6 px-4 lg:pl-10 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-[40px] lg:leading-[1.3] font-semibold text-pink-doca">
            Liên hệ với chúng mình
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Hãy kết nối với Doca để cùng chung tay giúp đỡ các bé thú cưng có
            hoàn cảnh khó khăn. Mỗi yêu thương đều làm nên điều kỳ diệu.
          </p>
          <div className="pt-4 md:pt-6 flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
            <Link href="/shop">
              <Button className="bg-pink-doca text-white hover:bg-pink-600 transition-colors">
                Mua sắm ngay
              </Button>
            </Link>
            <Link href="/about-us">
              <Button className="bg-white text-pink-doca border border-pink-doca rounded-lg hover:bg-pink-50 transition-colors">
                Về chúng mình
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] w-full mt-6 lg:mt-0 px-2 sm:px-4">
          <div className="relative h-full w-full">
            <Image
              src="/images/saigon-contact.png"
              alt="Saigon Contact"
              fill
              className="object-contain rounded-2xl md:rounded-3xl opacity-95"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              }}
              priority
            />
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 60%, rgba(252, 231, 243, 0.5) 100%)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
