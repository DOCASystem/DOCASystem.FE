import ContentHeaderHome from "@/components/sections/hero-section/content/content-header-home";
import DonateHero from "@/components/sections/hero-section/donate/donate-hero";

export default function Home() {
  return (
    <div className="container w-[1296px] mx-auto mt-3">
      <ContentHeaderHome />
      <DonateHero />
    </div>
  );
}
