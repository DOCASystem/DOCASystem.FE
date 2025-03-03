import Image from "next/image";

export default function DonateHero() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
        <Image
          src="/images/wait-me.webp"
          alt="Donate Hero"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
