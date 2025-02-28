import { cn } from "@/utils/cn";
import Link from "next/link";

interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function LinkNav({
  href,

  className,
  children,
}: LinkProps) {
  return (
    <>
      <Link href={href} className={cn("", className)}>
        {children}
      </Link>
    </>
  );
}
