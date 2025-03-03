import Image from "next/image";

export default function AdminHeader() {
  return (
    <div className="flex items-center justify-between gap-3 h-20 p-10 bg-gray-100">
      <div className="flex items-center gap-3">
        <Image src="/icons/foot-pet.png" alt="logo" width={40} height={40} />
        <div className="">Doca Management</div>
      </div>

      <div className="flex items-center gap-3">
        <div>User</div>
        <div>Logout</div>
      </div>
    </div>
  );
}
