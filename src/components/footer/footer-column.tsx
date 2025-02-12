interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

export default function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col mb-10 min-w-40 gap-2 ">
      <h3 className=" text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
