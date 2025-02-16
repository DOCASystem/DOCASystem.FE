import ServiceHeader from "@/components/sections/service/content-header/service-header";
import Image from "next/image";

export default function ServicePage() {
  return (
    <div>
      <ServiceHeader />
      <Image src="/images/wait-me.webp" alt={""} width={2000} height={1000} />
    </div>
  );
}
