import Image from "next/image";

export default function LogoDoca() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Image src="/icons/foot-pet.png" alt="Doca" width={29} height={24} />
        <span className="text-base font-bold text-[#F36]">DOCA</span>
      </div>
    </>
  );
}
