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
    <>
      <div className="w-[1200px] my-[70px] flex flex-col gap-10 pt-2 mx-auto">
        <p className="text-[30px]/[120%] font-semibold">Về tổ chức chúng tôi</p>

        <div className="flex flex-row gap-[110px]">
          <p>
            Chúng tôi là một tổ chức trung gian chuyên kết nối các tổ chức cứu
            trợ động vật với những người yêu thương và sẵn lòng nhận nuôi thú
            cưng. Với mục tiêu giúp đỡ các sinh vật bị bỏ rơi và tạo cơ hội để
            chúng có một cuộc sống mới, chúng tôi đóng vai trò là cầu nối giữa
            các bên cứu trợ và khách hàng, mang đến những giải pháp hiệu quả và
            bền vững cho phúc lợi động vật.
          </p>

          <p>
            Sứ mệnh của chúng tôi là giúp đỡ và hỗ trợ các tổ chức cứu trợ động
            vật, đồng thời tạo điều kiện để những người có lòng yêu thương dễ
            dàng tiếp cận với các vật nuôi cần được chăm sóc. Chúng tôi tin rằng
            thông qua việc kết nối này, nhiều sinh linh bị bỏ rơi sẽ có cơ hội
            được sống trong môi trường an toàn và đầy tình yêu thương.
          </p>
        </div>

        <div className="flex flex-row justify-between">
          {content.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <p className="text-pink-doca font-semibold text-3xl">
                {item.number}
              </p>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center justify-between my-[70px] px-7">
          <Image
            src="/images/doca.png"
            alt="About Us"
            width={400}
            height={568}
            className="rounded-[40px] shadow-[1px_16px_12px_2px_rgba(0,0,0,0.03)]"
          />
          <div className="flex flex-col gap-10">
            <p className="text-[30px]/[120%] font-semibold">Chúng tôi làm gì</p>
            <div className="w-[636px] flex flex-col gap-4">
              {saigon.map((item) => (
                <div key={item.id}>
                  <p className="font-semibold">{item.title}</p>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
