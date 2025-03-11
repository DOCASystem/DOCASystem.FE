// Hàm này chỉ cần thiết khi build static để xác định trước các tham số [id]
// Không ảnh hưởng đến hoạt động runtime
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
