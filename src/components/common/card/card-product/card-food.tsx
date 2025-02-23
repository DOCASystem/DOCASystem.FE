import Image from "next/image";

const product = {
  id: 1,
  img: "/images/food-test.png",
  name: "Thức ăn cho mèo - Whiskas 1.2kg",
  prices: 120000,
};

export default function CardProductList() {
  return (
    <div className="grid grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-[306px] border-2 border-slate-100 rounded-[20px]"
        >
          <Image
            src={product.img}
            alt={product.name}
            width={306}
            height={306}
            className="rounded-[20px]"
          />
          <div className="p-5 bg-slate-100 rounded-b-[20px]">
            <p className="mb-3 font-semibold">{product.name}</p>
            <div className="flex flex-row justify-between items-center">
              <p className="">{product.prices} VND</p>
              <Image
                src="/icons/plus-square-icon.png"
                alt=""
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
