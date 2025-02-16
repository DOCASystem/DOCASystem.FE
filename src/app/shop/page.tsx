import ShopHeader from "@/components/sections/shop/content-shop/shop-header";
import Image from "next/image";

export default function ShopPage() {
  return (
    <div>
      <ShopHeader />
      <Image src="/images/wait-me.webp" alt={""} width={2000} height={1000} />
    </div>
  );
}
