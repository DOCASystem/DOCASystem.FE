import LayoutWrapper from "@/components/layout/layout-wrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <LayoutWrapper>{children}</LayoutWrapper>
    </div>
  );
}
