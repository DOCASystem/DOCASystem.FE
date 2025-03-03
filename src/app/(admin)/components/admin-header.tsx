import Image from "next/image";

export default function AdminHeader() {
  return (
    <div className="flex items-center gap-3 h-24">
      <Image src="/icons/foot-pet.png" alt="logo" width={40} height={40} />
      <div className="">Doca Management</div>
    </div>
  );
}
