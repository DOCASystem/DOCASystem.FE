import AdminHeader from "./components/admin-header";
import Sidebar from "./components/sidebar";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(">>> ĐANG DÙNG ADMIN <<<");
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6  overflow-auto">{children}</main>
      </div>
    </div>
  );
}
