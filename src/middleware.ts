import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_CORS_HEADERS } from "./utils/api-config";

// Danh sách các đường dẫn cần kiểm tra khi ứng dụng đang chạy thực tế
const PROTECTED_PATHS = [
  "/admin",
  "/products-management",
  "/orders-management",
  "/blog-management",
  "/users-management",
];

// Danh sách các đường dẫn dành cho người dùng đã đăng nhập
const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

// Danh sách các API paths không cần xác thực
const API_PATHS = ["/api/", "/swagger/", "/next/data/"];

// Danh sách các IP được phép truy cập admin (tùy chọn)
// const ALLOWED_IPS = ['127.0.0.1', '::1']; // Chỉ localhost

// Middleware đơn giản chỉ chạy trong môi trường production thực tế
export function middleware(request: NextRequest) {
  // Lấy đường dẫn hiện tại
  const { pathname } = request.nextUrl;

  console.log("Middleware xử lý đường dẫn:", pathname);

  // Kiểm tra nếu đây là request API
  const isApiRequest = API_PATHS.some((path) => pathname.startsWith(path));

  // Nếu là API request, thêm CORS headers và cho phép request tiếp tục
  if (isApiRequest) {
    const response = NextResponse.next();

    // Thêm CORS headers
    Object.keys(API_CORS_HEADERS).forEach((key) => {
      response.headers.set(
        key,
        API_CORS_HEADERS[key as keyof typeof API_CORS_HEADERS]
      );
    });

    return response;
  }

  // Kiểm tra request method OPTIONS (CORS preflight)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    Object.keys(API_CORS_HEADERS).forEach((key) => {
      response.headers.set(
        key,
        API_CORS_HEADERS[key as keyof typeof API_CORS_HEADERS]
      );
    });
    return response;
  }

  // Không thực hiện bất kỳ redirect nào trong quá trình build
  // Khi chạy build trên máy local: NODE_ENV=production
  // Khi chạy build trên Vercel: NODE_ENV=production và có VERCEL=1
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return NextResponse.next();
  }

  // Lấy token từ cookie
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  console.log(
    "Auth state:",
    isAuthenticated ? "Đã đăng nhập" : "Chưa đăng nhập"
  );

  // Kiểm tra xem đường dẫn có nằm trong danh sách bảo vệ không
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // Kiểm tra xem đường dẫn có nằm trong danh sách dành cho người dùng chưa đăng nhập không
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  // Nếu đường dẫn được bảo vệ và người dùng chưa đăng nhập
  if (isProtectedPath && !isAuthenticated) {
    // Chuyển hướng về trang đăng nhập
    const loginUrl = new URL("/login", request.url);
    loginUrl.search = "";
    console.log("Chuyển hướng đến trang đăng nhập:", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Nếu người dùng đã đăng nhập và đang truy cập trang đăng nhập/đăng ký
  if (isAuthPath && isAuthenticated) {
    // Lấy thông tin người dùng từ cookie
    let isAdmin = false;
    let userRole = "USER";
    try {
      const userDataCookie = request.cookies.get("userData")?.value;
      if (userDataCookie) {
        const userData = JSON.parse(decodeURIComponent(userDataCookie));
        userRole = userData.role || "USER";
        isAdmin = userRole === "ADMIN" || userData.username === "admin";
        console.log("Thông tin người dùng:", {
          username: userData.username,
          role: userRole,
          isAdmin,
        });
      } else {
        console.log("Không tìm thấy cookie userData mặc dù đã xác thực");
      }
    } catch (error) {
      console.error("Lỗi khi phân tích userData:", error);
    }

    // Chuyển hướng đến trang phù hợp dựa trên vai trò
    if (isAdmin) {
      const redirectUrl = new URL("/products-management", request.url);
      console.log("Chuyển hướng admin đến:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    } else {
      const redirectUrl = new URL("/", request.url);
      console.log("Chuyển hướng người dùng đến:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Thêm header bảo mật cơ bản
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Thêm CORS headers vào tất cả các response
  Object.keys(API_CORS_HEADERS).forEach((key) => {
    response.headers.set(
      key,
      API_CORS_HEADERS[key as keyof typeof API_CORS_HEADERS]
    );
  });

  return response;
}

// Chỉ áp dụng middleware cho các đường dẫn cần thiết
export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    "/products-management/:path*",
    "/orders-management/:path*",
    "/blog-management/:path*",
    "/users-management/:path*",

    // Auth routes
    "/login",
    "/signup",
    "/forgot-password",

    // API routes
    "/api/:path*",
  ],
};
