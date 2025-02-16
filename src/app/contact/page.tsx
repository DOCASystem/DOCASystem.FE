import ContactHeader from "@/components/sections/contact/content-header/contact-header";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div>
      <ContactHeader />
      <Image src="/images/wait-me.webp" alt={""} width={2000} height={1000} />
    </div>
  );
}
