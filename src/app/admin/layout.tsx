export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(">>> ĐANG DÙNG ADMIN <<<");

  return (
    <div className=" flex justify-center items-center h-screen">{children}</div>
  );
}
