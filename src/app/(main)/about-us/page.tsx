import ContentAboutUs from "@/components/sections/about-us/content-header/content-about-us";
import ContentUs from "@/components/sections/about-us/us/content-us";

export default function AboutUsPage() {
  return (
    <div>
      <ContentAboutUs />
      <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
        <ContentUs />
      </div>
    </div>
  );
}
