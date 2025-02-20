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
    <>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <p className="text-3xl font-semibold">Hãy liên hệ với chúng tôi</p>
          <p>
            Kêt nối với các trạm cứu trợ chó mèo bị bỏ rơi, lang thang hoặc gặp
            khó khăn. Đồng thời, cung cấp thức ăn cho thú cưng, trích một phần
            lợi nhuận để hỗ trợ các bé cần giúp đỡ.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {info.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-black">
              <Image src={item.icon} alt={item.text} width={35} height={35} />
              <span className="text-base font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
