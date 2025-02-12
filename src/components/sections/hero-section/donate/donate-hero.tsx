import Image from "next/image";

export default function DonateHero() {
  return (
    <>
      <div>
        <Image
          src="/images/donate-hero.png"
          alt="Donate Hero"
          width={1920}
          height={1080}
        />
      </div>

      <div></div>
    </>
  );
}
