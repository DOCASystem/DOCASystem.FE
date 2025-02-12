import Footer from "@/components/footer";
import Header from "@/components/header";
import DonateHero from "@/components/sections/hero-section/donate/donate-hero";

export default function Home() {
  return (
    <div className="container w-[1296px] mx-auto mt-3">
      <Header />
      <DonateHero />
      <Footer />
    </div>
  );
}
