import Image from "next/image";
import LogoDoca from "../sections/logo/logo-doca";
import CartIcon from "../assets/icon-svg/cart-svg";
import HeartIcon from "../assets/icon-svg/heart-svg";

const info = [
  { id: 1, icon: "/icons/phone.png", text: "+84 847 911 068" },
  { id: 2, icon: "/icons/mail.png", text: "doca.love@gmail.com" },
  { id: 3, icon: "/icons/map-pin.png", text: "Nhà văn hóa sinh viên" },
];

const nav = [
  { id: 1, text: "Trang chủ", path: "/#!" },
  { id: 2, text: "Sản phẩm", path: "/#!" },
  { id: 3, text: "Blog", path: "/#!" },
  { id: 4, text: "Dịch vụ", path: "/#!" },
  { id: 5, text: "Về chúng tôi", path: "/#!" },
  { id: 6, text: "Liên hệ", path: "/#!" },
];

const cart = [
  { id: 1, icon: <HeartIcon />, text: "Yêu thích", path: "/#!" },
  { id: 2, icon: <CartIcon />, text: "Giỏ hàng", path: "/#!" },
];
export default function Header() {
  return (
    <>
      <div className=" w-[1296px] mx-auto py-6 flex flex-row justify-between items-center">
        <div className="flex gap-6">
          {info.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-black">
              <Image src={item.icon} alt={item.text} width={24} height={24} />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-black">
          <Image src={info[2].icon} alt={info[2].text} width={24} height={24} />
          <span className="text-sm">{info[2].text}</span>
        </div>
      </div>

      <div className="w-[1296px] py-6 px-10 flex flex-row justify-between items-center mx-auto  bg-white shadow-[0px_16px_12px_0px_rgba(0,0,0,0.03)] rounded-[40px]">
        <LogoDoca />
        <div className="flex gap-6 text-[20px]/[160%] font-[550px] ">
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className="hover:underline hover:underline-offset-8 hover:text-[#F36] "
            >
              {item.text}
            </a>
          ))}
        </div>

        <div className="flex gap-6">
          {cart.map((item) => (
            <a key={item.id} href={item.path} className="hover:text-[#F36]">
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
