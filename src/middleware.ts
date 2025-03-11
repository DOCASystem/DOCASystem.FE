import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Định nghĩa các đường dẫn cần bảo vệ
const ADMIN_PATHS = [
  "/admin",
  "/products-management",
  "/orders-management",
  "/blog-management",
  "/users-management",
];

// Danh sách các IP được phép truy cập admin (tùy chọn)
// const ALLOWED_IPS = ['127.0.0.1', '::1']; // Chỉ localhost

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // 1. Bảo vệ khỏi URL Injection
    // Kiểm tra và từ chối các URL có thể chứa mã độc
    if (
      pathname.includes("../") ||
      pathname.includes("..\\") ||
      pathname.includes("%2e%2e/") ||
      pathname.includes("%2e%2e%5c")
    ) {
      console.warn("Phát hiện tấn công Path Traversal:", pathname);
      return new NextResponse("Truy cập bị từ chối", { status: 403 });
    }

    // 2. Kiểm tra nếu là đường dẫn admin
    const isAdminPath = ADMIN_PATHS.some(
      (path) => pathname.startsWith(path) || pathname === path
    );

    // 3. Nếu là đường dẫn admin, áp dụng các biện pháp bảo mật nghiêm ngặt
    if (isAdminPath) {
      // a. Kiểm tra IP (tùy chọn)
      // const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim();
      // if (ALLOWED_IPS.length > 0 && clientIp && !ALLOWED_IPS.includes(clientIp)) {
      //   console.warn('Truy cập admin bị từ chối từ IP:', clientIp);
      //   return new NextResponse('Truy cập bị từ chối', { status: 403 });
      // }

      // b. Lấy token từ cookie và xác thực
      const token = request.cookies.get("token")?.value;

      // Nếu không có token, chuyển hướng đến trang đăng nhập
      if (!token) {
        const url = new URL("/login", request.url);

        // Xóa các query params nhạy cảm
        url.search = "";

        // Thêm URL trở về sau khi đăng nhập thành công (không bao gồm các tham số nhạy cảm)
        url.searchParams.set("callbackUrl", pathname);

        return NextResponse.redirect(url);
      }

      // c. Kiểm tra thời gian hết hạn token (nếu lưu trong cookie)
      const tokenExpiry = request.cookies.get("token_expiry")?.value;
      if (tokenExpiry && parseInt(tokenExpiry) < Date.now()) {
        // Token đã hết hạn
        const url = new URL("/login", request.url);
        url.searchParams.set("expired", "true");
        return NextResponse.redirect(url);
      }

      // d. Kiểm tra quyền admin
      const userData = request.cookies.get("userData")?.value;
      let isAdmin = false;

      if (userData) {
        try {
          const user = JSON.parse(userData);
          isAdmin = user.username === "admin"; // Hoặc logic xác định admin
        } catch {
          // Không làm gì nếu không thể phân tích userData
        }
      }

      // Nếu không phải admin, chuyển hướng về trang chủ
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // e. Thêm header bảo mật
      const response = NextResponse.next();

      // Thêm các header bảo mật cho trang admin
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-XSS-Protection", "1; mode=block");
      response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
      );
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
      );

      return response;
    }

    // 4. Xử lý các URL công khai - thêm header bảo mật cơ bản
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  } catch (error) {
    // Xử lý lỗi - log lỗi nhưng không hiển thị chi tiết cho người dùng
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

// Chỉ định các đường dẫn mà middleware sẽ được áp dụng
export const config = {
  matcher: [
    // Áp dụng cho tất cả các đường dẫn trừ các file tĩnh
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
