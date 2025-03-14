import Image from "next/image";

const content = [
  { id: 1, number: "2k+", text: "Khách Hàng Hài Lòng" },
  { id: 2, number: "10", text: "Thương Hiệu" },
  { id: 3, number: "100+", text: "Sản Phẩm" },
  { id: 4, number: "2024", text: "Thành Lập" },
];

const saigon = [
  {
    id: 1,
    title: "Liên kết cứu trợ",
    text: "Chúng tôi làm việc với các tổ chức cứu trợ động vật, hỗ trợ họ trong việc tìm kiếm những gia đình phù hợp cho các con vật bị bỏ rơi.",
  },
  {
    id: 2,
    title: "Kết nối khách hàng",
    text: "Chúng tôi giúp các cá nhân, gia đình tìm thấy những thú cưng cần được cứu hộ, cung cấp thông tin và hướng dẫn quy trình nhận nuôi một cách minh bạch và hiệu quả.",
  },
  {
    id: 3,
    title: "Hỗ trợ tổ chức cứu trợ",
    text: "Chúng tôi cung cấp các giải pháp và dịch vụ để hỗ trợ các tổ chức cứu trợ trong việc quản lý và phát triển hoạt động cứu hộ của họ.",
  },
];

export default function ContentUs() {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div>
        <h2 className="text-2xl md:text-[30px]/[120%] font-semibold mb-4 md:mb-6 text-center md:text-left">
          Chúng tôi là
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-[110px] text-sm md:text-base text-center md:text-left">
          <p className="md:flex-1">
            Một tổ chức trung gian chuyên kết nối các tổ chức cứu trợ động vật
            với những người yêu thương và sẵn lòng nhận nuôi thú cưng. Với mục
            tiêu giúp đỡ các sinh vật bị bỏ rơi và tạo cơ hội để chúng có một
            cuộc sống mới, chúng tôi đóng vai trò là cầu nối giữa các bên cứu
            trợ và khách hàng, mang đến những giải pháp hiệu quả và bền vững cho
            phúc lợi động vật.
          </p>

          <p className="md:flex-1">
            Sứ mệnh của chúng tôi là giúp đỡ và hỗ trợ các tổ chức cứu trợ động
            vật, đồng thời tạo điều kiện để những người có lòng yêu thương dễ
            dàng tiếp cận với các vật nuôi cần được chăm sóc. Chúng tôi tin rằng
            thông qua việc kết nối này, nhiều sinh linh bị bỏ rơi sẽ có cơ hội
            được sống trong môi trường an toàn và đầy tình yêu thương.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 py-4 md:py-8">
        {content.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 items-center md:items-start"
          >
            <p className="text-pink-doca font-semibold text-2xl md:text-3xl">
              {item.number}
            </p>
            <p className="text-sm md:text-base">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 py-6 md:py-10">
        <div className="w-full max-w-sm lg:max-w-none lg:w-auto">
          <Image
            src="/images/doca.png"
            alt="About Us"
            width={400}
            height={568}
            className="rounded-[20px] md:rounded-[40px] shadow-[1px_16px_12px_2px_rgba(0,0,0,0.03)] w-full h-auto"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl md:text-[30px]/[120%] font-semibold mb-4 md:mb-6 text-center lg:text-left">
            Chúng tôi làm gì
          </h2>
          <div className="w-full lg:w-[636px] flex flex-col gap-4 md:gap-6 text-sm md:text-base">
            {saigon.map((item) => (
              <div key={item.id} className="text-center lg:text-left">
                <p className="font-semibold mb-1">{item.title}</p>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
