interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

export default function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
      <h3 className="text-sm md:text-base font-semibold">{title}</h3>
      <div className="flex flex-col gap-2 md:gap-3">{children}</div>
    </div>
  );
}
