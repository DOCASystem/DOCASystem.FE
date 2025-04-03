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
    title: "Chia sẻ hành trình của các bé chó mèo tại Trạm SaiGon Time",
    text: "Thông qua blog và mạng xã hội, Doca kể lại những câu chuyện thật về cuộc sống, hoàn cảnh và tính cách đáng yêu của các bé chó mèo đang được chăm sóc tại Trạm cứu trợ SaiGon Time.",
  },
  {
    id: 2,
    title: "Giúp bạn gửi tặng thức ăn và đồ dùng thiết yếu cho các bé ở Trạm",
    text: "Doca cung cấp danh sách các sản phẩm cần thiết - từ thức ăn, sữa tắm đến đồ chơi - để người dùng dễ dàng mua và gửi thẳng đến Trạm, đúng món, đúng bé đang cần.",
  },
];

const saigontime = [
  {
    id: 1,
    title: "Liên kết cứu trợ",
    text: "Chúng mình làm việc với các tổ chức cứu trợ động vật, hỗ trợ họ trong việc tìm kiếm những gia đình phù hợp cho các con vật bị bỏ rơi.",
  },
  {
    id: 2,
    title: "Kết nối khách hàng",
    text: "Chúng mình giúp các cá nhân, gia đình tìm thấy những thú cưng cần được cứu hộ, cung cấp thông tin và hướng dẫn quy trình nhận nuôi một cách minh bạch và hiệu quả.",
  },
];
export default function ContentUs() {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div>
        <h2 className="text-2xl md:text-[30px]/[120%] font-semibold mb-4 md:mb-6 text-center md:text-left">
          Doca - Kết nối yêu thương đến những mái ấm nhỏ
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-[110px] text-sm md:text-base text-center md:text-left">
          <p className="md:flex-1">
            Doca là nơi dành cho những người yêu thương động vật, và cũng là cầu
            nối giữa bạn và những trạm cứu hộ chó mèo đang ngày đêm chăm sóc
            những bé thú cưng không may bị bỏ rơi.
          </p>

          <p className="md:flex-1">
            Tại Doca, bạn có thể dễ dàng mua thức ăn, đồ dùng cho thú cưng –
            không chỉ cho bé cưng của mình, mà còn có thể gửi tặng trực tiếp đến
            các trạm cứu hộ thông qua mỗi đơn hàng. Tất cả đều được chuyển đến
            tận nơi một cách rõ ràng và minh bạch.
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
            Doca làm gì
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

      <div className="flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-12 lg:gap-16 py-6 md:py-10">
        <div className="w-full max-w-sm lg:max-w-none lg:w-auto">
          <Image
            src="/images/saigon-time.png"
            alt="Saigon Time"
            width={400}
            height={568}
            className="rounded-[20px] md:rounded-[40px] shadow-[5px_16px_12px_2px_rgba(0,0,0,0.03)] w-full h-auto"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl md:text-[30px]/[120%] font-semibold mb-4 md:mb-6 text-center lg:text-left">
            Đối tác của Doca
          </h2>
          <div className="w-full lg:w-[636px] flex flex-col gap-4 md:gap-6 text-sm md:text-base">
            {saigontime.map((item) => (
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
