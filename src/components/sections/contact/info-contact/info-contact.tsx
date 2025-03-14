import Image from "next/image";

const info = [
  {
    id: 1,
    icon: "/icons/local-pink.png",
    alt: "local-icon",
    text: "Quận 9, Việt Nam",
  },
  {
    id: 2,
    icon: "/icons/mail-pink.png",
    alt: "mail-icon",
    text: "alodocafpt@gmail.com",
  },
  {
    id: 3,
    icon: "/icons/phone-pink.png",
    alt: "phone-icon",
    text: "083 722 0173",
  },
  {
    id: 4,
    icon: "/icons/clock-pink.png",
    alt: "clock-icon",
    text: "T2-T7: 7h-23h",
  },
];

export default function InfoContact() {
  return (
    <div className="w-full lg:flex-1 py-6 lg:py-0">
      <div className="flex flex-col gap-6 md:gap-10 text-center lg:text-left">
        <div className="flex flex-col gap-3 md:gap-5">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Hãy liên hệ với chúng tôi
          </h2>
          <p className="text-sm md:text-base">
            Kêt nối với tổ chức cứu trợ chó mèo bị bỏ rơi, lang thang hoặc gặp
            khó khăn. Đồng thời, cung cấp thức ăn cho thú cưng, trích một phần
            lợi nhuận để hỗ trợ các bé cần giúp đỡ.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-3 md:gap-4 mt-2">
          {info.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 md:gap-3 text-black"
            >
              <Image
                src={item.icon}
                alt={item.text}
                width={30}
                height={30}
                className="w-6 h-6 md:w-8 md:h-8"
              />
              <span className="text-sm md:text-base font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
