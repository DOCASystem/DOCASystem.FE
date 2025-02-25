import Image from "next/image";

const product = {
  id: 1,
  img: "/images/blog-test.png",
  date: "24 May,2024",
  title: "Xù yêu đời...",
};

export default function CardBlog() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-[306px] border-2 border-slate-100 rounded-[20px]"
        >
          <Image
            src={product.img}
            alt={product.date}
            width={306}
            height={306}
            className="rounded-[20px]"
          />
          <div className="h-[153px] p-5 bg-slate-100 rounded-b-[20px]">
            <p className="mb-5 font-normal text-[10px] text-gray-400">
              {product.date}
            </p>
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">{product.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
