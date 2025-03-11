import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các đường dẫn cần kiểm tra khi ứng dụng đang chạy thực tế
const PROTECTED_PATHS = [
  "/admin",
  "/products-management",
  "/orders-management",
  "/blog-management",
  "/users-management",
];

// Danh sách các IP được phép truy cập admin (tùy chọn)
// const ALLOWED_IPS = ['127.0.0.1', '::1']; // Chỉ localhost

// Middleware đơn giản chỉ chạy trong môi trường production thực tế
export function middleware(request: NextRequest) {
  // Lấy đường dẫn hiện tại
  const { pathname } = request.nextUrl;

  // Không thực hiện bất kỳ redirect nào trong quá trình build
  // Khi chạy build trên máy local: NODE_ENV=production
  // Khi chạy build trên Vercel: NODE_ENV=production và có VERCEL=1
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return NextResponse.next();
  }

  // Kiểm tra xem đường dẫn có nằm trong danh sách bảo vệ không
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // Chỉ kiểm tra bảo mật cho các đường dẫn được bảo vệ
  if (isProtectedPath) {
    // Lấy token từ cookie
    const token = request.cookies.get("token")?.value;

    // Nếu không có token, chuyển hướng về trang đăng nhập
    if (!token) {
      // Xóa tất cả tham số URL và chuyển hướng về trang đăng nhập
      const loginUrl = new URL("/login", request.url);
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Thêm header bảo mật cơ bản
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}

// Chỉ áp dụng middleware cho các đường dẫn cần thiết
export const config = {
  matcher: [
    "/admin/:path*",
    "/products-management/:path*",
    "/orders-management/:path*",
    "/blog-management/:path*",
    "/users-management/:path*",
    "/login",
  ],
};
