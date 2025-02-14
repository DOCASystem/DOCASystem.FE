interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

export default function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col min-w-40 gap-5 ">
      <h3 className=" text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
