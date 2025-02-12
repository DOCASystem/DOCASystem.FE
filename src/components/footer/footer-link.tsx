import Link from "next/link";
import { cn } from "@/utils/cn";
interface FooterLinkProps {
  className?: string;
  href: string;
  children: React.ReactNode;
}

export default function FooterLink({
  className,
  href,
  children,
}: FooterLinkProps) {
  return (
    <Link href={href} className={cn("hover:text-[#F36]", className)}>
      {children}
    </Link>
  );
}
