import Image from "next/image";
interface FooterIconProps {
  href: string;
  src: string;
  children?: React.ReactNode;
}

export default function FooterIcon({ href, src, children }: FooterIconProps) {
  return (
    <a href={href}>
      <Image src={src} alt="icon" width={24} height={24} />
      {children}
    </a>
  );
}
