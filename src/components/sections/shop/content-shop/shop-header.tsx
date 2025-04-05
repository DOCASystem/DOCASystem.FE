import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";

interface ShopHeaderProps {
  scrollToProducts?: () => void;
}

export default function ShopHeader({ scrollToProducts }: ShopHeaderProps) {
  return (
    <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
      <div className="container mx-auto py-10 md:py-16 lg:py-20 px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-1 space-y-4 md:space-y-6 px-4 lg:pl-10 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-[40px] lg:leading-[1.3] font-semibold text-pink-doca">
            Mua sắm với mục đích tốt đẹp
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Một lần mua sắm, một cuộc đời đổi thay, yêu thương được lan tỏa. Mỗi
            sản phẩm bạn mua là một phần đóng góp cho các bé thú cưng.
          </p>
          <div className="pt-4 md:pt-6 flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
            <Button
              onClick={scrollToProducts}
              className="bg-pink-doca text-white hover:bg-pink-600 transition-colors"
            >
              Mua sắm ngay
            </Button>
            <Link href="/contact">
              <Button className="bg-white text-pink-doca border border-pink-doca rounded-lg hover:bg-pink-50 transition-colors">
                Dịch vụ
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] w-full mt-6 lg:mt-0 px-2 sm:px-4">
          <div className="relative h-full w-full">
            <Image
              src="/images/saigon-food.png"
              alt="Saigon Food"
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
