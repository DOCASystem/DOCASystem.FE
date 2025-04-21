import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_CORS_HEADERS } from "./utils/api-config";

// Protected paths that require authentication
const PROTECTED_PATHS = [
  "/admin",
  "/products-management",
  "/orders-management",
  "/blog-management",
  "/users-management",
];

// Authentication paths for unauthenticated users
const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

// API paths that don't require authentication
const API_PATHS = ["/api/", "/swagger/", "/next/data/"];

// Danh sách các IP được phép truy cập admin (tùy chọn)
// const ALLOWED_IPS = ['127.0.0.1', '::1']; // Chỉ localhost

// Các URL cần ưu tiên
const HIGH_PRIORITY_ROUTES = ["/api/v1/carts", "/api/v1/profile"];

// Các URL có thể tải sau
const LOW_PRIORITY_ROUTES = [
  "/api/v1/admin",
  "/api/v1/dashboard",
  "/api/v1/statistics",
  "/api/v1/analytics",
];

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Xử lý yêu cầu đến: ${pathname}`);

  // Nếu là API call và là phương thức GET
  if (pathname.startsWith("/api/v1/") && request.method === "GET") {
    // Kiểm tra xem URL có phải là high priority route không
    const isHighPriority = HIGH_PRIORITY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Kiểm tra xem URL có phải là low priority route không
    const isLowPriority = LOW_PRIORITY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Thêm header để server biết mức độ ưu tiên của request
    const response = NextResponse.next();

    if (isHighPriority) {
      response.headers.set("X-Priority", "high");
    } else if (isLowPriority) {
      response.headers.set("X-Priority", "low");
    }

    return response;
  }

  // Nếu là trang login hoặc register, đảm bảo redirect đến trang chính sau khi đăng nhập
  if (pathname.includes("/login") || pathname.includes("/signup")) {
    const response = NextResponse.next();
    response.headers.set("X-Optimize-User-Profile", "true");
    return response;
  }

  // Check if this is an API request
  const isApiRequest = API_PATHS.some((path) => pathname.startsWith(path));

  // If it's an API request, add CORS headers and continue
  if (isApiRequest) {
    return handleApiRequest();
  }

  // Handle OPTIONS request (CORS preflight)
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  // Skip during build process
  if (isInBuildProcess()) {
    return NextResponse.next();
  }

  // Get authentication state
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  console.log(
    `[Middleware] Trạng thái xác thực: ${
      isAuthenticated ? "Đã đăng nhập" : "Chưa đăng nhập"
    }`
  );

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  console.log(
    `[Middleware] Đường dẫn hiện tại ${
      isProtectedPath ? "được bảo vệ" : "không được bảo vệ"
    }`
  );

  // Check if the path is for authentication
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  // Kiểm tra quyền ADMIN
  let isAdmin = false;
  try {
    const userDataCookie = request.cookies.get("userData")?.value;
    if (userDataCookie) {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      // Kiểm tra roles hoặc username
      isAdmin =
        (Array.isArray(userData.roles) && userData.roles.includes("ADMIN")) ||
        userData.username === "admin";

      console.log(
        `[Middleware] Thông tin người dùng: ${
          userData.username
        }, quyền: ${userData.roles?.join(", ")}, isAdmin: ${isAdmin}`
      );
    }
  } catch (e) {
    console.log(`[Middleware] Lỗi khi phân tích userData: ${e}`);
    isAdmin = false;
  }

  // Xử lý đặc biệt cho trang admin
  if (pathname.startsWith("/admin") && !isAuthenticated) {
    console.log(
      "[Middleware] Chưa đăng nhập, chuyển hướng đến trang đăng nhập"
    );
    return redirectToLogin(request);
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    console.log(
      "[Middleware] Không có quyền admin, chuyển hướng đến trang chủ"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If protected path and not authenticated, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    console.log(
      "[Middleware] Chuyển hướng đến trang đăng nhập vì không có xác thực"
    );
    return redirectToLogin(request);
  }

  // If authenticated and accessing auth paths, redirect to appropriate page
  if (isAuthPath && isAuthenticated) {
    console.log("[Middleware] Đã đăng nhập, chuyển hướng đến trang thích hợp");
    return redirectAuthenticated(request);
  }

  // Add security headers to all responses
  return addSecurityHeaders();
}

// Handle API requests
function handleApiRequest() {
  const response = NextResponse.next();
  addCorsHeaders(response);
  return response;
}

// Handle OPTIONS requests
function handleOptionsRequest() {
  const response = new NextResponse(null, { status: 200 });
  addCorsHeaders(response);
  return response;
}

// Add CORS headers to response
function addCorsHeaders(response: NextResponse) {
  Object.keys(API_CORS_HEADERS).forEach((key) => {
    response.headers.set(
      key,
      API_CORS_HEADERS[key as keyof typeof API_CORS_HEADERS]
    );
  });
  return response;
}

// Check if running in build process
function isInBuildProcess() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

// Redirect to login page
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

// Redirect authenticated user based on role
function redirectAuthenticated(request: NextRequest) {
  // Extract user data
  let isAdmin = false;
  let username = "";

  try {
    const userDataCookie = request.cookies.get("userData")?.value;
    if (userDataCookie) {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      username = userData.username || "";
      // Kiểm tra roles là một mảng và chứa "ADMIN" hoặc username là "admin"
      isAdmin =
        (Array.isArray(userData.roles) && userData.roles.includes("ADMIN")) ||
        userData.username === "admin";

      console.log(
        `[Middleware] redirectAuthenticated: User ${username}, isAdmin=${isAdmin}`
      );
    } else {
      console.log(
        "[Middleware] redirectAuthenticated: Không tìm thấy cookie userData"
      );
    }
  } catch (error) {
    // If error parsing user data, assume regular user
    console.log(
      `[Middleware] redirectAuthenticated: Lỗi khi xử lý userData: ${error}`
    );
    isAdmin = false;
  }

  // Nếu username là "admin", luôn coi là admin
  if (username === "admin") {
    isAdmin = true;
    console.log("[Middleware] redirectAuthenticated: Tài khoản admin đặc biệt");
  }

  // Redirect based on role
  if (isAdmin) {
    console.log(
      "[Middleware] redirectAuthenticated: Chuyển hướng đến trang admin"
    );
    return NextResponse.redirect(new URL("/admin", request.url));
  } else {
    console.log(
      "[Middleware] redirectAuthenticated: Chuyển hướng đến trang chủ"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Add security headers
function addSecurityHeaders() {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  addCorsHeaders(response);
  return response;
}

// Matcher for paths that need middleware
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
