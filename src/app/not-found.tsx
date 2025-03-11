export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang</h1>
      <p className="text-lg mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
      <a
        href="/"
        className="px-6 py-3 bg-pink-doca text-white rounded-md hover:bg-pink-700 transition-colors"
      >
        Quay về trang chủ
      </a>
    </div>
  );
}
