export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(">>> ĐANG DÙNG ADMIN <<<");
  return <div className="min-h-screen">{children}</div>;
}
