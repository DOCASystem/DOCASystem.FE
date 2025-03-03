import ContactHeader from "@/components/sections/contact/content-header/contact-header";
import FormContact from "@/components/sections/contact/form-contact/form-contact";
import InfoContact from "@/components/sections/contact/info-contact/info-contact";

export default function ContactPage() {
  return (
    <div>
      <ContactHeader />
      <div className="flex flex-row py-[60px] gap-20">
        <FormContact />
        <InfoContact />
      </div>
    </div>
  );
}
