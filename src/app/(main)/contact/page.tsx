import ContactHeader from "@/components/sections/contact/content-header/contact-header";
import FormContact from "@/components/sections/contact/form-contact/form-contact";
import InfoContact from "@/components/sections/contact/info-contact/info-contact";

export default function ContactPage() {
  return (
    <div>
      <ContactHeader />
      <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20">
          <FormContact />
          <InfoContact />
        </div>
      </div>
    </div>
  );
}
